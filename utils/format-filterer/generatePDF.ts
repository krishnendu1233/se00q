import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePDF = (channel: string, filteredData: any[]) => {
  if (!filteredData || !filteredData.length) return;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`YouTube Format Filterer - @${channel}`, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Made by Krishnendu | IG: @contentbykrishnendu | GitHub: Krishnendu1233 | YT: @krishnendw", 14, 22);

  const tableColumn = ["Keyword", "Title", "Views", "Multiplier", "Date"];
  const tableRows = filteredData.map(row => [
    row.Shared_Keyword,
    row.Title,
    row.Performance.toLocaleString(),
    row.Outlier_Score + "x",
    row.Date
  ]);

  // @ts-ignore - jspdf-autotable extends jsPDF but TS sometimes misses the type
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 0, 0] },
    columnStyles: { 1: { cellWidth: 80 } } 
  });

  doc.save(`${channel}_formats.pdf`);
};
