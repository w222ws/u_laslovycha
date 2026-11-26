import type { Metadata } from 'next';
import { Landing } from '@/components/Landing';
import { SITE_URL } from '@/content/hotel';
import { brandIcons, socialImages } from '@/lib/brandMeta';
import { getMessages } from '@/lib/i18n';

export function generateMetadata(): Metadata {
  const { meta } = getMessages('ru');
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    ...brandIcons,
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
      images: socialImages('ru', meta.title).openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: socialImages('ru', meta.title).twitter,
    },
  };
}

export default function Page() {
  return <Landing locale="ru" />;
}
