"use client";
import React, { useRef, useState } from "react";
import { TOOLS, Tool } from "@/description/tools";

// 1. The Mobile-Friendly Hover Card Component
function HoverVideoCard({ tool }: { tool: Tool }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleStart = () => {
    setIsActive(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleStop = () => {
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-3xl cursor-pointer select-none ${tool.colSpan} ${tool.rowSpan}`}
      style={{ 
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none" 
      }}
      onMouseEnter={handleStart}
      onMouseLeave={handleStop}
      onTouchStart={handleStart}
      onTouchEnd={handleStop}
      onTouchCancel={handleStop}
      onContextMenu={(e) => e.preventDefault()} 
    >
      <img 
        src={tool.imagePath} 
        alt={tool.name} 
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      />
      
      <video
        ref={videoRef}
        src={tool.videoPath}
        muted
        loop
        playsInline 
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
          {tool.name}
        </h3>
        <p className={`text-xs text-zinc-300 drop-shadow-md transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}>
          {tool.description}
        </p>
      </div>
    </div>
  );
}

// 2. The Missing Default Export (This is what Vercel was looking for)
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 md:p-12 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="pb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, Creator</h1>
          <p className="text-sm text-zinc-500 mt-1">Select a tool to begin analysis.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          <HoverVideoCard tool={TOOLS.find(t => t.id === "timeline")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "format-filterer")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "audio-spectrum")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "outlier-predictor")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "saliency")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "format-database")!} />
          <HoverVideoCard tool={TOOLS.find(t => t.id === "aligner")!} />
        </div>

      </div>
    </div>
  );
}
