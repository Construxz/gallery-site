'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function EditPage() {
  const { slug } = useParams<{slug:string}>();
  const router = useRouter();
  const [title, setTitle] = useState('');

  const editor = useEditor({ extensions: [StarterKit], content: '<p>Text…</p>' });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('pages').select('*').eq('slug', slug).single();
      if (data) { setTitle(data.title); editor?.commands.setContent(data.content_html || '<p></p>'); }
    })();
  }, [slug, editor]);

  async function save() {
    const html = editor?.getHTML() || '';
    const { data } = await supabase.from('pages')
      .upsert({ slug, title, content_html: html }, { onConflict: 'slug' }).select('slug').single();
    alert('Gespeichert'); router.replace('/'+data?.slug);
  }

  return (
    <main style={{ padding: 16, maxWidth: 800, margin:'0 auto' }}>
      <h1>Seite bearbeiten: {slug}</h1>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titel" style={{ width:'100%', padding:8, marginBottom:12 }}/>
      <div style={{ border:'1px solid #ddd', padding:8 }}>
        <EditorContent editor={editor} />
      </div>
      <button onClick={save} style={{ marginTop:12, padding:10 }}>Speichern</button>
    </main>
  );
}
