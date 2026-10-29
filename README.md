# se00q. — Suite for Creators 🚀

**se00q.** is a comprehensive suite of analytical tools designed to optimize content creation[span_0](start_span)[span_0](end_span). From identifying viral thumbnails and winning video formats to ensuring perfect cinematic framing, **se00q.** provides the intelligence creators need to scale[span_1](start_span)[span_1](end_span).

🌐 **Live Demo:** [se00q.vercel.app](https://se00q.vercel.app)[span_2](start_span)[span_2](end_span)[span_3](start_span)[span_3](end_span)

---

## 🛠️ The Creator Toolkit

| Tool | Route ID | Description |
| :--- | :--- | :--- |
| **Format Filterer**[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span) | `/format-filterer` | Extract winning video formats instantly. Analyze channel handles, calculate outlier multiplier scores, filter by shared keywords, and export reports to PDF. |
| **Timeline**[span_6](start_span)[span_6](end_span) | `/timeline` | Analyze pacing and retention drops. |
| **Audio Spectrum**[span_7](start_span)[span_7](end_span) | `/audio-spectrum` | Visualize audio hooks and dynamic range. |
| **Outlier Predictor**[span_8](start_span)[span_8](end_span) | `/outlier-predictor` | Identify viral thumbnails & titles[span_9](start_span)[span_9](end_span). Filter your best variations to maximize CTR[span_10](start_span)[span_10](end_span). |
| **Saliency**[span_11](start_span)[span_11](end_span) | `/saliency` | Visual attention mapping. |
| **Format Database**[span_12](start_span)[span_12](end_span) | `/format-database` | Searchable archive of proven strategies. |
| **Aligner**[span_13](start_span)[span_13](end_span) | `/aligner` | Cinematic framing guaranteed. |

### 🧪 Additional Landing Modules
* **B-Roll Suggestor**[span_14](start_span)[span_14](end_span)
* **Text To Speech**[span_15](start_span)[span_15](end_span)

---

## 🏗️ Modular Project Architecture

To keep the codebase clean and scalable across all 7+ creator tools, the repository follows a strict tool-scoped modular structure using the Next.js App Router:

```text
├── app/
│   ├── api/
│   │   └── proxy/               # Local API bridges (e.g., /api/proxy/filterer)
│   └── (tools)/                 # Route group for all creator tools
│       ├── format-filterer/
│       │   └── page.tsx
│       ├── timeline/
│       │   └── page.tsx
│       ├── audio-spectrum/
│       │   └── page.tsx
│       ├── outlier-predictor/
│       │   └── page.tsx
│       ├── saliency/
│       │   └── page.tsx
│       ├── format-database/
│       │   └── page.tsx
│       └── aligner/
│           └── page.tsx
├── components/
│   ├── format-filterer/         # Scoped UI components per tool
│   │   ├── Dashboard.tsx
│   │   ├── ResultsTable.tsx
│   │   ├── SearchForm.tsx
│   │   └── Footer.tsx
│   ├── timeline/
│   ├── audio-spectrum/
│   ├── outlier-predictor/
│   ├── saliency/
│   ├── format-database/
│   └── aligner/
├── utils/
│   └── format-filterer/         # Scoped helper & export functions per tool
│       └── generatePDF.ts
└── public/                      # B-Roll previews (.mp4) & fallback posters (.png)
```

💻 Tech Stack
 * Framework: Next.js (App Router)
 * Language: TypeScript
 * Styling: Tailwind CSS
 * Document Generation: jspdf & jspdf-autotable
 * Deployment: Vercel
🚀 Getting Started
1. Clone the repository
git clone [https://github.com/Krishnendu1233/se00q.git](https://github.com/Krishnendu1233/se00q.git)
cd se00q

2. Install dependencies
npm install
# Ensure PDF generation packages are installed:
npm install jspdf jspdf-autotable

3. Run the development server
npm run dev

Open http://localhost:3000 in your browser to explore the suite.
👨‍💻 Author & Creator
Made by Krishnendu
 * 📸 Instagram: @contentbykrishnendu
 * 🐙 GitHub: @Krishnendu1233
 * ▶️ YouTube: @krishnendw

