import { buildContactLinks, type Locale } from '@/content/hotel';
import { fmt, getMessages } from '@/lib/i18n';
import { Hero } from './Hero';
import { MobileContactBar } from './MobileContactBar';
import { Rooms } from './Rooms';
import { SiteHeader } from './SiteHeader';

export function Landing({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const links = buildContactLinks(fmt(m.booking.template, { room: m.booking.anyRoom }));

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="pb-20 md:pb-0">
        <Hero locale={locale} />
        <Rooms locale={locale} />
      </main>
      <MobileContactBar
        watchId="hero"
        links={links}
        labels={{
          title: m.contact.barTitle,
          telegram: m.cta.telegramShort,
          viber: m.cta.viberShort,
          call: m.cta.callShort,
        }}
      />
    </>
  );
}
