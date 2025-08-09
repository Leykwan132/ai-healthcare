import { NextRequest, NextResponse } from 'next/server';
import { createAICompletion, AIError, AIProvider } from '@/lib/ai';
import { z } from 'zod';

// Schema for prescription parsing request
const prescriptionRequestSchema = z.object({
  instruction: z.string().min(1, 'Instruction is required'),
  provider: z.enum(['openai', 'groq']).optional().default('openai'),
  language: z.enum(['en', 'ms']).optional().default('en'),
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
});

// Schema for single parsed instruction (matching the UI interface)
const parsedInstructionSchema = z.object({
  medicationName: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  instructions: z.string(),
  route: z.string(),
  quantity: z.string(),
  refills: z.string(),
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

    const { instruction, provider, language, patientId, doctorId } = validation.data;

    // Create the prompt for prescription parsing
    const prompt = `You are a medical prescription parser. Analyze the provided prescription text and extract structured medication information.

INPUT:
Prescription text: ${instruction}
Language: ${language === 'ms' ? 'Malay' : 'English'}

OUTPUT FORMAT (JSON):
{
  "medicationName": "string - exact medication name",
  "dosage": "string - dosage amount and unit",
  "frequency": "string - how often to take",
  "duration": "string - how long to take",
  "instructions": "string - additional instructions",
  "route": "string - how to take (oral, topical, etc.)",
  "quantity": "string - total quantity prescribed",
  "refills": "string - number of refills allowed"
}

PARSING RULES:
1. Extract exact medication names (brand/generic)
2. Parse dosage amounts with units (mg, ml, units, etc.)
3. Identify frequency patterns (daily, twice daily, as needed, etc.)
4. Determine duration from phrases like "for 7 days" or "until finished"
5. Capture special instructions ("with food", "before bed", etc.)
6. Identify route of administration
7. Calculate total quantity when possible
8. Note refill information

If information is unclear, return "unknown" for that field.
If multiple medications are mentioned, focus on the first/primary medication.

Return ONLY the JSON object, no additional text.`;

    // Call AI API with the selected provider
    const response = await createAICompletion(
      prompt,
      provider as AIProvider,
      provider === 'openai' ? 'gpt-4o-mini' : 'llama3-8b-8192',
      0.3, // Lower temperature for more consistent parsing
      1500
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
    const responseValidation = parsedInstructionSchema.safeParse(parsedResponse);
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
      parsedInstruction: responseValidation.data,
      metadata: {
        provider,
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
