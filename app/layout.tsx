import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingAddButton from "@/components/FloatingAddButton";

export const metadata: Metadata = {
  title: "AnalysisArchive",
  description: "A lightweight community platform for content analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* globals.css handles the bg-black and text color automatically on the body */}
      <body>
        <Navbar />
        
        {/* pb-20 adds padding at the bottom so the floating button doesn't cover content */}
        <main className="min-h-screen pb-20 pt-6">
          {children}
        </main>

        <FloatingAddButton />
      </body>
    </html>
  );
}
