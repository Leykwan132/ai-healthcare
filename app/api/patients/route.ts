import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get('doctorId');

        if (!doctorId) {
            return NextResponse.json(
                { error: 'doctorId query parameter is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        
        // Join patients with conversations to get patients for a specific doctor
        const { data: patients, error } = await supabase
            .from('patients')
            .select(`
                *,
                conversations!inner(
                    doctor_id
                )
            `)
            .eq('conversations.doctor_id', doctorId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching patients:', error);
            return NextResponse.json(
                { error: 'Failed to fetch patients' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data: patients || [],
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
