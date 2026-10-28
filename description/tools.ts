export interface Tool {
  id: string;
  name: string;
  description: string;
  videoPath: string;
  imagePath: string;
  colSpan: string;
  rowSpan: string;
}

export const TOOLS: Tool[] = [
  {
    id: "format-filterer",
    name: "Format Filterer",
    description: "Extract winning video formats instantly.",
    videoPath: "/format-filterer-broll.mp4",
    imagePath: "/format-filterer-broll.png",
    colSpan: "md:col-span-1", 
    rowSpan: "row-span-2",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Analyze pacing and retention drops.",
    videoPath: "/timeline-dark-broll.mp4",
    imagePath: "/timeline-dark-broll.png",
    colSpan: "md:col-span-2",
    rowSpan: "row-span-1",
  },
  {
    id: "audio-spectrum",
    name: "Audio Spectrum",
    description: "Visualize audio hooks and dynamic range.",
    videoPath: "/audio-spectrum.mp4",
    imagePath: "/audio-spectrum.png",
    colSpan: "md:col-span-3",
    rowSpan: "row-span-1",
  },
  {
    id: "outlier-predictor",
    name: "Outlier Predictor",
    description: "Identify viral thumbnails & titles.",
    videoPath: "/outlier-predictor-broll.mp4",
    imagePath: "/outlier-predictor-broll.png",
    colSpan: "md:col-span-1",
    rowSpan: "row-span-1",
  },
  {
    id: "saliency",
    name: "Saliency",
    description: "Visual attention mapping.",
    videoPath: "/saliency-cyan-broll.mp4",
    imagePath: "/saliency-cyan-broll.png",
    colSpan: "md:col-span-1.5",
    rowSpan: "row-span-1.5",
  },
  {
    id: "format-database",
    name: "Format Database",
    description: "Searchable archive of proven strategies.",
    videoPath: "/format-database-horizontal-broll.mp4",
    imagePath: "/format-database-horizontal-broll.png",
    colSpan: "md:col-span-3",
    rowSpan: "row-span-1",
  },
  {
    id: "aligner",
    name: "Aligner",
    description: "Cinematic framing guaranteed.",
    videoPath: "/aligner-broll-v2.mp4",
    imagePath: "/aligner-broll-v2.png",
    colSpan: "md:col-span-2",
    rowSpan: "row-span-2",
  }
];
