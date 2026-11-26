import { hotel, SITE_URL, type Locale } from '@/content/hotel';
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
  const pageUrl = locale === 'uk' ? `${SITE_URL}/` : `${SITE_URL}/ru/`;
  const lodging = {
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/#lodging`,
    name: hotel.name,
    description: meta.description,
    url: pageUrl,
    // Картинки для превью в выдаче Google: баннер 1200×630, фото дома и квадратный логотип.
    image: [`${SITE_URL}/og-${locale}.png`, `${SITE_URL}${hotel.heroPhoto}`],
    logo: `${SITE_URL}/icon-512.png`,
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
  // Название сайта для выдачи: «У Ласловича» вместо голого домена.
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: hotel.name,
    url: `${SITE_URL}/`,
    inLanguage: ['uk', 'ru'],
  };
  const jsonLd = { '@context': 'https://schema.org', '@graph': [website, lodging] };

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
