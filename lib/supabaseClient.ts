import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser-Client (RLS regelt die Rechte) */
export const supabase = createClient(url, anon);

export type Post = {
  id: string; status: 'draft' | 'published';
  created_at: string; published_at: string | null;
  title: string | null; cover_slide_id: string | null;
};

export type Slide = {
  id: string; post_id: string; idx: number;
  media_url: string; media_type: 'image'|'video';
  caption: string | null; alt_text: string | null; duration_ms: number | null;
};
