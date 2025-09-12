'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase, Slide } from '@/lib/supabaseClient';

type LocalSlide = { file: File; caption: string };

export default function Studio() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [slides, setSlides] = useState<LocalSlide[]>([]);
  const [publishing, setPublishing] = useState(false);

  // --- Auth-Guard ---
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setAuthed(!!data.user);
      if (!data.user) location.href = '/login';
    })();
  }, []);

  // Neues Draft anlegen
  async function startNewPost() {
    const { data, error } = await supabase.from('posts')
      .insert({ status: 'draft' }).select('id').single();
    if (error) { alert(error.message); return; }
    setPostId(data.id);
  }

  // Auswahl Datein -> lokale Slides
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSlides(files.map(f => ({ file: f, caption: '' })));
  }

  function move(idx: number, dir: -1 | 1) {
    setSlides(s => {
      const copy = s.slice();
      const to = idx + dir;
      if (to < 0 || to >= copy.length) return copy;
      const [x] = copy.splice(idx, 1);
      copy.splice(to, 0, x);
      return copy;
    });
  }

  // Upload + DB anlegen
  async function uploadAll() {
    if (!postId) { alert('Bitte zuerst „Neuen Post“ erstellen'); return; }
    for (let i = 0; i < slides.length; i++) {
      const s = slides[i];
      const ext = s.file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `posts/${postId}/${String(i).padStart(3,'0')}.${ext}`;
      const { error: upErr } = await supabase.storage.from('media').upload(path, s.file, { upsert: true });
      if (upErr) { alert(upErr.message); return; }

      const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
      const media_type = s.file.type.startsWith('video') ? 'video' : 'image';
      const { error: insErr } = await supabase.from('slides').insert({
        post_id: postId, idx: i, media_url: pub.publicUrl, media_type, caption: s.caption
      });
      if (insErr) { alert(insErr.message); return; }
    }
    alert('Uploads fertig. Jetzt veröffentlichen.');
  }

  // Publish
  async function publish() {
    if (!postId) return;
    setPublishing(true);
    // Cover = erste Slide
    const { data: first } = await supabase.from('slides')
      .select('id').eq('post_id', postId).order('idx', { ascending: true }).limit(1).single();
    const { error } = await supabase.from('posts')
      .update({ status: 'published', published_at: new Date().toISOString(), cover_slide_id: first?.id || null })
      .eq('id', postId);
    setPublishing(false);
    if (error) { alert(error.message); return; }
    alert('Veröffentlicht! Öffne die Startseite oder teile als WhatsApp-Status.');
  }

  // Teilen (ein Slide)
  async function shareSlide(url: string, caption?: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const fname = url.split('/').pop() || 'slide.jpg';
    const file = new File([blob], fname, { type: blob.type || 'image/jpeg' });

    if ((navigator as any).canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: caption || '' });
    } else {
      // Fallback: Datei öffnen – Nutzer kann manuell teilen
      window.open(url, '_blank');
    }
  }

  const disableActions = authed === false || !postId;

  // bereits hochgeladene Slides abfragen, um „Teilen“ anbieten zu können
  const [uploaded, setUploaded] = useState<Slide[]>([]);
  useEffect(() => {
    if (!postId) return;
    const load = async () => {
      const { data } = await supabase.from('slides')
        .select('*').eq('post_id', postId).order('idx', { ascending: true });
      setUploaded(data || []);
    };
    load();
  }, [postId]);

  return (
    <main style={{ padding: 16, maxWidth: 820, margin: '0 auto' }}>
      <h1>Studio</h1>

      {authed && !postId && (
        <button onClick={startNewPost} style={{ padding: 8, marginBottom: 12 }}>
          Neuen Post anlegen
        </button>
      )}

      {!!postId && (
        <>
          <section style={{ border: '1px solid #eee', padding: 12, marginBottom: 16 }}>
            <h3>1) Medien auswählen</h3>
            <input type="file" accept="image/*,video/*" multiple onChange={onPick}/>
            {slides.length > 0 && (
              <ol style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
                {slides.map((s, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <img src={URL.createObjectURL(s.file)} alt="" style={{ width: 100, height: 100, objectFit: 'cover' }}/>
                    <input
                      placeholder="Caption…" value={s.caption}
                      onChange={e => setSlides(arr => arr.map((x, idx) => idx===i ? ({...x, caption: e.target.value}) : x))}
                      style={{ padding: 8, border: '1px solid #ddd' }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => move(i, -1)} disabled={i===0}>↑</button>
                      <button onClick={() => move(i, +1)} disabled={i===slides.length-1}>↓</button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={uploadAll} disabled={slides.length===0 || disableActions}>Hochladen</button>
            </div>
          </section>

          <section style={{ border: '1px solid #eee', padding: 12, marginBottom: 16 }}>
            <h3>2) Veröffentlichen</h3>
            <button onClick={publish} disabled={publishing || uploaded.length===0}>
              {publishing ? 'Veröffentliche…' : 'Jetzt veröffentlichen'}
            </button>
          </section>

          <section style={{ border: '1px solid #eee', padding: 12 }}>
            <h3>3) Als WhatsApp-Status teilen</h3>
            {uploaded.length === 0 && <p>Noch keine hochgeladenen Slides gefunden.</p>}
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 12 }}>
              {uploaded.map(s => (
                <li key={s.id} style={{ border: '1px solid #eee', padding: 8 }}>
                  <img src={s.media_url} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }}/>
                  <button onClick={() => shareSlide(s.media_url, s.caption || '')} style={{ marginTop: 8, width: '100%' }}>
                    Diesen Slide teilen
                  </button>
                </li>
              ))}
            </ul>
            {uploaded.length > 1 && (
              <button
                style={{ marginTop: 12 }}
                onClick={async () => {
                  for (const s of uploaded) { await shareSlide(s.media_url, s.caption || ''); }
                }}>
                Alle nacheinander teilen
              </button>
            )}
          </section>
        </>
      )}
    </main>
  );
}
