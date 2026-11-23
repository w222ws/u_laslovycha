import type { Locale } from '@/content/hotel';
import { buildContactLinks } from '@/content/hotel';
import { fmt, getMessages } from '@/lib/i18n';

const base =
  'inline-flex items-center justify-center rounded-btn border px-6 py-3 font-medium transition-colors duration-fast ease-quiet';
const primary = `${base} border-spruce bg-spruce text-paper hover:bg-ink hover:border-ink`;
const outline = `${base} border-spruce text-spruce hover:bg-spruce hover:text-paper`;

/** Порядок везде один: Telegram, Viber, звонок. Главная — залитая spruce. */
export function ContactButtons({ locale, roomBookingName }: { locale: Locale; roomBookingName?: string }) {
  const m = getMessages(locale);
  const message = fmt(m.booking.template, { room: roomBookingName ?? m.booking.anyRoom });
  const links = buildContactLinks(message);
  return (
    <div className="flex flex-wrap gap-3">
      <a className={primary} href={links.telegram} target="_blank" rel="noopener">
        {m.cta.telegram}
      </a>
      <a className={outline} href={links.viber}>
        {m.cta.viber}
      </a>
      <a className={outline} href={links.call}>
        {m.cta.call}
      </a>
    </div>
  );
}
