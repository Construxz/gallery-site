import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { slug: string } }) {
  const { data } = await supabase.from('pages').select('*').eq('slug', params.slug).single();
  if (!data) return <main style={{padding:24}}>Nicht gefunden.</main>;
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content_html || '' }} />
    </main>
  );
}
