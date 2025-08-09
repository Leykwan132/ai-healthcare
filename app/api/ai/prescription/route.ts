import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompletion, AIError } from '@/lib/ai';
import { z } from 'zod';

// Schema for prescription parsing request
const prescriptionRequestSchema = z.object({
  instructions: z.string().min(1, 'Instructions are required'),
  language: z.enum(['en', 'ms']).optional().default('en'),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
});

// Schema for parsed prescription response
const parsedPrescriptionSchema = z.object({
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string().optional(),
    instructions: z.string().optional(),
  })),
  activities: z.array(z.object({
    type: z.string(),
    description: z.string(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
  })).optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = prescriptionRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { instructions, language, patientId, doctorId } = validation.data;

    // Create the prompt for prescription parsing
    const prompt = `Please parse the following prescription instructions and return a structured JSON response.

Instructions: ${instructions}
Language: ${language === 'ms' ? 'Malay' : 'English'}

Please extract the following information and return it as a valid JSON object:
1. Medications: name, dosage, frequency, duration (if specified), special instructions
2. Activities: type, description, frequency, duration (if specified)
3. Follow-up date (if mentioned)
4. Additional notes

Return the response in this exact JSON format:
{
  "medications": [
    {
      "name": "medication name",
      "dosage": "dosage amount",
      "frequency": "how often",
      "duration": "how long",
      "instructions": "special instructions"
    }
  ],
  "activities": [
    {
      "type": "activity type",
      "description": "activity description",
      "frequency": "how often",
      "duration": "how long"
    }
  ],
  "followUpDate": "YYYY-MM-DD",
  "notes": "additional notes"
}

Only return the JSON object, no additional text or explanations.`;

    // Call OpenAI API
    const response = await createOpenAICompletion(
      prompt,
      'gpt-4',
      0.3, // Lower temperature for more consistent parsing
      2000
    );

    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response', rawResponse: response },
        { status: 500 }
      );
    }

    // Validate the parsed response
    const responseValidation = parsedPrescriptionSchema.safeParse(parsedResponse);
    if (!responseValidation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid AI response format', 
          details: responseValidation.error.issues,
          rawResponse: parsedResponse
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseValidation.data,
      metadata: {
        language,
        patientId,
        doctorId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Prescription parsing error:', error);
    
    if (error instanceof AIError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to parse prescription instructions' },
      { status: 500 }
    );
  }
}
