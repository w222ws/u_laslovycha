import type { Metadata } from 'next';
import type { Locale } from '@/content/hotel';

/** Иконки вкладки, экрана «Домой» iOS и манифест — один набор на оба языка (файлы лежат в public/). */
export const brandIcons = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
} satisfies Pick<Metadata, 'icons' | 'manifest'>;

/** Превью для мессенджеров и соцсетей (1200×630): по картинке на язык. */
export function socialImages(locale: Locale, alt: string) {
  const url = `/og-${locale}.jpg`;
  return {
    openGraph: [{ url, width: 1200, height: 630, alt, type: 'image/jpeg' }],
    twitter: [{ url, alt }],
  };
}
