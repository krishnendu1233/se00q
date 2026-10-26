'use client';

import React from 'react';

interface ToolCard {
  title: string;
  description: string;
  videoSrc: string;
  tag: string;
  spanClass: string;
}

const tools: ToolCard[] = [
  {
    title: "Format Filterer",
    description: "Filters raw video streams through funnel analytics into structured reports.",
    videoSrc: "/format-filterer-broll (3).mp4",
    tag: "Core Engine",
    spanClass: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    title: "Audio Spectrum Roller-Coaster",
    description: "Dual thread audio visualization weaving across corner-to-corner tracks.",
    videoSrc: "/audio-spectrum-broll (1).mp4",
    tag: "Visualizer",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Outlier Predictor Tool",
    description: "Scans chart metrics and highlights anomaly spike predictions.",
    videoSrc: "/outlier-predictor-broll (2).mp4",
    tag: "Analytics",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Format Database",
    description: "Community-driven horizontal stream of video formats and metrics.",
    videoSrc: "/format-database-horizontal-broll (1).mp4",
    tag: "Community",
    spanClass: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    title: "Timeline & Aligner",
    description: "Precise synchronization and structural timeline layout b-rolls.",
    videoSrc: "/timeline-dark-broll (3).mp4",
    tag: "Editing",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Saliency Heatmap Tool",
    description: "Tracks viewer attention hotspots with calm pulsing focal points.",
    videoSrc: "/aligner-broll-v2 (1).mp4",
    tag: "Attention AI",
    spanClass: "col-span-1 md:col-span-2 row-span-1",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 font-sans selection:bg-[#00e5ff] selection:text-black">
      {/* Dashboard Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#222228] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#00e5ff] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-[#00e5ff] font-mono">Platform Command Center</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Format Database & Tools Bento</h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 font-mono text-xs text-[#888890]">
          <span className="px-3 py-1.5 rounded bg-[#12141a] border border-[#222228]">Status: Online</span>
          <span className="px-3 py-1.5 rounded bg-[#12141a] border border-[#222228] text-[#00e5ff]">6 Active B-rolls</span>
        </div>
      </header>

      {/* Bento Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[280px]">
        {tools.map((tool, index) => (
          <div
            key={index}
            className={`relative group rounded-2xl bg-[#12141a] border border-[#222228] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#00e5ff]/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)] ${tool.spanClass}`}
          >
            {/* Background Video Preview Loop */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500 overflow-hidden pointer-events-none">
              <video
                src={tool.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/60 to-transparent"></div>
            </div>

            {/* Card Top Metadata */}
            <div className="relative z-10 p-5 flex items-start justify-between">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-[#0a0a0c]/80 border border-[#222228] text-[#00e5ff] backdrop-blur-md">
                {tool.tag}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]/40 group-hover:bg-[#00e5ff] transition-colors"></span>
            </div>

            {/* Card Bottom Content */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/90 to-transparent pt-10">
              <h3 className="text-lg font-semibold tracking-wide text-white mb-1 group-hover:text-[#00e5ff] transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-[#9999a3] line-clamp-2 leading-relaxed font-sans">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
