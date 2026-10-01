import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-6 sm:p-12">
      <main className="max-w-4xl w-full space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Democratizing <span className="text-cyan-500">Content Analytics</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Official platform APIs heavily restrict access to video data. We bypass the gatekeepers by relying on the most powerful analytical tool available: human intelligence. 
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link 
              href="/login" 
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-md transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </section>

        {/* The Story / Features Section */}
        <section className="grid md:grid-cols-3 gap-8 pt-12 border-t border-gray-800">
          
          <div className="space-y-3">
            <div className="h-12 w-12 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-lg text-2xl mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Beyond Strict Limits</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Why let platforms hide their analytics? We sidestep restrictive APIs and terms of service by crowdsourcing qualitative data directly from the community, for any platform.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-lg text-2xl mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Community Breakdown</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Raw data feeds lack context. Real creators manually breaking down hooks, pacing, and transcripts of outlier videos provide infinitely more actionable insights.
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-12 w-12 bg-cyan-900/30 text-cyan-400 flex items-center justify-center rounded-lg text-2xl mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Searchable Archive</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              As users spot and document high-performing videos, the platform evolves into a collaborative, searchable database of proven content strategies available to everyone.
            </p>
          </div>

        </section>
      </main>
    </div>
  );
}
