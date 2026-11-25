import type { Metadata } from 'next';
import { Landing } from '@/components/Landing';
import { SITE_URL } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';

export function generateMetadata(): Metadata {
  const { meta } = getMessages('uk');
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: '/',
      languages: { uk: '/', ru: '/ru/', 'x-default': '/' },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: '/',
      siteName: 'У Ласловича',
      locale: 'uk_UA',
      type: 'website',
    },
  };
}

export default function Page() {
  return <Landing locale="uk" />;
}
