import { useState, useMemo } from "react";
import ResultsTable from "./ResultsTable";
import { generatePDF } from "@/utils/format-filterer/generatePDF";

interface DashboardProps {
  result: any;
  onReset: () => void;
}

export default function Dashboard({ result, onReset }: DashboardProps) {
  const [sortBy, setSortBy] = useState("views_desc");
  const [selectedKeyword, setSelectedKeyword] = useState("all");

  const keywords = useMemo(() => {
    if (!result?.data) return [];
    return Array.from(new Set(result.data.map((item: any) => item.Shared_Keyword)));
  }, [result]);

  const filteredData = useMemo(() => {
    if (!result?.data) return [];
    let list = [...result.data];

    if (selectedKeyword !== "all") {
      list = list.filter((item) => item.Shared_Keyword === selectedKeyword);
    }

    if (sortBy === "views_desc") list.sort((a, b) => b.Performance - a.Performance);
    if (sortBy === "views_asc") list.sort((a, b) => a.Performance - b.Performance);
    if (sortBy === "date_desc") list.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    if (sortBy === "outlier_desc") list.sort((a, b) => b.Outlier_Score - a.Outlier_Score);

    return list;
  }, [result, selectedKeyword, sortBy]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-4 justify-between items-center border-b border-gray-800 pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">@{result.channel}</h2>
          <p className="text-gray-400 mt-1">
            Median Views: <span className="text-white font-bold">{result.median_views?.toLocaleString()}</span> | 
            Analyzed: <span className="text-white font-bold">{result.total_videos}</span> videos
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 transition-colors"
        >
          ← Analyze Another
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className="bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyan-400 outline-none"
        >
          <option value="views_desc">Highest Views</option>
          <option value="views_asc">Lowest Views</option>
          <option value="outlier_desc">Highest Multiplier (🔥)</option>
          <option value="date_desc">Newest Date</option>
        </select>

        <select 
          value={selectedKeyword} 
          onChange={(e) => setSelectedKeyword(e.target.value)} 
          className="bg-gray-900 border border-gray-700 text-white p-2 rounded focus:border-cyan-400 outline-none"
        >
          <option value="all">All Keywords ({keywords.length as number})</option>
          {keywords.map((kw: any) => (
            <option key={kw} value={kw}>{kw}</option>
          ))}
        </select>

        <button
          onClick={() => generatePDF(result.channel, filteredData)}
          className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
        >
          Download PDF 📄
        </button>
      </div>

      <ResultsTable data={filteredData} />
    </div>
  );
  }
