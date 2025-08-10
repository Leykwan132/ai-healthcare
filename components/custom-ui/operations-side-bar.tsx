"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Menu = {
    name: string;
    href: string;
};

const menus: Menu[] = [
    { name: "AI Prompt Testing", href: "/operations/prompt" },
    { name: "Appointments & Schedule", href: "/operations/appointments" },
    { name: "Users", href: "/operations/users" },
    { name: "Doctors", href: "/operations/doctors" },
    { name: "Patients", href: "/operations/patients" },
    { name: "Conversations", href: "/operations/conversations" },
    { name: "Conversation Messages", href: "/operations/conversation-messages" },
    { name: "Notifications", href: "/operations/notifications" },
    { name: "Prescriptions", href: "/operations/prescriptions" },
    { name: "Schedules", href: "/operations/schedules" },
    { name: "Parsed Instructions", href: "/operations/parsed-instructions" },
    { name: "Review Documents", href: "/operations/review-documents" },
    { name: "Tasks", href: "/operations/tasks" },
];

export function OperationsSidebar() {
    const pathname = usePathname();
    const navbarHeight = 64; // match TopNavBar height

    return (
        <aside
            className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 p-4 fixed left-0"
            style={{ top: navbarHeight, height: `calc(100vh - ${navbarHeight}px)` }}
        >
            <h2 className="text-lg font-semibold mb-4">OPERATIONS & TESTING</h2>
            <nav className="space-y-1">
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        className={cn(
                            "block px-3 py-2 rounded-md transition-colors",
                            pathname === menu.href
                                ? "bg-gray-300 dark:bg-gray-700 font-medium"
                                : "hover:bg-gray-200 dark:hover:bg-gray-800"
                        )}
                    >
                        {menu.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
