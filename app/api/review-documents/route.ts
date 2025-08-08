import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reviewDocumentSchema = z.object({
    content: z.json(),
    doctorId: z.string(),
    isReviewed: z.boolean().optional().default(false),
});

type DocumentContent = {
    [key: string]: any;
};

export async function POST(
  request: Request
) {
    try {
        const supabase = await createClient();

        // Verify user session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Validate request body
        const body = await request.json();
        const validation = reviewDocumentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { content, doctorId, isReviewed } = validation.data;

        // Create a new document review
        const { data: document, error } = await supabase
            .from('reviewDocuments')
            .insert([
                {
                    content,
                    doctorId,
                    isReviewed,
                    reviewed_at: isReviewed ? new Date().toISOString() : null,
                }
            ])
            .select('*')
            .single();

        if (error) {
            console.error('Error creating document review:', error);
            return NextResponse.json(
                { error: 'Failed to create document review' },
                { status: 500 }
            );
        }

        return NextResponse.json(document, { status: 201 });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
  request: Request
) {
    try {
        const { searchParams } = new URL(request.url);
        const supabase = await createClient();

        // Get query parameters
        const doctorId = searchParams.get('doctorId');
        const isReviewed = searchParams.get('isReviewed');

        // Build the query
        let query = supabase
            .from('reviewDocuments')
            .select('*')
            .order('created_at', { ascending: false });

        // Add filters if provided
        if (doctorId) {
            query = query.eq('doctorId', doctorId);
        }

        if (isReviewed) {
            query = query.eq('isReviewed', isReviewed === 'true');
        }

        // Execute the query
        const { data: documents, error } = await query;

        if (error) {
            console.error('Error fetching documents:', error);
            return NextResponse.json(
                { error: 'Failed to fetch documents' },
                { status: 500 }
            );
        }

        return NextResponse.json(documents || []);

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
