import { NextRequest, NextResponse } from 'next/server';
import { createGroqCompletion, validateGroqKey, AIError } from '@/lib/ai';
import { z } from 'zod';

// Schema for Groq completion request
const groqRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.string().optional().default('gemma2-9b-it'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(1).max(4000).optional().default(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = groqRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { prompt, model, temperature, maxTokens } = validation.data;

    // Validate Groq API key
    try {
      validateGroqKey();
    } catch (error) {
      return NextResponse.json(
        { error: 'Groq API key not configured', details: error instanceof AIError ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Generate completion using Groq
    const completion = await createGroqCompletion(prompt, model, temperature, maxTokens);

    return NextResponse.json({
      success: true,
      provider: 'groq',
      model,
      prompt,
      completion,
      metadata: {
        temperature,
        maxTokens,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Groq API error:', error);
    
    if (error instanceof AIError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          statusCode: error.statusCode,
          provider: 'groq'
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        provider: 'groq',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt') || 'Hello, how are you today?';
    const model = searchParams.get('model') || 'gemma2-9b-it';
    const temperature = parseFloat(searchParams.get('temperature') || '0.7');
    const maxTokens = parseInt(searchParams.get('maxTokens') || '100');

    // Validate Groq API key
    try {
      validateGroqKey();
    } catch (error) {
      return NextResponse.json(
        { error: 'Groq API key not configured', details: error instanceof AIError ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Generate completion using Groq
    const completion = await createGroqCompletion(prompt, model, temperature, maxTokens);

    return NextResponse.json({
      success: true,
      provider: 'groq',
      model,
      prompt,
      completion,
      metadata: {
        temperature,
        maxTokens,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Groq API error:', error);
    
    if (error instanceof AIError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          statusCode: error.statusCode,
          provider: 'groq'
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        provider: 'groq',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
