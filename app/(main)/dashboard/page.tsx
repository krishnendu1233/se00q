"use client";
import React, { useRef, useState } from "react";
import { TOOLS, Tool } from "@/description/tools";

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

  // Convert hardcoded spans to responsive spans (e.g., 'col-span-2' becomes 'md:col-span-2')
  // This ensures mobile stays balanced while preserving your layout on desktop.
  const responsiveColSpan = tool.colSpan?.includes("md:") ? tool.colSpan : `md:${tool.colSpan}`;
  const responsiveRowSpan = tool.rowSpan?.includes("md:") ? tool.rowSpan : `md:${tool.rowSpan}`;

  return (
    <div 
      // Added min-h-0 and min-w-0 to prevent grid blowout, and default col/row spans for mobile
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl cursor-pointer select-none min-h-0 min-w-0 col-span-1 row-span-1 ${responsiveColSpan} ${responsiveRowSpan}`}
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 md:p-6 flex flex-col justify-end pointer-events-none">
        <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-md">
          {tool.name}
        </h3>
        <p className={`text-xs text-zinc-300 drop-shadow-md transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        } line-clamp-2`}>
          {tool.description}
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <header className="pb-2 md:pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Welcome back, Creator!</h1>
          <p className="text-sm text-zinc-500 mt-1">Select a tool to begin analysis.</p>
        </header>

        {/* Changed grid-cols-1 to grid-cols-2 for mobile to better accommodate the masonry feel, keeping it dense */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[100px] md:auto-rows-[120px] grid-flow-dense">
          {TOOLS.filter(t => ["timeline", "format-filterer", "audio-spectrum", "outlier-predictor", "saliency", "format-database", "aligner"].includes(t.id)).map(tool => (
            <HoverVideoCard key={tool.id} tool={tool} />
          ))}
        </div>

      </div>
    </div>
  );
}
