interface SearchFormProps {
  handle: string;
  setHandle: (val: string) => void;
  onAnalyze: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function SearchForm({ handle, setHandle, onAnalyze, loading, error }: SearchFormProps) {
  return (
    <div className="text-center mt-[15vh]">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Format Filterer</h1>
      <p className="text-gray-400 mb-8">Enter any channel handle to extract winning video formats.</p>

      <form onSubmit={onAnalyze} className="flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="e.g. MrBeast, mkbhd"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          disabled={loading}
          className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:border-cyan-400 outline-none w-full max-w-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 text-black font-bold px-8 py-3 rounded hover:bg-yellow-500 disabled:opacity-50 transition-colors w-full sm:w-auto"
        >
          {loading ? "CRUNCHING..." : "ANALYZE"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
