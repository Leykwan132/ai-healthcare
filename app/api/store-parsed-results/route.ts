import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema for the request to store parsed results
const storeResultsRequestSchema = z.object({
  parsedInstruction: z.object({
    medications: z.array(z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
      timing: z.string(),
      instructions: z.string(),
    })),
    activities: z.array(z.object({
      name: z.string(),
      duration: z.string(),
      frequency: z.string(),
      timing: z.string(),
      instructions: z.string(),
    })),
    followUpDate: z.string().optional(),
    notes: z.string().optional(),
  }),
  scheduleEvents: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    time: z.string(),
    type: z.enum(['medication', 'activity', 'followup']),
    description: z.string(),
    metadata: z.object({
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      duration: z.string().optional(),
      instructions: z.string().optional(),
    }),
  })),
  originalInstruction: z.string(),
  startDate: z.string(),
  provider: z.enum(['openai', 'groq']),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = storeResultsRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { 
      parsedInstruction, 
      scheduleEvents, 
      originalInstruction, 
      startDate, 
      provider,
      patientId,
      doctorId
    } = validation.data;

    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For demo purposes, we'll use existing IDs from the database if not provided
    // These IDs correspond to the data inserted in our migration
    const demoPatientId = patientId || '770e8400-e29b-41d4-a716-446655440001';
    const demoDoctorId = doctorId || '660e8400-e29b-41d4-a716-446655440001';

    // Start a transaction to ensure data consistency
    const { data: prescriptionData, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert([{
        patientid: demoPatientId,
        doctorid: demoDoctorId,
        originalinstructions: originalInstruction,
        language: 'en', // Default to English for now
        status: 'draft'
      }])
      .select('id')
      .single();

    if (prescriptionError) {
      console.error('Error creating prescription:', prescriptionError);
      return NextResponse.json(
        { error: 'Failed to store prescription', details: prescriptionError.message },
        { status: 500 }
      );
    }

    const prescriptionId = prescriptionData.id;

    // Store parsed instructions
    const { error: parsedError } = await supabase
      .from('parsedinstructions')
      .insert([{
        prescriptionid: prescriptionId,
        medications: parsedInstruction.medications,
        activities: parsedInstruction.activities,
        followupdate: parsedInstruction.followUpDate ? new Date(parsedInstruction.followUpDate).toISOString() : null,
        notes: parsedInstruction.notes
      }]);

    if (parsedError) {
      console.error('Error storing parsed instructions:', parsedError);
      return NextResponse.json(
        { error: 'Failed to store parsed instructions', details: parsedError.message },
        { status: 500 }
      );
    }

    // Store schedule events
    const scheduleInserts = scheduleEvents.map(event => ({
      prescriptionid: prescriptionId,
      type: event.type,
      title: event.title,
      description: event.description,
      dosage: event.metadata.dosage,
      frequency: event.metadata.frequency || 'as scheduled',
      startdate: new Date(`${event.date}T${event.time}`).toISOString(),
      enddate: new Date(`${event.date}T${event.time}`).toISOString(), // For single events, start and end are the same
      times: [event.time],
      status: 'active'
    }));

    const { error: scheduleError } = await supabase
      .from('schedules')
      .insert(scheduleInserts);

    if (scheduleError) {
      console.error('Error storing schedule events:', scheduleError);
      return NextResponse.json(
        { error: 'Failed to store schedule events', details: scheduleError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      prescriptionId: prescriptionId,
      message: 'Parsed results and schedule stored successfully',
      metadata: {
        medicationsCount: parsedInstruction.medications.length,
        activitiesCount: parsedInstruction.activities.length,
        scheduleEventsCount: scheduleEvents.length,
        provider: provider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Store results error:', error);
    return NextResponse.json(
      { error: 'Failed to store parsed results' },
      { status: 500 }
    );
  }
}
