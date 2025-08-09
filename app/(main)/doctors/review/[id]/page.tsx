import FollowUpPage from "@/components/custom-ui/follow-up-doc";

interface ReviewPageProps {
    params: { id: string };
}

export default async function PatientReviewForm({ params }: ReviewPageProps) {
    // await params if needed (some Next.js versions require this)
    const awaitedParams = await params;

    return (
        <main className="p-8 pt-24">
            <h1 className="text-3xl font-bold mb-6">
                Review patient who completed prescription
            </h1>
            <FollowUpPage params={{ id: awaitedParams.id }} />
        </main>
    );
}