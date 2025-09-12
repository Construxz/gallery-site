'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Callback() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = sp.get('code');
    if (!code) { router.replace('/login'); return; }
    (async () => {
      await supabase.auth.exchangeCodeForSession(code);
      router.replace('/studio');
    })();
  }, [sp, router]);

  return <main style={{ padding: 24 }}>Anmeldung…</main>;
}
