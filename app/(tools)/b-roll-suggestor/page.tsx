"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/broll/Header";
import InputCard from "@/components/broll/InputCard";
import ResultList, { SegmentResult } from "@/components/broll/ResultList";

export default function BRollSuggesterPage() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [timestamps, setTimestamps] = useState<string>("");
  const [status, setStatus] = useState<string>("IDLE");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<SegmentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startProcess = async () => {
    if (!videoUrl || !timestamps) {
      setError("Please provide a video URL and timestamps.");
      return;
    }
    
    setStatus("UPLOADING");
    setError(null);
    
    try {
      const uploadData = new FormData();
      uploadData.append("video_url", videoUrl);
      
      const uploadRes = await fetch("/api/proxy/broll/upload", {
        method: "POST",
        body: uploadData
      });
      const uploadResult = await uploadRes.json();
      
      if (!uploadRes.ok) {
        throw new Error(uploadResult.error || "Upload failed");
      }
      
      setFileName(uploadResult.file_name);
      setStatus("PROCESSING");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during upload.");
      }
      setStatus("ERROR");
    }
  };

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
            setError("Video processing failed in the engine.");
          }
        } catch {
          clearInterval(interval);
          setStatus("ERROR");
          setError("Failed to check video processing status.");
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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

      if (!genRes.ok) {
        throw new Error(genResult.error || "Generation failed");
      }

      setResults(genResult.data || []);
      setStatus("DONE");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during generation.");
      }
      setStatus("ERROR");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <Header />
        <InputCard 
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          timestamps={timestamps}
          setTimestamps={setTimestamps}
          status={status}
          error={error}
          startProcess={startProcess}
          fileInputRef={fileInputRef}
        />
        {status === "DONE" && <ResultList results={results} />}
      </div>
    </div>
  );
}
