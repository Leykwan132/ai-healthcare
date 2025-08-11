import { DoctorSidebar } from "@/components/custom-ui/doctor-side-bar";
import { DoctorTopNavBar } from "@/components/custom-ui/doctor-top-nav-bar";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <DoctorTopNavBar />
            <div className="flex flex-1">
                <DoctorSidebar />
                <main
                    className="
                        flex-1
                        p-4 md:p-6
                        transition-all duration-300 ease-in-out
                        md:ml-64
                    "
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
