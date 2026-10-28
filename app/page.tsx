"use client";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [activeTool, setActiveTool] = useState(0);

  const tools = [
    {
      id: "predictor",
      name: "Z03 Predictor",
      tagline: "Identify viral thumbnails & titles",
      description: "Filter your best thumbnails and titles, and check variations to maximize CTR.",
      accent: "bg-yellow-400",
      textColor: "text-black",
    },
    {
      id: "aligner",
      name: "Aligner for Creators",
      tagline: "Cinematic framing guaranteed",
      description: "Ensure your face is perfectly centered, headroom is cinematic, and you have distinct contrast from your background before hitting record.",
      accent: "bg-[#d4ff00]", // Matching the neon yellow/green from the screenshot
      textColor: "text-black",
    },
    {
      id: "filterer",
      name: "Format Filterer",
      tagline: "Extract winning video formats",
      description: "Enter any channel handle to instantly extract and analyze their winning video formats.",
      accent: "bg-white",
      textColor: "text-black",
    },
    {
      id: "broll",
      name: "B-Roll Suggestor",
      tagline: "Automated timestamp analysis",
      description: "Select your video file and input timestamps to automatically analyze and suggest optimal B-roll placements.",
      accent: "bg-[#00ff00]", // Neon green from the screenshot
      textColor: "text-black",
    },
    {
      id: "tts",
      name: "Text To Speech",
      tagline: "Realistic voice generation",
      description: "Fast, free, realistic multilingual voice generation alternative for creators generating natural voiceovers.",
      accent: "bg-zinc-800",
      textColor: "text-white",
    },
    {
      id: "saliency",
      name: "Saliency Analyser",
      tagline: "Visual attention mapping",
      description: "Analyze your frames to map visual attention and ensure viewers focus exactly where you intend.",
      accent: "bg-cyan-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-start px-4 py-12 md:py-24 font-mono">
      <main className="max-w-6xl w-full space-y-16 md:space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 md:space-y-8 mt-10 md:mt-0">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            <span className="text-cyan-500 block mb-2 md:inline md:mb-0">se00q.</span> <br className="md:hidden" />
            Suite for Creators
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
            A comprehensive suite of analytical tools designed to optimize your content. From identifying viral thumbnails to ensuring perfect cinematic framing, we provide the intelligence you need to scale.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-4 sm:px-0">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-center text-sm uppercase tracking-wide"
            >
              Sign up
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-8 py-3 bg-transparent border border-gray-600 text-white font-semibold rounded-full hover:border-white transition-colors text-center text-sm uppercase tracking-wide"
            >
              Contact sales
            </Link>
          </div>
        </section>

        {/* Sliding Interactive Tool Showcase */}
        <section className="w-full max-w-5xl mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-4 md:p-8">
          {/* Tool Navigation Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar border-b border-zinc-800">
            {tools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(index)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTool === index 
                    ? "bg-zinc-800 text-white border border-zinc-700" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tool.name}
              </button>
            ))}
          </div>

          {/* Active Tool Display Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[300px]">
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-3xl font-bold text-white">{tools[activeTool].name}</h3>
              <p className="text-xl text-zinc-300 font-medium">{tools[activeTool].tagline}</p>
              <p className="text-zinc-500 leading-relaxed">{tools[activeTool].description}</p>
              <button className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm transition-colors">
                Try {tools[activeTool].name}
              </button>
            </div>
            
            {/* Mock UI Container */}
            <div className={`order-1 md:order-2 w-full aspect-square md:aspect-video rounded-2xl ${tools[activeTool].accent} flex items-center justify-center p-6 shadow-2xl transition-colors duration-500`}>
              <div className="text-center space-y-3">
                <span className={`text-2xl font-bold ${tools[activeTool].textColor}`}>
                  {tools[activeTool].name.toUpperCase()}
                </span>
                <div className={`w-16 h-1 mx-auto rounded-full ${tools[activeTool].textColor} opacity-20`}></div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
