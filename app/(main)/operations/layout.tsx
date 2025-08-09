import { OperationsSidebar } from "../../../components/custom-ui/operations-side-bar";
import { OperationsTopNavBar } from "../../../components/custom-ui/operations-top-nav-bar";

export default function OperationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <OperationsTopNavBar />
            <OperationsSidebar />
            <main className="flex-1 ml-64 pt-16">{children}</main>
        </div>
    );
}
