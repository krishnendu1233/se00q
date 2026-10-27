'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/config/tools';

export default function BentoCard({ tool }: { tool: ToolCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handle browser autoplay policy restrictions silently
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset video on mouse leave
    }
  };

  return (
    <Link
      href={tool.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative group rounded-3xl bg-[#12141c] border border-[#222634] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#00e5ff]/60 hover:shadow-[0_0_35px_rgba(0,229,255,0.12)]",
        tool.spanClass
      )}
    >
      <div className="absolute inset-0 opacity-50 group-hover:opacity-90 transition-opacity duration-500 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={tool.videoSrc}
          poster={tool.posterSrc}
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/60 to-transparent" />
      </div>

      <div className="relative z-10 p-6 flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#070709]/80 border border-[#222634] text-[#00e5ff] backdrop-blur-md">
          {tool.tag}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#00e5ff]/30 group-hover:bg-[#00e5ff] transition-colors" />
      </div>

      <div className="relative z-10 p-6 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/95 to-transparent pt-12 mt-auto">
        <h3 className="text-base font-semibold tracking-wide text-white mb-1 group-hover:text-[#00e5ff] transition-colors">
          {tool.title}
        </h3>
        <p className="text-xs text-[#9094a6] line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
