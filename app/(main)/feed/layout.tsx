import Navbar from "@/components/Navbar";
import FloatingAddButton from "@/components/FloatingAddButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar />
      
      {/* The specific page content (dashboard, analysis, submit) gets injected here */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      <FloatingAddButton />
    </div>
  );
}
