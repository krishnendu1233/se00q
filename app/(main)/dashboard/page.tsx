"use client";
import React, { useRef } from "react";
import { TOOLS, Tool } from "description/tools";

// Card Component with Hover-to-Play logic
function HoverVideoCard({ tool }: { tool: Tool }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video to start
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-3xl group cursor-pointer ${tool.colSpan} ${tool.rowSpan}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fallback PNG (Visible initially, fades out slightly on hover if needed) */}
      <img 
        src={tool.imagePath} 
        alt={tool.name} 
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
      />
      
      {/* MP4 Video (Hidden until hovered/played) */}
      <video
        ref={videoRef}
        src={tool.videoPath}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{tool.name}</h3>
        <p className="text-xs text-zinc-300 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tool.description}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Greeting[span_2](start_span)[span_2](end_span) */}
        <header className="pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Creator</h1>
          <p className="text-sm text-zinc-500 mt-1">Select a tool to begin analysis.</p>
        </header>

        {/* Bento Grid Architecture[span_3](start_span)[span_3](end_span) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          
          {/* Top Row: Timeline (Left, Tall), Format Filterer (Top Center, Wide), Audio Spectrum (Right, Tall) */}
          <HoverVideoCard tool={TOOLS.find(t => t.id === "timeline")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "format-filterer")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "audio-spectrum")!} />

          {/* Middle Row: Outlier Predictor (Center, Large), Saliency (Center Right, Small) */}
          <HoverVideoCard tool={TOOLS.find(t => t.id === "outlier-predictor")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "saliency")!} />

          {/* Bottom Row: Format Database (Bottom Center, Wide), Aligner (Bottom Right, Small) */}
          <HoverVideoCard tool={TOOLS.find(t => t.id === "format-database")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "aligner")!} />

        </div>
      </div>
    </div>
  );
}
