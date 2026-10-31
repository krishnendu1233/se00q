import { useState } from 'react';
import { supabaseBUCKET } from '@/lib/supabase';
import { AppState, TimestampBlock } from '@/types/broll';

export function useBrollAnalyzer() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TimestampBlock[] | null>(null);

  const analyzeVideo = async (file: File, timestamps: string) => {
    setError(null);
    setResults(null);
    setAppState('uploading-supabase');

    const fileExt = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    let uploadedToSupabase = false;

    try {
      // 1. Upload to Supabase
      const { error: uploadErr } = await supabaseBUCKET.storage
        .from('videos')
        .upload(uniqueFileName, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);
      uploadedToSupabase = true;

      const { data: urlData } = supabaseBUCKET.storage.from('videos').getPublicUrl(uniqueFileName);
      
      // 2. Upload to Gemini
      setAppState('uploading-gemini');
      const apiFormData = new FormData();
      apiFormData.append('video_url', urlData.publicUrl);

      const geminiUploadRes = await fetch('/api/proxy/broll/upload', { method: 'POST', body: apiFormData });
      const geminiResult = await geminiUploadRes.json();
      if (!geminiUploadRes.ok) throw new Error(geminiResult.detail || 'Analysis upload failed');

      // 3. Poll for processing completion
      setAppState('processing');
      let isReady = false;
      while (!isReady) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const statusRes = await fetch(`/api/proxy/broll/status?file_name=${encodeURIComponent(geminiResult.file_name)}`);
        const statusResult = await statusRes.json();
        
        if (!statusRes.ok) throw new Error(statusResult.detail || 'Status check failed');
        if (statusResult.state === 'FAILED') throw new Error('Failed to process video audio.');
        if (statusResult.state === 'ACTIVE') isReady = true;
      }

      // 4. Generate B-Roll
      setAppState('generating');
      const genFormData = new FormData();
      genFormData.append('file_name', geminiResult.file_name);
      genFormData.append('timestamps', timestamps);

      const genRes = await fetch('/api/proxy/broll/generate', { method: 'POST', body: genFormData });
      const genResult = await genRes.json();
      if (!genRes.ok) throw new Error(genResult.detail || 'Failed to generate visual ideas.');

      setResults(genResult.data);
      setAppState('done');
      
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setAppState('error');
    } finally {
      // 5. Cleanup
      if (uploadedToSupabase) {
        supabaseBUCKET.storage.from('videos').remove([uniqueFileName]);
      }
    }
  };

  return { appState, error, results, analyzeVideo };
}
