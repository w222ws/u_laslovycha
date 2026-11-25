import { hotel, type Locale } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';
import { Contacts } from './Contacts';
import { Faq } from './Faq';
import { Hero } from './Hero';
import { Reviews } from './Reviews';
import { Rooms } from './Rooms';
import { SiteHeader } from './SiteHeader';
import { SiteHeaderContent } from './SiteHeaderContent';

/** Шаги 1–4: прозрачный Хедер, Хиро на 100dvh, разделы #rooms, #reviews, #faq и #contacts. */
export function Landing({ locale }: { locale: Locale }) {
  const { meta } = getMessages(locale);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: hotel.name,
    description: meta.description,
    telephone: hotel.contacts.phone,
    inLanguage: locale,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotel.city[locale],
      addressRegion: hotel.region[locale],
      addressCountry: 'UA',
    },
    hasMap: hotel.mapUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader>
        <SiteHeaderContent locale={locale} />
      </SiteHeader>
      <main>
        <Hero locale={locale} />
        <Rooms locale={locale} />
        <Reviews locale={locale} />
        <Faq locale={locale} />
        <Contacts locale={locale} />
      </main>
    </>
  );
}
