import React from 'react';
import ThemeInit from '@/components/ThemeInit';

export const metadata = { title: 'My Story Site' };
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, background: 'var(--bg, #000)', color: 'var(--brand, #fff)', fontFamily: 'var(--font, system-ui, sans-serif)' }}>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
