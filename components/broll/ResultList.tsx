interface ResultListProps {
  results: any[];
}

export default function ResultList({ results }: ResultListProps) {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-cyan-400 text-xl border-b border-gray-800 pb-2">Analysis Results</h2>
      
      {results.map((segment, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-gray-800 p-6 rounded-lg">
          <div className="text-yellow-400 text-sm mb-4">Timestamp: {segment.timestamp}s</div>
          
          <div className="grid grid-cols-1 gap-6">
            {segment.queries.map((q: any, qIdx: number) => (
              <div key={qIdx} className="space-y-3">
                <p className="text-gray-300 text-sm italic border-l-2 border-cyan-500 pl-3">
                  "{q.query}"
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
                  {q.videos.map((vid: any, vIdx: number) => (
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
  );
}
