import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params;
  try {
    const supabase = await createClient();
    const { data: tasks, error, status } = await supabase
      .from('tasks')
      .select('*')
      .eq('patientId', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: tasks || [],
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
