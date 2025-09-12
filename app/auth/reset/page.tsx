'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Reset() {
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Wenn man über den "Reset password" Link kommt, setzt Supabase eine Session via #access_token
    // Wir warten kurz, dann zeigen wir das Formular
    (async () => {
      const { data } = await supabase.auth.getUser();
      setReady(!!data.user);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return alert(error.message);
    alert('Passwort gesetzt.');
    router.replace('/studio');
  }

  if (!ready) return <main style={{ padding: 24 }}>Lade…</main>;

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>Neues Passwort</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input type="password" required placeholder="Neues Passwort" value={pw} onChange={e=>setPw(e.target.value)} />
        <button>Speichern</button>
      </form>
    </main>
  );
}
