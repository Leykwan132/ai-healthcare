"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Menu = {
    name: string;
    href: string;
};

const menus: Menu[] = [
    { name: "Prescription Scheduler", href: "/doctors/dashboard" },
    { name: "Patient Follow-Up", href: "/doctors/patient-table" },
];

export function DoctorSidebar() {
    const pathname = usePathname();
    const navbarHeight = 64; // match TopNavBar height

    return (
        <aside
            className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 p-4 fixed left-0"
            style={{ top: navbarHeight, height: `calc(100vh - ${navbarHeight}px)` }}
        >
            <h2 className="text-lg font-semibold mb-4">PAGES</h2>
            <nav className="space-y-1">
                {menus.map((channel) => (
                    <Link
                        key={channel.href}
                        href={channel.href}
                        className={cn(
                            "block px-3 py-2 rounded-md transition-colors",
                            pathname === channel.href
                                ? "bg-blue-100 text-blue-800 font-medium dark:bg-blue-900 dark:text-blue-300"
                                : "hover:bg-gray-200 dark:hover:bg-gray-800"
                        )}
                    >
                        {channel.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
