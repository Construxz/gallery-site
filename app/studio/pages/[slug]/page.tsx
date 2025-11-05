'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EditPage() {
  const { slug } = useParams<{slug:string}>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Text…</p>');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('pages').select('*').eq('slug', slug).single();
      if (data) {
        setTitle(data.title || '');
        setContent(data.content_html || '<p></p>');
      }
    })();
  }, [slug]);

  async function save() {
    const { data, error } = await supabase.from('pages')
      .upsert({ slug, title, content_html: content }, { onConflict: 'slug' }).select('slug').single();
    if (error) { alert(error.message); return; }
    alert('Gespeichert'); router.replace('/'+(data?.slug ?? slug));
  }

  return (
    <main style={{ padding: 16, maxWidth: 800, margin:'0 auto' }}>
      <h1>Seite bearbeiten: {slug}</h1>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titel" style={{ width:'100%', padding:8, marginBottom:12 }}/>
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={16} style={{ width:'100%', padding:8, fontFamily:'monospace' }} />
      <button onClick={save} style={{ marginTop:12, padding:10 }}>Speichern</button>
    </main>
  );
}
