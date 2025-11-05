import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser-Client (RLS regelt die Rechte) */
export const supabase = createClient(url, anon);

export type Album = {
  id: string;
  name: string;
  description: string | null;
  cover_photo_url: string | null;
  created_at: string;
  display_order: number;
};

export type Photo = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  album_id: string | null;
  taken_at: string | null;
  uploaded_at: string;
  display_order: number;
  published: boolean;
  width: number | null;
  height: number | null;
};
