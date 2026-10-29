"use client";
import React, { useRef, useState } from "react";
import { TOOLS } from "@/description/tools";

import HoverVideoCard from "@/components/dashboard/HoverVideoCard";
// At the top of your dashboard page file:
import CreditCircle from "@/components/general/CreditCircle";
  
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* হেডার আপডেট: flex justify-between ব্যবহার করা হয়েছে টপ রাইট পজিশনের জন্য */}
        <header className="pb-2 md:pb-4 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Welcome back, Creator!</h1>
            <p className="text-sm text-zinc-500 mt-1">Select a tool to begin analysis.</p>
          </div>
          {/* just plugin credit circle */}
          <CreditCircle credits={100} />
        </header>

        {/* মোবাইলের জন্য grid-cols-1 এবং ডেস্কটপের জন্য grid-cols-3 বা 4 করা হয়েছে */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-6">
          {TOOLS.filter(t => ["timeline", "format-filterer", "audio-spectrum", "outlier-predictor", "saliency", "format-database", "aligner"].includes(t.id)).map(tool => (
            <HoverVideoCard key={tool.id} tool={tool} />
          ))}
        </div>

      </div>
    </div>
  );
}
