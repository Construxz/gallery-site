'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type S = {
  brand_color: string; bg_color: string; font_family: string;
  auto_advance_ms: number; story_fit: 'cover'|'contain'; show_progress: boolean;
};

export default function SettingsPage() {
  const [s, setS] = useState<S>({ brand_color:'#fff', bg_color:'#000', font_family:'system-ui, sans-serif', auto_advance_ms:5000, story_fit:'cover', show_progress:true });
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').limit(1).single();
      if (data) { setId(data.id); setS(data as S); }
    })();
  }, []);

  async function save() {
    if (id) {
      await supabase.from('site_settings').update(s).eq('id', id);
    } else {
      const { data } = await supabase.from('site_settings').insert(s).select('id').single();
      setId(data?.id ?? null);
    }
    alert('Gespeichert');
  }

  return (
    <main style={{ padding: 16, maxWidth: 640, margin: '0 auto', display: 'grid', gap: 12 }}>
      <h1>Design & Verhalten</h1>

      <label>Brand-Farbe <input type="color" value={s.brand_color} onChange={e=>setS({...s, brand_color:e.target.value})} /></label>
      <label>Hintergrund <input type="color" value={s.bg_color} onChange={e=>setS({...s, bg_color:e.target.value})} /></label>
      <label>Schriftfamilie <input value={s.font_family} onChange={e=>setS({...s, font_family:e.target.value})} /></label>
      <label>Auto-Advance (ms) <input type="number" value={s.auto_advance_ms} onChange={e=>setS({...s, auto_advance_ms:Number(e.target.value)})} /></label>
      <label>Bild-Anpassung
        <select value={s.story_fit} onChange={e=>setS({...s, story_fit:e.target.value as any})}>
          <option value="cover">Cover (formatfüllend)</option>
          <option value="contain">Contain (ganze Bilder)</option>
        </select>
      </label>
      <label><input type="checkbox" checked={s.show_progress} onChange={e=>setS({...s, show_progress:e.target.checked})}/> Fortschrittsbalken zeigen</label>

      <button onClick={save} style={{ padding: 10 }}>Speichern</button>
    </main>
  );
}
