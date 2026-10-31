export interface MediaItem {
  id: number;
  preview: string;
  download_url: string;
}

export interface QueryBlock {
  query: string;
  images: MediaItem[];
  videos: MediaItem[];
}

export interface TimestampBlock {
  timestamp: string;
  queries: QueryBlock[];
}

export type AppState = 'idle' | 'uploading-supabase' | 'uploading-gemini' | 'processing' | 'generating' | 'done' | 'error';
