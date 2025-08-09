import type { Metadata } from "next";
import { Geist, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import ThemeToggle from "@/components/custom-ui/accessibility";
import { PatientTopNavBar } from "@/components/custom-ui/patient-top-nav-bar";
import { DoctorTopNavBar } from "@/components/custom-ui/doctor-top-nav-bar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MediBuddyAI",
  description: "Smart, Friendly and Efficient for your doctor and patient",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <DoctorTopNavBar /> */}
          {children}
          {/* <ThemeToggle /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
