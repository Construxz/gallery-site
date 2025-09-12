'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const metadata = { title: 'My Story Site' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      const r = document.documentElement.style;
      r.setProperty('--brand', data?.brand_color ?? '#fff');
      r.setProperty('--bg', data?.bg_color ?? '#000');
      r.setProperty('--font', data?.font_family ?? 'system-ui, sans-serif');
      r.setProperty('--fit', (data?.story_fit ?? 'cover') as string);
      r.setProperty('--advance', String(data?.auto_advance_ms ?? 5000));
      r.setProperty('--show-progress', (data?.show_progress ?? true) ? '1' : '0');
      setReady(true);
    })();
  }, []);

  return (
    <html lang="de">
      <body style={{ margin: 0, background: 'var(--bg)', color: 'var(--brand)', fontFamily: 'var(--font)' }}>
        {children}
      </body>
    </html>
  );
}
