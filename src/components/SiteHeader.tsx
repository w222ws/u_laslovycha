import { buildContactLinks, hotel, type Locale } from '@/content/hotel';
import { sectionIds } from '@/content/sections';
import { formatPhone, pad2 } from '@/lib/format';
import { fmt, getMessages } from '@/lib/i18n';
import { ContactButtons } from './ContactButtons';
import { LangSwitch } from './LangSwitch';
import { MenuDialog } from './MenuDialog';
import { RidgeMark } from './Ridge';

export function SiteHeader({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <MenuDialog labels={{ open: m.header.menu, close: m.header.close, title: m.header.menuTitle }}>
            <MenuContent locale={locale} />
          </MenuDialog>
          <LangSwitch locale={locale} />
        </div>
        <a
          href="#top"
          aria-label={m.header.home}
          className="group flex items-center gap-3 font-serif text-wordmark font-medium text-ink"
        >
          <RidgeMark className="hidden h-4 w-10 text-rust transition-transform duration-hover group-hover:-translate-y-0.5 sm:block" />
          {m.brand}
        </a>
      </div>
    </header>
  );
}

function MenuContent({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const links = buildContactLinks(fmt(m.booking.template, { room: m.booking.anyRoom }));
  return (
    <>
      <nav aria-label={m.header.menuTitle} className="mt-6 md:mt-10">
        <ol>
          {sectionIds.map((id, i) => (
            <li key={id} className="border-b border-line">
              <a href={`#${id}`} className="group flex items-baseline gap-4 py-4 md:gap-6 md:py-5">
                <span className="w-6 shrink-0 font-mono text-label text-ink-muted transition-colors duration-hover group-hover:text-rust-text">
                  {pad2(i + 1)}
                </span>
                <span aria-hidden className="font-mono text-label text-line">
                  /
                </span>
                <span className="font-serif text-menu transition-[color,translate] duration-hover group-hover:translate-x-2 group-hover:text-spruce">
                  {m.nav[id]}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-auto pt-12">
        <p className="font-mono text-label uppercase text-ink-muted">{m.contact.heading}</p>
        <div className="mt-4 grid gap-6 border-t border-line pt-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-label uppercase text-ink-muted">{m.contact.phone}</p>
            <a
              href={links.call}
              className="mt-2 inline-block font-mono text-price transition-colors duration-hover hover:text-spruce"
            >
              {formatPhone(hotel.contacts.phone)}
            </a>
          </div>
          <div>
            <p className="font-mono text-label uppercase text-ink-muted">{m.contact.address}</p>
            <p className="mt-2">{hotel.address[locale]}</p>
          </div>
        </div>
        <div className="mt-8">
          <ContactButtons locale={locale} />
        </div>
      </div>
    </>
  );
}
