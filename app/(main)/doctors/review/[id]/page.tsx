import FollowUpPage from "@/components/custom-ui/follow-up-doc";

interface ReviewPageProps {
    params: { id: string };
}

export default function PatientReviewForm({ params }: ReviewPageProps) {
    return (
        <main className="p-8 pt-24">
            <h1 className="text-3xl font-bold mb-6">
                Review patient who completed prescription
            </h1>
            <FollowUpPage params={{ id: params.id }} />
        </main>
    );
}