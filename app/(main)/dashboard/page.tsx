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

  return (
    <div 
      // colSpan/rowSpan বাদ দেওয়া হয়েছে এবং aspect-square যোগ করা হয়েছে ১:১ রেশিওর জন্য
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl cursor-pointer select-none aspect-square`}
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
        // object-cover এর বদলে object-contain ব্যবহার করা হয়েছে
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
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
        // object-cover এর বদলে object-contain ব্যবহার করা হয়েছে
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* টেক্সটগুলো যাতে কন্টেইনের উপরে ভালোভাবে বসে তাই পজিশনিং ঠিক রাখা হয়েছে */}
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

        {/* auto-rows বাদ দিয়ে শুধুমাত্র কলাম সংখ্যা নির্ধারণ করা হয়েছে */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {TOOLS.filter(t => ["timeline", "format-filterer", "audio-spectrum", "outlier-predictor", "saliency", "format-database", "aligner"].includes(t.id)).map(tool => (
            <HoverVideoCard key={tool.id} tool={tool} />
          ))}
        </div>

      </div>
    </div>
  );
}
