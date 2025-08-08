import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const queryParamsSchema = z.object({
  isCompleted: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const { patientId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    // Validate query parameters
    const queryParams = {
      isCompleted: searchParams.get('isCompleted'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    };

    const validation = queryParamsSchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { isCompleted, limit, offset } = validation.data;

    // Build the query
    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('patientId', patientId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add isCompleted filter if provided
    if (isCompleted) {
      query = query.eq('isCompleted', isCompleted === 'true');
    }

    // Execute the query
    const { data: tasks, error, count } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: tasks || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: count ? offset + (tasks?.length || 0) < count : false,
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
