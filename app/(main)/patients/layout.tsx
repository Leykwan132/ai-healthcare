import { PatientSidebar } from "@/components/custom-ui/patient-side-bar";
import { PatientTopNavBar } from "@/components/custom-ui/patient-top-nav-bar";


export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <PatientTopNavBar />
            <PatientSidebar />
            <main className="flex-1 ml-64 p-6">{children}</main>
        </div>
    );
}
