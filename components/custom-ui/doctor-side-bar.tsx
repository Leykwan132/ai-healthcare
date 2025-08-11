"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";

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
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden fixed top-[72px] left-4 z-50 p-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            >
                {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-[64px] left-0 bottom-0 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 transition-transform duration-200 ease-in-out z-40 flex flex-col",
                    open ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0 md:w-64"
                )}
            >
                <div className="p-4 flex-1 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4 pt-8 md:pt-0">PAGES</h2>
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
                                onClick={() => setOpen(false)}
                            >
                                {channel.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
}
