import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../logout-button";
import { LoginButton } from "../login-button";

export async function DoctorTopNavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims as { email?: string } | undefined;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 flex justify-between items-center">
      {/* Left section (logo stays flush left) */}
      <div className="flex items-center space-x-2 pl-4">
        <Link href="/doctors/dashboard" className="flex items-center space-x-2">
          <img src="/Vertica.gif" alt="Logo" className="h-11 w-11 rounded-full object-cover" />
          <span className="font-semibold">MediBuddyAI</span>
        </Link>
      </div>

      {/* Right section (shifted for sidebar space) */}
      <div className="flex items-center gap-4 pr-4" style={{ paddingLeft: "200px" }}>
        {user ? (
          <>
            <span className="text-sm">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <span className="text-sm">Developer mode</span>
            <LoginButton />
          </>
        )}
      </div>
    </header>
  );
}