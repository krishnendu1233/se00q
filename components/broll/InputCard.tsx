import { RefObject } from "react";

interface InputCardProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  timestamps: string;
  setTimestamps: (ts: string) => void;
  status: string;
  error: string | null;
  startProcess: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

export default function InputCard({
  videoUrl, setVideoUrl, timestamps, setTimestamps, status, error, startProcess, fileInputRef
}: InputCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Select Video</label>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold py-3 px-6 transition-colors"
          >
            Choose File
          </button>
          <input 
            type="text" 
            placeholder="Or paste Supabase/Public Video URL" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="flex-1 bg-[#111] border border-gray-700 text-white p-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <input type="file" ref={fileInputRef} className="hidden" accept="video/*" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
        <input 
          type="text" 
          placeholder="e.g. 3-7, 12-20" 
          value={timestamps}
          onChange={(e) => setTimestamps(e.target.value)}
          className="w-full bg-[#111] border border-gray-700 text-white p-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {error && (
        <div className="border border-red-900 bg-red-950/30 text-red-400 p-4 rounded text-sm">
          {error}
        </div>
      )}

      <button 
        onClick={startProcess}
        disabled={status !== "IDLE" && status !== "ERROR" && status !== "DONE"}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 transition-colors"
      >
        {status === "IDLE" || status === "DONE" || status === "ERROR" 
          ? "Analyze Video" 
          : `Processing: ${status}...`}
      </button>
    </div>
  );
        }
