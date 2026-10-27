'use client';

import React, { useState, useEffect } from 'react';
import { tools } from '@/config/tools';
import BentoCard from '@/components/BentoCard';

export default function DashboardClient({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5 || hour >= 22) setGreeting("Working at midnight?");
    else if (hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 14) setGreeting("Good noon");
    else if (hour >= 14 && hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <main className="min-h-screen bg-[#070709] text-white p-4 md:p-8 font-mono selection:bg-[#00e5ff] selection:text-black">
      <header className="max-w-[90rem] mx-auto mb-8 flex flex-col md:flex-row md:items-end md:justify-between border-b border-[#1f222d] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#00e5ff]">System Command Matrix</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-1 capitalize">
            Hey {userName}, {greeting}
          </h1>
          <p className="text-sm text-[#888890]">Start using the suite!</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-xs text-[#888890]">
          <span className="px-3 py-1.5 rounded-xl bg-[#12141c] border border-[#222634]">Status: Synchronized</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#12141c] border border-[#222634] text-[#00e5ff]">{tools.length} Modules Active</span>
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-5 gap-5 auto-rows-[270px]">
        {tools.map((tool, index) => (
          <BentoCard key={index} tool={tool} />
        ))}
      </div>
    </main>
  );
}
