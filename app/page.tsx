import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center px-4 py-12 md:p-12">
      <main className="max-w-5xl w-full space-y-16 md:space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 md:space-y-8 mt-10 md:mt-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            <span className="text-cyan-500 block mb-2 md:inline md:mb-0">se00q.</span> <br className="md:hidden" />
            Content Analytics
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
            Official platform APIs heavily restrict access to video data. We bypass the gatekeepers by relying on the most powerful analytical tool available: human intelligence. 
          </p>
          <div className="pt-6 flex justify-center w-full px-4 sm:px-0">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-md transition-colors text-center text-lg"
            >
              Join se00q
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-12 md:pt-16 border-t border-gray-800 px-2 md:px-0">
          
          <div className="space-y-4 bg-gray-950 p-6 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
            <div className="h-14 w-14 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-xl text-2xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Beyond Strict Limits</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Why let platforms hide their analytics? We sidestep restrictive APIs and terms of service by crowdsourcing qualitative data directly from the community, for any platform.
            </p>
          </div>

          <div className="space-y-4 bg-gray-950 p-6 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
            <div className="h-14 w-14 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-xl text-2xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Community Breakdown</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Raw data feeds lack context. Real creators manually breaking down hooks, pacing, and transcripts of outlier videos provide infinitely more actionable insights.
            </p>
          </div>

          <div className="space-y-4 bg-gray-950 p-6 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
            <div className="h-14 w-14 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-xl text-2xl">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Searchable Archive</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              As users spot and document high-performing videos, the platform evolves into a collaborative, searchable database of proven content strategies available to everyone.
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}
