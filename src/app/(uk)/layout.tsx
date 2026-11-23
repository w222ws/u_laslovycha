import '@/styles/globals.css';
import { fontClassName } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={fontClassName}>
      <body>{children}</body>
    </html>
  );
}
