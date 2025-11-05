'use client';
import { useEffect, useState } from 'react';
import { supabase, Slide } from '@/lib/supabaseClient';

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: post } = await supabase.from('posts')
        .select('id').eq('status','published')
        .order('published_at', { ascending: false }).limit(1).single();
      if (!post?.id) return;
      const { data: sl } = await supabase.from('slides')
        .select('*').eq('post_id', post.id).order('idx', { ascending: true });
      setSlides(sl || []);
    })();
  }, []);

  // Auto-advance alle 5s (hold to pause könntest du später ergänzen)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (slides.length ? (i+1)%slides.length : 0)), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return <main style={{ padding: 24 }}>Noch keine veröffentlichten Stories.</main>;
  const current = slides[idx];

  return (
    <main
      style={{
        width: '100vw', height: '100svh', overflow: 'hidden', position: 'relative',
        background: '#000', color: '#fff', display: 'flex', flexDirection: 'column'
      }}
      onClick={() => setIdx(i => (i+1) % slides.length)}
    >
      <img
        src={current.media_url}
        alt={current.alt_text || ''}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '16px'
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              height: 3, flex: 1,
              background: i <= idx ? 'white' : 'rgba(255,255,255,0.35)'
            }}/>
          ))}
        </div>
        <div style={{ fontSize: 16 }}>{current.caption}</div>
        <a href="/archive" style={{ position: 'absolute', top: 12, right: 12, color: '#fff' }}>Archiv</a>
      </div>
    </main>
  );
}
