import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params;
        const supabase = await createClient();

        // Build the query
        let query = supabase
            .from('reviewdocuments')
            .select('*')
            .eq('patientid', patientId)
            .order('created_at', { ascending: false });

        // Execute the query
        const { data: documents, error } = await query;

        if (error) {
            console.error('Error fetching documents:', error);
            return NextResponse.json(
                { error: 'Failed to fetch documents' },
                { status: 500 }
            );
        }

        // Parse the content JSON string for each document
        const documentsWithParsedContent = documents?.map(document => {
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

            return {
                ...document,
                content: parsedContent
            };
        }) || [];

        return NextResponse.json(documentsWithParsedContent);

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}