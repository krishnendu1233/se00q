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
      // Added `select-none` to prevent text highlighting
      className={`relative overflow-hidden bg-zinc-950 border border-zinc-800 rounded-3xl cursor-pointer select-none ${tool.colSpan} ${tool.rowSpan}`}
      style={{ 
        WebkitTouchCallout: "none", // Prevents the iOS long-press popup menu
        WebkitUserSelect: "none" 
      }}
      onMouseEnter={handleStart}
      onMouseLeave={handleStop}
      onTouchStart={handleStart}
      onTouchEnd={handleStop}
      onTouchCancel={handleStop}
      // Optional: Prevents the context menu on right-click/long-press entirely
      onContextMenu={(e) => e.preventDefault()} 
    >
      <img 
        src={tool.imagePath} 
        alt={tool.name} 
        draggable={false} // Prevents ghost-dragging the image on mobile/desktop
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      />
      
      <video
        ref={videoRef}
        src={tool.videoPath}
        muted
        loop
        playsInline // CRITICAL for mobile: prevents the video from opening in a fullscreen player
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
