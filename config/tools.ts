export interface ToolCard {
  title: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  tag: string;
  spanClass: string;
  href: string;
}

export const tools: ToolCard[] = [
  {
    title: "Z03 Predictor",
    description: "Scans chart metrics and highlights anomaly spike predictions.",
    videoSrc: "/outlier-predictor-broll.mp4",
    posterSrc: "/outlier-predictor-thumb.png",
    tag: "Analytics",
    spanClass: "col-span-1 md:col-start-1 md:col-span-1 md:row-span-2",
    href: "/z03-predictor",
  },
  {
    title: "Format Database",
    description: "Community-driven vertical stream of video formats and metrics.",
    videoSrc: "/format-database-horizontal-broll.mp4",
    posterSrc: "/format-database-thumb.png",
    tag: "Community",
    spanClass: "col-span-1 md:col-start-2 md:col-span-1 md:row-span-2",
    href: "#",
  },
  {
    title: "Saliency Analyser",
    description: "Tracks viewer attention hotspots with calm pulsing cyan focal points.",
    videoSrc: "/saliency-cyan-broll.mp4",
    posterSrc: "/saliency-thumb.png",
    tag: "Attention AI",
    spanClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-1",
    href: "/saliency",
  },
  {
    title: "Aligner",
    description: "Advanced structural alignment and frame matching module.",
    videoSrc: "/aligner-broll.mp4",
    posterSrc: "/aligner-thumb.png",
    tag: "Sync Suite",
    spanClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-2",
    href: "/aligner",
  },
  {
    title: "YouTube Format Filter",
    description: "Filters raw video streams through funnel analytics into structured reports.",
    videoSrc: "/format-filterer-broll.mp4",
    posterSrc: "/format-filterer-thumb.png",
    tag: "Core Engine",
    spanClass: "col-span-1 md:col-start-4 md:col-span-2 md:row-start-1",
    href: "/youtube-filterer",
  },
  {
    title: "B Rolls Suggestor",
    description: "Precise synchronization and structural timeline layout b-rolls.",
    videoSrc: "/timeline-dark-broll.mp4",
    posterSrc: "/timeline-thumb.png",
    tag: "Editing",
    spanClass: "col-span-1 md:col-start-4 md:col-span-1 md:row-start-2",
    href: "/b-rolls",
  },
  {
    title: "Elevenlabs Alternative",
    description: "Dual thread audio visualization weaving across corner-to-corner tracks.",
    videoSrc: "/audio-spectrum.mp4",
    posterSrc: "/audio-spectrum-thumb.png",
    tag: "Voice AI",
    spanClass: "col-span-1 md:col-start-5 md:col-span-1 md:row-start-2",
    href: "/elevenlabs-alt",
  },
];
