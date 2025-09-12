'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [mode, setMode] = useState<'password'|'magic'>('password');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const router = useRouter();

  async function signInPassword(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) return alert(error.message);
    router.replace('/studio');
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return alert(error.message);
    alert('Account erstellt. Du bist jetzt eingeloggt.');
    router.replace('/studio');
  }

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });
    if (error) return alert(error.message);
    alert('Magic-Link verschickt. Bitte E-Mail öffnen.');
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>Login</h1>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <button onClick={() => setMode('password')} disabled={mode==='password'}>Email + Passwort</button>
        <button onClick={() => setMode('magic')} disabled={mode==='magic'}>Magic-Link</button>
      </div>

      {mode === 'password' ? (
        <form onSubmit={signInPassword} style={{ display: 'grid', gap: 8 }}>
          <input type="email" required placeholder="dein@mail.de" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" required placeholder="Passwort" value={pw} onChange={e=>setPw(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Einloggen</button>
            <button type="button" onClick={signUp}>Registrieren (nur kurz erlaubt)</button>
            <a href="/auth/reset">Passwort vergessen?</a>
          </div>
        </form>
      ) : (
        <form onSubmit={sendMagic} style={{ display: 'flex', gap: 8 }}>
          <input type="email" required placeholder="dein@mail.de" value={email} onChange={e=>setEmail(e.target.value)} style={{ flex: 1 }} />
          <button>Link senden</button>
        </form>
      )}
    </main>
  );
}
