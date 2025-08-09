"use client";

export default function Home() {
  return (
    <main
      className="
      relative min-h-screen
      bg-gradient-to-br
      from-[#12204b] via-[#3b5998] to-[#a8c7ff]
      flex items-center justify-center
      text-gray-900
      overflow-hidden
    "
    >
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Brighter pulsing radial top-left */}
        <div
          className="
            absolute top-0 left-0 w-[150%] h-[150%]
            bg-[radial-gradient(circle_at_30%_30%,rgba(255,245,230,0.3),transparent_40%)]
            animate-slow-pulse
          "
        />

        {/* Ping bottom-right with more intensity */}
        <div
          className="
            absolute bottom-0 right-0 w-[150%] h-[150%]
            bg-[radial-gradient(circle_at_70%_80%,rgba(255,235,210,0.2),transparent_40%)]
            animate-slow-ping
          "
        />

        {/* Floating translucent warm blue-purple-pink blob */}
        <div
          className="
            absolute left-1/2 top-1/3 w-96 h-96
            bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-300
            opacity-20 blur-3xl rounded-full animate-float-slow
          "
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 text-center flex flex-col items-center gap-4 px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg whitespace-nowrap text-white">
          Welcome to MediBuddyAI
        </h1>
        <p className="text-lg md:text-xl max-w-none whitespace-nowrap text-white">
          Smart, Friendly and Efficient for your doctor and patient
        </p>

        <div className="flex flex-col items-center gap-6 mt-8">

          <img
            src="/Vertica.gif"
            alt="Vertica animation"
            style={{
              width: 250,
              height: 250,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

          <button
            onClick={() => {
              window.location.href = "/patients/dashboard";
            }}
            className="
              bg-blue-600 hover:bg-blue-700
              transition px-6 py-3 rounded-xl text-lg font-semibold shadow-lg text-white
            "
          >
            Developer Mode
          </button>
        </div>
      </div>
    </main>
  );
}