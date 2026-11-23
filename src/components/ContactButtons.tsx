import type { Locale } from '@/content/hotel';
import { buildContactLinks } from '@/content/hotel';
import { fmt, getMessages } from '@/lib/i18n';
import { PhoneIcon, TelegramIcon, ViberIcon } from './icons';

const base =
  'inline-flex items-center justify-center gap-3 rounded-btn border px-5 py-3 text-small font-medium transition-colors duration-hover ease-quiet';
const primary = `${base} border-spruce bg-spruce text-paper hover:border-ink hover:bg-ink`;
const outline = `${base} border-spruce text-spruce hover:bg-spruce hover:text-paper`;

type Props = { locale: Locale; roomBookingName?: string; stack?: boolean };

/** Порядок везде один: Telegram, Viber, звонок. Главная — залитая spruce. */
export function ContactButtons({ locale, roomBookingName, stack = false }: Props) {
  const m = getMessages(locale);
  const message = fmt(m.booking.template, { room: roomBookingName ?? m.booking.anyRoom });
  const links = buildContactLinks(message);
  const wrap = stack ? 'grid gap-3' : 'flex flex-wrap gap-3';
  return (
    <div className={wrap}>
      <a className={primary} href={links.telegram} target="_blank" rel="noopener">
        <TelegramIcon />
        {m.cta.telegram}
      </a>
      <a className={outline} href={links.viber}>
        <ViberIcon />
        {m.cta.viber}
      </a>
      <a className={outline} href={links.call}>
        <PhoneIcon />
        {m.cta.call}
      </a>
    </div>
  );
}
