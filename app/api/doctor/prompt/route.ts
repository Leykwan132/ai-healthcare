import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const promptSchema = z.object({
  conversationId: z.string().uuid(),
  doctorId: z.string().uuid(),
  message: z.string().min(1, 'Message is required'),
  context: z.object({
    patientId: z.string().uuid(),
    previousMessages: z.array(z.any()).optional(),
  }),
});


export async function POST(
  request: Request
) {
  try {
    const supabase = await createClient();

    // Validate request body
    const body = await request.json();
    const validation = promptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { conversationId, doctorId, message, context } = validation.data;

    // Verify the doctor has access to this conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('doctor_id', doctorId)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found or access denied' },
        { status: 404 }
      );
    }

    // Here you would typically call your AI/ML service to process the prompt
    // For now, we'll just return a mock response
    const aiResponse = {
      response: "I've processed your request regarding the patient's condition. Here's my analysis...",
      suggestions: ["Consider ordering lab tests", "Review medication history"],
      followUpQuestions: ["When did the symptoms start?", "Any recent changes in medication?"]
    };

    // Save the message to the database
    const { data: messageData, error: messageError } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: doctorId,
          sender_type: 'doctor',
          content: message,
          metadata: {
            ai_response: aiResponse,
            context: context
          }
        }
      ])
      .select('*')
      .single();

    if (messageError) {
      console.error('Error saving message:', messageError);
      return NextResponse.json(
        { error: 'Failed to process prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: messageData,
      aiResponse: aiResponse
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
