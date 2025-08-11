import { PatientSidebar } from "@/components/custom-ui/patient-side-bar";
import { PatientTopNavBar } from "@/components/custom-ui/patient-top-nav-bar";

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <PatientTopNavBar />
            <div className="flex flex-1">
                <main
                    className="
                        flex-1
                        p-4 md:p-6
                        transition-all duration-300 ease-in-out
                        md:ml-64
                    "
                >
                    <PatientSidebar />
                    {children}
                </main>
            </div>
        </div>
    );
}