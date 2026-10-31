import { ChangeEvent, FormEvent } from 'react';

interface BrollFormProps {
  file: File | null;
  videoPreviewUrl: string | null;
  timestamps: string;
  isBusy: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTimestampsChange: (val: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function BrollForm({ 
  file, 
  videoPreviewUrl, 
  timestamps, 
  isBusy, 
  onFileChange, 
  onTimestampsChange, 
  onSubmit 
}: BrollFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 mb-8 bg-zinc-900/50 p-6 rounded-xl border border-[#39ff14]/20 shadow-[0_0_15px_rgba(57,255,20,0.05)]">
      <div>
        <label className="block text-sm font-semibold mb-2 text-zinc-400 uppercase tracking-wider">Select Video</label>
        <input 
          type="file" 
          accept="video/*" 
          onChange={onFileChange} 
          className="w-full border border-zinc-800 p-3 rounded-lg bg-zinc-950 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#39ff14] file:text-black hover:file:bg-[#32e011] transition-all cursor-pointer focus:outline-none focus:border-[#39ff14]/50"
        />
      </div>

      {videoPreviewUrl && (
        <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
          <video src={videoPreviewUrl} controls className="w-full max-h-64 object-contain">
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-2 text-zinc-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
        <input 
          type="text" 
          value={timestamps} 
          onChange={(e) => onTimestampsChange(e.target.value)} 
          className="w-full border border-zinc-800 p-3 rounded-lg bg-zinc-950 text-white placeholder-zinc-700 focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14] transition-all"
          placeholder="3-7, 12-20"
        />
      </div>

      <button 
        type="submit" 
        disabled={isBusy || (!file || !timestamps)}
        className="w-full bg-[#39ff14] hover:bg-[#32e011] text-black font-black text-lg px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]"
      >
        {isBusy ? 'Processing...' : 'Analyze Video'}
      </button>
    </form>
  );
}
