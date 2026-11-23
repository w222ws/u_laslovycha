import type { Metadata } from 'next';
import { Landing } from '@/components/Landing';
import { getMessages } from '@/lib/i18n';

export function generateMetadata(): Metadata {
  const { meta } = getMessages('ru');
  return { title: meta.title, description: meta.description };
}

export default function Page() {
  return <Landing locale="ru" />;
}
