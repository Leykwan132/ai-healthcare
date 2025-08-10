import { NextResponse } from 'next/server';

// External Supabase API configuration
const EXTERNAL_SUPABASE_URL = 'https://tmfkvxofwewpjtpafjkq.supabase.co/rest/v1';

// Note: Replace YOUR_ANON_KEY with the actual API key
const EXTERNAL_SUPABASE_ANON_KEY = process.env.EXTERNAL_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params;
        
        const response = await fetch(`${EXTERNAL_SUPABASE_URL}/patients?id=eq.${patientId}`, {
            headers: {
                'apikey': EXTERNAL_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${EXTERNAL_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('External Supabase API error:', response.status, response.statusText);
            return NextResponse.json(
                { error: `External API error: ${response.status}` },
                { status: response.status }
            );
        }

        const patients = await response.json();
        const patient = patients && patients.length > 0 ? patients[0] : null;
        
        if (!patient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(patient);

    } catch (error) {
        console.error('Error fetching patient details from external Supabase:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patient details from external API' },
            { status: 500 }
        );
    }
}
