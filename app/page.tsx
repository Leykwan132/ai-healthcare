import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="relative min-h-screen 
    bg-gradient-to-br from-white via-blue-100 to-blue-300 
    dark:from-indigo-900 dark:via-purple-900 dark:to-gray-900 
    flex items-center justify-center 
    text-black dark:text-white overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Brighter pulsing radial top-left */}
        <div className="absolute top-0 left-0 w-[150%] h-[150%] 
      bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_40%)] 
      dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_40%)] 
      animate-slow-pulse" />

        {/* Ping bottom-right with more intensity */}
        <div className="absolute bottom-0 right-0 w-[150%] h-[150%] 
      bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.15),transparent_40%)] 
      dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_40%)] 
      animate-slow-ping" />

        {/* Optional: floating translucent blob */}
        <div className="absolute left-1/2 top-1/3 w-96 h-96 bg-purple-400 opacity-20 blur-3xl rounded-full animate-float-slow dark:bg-purple-600" />
      </div>

      {/* Foreground content remains the same */}
      <div className="relative z-10 text-center flex flex-col items-center gap-8 px-6">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Welcome to AI Healthcare
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-gray-800 dark:text-gray-200">
          Choose your role to log in and start managing your health journey with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <Link href="/schedule-planning">
              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
                Doctor
              </button>
            </Link>

            <Link href="/home">
              <button className="bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500 transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
                Patient
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}