"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Menu = {
    name: string;
    href: string;
};

const menus: Menu[] = [
    { name: "Tenants", href: "/tenants" },
    { name: "Health", href: "/doctors" },
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
                                ? "bg-gray-300 dark:bg-gray-700 font-medium"
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
