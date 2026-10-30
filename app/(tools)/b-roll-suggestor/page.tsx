"use client";
import { useState, useEffect, useRef } from "react";

export interface MediaItem {
  id: number;
  preview: string;
  download_url: string;
}

export interface QueryItem {
  query: string;
  images: MediaItem[];
  videos: MediaItem[];
}

export interface SegmentResult {
  timestamp: string;
  queries: QueryItem[];
}

export default function BRollSuggesterPage() {
  // Input State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<string>("");
  
  // Progress & Status State
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "PROCESSING" | "GENERATING" | "DONE" | "ERROR">("IDLE");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<SegmentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // File Selection, Validation & Immediate Playback
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    // Warn user: No upload more than 50mb
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit. Please select a smaller file.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    // Sanitize regex for malicious file inputs
    if (!selectedFile.type.match(/^(video|audio)\/[a-zA-Z0-9-.]+$/)) {
      setError("Invalid file type. Please upload a safe video or audio file.");
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // Function to check all steps and measure total progress
  const getOverallProgress = () => {
    switch (status) {
      case "IDLE": return { percent: 0, text: "Ready" };
      case "UPLOADING": return { percent: uploadProgress * 0.4, text: `Uploading File: ${uploadProgress}%` };
      case "PROCESSING": return { percent: 60, text: "Backend Engine Processing Audio..." };
      case "GENERATING": return { percent: 85, text: "Generating B-Roll Queries..." };
      case "DONE": return { percent: 100, text: "Complete!" };
      case "ERROR": return { percent: 0, text: "Failed" };
      default: return { percent: 0, text: "" };
    }
  };

  const startProcess = () => {
    if (!file || !timestamps) {
      setError("Please provide a video file and timestamps.");
      return;
    }
    
    setStatus("UPLOADING");
    setUploadProgress(0);
    setError(null);
    
    const uploadData = new FormData();
    uploadData.append("file", file); // Sending file directly to proxy
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/proxy/broll/upload", true);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const uploadResult = JSON.parse(xhr.responseText);
          setFileName(uploadResult.file_name);
          setStatus("PROCESSING");
        } catch (err) {
          setError("Invalid response from proxy server.");
          setStatus("ERROR");
        }
      } else {
        try {
          const errResponse = JSON.parse(xhr.responseText);
          setError(errResponse.error || `Upload failed with status ${xhr.status}`);
        } catch {
          setError(`Upload failed with status ${xhr.status}`);
        }
        setStatus("ERROR");
      }
    };
    
    xhr.onerror = () => {
      setError("XHR Network Error during upload.");
      setStatus("ERROR");
    };

    xhr.send(uploadData);
  };

  // Poll for Processing Status
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === "PROCESSING" && fileName) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/proxy/broll/status?file_name=${fileName}`);
          const data = await res.json();
          
          if (data.state === "ACTIVE") {
            clearInterval(interval);
            generateBroll(fileName);
          } else if (data.state === "FAILED") {
            clearInterval(interval);
            setStatus("ERROR");
            setError("Video processing failed in the backend engine.");
          }
        } catch {
          clearInterval(interval);
          setStatus("ERROR");
          setError("Failed to check video processing status.");
        }
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [status, fileName]);

  const generateBroll = async (activeFileName: string) => {
    setStatus("GENERATING");
    try {
      const genData = new FormData();
      genData.append("file_name", activeFileName);
      genData.append("timestamps", timestamps);

      const genRes = await fetch("/api/proxy/broll/generate", {
        method: "POST",
        body: genData
      });
      const genResult = await genRes.json();

      if (!genRes.ok) throw new Error(genResult.error || "Generation failed");

      setResults(genResult.data || []);
      setStatus("DONE");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred during generation.");
      setStatus("ERROR");
    }
  };

  const currentProgress = getOverallProgress();
  const isBusy = ["UPLOADING", "PROCESSING", "GENERATING"].includes(status);

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <header className="border-b border-gray-800 pb-6 mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            B-Roll Suggester
          </h1>
          <p className="text-gray-400 text-sm mt-2">Upload a video to generate contextual B-roll</p>
        </header>

        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Select Video</label>
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-3 px-6 transition-colors rounded w-full sm:w-auto"
              >
                Open File Browser
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden" 
                accept="video/*,audio/*" 
              />
            </div>
            {file && (
              <p className="text-xs text-green-400 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {previewUrl && (
            <div className="rounded-lg overflow-hidden border border-gray-800 bg-black mt-4">
              <video src={previewUrl} controls className="w-full max-h-64 object-contain" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
            <input 
              type="text" 
              placeholder="3-7, 12-20" 
              value={timestamps}
              onChange={(e) => setTimestamps(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded text-white p-3 text-sm focus:outline-none focus:border-green-400 transition-colors"
            />
          </div>

          {error && (
            <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded text-sm">
              {error}
            </div>
          )}

          <button 
            type="button"
            onClick={startProcess}
            disabled={isBusy}
            className="w-full bg-green-500 hover:bg-green-400 text-black rounded font-black py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            {isBusy ? `Processing: ${status}...` : "Analyze Video"}
          </button>
        </div>

        {status !== "IDLE" && (
          <div className="p-6 bg-[#0a0a0a] rounded-lg border border-gray-800">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-green-400">{currentProgress.text}</span>
              <span className="text-xs text-gray-500 font-mono">{currentProgress.percent}%</span>
            </div>
            <div className="w-full bg-[#111] rounded-full h-3 overflow-hidden border border-gray-800">
              <div 
                className="bg-green-500 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.8)]" 
                style={{ width: `${currentProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {status === "DONE" && results.length > 0 && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-cyan-400 text-xl border-b border-gray-800 pb-2">Analysis Results</h2>
            
            {results.map((segment, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg">
                <div className="text-yellow-400 text-sm mb-4">Timestamp: {segment.timestamp}s</div>
                
                <div className="grid grid-cols-1 gap-6">
                  {segment.queries.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-gray-300 text-sm italic border-l-2 border-cyan-500 pl-3">
                        &ldquo;{q.query}&rdquo;
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                        {q.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="relative group shrink-0">
                            <img 
                              src={vid.preview} 
                              alt="B-roll preview" 
                              className="h-28 w-auto object-cover rounded border border-gray-700 group-hover:border-cyan-400 transition-colors" 
                            />
                            <a 
                              href={vid.download_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition-opacity"
                            >
                              DOWNLOAD
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
