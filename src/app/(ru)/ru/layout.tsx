import type { Viewport } from 'next';
import '@/styles/globals.css';
import { Preloader } from '@/components/Preloader';
import { fontClassName } from '@/lib/fonts';

/** Цвет адресной строки мобильного браузера — фон страницы (paper). */
export const viewport: Viewport = { themeColor: '#F7F7F5' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontClassName}>
      <body id="top">
        <noscript>
          <style>{'[style*="opacity: 0"]{opacity:1!important;transform:none!important}.preloader{display:none!important}'}</style>
        </noscript>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
