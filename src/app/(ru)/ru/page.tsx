import type { Metadata } from 'next';
import { Landing } from '@/components/Landing';
import { SITE_URL } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';

export function generateMetadata(): Metadata {
  const { meta } = getMessages('ru');
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: '/ru/',
      languages: { uk: '/', ru: '/ru/', 'x-default': '/' },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: '/ru/',
      siteName: 'У Ласловича',
      locale: 'ru_UA',
      type: 'website',
    },
  };
}

export default function Page() {
  return <Landing locale="ru" />;
}
