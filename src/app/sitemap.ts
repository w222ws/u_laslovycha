import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/hotel';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      alternates: { languages: { uk: `${SITE_URL}/`, ru: `${SITE_URL}/ru/` } },
    },
    {
      url: `${SITE_URL}/ru/`,
      alternates: { languages: { uk: `${SITE_URL}/`, ru: `${SITE_URL}/ru/` } },
    },
  ];
}
