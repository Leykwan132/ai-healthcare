import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params;
        const supabase = await createClient();

        // Fetch the most recent document for the patient
        const { data: document, error } = await supabase
            .from('reviewdocuments')
            .select('*')
            .eq('patientid', patientId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                return NextResponse.json(
                    { error: 'No documents found for this patient' },
                    { status: 404 }
                );
            }
            console.error('Error fetching document:', error);
            return NextResponse.json(
                { error: 'Failed to fetch document' },
                { status: 500 }
            );
        }

        // Parse the content JSON string
        let parsedContent = null;
        if (document.content) {
            try {
                parsedContent = JSON.parse(document.content);
            } catch (parseError) {
                console.error('Error parsing content JSON for document:', document.id, parseError);
                // If parsing fails, keep the original content as string
                parsedContent = document.content;
            }
        }

        const result = {
            ...document,
            content: parsedContent
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}