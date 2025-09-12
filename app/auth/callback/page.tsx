'use client';
import { supabase } from '@/lib/supabaseClient';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic'; // nicht SSG/Prerendern

function CallbackInner() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = sp.get('code');
    if (!code) {
      router.replace('/login');
      return;
    }
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace('/studio');
      } catch (err) {
        console.error(err);
        router.replace('/login');
      }
    })();
  }, [sp, router]);

  return <main style={{ padding: 24 }}>Anmeldung läuft…</main>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Lade…</main>}>
      <CallbackInner />
    </Suspense>
  );
}
