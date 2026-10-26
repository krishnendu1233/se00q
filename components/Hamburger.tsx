'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ToolItem {
  title: string;
  href: string;
}

const tools: ToolItem[] = [
  { title: "Format Filterer", href: "/dashboard#tool-0" },
  { title: "Audio Spectrum", href: "/dashboard#tool-1" },
  { title: "Outlier Predictor", href: "/dashboard#tool-2" },
  { title: "Format Database", href: "/dashboard#tool-3" },
  { title: "Timeline & Aligner", href: "/dashboard#tool-4" },
  { title: "Saliency Heatmap", href: "/dashboard#tool-5" },
  { title: "Sync Aligner V2", href: "/dashboard#tool-6" },
];

export default function Hamburger() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);

  return (
    <div className="relative font-mono">
      {/* Hamburger Toggle Button */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-2 rounded-xl bg-[#12141c] border border-[#222634] text-[#00e5ff] hover:border-[#00e5ff] transition-colors flex items-center gap-2 text-xs"
      >
        <span>Menu</span>
        <span className="text-base font-bold">≡</span>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-12 right-0 z-50 w-72 bg-[#12141c] border border-[#222634] rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 text-white">
          <div className="flex items-center justify-between mb-3 border-b border-[#222634] pb-2">
            <span className="text-xs uppercase text-[#00e5ff] tracking-widest font-bold">Navigation</span>
            <button onClick={() => setMenuOpen(false)} className="text-xs text-[#888890] hover:text-white">✕</button>
          </div>
          
          <div className="flex flex-col gap-2 text-xs">
            <Link 
              href="/dashboard" 
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#1a1e2c] text-[#c0c4d0] hover:text-[#00e5ff] transition-colors"
            >
              Dashboard
            </Link>

            <Link 
              href="/about" 
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#1a1e2c] text-[#c0c4d0] hover:text-[#00e5ff] transition-colors"
            >
              About
            </Link>

            <Link 
              href="/setup" 
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#1a1e2c] text-[#c0c4d0] hover:text-[#00e5ff] transition-colors"
            >
              Profile Setup
            </Link>

            {/* Tool Vault Dropdown Toggle */}
            <div className="border-t border-[#222634] pt-2 mt-1">
              <button 
                onClick={() => setVaultOpen(!vaultOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1a1e2c] text-[#00e5ff] font-bold transition-colors"
              >
                <span>Tool Vault</span>
                <span>{vaultOpen ? '▾' : '▸'}</span>
              </button>

              {vaultOpen && (
                <div className="flex flex-col gap-1 mt-1 pl-2 max-h-48 overflow-y-auto border-l border-[#222634]">
                  {tools.map((t, idx) => (
                    <a 
                      key={idx}
                      href={t.href}
                      onClick={() => { setMenuOpen(false); setVaultOpen(false); }}
                      className="text-[11px] text-[#9094a6] hover:text-[#00e5ff] p-1.5 rounded transition-colors flex items-center justify-between"
                    >
                      <span>{t.title}</span>
                      <span>→</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
        
