import { useState } from 'react';
import { TimestampBlock } from '@/types/broll';

export default function ResultsGrid({ results }: { results: TimestampBlock[] }) {
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());

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

  return (
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
  );
}
