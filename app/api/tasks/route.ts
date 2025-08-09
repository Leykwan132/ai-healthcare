import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patientId');
        const supabase = await createClient();

        let query = supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (patientId) {
            query = query.eq('patientid', patientId);
        }

        const { data: tasks, error } = await query;

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
