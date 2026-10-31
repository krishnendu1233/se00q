'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_BROLL_BUCKET_URL!; {/* entirely different projects just to store files*/}
const supabaseAnonKey = process.env.NEXT_PUBLIC_BROLL_BUCKET_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface MediaItem {
  id: number;
  preview: string;
  download_url: string;
}

interface QueryBlock {
  query: string;
  images: MediaItem[];
  videos: MediaItem[];
}

interface TimestampBlock {
  timestamp: string;
  queries: QueryBlock[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState('');
  
  const [appState, setAppState] = useState<'idle' | 'uploading-supabase' | 'uploading-gemini' | 'processing' | 'generating' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TimestampBlock[] | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    
    if (selected) {
      setVideoPreviewUrl(URL.createObjectURL(selected));
    } else {
      setVideoPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !timestamps) return;

    setError(null);
    setResults(null);
    setAppState('uploading-supabase');

    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    let uploadedToSupabase = false;

    try {
      const { error: uploadErr } = await supabase.storage
        .from('videos')
        .upload(uniqueFileName, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);
      uploadedToSupabase = true;

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(uniqueFileName);
      
      const publicVideoUrl = urlData.publicUrl;

      setAppState('uploading-gemini');
      const apiFormData = new FormData();
      apiFormData.append('video_url', publicVideoUrl);

      const geminiUploadRes = await fetch('/app/api/proxy/broll/upload', {
        method: 'POST',
        body: apiFormData,
      });
      const geminiResult = await geminiUploadRes.json();
      if (!geminiUploadRes.ok) throw new Error(geminiResult.detail || 'Analysis upload failed');

      const fileName = geminiResult.file_name;
      setAppState('processing');

      let isReady = false;
      while (!isReady) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const statusRes = await fetch(`/app/api/proxy/broll/status?file_name=${encodeURIComponent(fileName)}`);
        const statusResult = await statusRes.json();
        
        if (!statusRes.ok) throw new Error(statusResult.detail || 'Status check failed');

        if (statusResult.state === 'FAILED') {
          throw new Error('Failed to process video audio.');
        } else if (statusResult.state === 'ACTIVE') {
          isReady = true;
        }
      }

      setAppState('generating');
      const genFormData = new FormData();
      genFormData.append('file_name', fileName);
      genFormData.append('timestamps', timestamps);

      const genRes = await fetch('/app/api/proxy/broll/generate', {
        method: 'POST',
        body: genFormData,
      });
      const genResult = await genRes.json();
      if (!genRes.ok) throw new Error(genResult.detail || 'Failed to generate visual ideas.');

      setResults(genResult.data);
      setAppState('done');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setAppState('error');
    } finally {
      if (uploadedToSupabase) {
        supabase.storage.from('videos').remove([uniqueFileName]);
      }
    }
  };

  const toggleSelection = (url: string) => {
    const newSelection = new Set(selectedMedia);
    newSelection.has(url) ? newSelection.delete(url) : newSelection.add(url);
    setSelectedMedia(newSelection);
  };

  const downloadSelected = async () => {
    for (const url of selectedMedia) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = url.split('/').pop()?.split('?')[0] || 'media-item';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        window.open(url, '_blank');
      }
    }
  };

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
  const isBusy = ['uploading-supabase', 'uploading-gemini', 'processing', 'generating'].includes(appState);

  return (
    <main className="min-h-screen bg-black text-zinc-300 p-6 font-sans selection:bg-[#39ff14] selection:text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-emerald-400 drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
          B-Roll Suggestor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8 bg-zinc-900/50 p-6 rounded-xl border border-[#39ff14]/20 shadow-[0_0_15px_rgba(57,255,20,0.05)]">
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-400 uppercase tracking-wider">Select Video</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className="w-full border border-zinc-800 p-3 rounded-lg bg-zinc-950 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#39ff14] file:text-black hover:file:bg-[#32e011] transition-all cursor-pointer focus:outline-none focus:border-[#39ff14]/50"
            />
          </div>

          {videoPreviewUrl && (
            <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
              <video 
                src={videoPreviewUrl} 
                controls 
                className="w-full max-h-64 object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-400 uppercase tracking-wider">Timestamps (e.g. 3-7, 12-18)</label>
            <input 
              type="text" 
              value={timestamps} 
              onChange={(e) => setTimestamps(e.target.value)} 
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

        {isBusy && (
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
        )}

        {error && (
          <div className="text-red-400 mb-8 p-4 bg-red-950/30 rounded-lg border border-red-900/50">
            ⚠️ {error}
          </div>
        )}

        {appState === 'done' && results && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Suggested B-Roll</h2>
              {selectedMedia.size > 0 && (
                <button 
                  onClick={downloadSelected}
                  className="bg-zinc-800 hover:bg-zinc-700 text-[#39ff14] border border-[#39ff14]/30 px-5 py-2 rounded-lg font-bold transition-all shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                >
                  Download Selected ({selectedMedia.size})
                </button>
              )}
            </div>

            <div className="space-y-10">
              {results.map((tsBlock, i) => (
                <div key={i} className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50">
                  <h3 className="text-xl font-black mb-6 text-white flex items-center gap-2">
                    <span className="bg-[#39ff14] text-black px-2 py-1 rounded text-sm">TS</span> 
                    {tsBlock.timestamp}s
                  </h3>
                  
                  {tsBlock.queries.map((queryBlock, j) => (
                    <div key={j} className="mb-8 last:mb-0">
                      <p className="font-mono text-[#39ff14]/80 text-sm mb-4 bg-black/50 inline-block px-3 py-1 rounded border border-zinc-800">
                        &gt; {queryBlock.query}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {queryBlock.images.map((img) => (
                          <div 
                            key={img.id} 
                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer group transition-all ${selectedMedia.has(img.download_url) ? 'border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-zinc-800 hover:border-zinc-600'}`} 
                            onClick={() => toggleSelection(img.download_url)}
                          >
                            <img src={img.preview} alt="preview" className="w-full h-32 object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                              <input type="checkbox" checked={selectedMedia.has(img.download_url)} readOnly className="w-5 h-5 cursor-pointer accent-[#39ff14]" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/80 text-zinc-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded backdrop-blur-sm">Image</span>
                          </div>
                        ))}
                        
                        {queryBlock.videos.map((vid) => (
                          <div 
                            key={vid.id} 
                            className={`relative border-2 rounded-lg overflow-hidden cursor-pointer group transition-all ${selectedMedia.has(vid.download_url) ? 'border-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-zinc-800 hover:border-zinc-600'}`} 
                            onClick={() => toggleSelection(vid.download_url)}
                          >
                            <img src={vid.preview} alt="video thumbnail" className="w-full h-32 object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                              <input type="checkbox" checked={selectedMedia.has(vid.download_url)} readOnly className="w-5 h-5 cursor-pointer accent-[#39ff14]" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-[#39ff14]/90 text-black text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded backdrop-blur-sm">Video</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
          <button
            onClick={startProcess}
            disabled={isBusy}
            className="w-full bg-[#39ff14] hover:bg-[#32e011] text-black rounded font-mono font-black py-3 px-4 uppercase text-sm tracking-wide disabled:opacity-50 disabled:hover:shadow-none transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]"
          >
            {isBusy ? "PROCESSING..." : "ANALYZE VIDEO"}
          </button>
        </div>


        {status !== "IDLE" && (
          <div className="p-6 bg-black/50 backdrop-blur rounded-lg border border-[#39ff14]/30">
            <div className="flex justify-between items-end mb-3 font-mono">
              <span className="text-sm font-bold text-[#39ff14]">{currentProgress.text}</span>
              <span className="text-xs text-[#39ff14]/70">{currentProgress.percent}%</span>
            </div>
            <div className="w-full bg-black rounded-full h-3 overflow-hidden border border-[#39ff14]/30">
              <div 
                className="bg-[#39ff14] h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(57,255,20,0.8)]" 
                style={{ width: `${currentProgress.percent}%` }}
              />
            </div>
          </div>
        )}

        {status === "DONE" && results.length > 0 && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-cyan-400 font-mono text-xl font-bold border-b border-cyan-400/30 pb-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.4)]">
              Analysis Results
            </h2>
            
            {results.map((segment, idx) => (
              <div key={idx} className="bg-black/50 backdrop-blur border border-[#39ff14]/30 p-6 rounded-lg">
                <div className="text-[#39ff14] font-mono text-sm font-bold mb-4 bg-[#39ff14]/10 inline-block px-3 py-1 rounded border border-[#39ff14]/20">
                  TIMESTAMP: {segment.timestamp}s
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {segment.queries.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-3">
                      <p className="text-cyan-100 text-sm font-mono italic border-l-2 border-cyan-400 pl-3">
                        &ldquo;{q.query}&rdquo;
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#39ff14]/30">
                        {q.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="relative group shrink-0">
                            <img 
                              src={vid.preview} 
                              alt="B-roll preview" 
                              className="h-28 w-auto object-cover rounded border border-[#39ff14]/30 group-hover:border-[#39ff14] group-hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all" 
                            />
                            <a 
                              href={vid.download_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-mono font-bold text-[#39ff14] transition-opacity"
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

          
