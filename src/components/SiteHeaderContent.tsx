import type { Locale } from '@/content/hotel';
import { hotel } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';
import { BrandMark } from './BrandMark';
import { getContactChannels, primaryChannel } from './contactChannels';
import { HeaderContact } from './HeaderContact';
import { LangToggle } from './LangToggle';
import { MenuDialog } from './MenuDialog';

const navIds = ['rooms', 'reviews', 'faq', 'contacts'] as const;

export function SiteHeaderContent({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    // relative z-50 — чтобы в контексте шапки верхняя строка всегда лежала выше оверлея (z-20).
    <div className="relative z-50 mx-auto flex h-16 max-w-page items-center gap-6 px-5 md:h-20 md:px-8">
      <div className="relative z-30">
        <BrandMark label={m.brand} ariaLabel={m.header.home} />
      </div>

      <nav aria-label={m.header.menuTitle} className="hidden flex-1 justify-center lg:flex">
        <ul className="flex items-center gap-8">
          {navIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-nav font-medium text-ink/85 transition-colors duration-hover hover:text-accent"
              >
                {m.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
        {/* Переключатель языка виден всегда: он — часть верхней строки мобильного меню тоже. */}
        <LangToggle locale={locale} className="relative z-30" />
        <div className="hidden lg:block">
          <HeaderContact locale={locale} />
        </div>
        <div className="lg:hidden">
          <MenuDialog
            labels={{ open: m.header.openMenu, close: m.header.closeMenu, title: m.header.menuTitle }}
          >
            <MobileMenuBody locale={locale} />
          </MenuDialog>
        </div>
      </div>
    </div>
  );
}

function MobileMenuBody({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const channels = getContactChannels(locale);
  return (
    <div className="flex flex-1 flex-col gap-10 pt-2">
      <nav aria-label={m.header.menuTitle}>
        <ul className="flex flex-col divide-y divide-line">
          {navIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="block py-4 font-display text-menu font-semibold text-ink transition-colors duration-hover hover:text-accent"
              >
                {m.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="menu-contact" className="mt-auto">
        <h2 id="menu-contact" className="mb-3 text-label uppercase text-ink-muted">
          {m.header.contactTitle}
        </h2>
        <a
          href={`tel:${hotel.contacts.phone}`}
          className="mb-4 inline-block text-small font-semibold text-ink transition-colors duration-hover hover:text-accent"
        >
          {hotel.contacts.phoneDisplay}
        </a>
        {/* Сетка 2×2: Telegram, Viber (акцент), WhatsApp, Google Maps. Отдельной кнопки звонка нет — номер кликабелен выше. */}
        <ul className="grid grid-cols-2 gap-2.5">
          {channels.map(({ id, href, label, Icon, external }) => {
            const isPrimary = id === primaryChannel;
            const cls = isPrimary
              ? 'bg-accent text-surface shadow-card hover:bg-accent-hover'
              : 'bg-surface text-ink hover:bg-accent-soft hover:text-accent';
            return (
              <li key={id}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`flex h-14 items-center justify-center gap-2.5 rounded-2xl text-small font-semibold transition-colors duration-hover ${cls}`}
                >
                  <Icon aria-hidden size={18} />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
