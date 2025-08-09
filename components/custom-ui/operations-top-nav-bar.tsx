import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../logout-button";

export async function OperationsTopNavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims as { email?: string } | undefined;

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 flex justify-between items-center">
      {/* Left section (logo stays flush left) */}
      <div className="flex items-center space-x-2 pl-4">
        <Link href="/operations" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="font-semibold">AI Healthcare - Operations</span>
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
