import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  isCompleted: z.boolean(),
  updatedBy: z.string(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  try {
    const supabase = await createClient();

    // Validate request body
    const body = await request.json();
    const validation = statusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { isCompleted, updatedBy } = validation.data;

    // Verify the task exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update the task completion status
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({
        isCompleted,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      })
      .eq('id', taskId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating task status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update task status' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTask);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
