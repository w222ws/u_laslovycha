import '@/styles/globals.css';
import { Preloader } from '@/components/Preloader';
import { fontClassName } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={fontClassName}>
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
