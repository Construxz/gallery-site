'use client';
import { supabase } from '@/lib/supabaseClient';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function CallbackInner() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // 1) PKCE-Code-Flow (?code=...)
        const code = sp.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          router.replace('/studio');
          return;
        }
        // 2) Hash-Token-Flow (#access_token&refresh_token=...)
        if (typeof window !== 'undefined' && window.location.hash) {
          const params = new URLSearchParams(window.location.hash.slice(1));
          const at = params.get('access_token');
          const rt = params.get('refresh_token');
          if (at && rt) {
            await supabase.auth.setSession({ access_token: at, refresh_token: rt });
            router.replace('/studio');
            return;
          }
        }
        // Fallback
        router.replace('/login');
      } catch {
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
