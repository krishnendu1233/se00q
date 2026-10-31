'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useBrollAnalyzer } from '@/hooks/useBrollAnalyzer';

import BrollForm from './BrollForm';
import ProgressBar from './ProgressBar';
import ResultsGrid from './ResultsGrid';

export default function BrollApp() {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState('');
  
  // Bring in the heavy lifting from our custom hook
  const { appState, error, results, analyzeVideo } = useBrollAnalyzer();

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    };
  }, [videoPreviewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setVideoPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (file && timestamps) {
      // Trigger the complex logic living in the hook
      await analyzeVideo(file, timestamps);
    }
  };

  const isBusy = ['uploading-supabase', 'uploading-gemini', 'processing', 'generating'].includes(appState);

  return (
    <>
      <BrollForm 
        file={file}
        videoPreviewUrl={videoPreviewUrl}
        timestamps={timestamps}
        isBusy={isBusy}
        onFileChange={handleFileChange}
        onTimestampsChange={setTimestamps}
        onSubmit={handleSubmit}
      />

      {isBusy && <ProgressBar appState={appState} />}

      {error && (
        <div className="text-red-400 mb-8 p-4 bg-red-950/30 rounded-lg border border-red-900/50">
          ⚠️ {error}
        </div>
      )}

      {appState === 'done' && results && (
        <ResultsGrid results={results} />
      )}
    </>
  );
}
