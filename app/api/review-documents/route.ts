import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reviewDocumentSchema = z.object({
    patientId: z.string(),
    isReviewed: z.boolean().optional().default(false),
});

export async function POST(
    request: Request
) {
    try {
        const supabase = await createClient();

        // Validate request body
        const body = await request.json();
        const validation = reviewDocumentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { isReviewed, patientId } = validation.data;

        // update the document review
        const { data: document, error } = await supabase
            .from('reviewdocuments')
            .update({
                isReviewed,
            })
            .eq('patientid', patientId)
            .select('*')
            .single();

        if (error) {
            console.error('Error updating document review:', error);
            return NextResponse.json(
                { error: 'Failed to update document review' },
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

