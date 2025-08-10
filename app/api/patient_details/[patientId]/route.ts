import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params;
        
        if (!patientId) {
            return NextResponse.json(
                { error: 'patientId parameter is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        
        // Fetch patient details by ID
        const { data: patient, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single();

        if (error) {
            console.error('Error fetching patient details:', error);
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Patient not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: 'Failed to fetch patient details' },
                { status: 500 }
            );
        }

        if (!patient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(patient);

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
