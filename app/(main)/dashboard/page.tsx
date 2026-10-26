'use client';

import React from 'react';

interface ToolCard {
  title: string;
  description: string;
  videoSrc: string;
  tag: string;
  spanClass: string;
  bgTint?: string;
}

const tools: ToolCard[] = [
  {
    title: "Format Filterer",
    description: "Filters raw video streams through funnel analytics into structured reports.",
    videoSrc: "/format-filterer-broll.mp4",
    tag: "Core Engine",
    spanClass: "col-span-1 md:col-span-2 row-span-2",
  },
  {
    title: "Audio Spectrum",
    description: "Dual thread audio visualization weaving across corner-to-corner tracks.",
    videoSrc: "/audio-spectrum.mp4",
    tag: "Visualizer",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Outlier Predictor",
    description: "Scans chart metrics and highlights anomaly spike predictions.",
    videoSrc: "/outlier-predictor-broll.mp4",
    tag: "Analytics",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Format Database",
    description: "Community-driven horizontal stream of video formats and metrics.",
    videoSrc: "/format-database-horizontal-broll.mp4",
    tag: "Community",
    spanClass: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    title: "Timeline & Aligner",
    description: "Precise synchronization and structural timeline layout b-rolls.",
    videoSrc: "/timeline-dark-broll.mp4",
    tag: "Editing",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
  {
    title: "Saliency Heatmap",
    description: "Tracks viewer attention hotspots with calm pulsing cyan focal points.",
    videoSrc: "/saliency-cyan-broll.mp4",
    tag: "Attention AI",
    spanClass: "col-span-1 md:col-span-2 row-span-1",
  },
  {
    title: "Sync Aligner V2",
    description: "Advanced structural alignment and frame matching module.",
    videoSrc: "/aligner-broll.mp4",
    tag: "Sync Suite",
    spanClass: "col-span-1 md:col-span-1 row-span-1",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#070709] text-white p-4 md:p-8 font-mono selection:bg-[#00e5ff] selection:text-black">
      {/* Dashboard Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#1f222d] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
            <span className="text-[11px] uppercase tracking-widest text-[#00e5ff]">System Command Matrix</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">Format Tools & Bento Feed</h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-xs text-[#888890]">
          <span className="px-3 py-1.5 rounded-xl bg-[#12141c] border border-[#222634]">Status: Synchronized</span>
          <span className="px-3 py-1.5 rounded-xl bg-[#12141c] border border-[#222634] text-[#00e5ff]">7 Modules Active</span>
        </div>
      </header>

      {/* Bento Grid Architecture (Inspired by Reference Layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[270px]">
        {tools.map((tool, index) => (
          <div
            key={index}
            className={`relative group rounded-3xl bg-[#12141c] border border-[#222634] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#00e5ff]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.12)] ${tool.spanClass}`}
          >
            {/* Background Video Preview Loop */}
            <div className="absolute inset-0 opacity-35 group-hover:opacity-75 transition-opacity duration-500 overflow-hidden pointer-events-none">
              <video
                src={tool.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/70 to-transparent"></div>
            </div>

            {/* Card Top Metadata Tag */}
            <div className="relative z-10 p-6 flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#070709]/80 border border-[#222634] text-[#00e5ff] backdrop-blur-md">
                {tool.tag}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]/30 group-hover:bg-[#00e5ff] transition-colors"></span>
            </div>

            {/* Card Bottom Description & Title */}
            <div className="relative z-10 p-6 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/95 to-transparent pt-12">
              <h3 className="text-base font-semibold tracking-wide text-white mb-1 group-hover:text-[#00e5ff] transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-[#9094a6] line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
