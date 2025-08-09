import { DoctorSidebar } from "@/components/custom-ui/doctor-side-bar";
import { DoctorTopNavBar } from "@/components/custom-ui/doctor-top-nav-bar";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex">
            <DoctorTopNavBar />
            <DoctorSidebar />
            <main className="flex-1 ml-64 p-6">{children}</main>
        </div>
    );
}
