import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const conversationSchema = z.object({
    patientId: z.string().uuid(),
    doctorId: z.string().uuid(),
    context: z.object({
        appointmentId: z.string().uuid().optional(),
        purpose: z.enum(['follow_up', 'consultation', 'treatment']),
    }),
});


export async function POST(
  request: Request
) {
    try {
        const supabase = await createClient();

        // Validate request body
        const body = await request.json();
        const validation = conversationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { patientId, doctorId, context } = validation.data;

        // Create a new conversation
        const { data: conversation, error } = await supabase
            .from('conversations')
            .insert([
                {
                    patient_id: patientId,
                    doctor_id: doctorId,
                    status: 'active',
                    context: context,
                    created_by: 'system'
                }
            ])
            .select('*')
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return NextResponse.json(
                { error: 'Failed to create conversation' },
                { status: 500 }
            );
        }

        return NextResponse.json(conversation, { status: 201 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
