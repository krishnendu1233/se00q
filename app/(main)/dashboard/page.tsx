'use client';

import React, { useState } from 'react';

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
  const [vaultOpen, setVaultOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#070709] text-white overflow-y-auto font-mono selection:bg-[#00e5ff] selection:text-black">
      
      {/* --- CUSTOM TOP HEADER (As in your sketch) --- */}
      <header className="sticky top-0 z-40 bg-[#070709]/90 backdrop-blur-md border-b border-[#1f222d] px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Top-Left: Profile & Seek Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
            <span className="font-bold text-sm tracking-wide">se00q</span>
          </div>
          
          {/* Seek Input Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-[#12141c] border border-[#222634] px-3 py-1 rounded-full text-xs text-[#888890]">
            <span>seek</span>
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="bg-transparent outline-none text-white placeholder-[#555] w-28 text-xs"
            />
          </div>
        </div>

        {/* Top-Right: Hamburger / Tool Vault Trigger */}
        <button 
          onClick={() => setVaultOpen(!vaultOpen)}
          className="p-2 rounded-xl bg-[#12141c] border border-[#222634] text-[#00e5ff] hover:border-[#00e5ff] transition-colors flex items-center gap-2 text-xs"
        >
          <span>Tool Vault</span>
          <span className="text-base font-bold">≡</span>
        </button>
      </header>

      {/* --- TOOL VAULT DRAWER (Opens when Hamburger is clicked) --- */}
      {vaultOpen && (
        <div className="absolute top-16 right-4 z-50 w-72 bg-[#12141c] border border-[#222634] rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3 border-b border-[#222634] pb-2">
            <span className="text-xs uppercase text-[#00e5ff] tracking-widest font-bold">Tool Vault</span>
            <button onClick={() => setVaultOpen(false)} className="text-xs text-[#888890] hover:text-white">✕</button>
          </div>
          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
            {tools.map((t, idx) => (
              <a 
                key={idx}
                href={`#tool-${idx}`}
                onClick={() => setVaultOpen(false)}
                className="text-xs text-[#c0c4d0] hover:text-[#00e5ff] hover:bg-[#1a1e2c] p-2 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>{t.title}</span>
                <span className="text-[10px] text-[#555]">→</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN DASHBOARD BENTO GRID CONTENT --- */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Format Tools & Bento Feed</h1>
          <p className="text-xs text-[#888890] mt-1">Select any module to inspect or launch its workspace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[270px]">
          {tools.map((tool, index) => (
            <div
              key={index}
              id={`tool-${index}`}
              className={`relative group rounded-3xl bg-[#12141c] border border-[#222634] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#00e5ff]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.12)] ${tool.spanClass}`}
            >
              {/* Background Video Preview Loop */}
              <div className="absolute inset-0 opacity-50 group-hover:opacity-90 transition-opacity duration-500 overflow-hidden pointer-events-none">
                <video
                  src={tool.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/60 to-transparent"></div>
              </div>

              {/* Card Top Tag */}
              <div className="relative z-10 p-6 flex items-start justify-between">
                <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#070709]/80 border border-[#222634] text-[#00e5ff] backdrop-blur-md">
                  {tool.tag}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#00e5ff]/30 group-hover:bg-[#00e5ff] transition-colors"></span>
              </div>

              {/* Card Bottom Content */}
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
    </div>
  );
}
