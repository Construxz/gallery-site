'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });
    alert('Magic-Link wurde verschickt. Bitte E-Mail öffnen.');
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>Login</h1>
      <form onSubmit={sendLink} style={{ display: 'flex', gap: 8 }}>
        <input
          type="email" required placeholder="dein@mail.de"
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, padding: 8, border: '1px solid #ccc' }}
        />
        <button style={{ padding: 8 }}>Magic-Link senden</button>
      </form>
    </main>
  );
}
