import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../logout-button";

export async function PatientTopNavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims as { email?: string } | undefined;

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
      {/* Full-width flex container */}
      <div className="flex justify-between items-center h-16 px-4">

        {/* Logo */}
        <Link href="/patients/dashboard" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-11 w-11" />
          <span className="font-semibold">AI Healthcare</span>
        </Link>

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="default">
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}