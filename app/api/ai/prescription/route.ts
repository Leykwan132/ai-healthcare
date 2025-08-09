import { NextRequest, NextResponse } from 'next/server';
import { createAICompletion, AIError, AIProvider } from '@/lib/ai';
import { z } from 'zod';

// Schema for prescription parsing request
const prescriptionRequestSchema = z.object({
  instruction: z.string().min(1, 'Instruction is required'),
  provider: z.enum(['openai', 'groq']).optional().default('openai'),
  language: z.enum(['en', 'ms']).optional().default('en'),
  startDate: z.string().optional().default(new Date().toISOString().split('T')[0]), // YYYY-MM-DD format
  patientId: z.string().uuid().optional(),
  doctorId: z.string().uuid().optional(),
});

// Schema for parsed instruction response (matching database schema)
const parsedInstructionSchema = z.object({
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

    const { instruction, provider, language, startDate, patientId, doctorId } = validation.data;

    // Create the prompt for prescription parsing (matching database schema)
    const prompt = `You are a medical prescription parser. Analyze the provided prescription text and extract structured information.

INPUT:
Prescription text: ${instruction}
Language: ${language === 'ms' ? 'Malay' : 'English'}

OUTPUT FORMAT (JSON):
{
  "medications": [
    {
      "name": "string - exact medication name",
      "dosage": "string - dosage amount and unit",
      "frequency": "string - how often to take",
      "duration": "string - how long to take (ongoing, 7 days, etc.)",
      "timing": "string - when to take (morning, evening, before meals, etc.)",
      "instructions": "string - additional instructions"
    }
  ],
  "activities": [
    {
      "name": "string - activity name",
      "duration": "string - how long to do activity",
      "frequency": "string - how often to do activity",
      "timing": "string - when to do activity",
      "instructions": "string - additional activity instructions"
    }
  ],
  "followUpDate": "string - follow-up date in ISO format (optional)",
  "notes": "string - additional notes or instructions (optional)"
}

PARSING RULES:
1. Extract ALL medications mentioned in the text
2. For each medication: name, dosage, frequency, duration, timing, special instructions
3. Extract activities like exercise, diet changes, monitoring tasks
4. For each activity: name, duration, frequency, timing, instructions
5. Look for follow-up appointments or check-up dates
6. Include general notes or warnings
7. Use "ongoing" for duration if no end date specified
8. If information is unclear, return "unknown" for that field

EXAMPLES:

Example 1:
Input: "Take 1 tablet of Amlodipine 5mg once daily in the morning. Light exercise 30 minutes daily."
Output:
{
  "medications": [{
    "name": "Amlodipine",
    "dosage": "5mg",
    "frequency": "once daily",
    "duration": "ongoing",
    "timing": "morning",
    "instructions": "Take 1 tablet"
  }],
  "activities": [{
    "name": "Light Exercise",
    "duration": "30 minutes",
    "frequency": "daily",
    "timing": "anytime",
    "instructions": "Walking or light stretching"
  }],
  "followUpDate": "",
  "notes": ""
}

Return ONLY the JSON object, no additional text.`;

    // Call AI API with the selected provider
    const response = await createAICompletion(
      prompt,
      provider as AIProvider,
      provider === 'openai' ? 'gpt-4o-mini' : 'llama-3.1-8b-instant',
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
