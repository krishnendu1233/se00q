export default function ResultsTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-950 border-b border-gray-800 text-gray-300">
            <th className="p-4">Keyword</th>
            <th className="p-4">Title</th>
            <th className="p-4">Views</th>
            <th className="p-4">Outlier Score</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <td className="p-4 text-cyan-400 font-semibold">{row.Shared_Keyword}</td>
              <td className="p-4 max-w-xs truncate" title={row.Title}>{row.Title}</td>
              <td className="p-4 text-gray-300">{row.Performance.toLocaleString()}</td>
              <td className={`p-4 font-bold ${row.Outlier_Score >= 2.0 ? "text-yellow-400" : "text-gray-300"}`}>
                {row.Outlier_Score}x
              </td>
              <td className="p-4 text-gray-500">{row.Date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
