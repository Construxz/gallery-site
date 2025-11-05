"use client";
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ThemeInit() {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').limit(1).single();
        const r = document.documentElement.style;
        r.setProperty('--brand', data?.brand_color ?? '#fff');
        r.setProperty('--bg', data?.bg_color ?? '#000');
        r.setProperty('--font', data?.font_family ?? 'system-ui, sans-serif');
        r.setProperty('--fit', (data?.story_fit ?? 'cover') as string);
        r.setProperty('--advance', String(data?.auto_advance_ms ?? 5000));
        r.setProperty('--show-progress', (data?.show_progress ?? true) ? '1' : '0');
      } catch (e) {
        // fallback values already set above
      }
    })();
  }, []);

  return null;
}

