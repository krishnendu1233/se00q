import { AppState } from '@/types/broll';

export default function ProgressBar({ appState }: { appState: AppState }) {
  const getProgressState = () => {
    switch (appState) {
      case 'uploading-supabase': return { percent: 25, text: 'Preparing your video...' };
      case 'uploading-gemini': return { percent: 50, text: 'Analyzing video data...' };
      case 'processing': return { percent: 75, text: 'AI is watching and listening...' };
      case 'generating': return { percent: 90, text: 'Hunting for the perfect B-roll...' };
      case 'done': return { percent: 100, text: 'Complete!' };
      default: return { percent: 0, text: '' };
    }
  };

  const progress = getProgressState();

  return (
    <div className="mb-8 p-6 bg-zinc-900/80 rounded-xl border border-zinc-800">
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-bold text-[#39ff14] animate-pulse">{progress.text}</span>
        <span className="text-xs text-zinc-500 font-mono">{progress.percent}%</span>
      </div>
      <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
        <div 
          className="bg-[#39ff14] h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(57,255,20,0.8)]" 
          style={{ width: `${progress.percent}%` }}
        ></div>
      </div>
    </div>
  );
}
