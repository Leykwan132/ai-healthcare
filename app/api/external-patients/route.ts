import { NextResponse } from 'next/server';

// External Supabase API configuration
const EXTERNAL_SUPABASE_URL = 'https://tmfkvxofwewpjtpafjkq.supabase.co/rest/v1';

// Note: Replace YOUR_ANON_KEY with the actual API key
const EXTERNAL_SUPABASE_ANON_KEY = process.env.EXTERNAL_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export async function GET() {
    try {
        // Check if we have a valid API key
        if (!EXTERNAL_SUPABASE_ANON_KEY || EXTERNAL_SUPABASE_ANON_KEY === 'YOUR_ANON_KEY') {
            console.log('External Supabase API key not configured, using local fallback');
            return NextResponse.json(
                { error: 'External API key not configured' },
                { status: 401 }
            );
        }

        const response = await fetch(`${EXTERNAL_SUPABASE_URL}/patients`, {
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
        
        return NextResponse.json({
            data: patients || [],
            source: 'external_supabase'
        });

    } catch (error) {
        console.error('Error fetching patients from external Supabase:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patients from external API' },
            { status: 500 }
        );
    }
}
