import BrollApp from '@/components/broll/BrollApp';

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-emerald-400 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
          B-Roll Suggestor
        </h1>
        
        {/* The client-side logic happens inside here */}
        <BrollApp />
      </div>
    </main>
  );
}
