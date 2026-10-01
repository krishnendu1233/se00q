export interface AnalysisPost {
  id: string;
  user_id: string;
  created_at: string;
  
  platform: 'YouTube' | 'X' | 'IG';
  content_type: 'long_form' | 'carousel' | 'shorts_reels';
  
  link: string;
  actual_creator_username: string;
  upload_date: string;
  views: string;
  topic: string;
  general_notes: string;
  
  // Conditional fields
  title?: string;
  duration?: string;
  thumbnail_url?: string;
  hook_notes?: string;
  post_count?: number;
  caption?: string;
}
