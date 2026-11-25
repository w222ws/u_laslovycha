import type { IconType } from 'react-icons';
import {
  FaMapMarkerAlt,
  FaTelegramPlane,
  FaViber,
  FaWhatsapp,
} from 'react-icons/fa';
import { contactLinks, type Locale } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';

export type ChannelId = 'telegram' | 'viber' | 'whatsapp' | 'map';

const icons: Record<ChannelId, IconType> = {
  telegram: FaTelegramPlane,
  viber: FaViber,
  whatsapp: FaWhatsapp,
  map: FaMapMarkerAlt,
};

// Единый порядок: Telegram, Viber (акцент), WhatsApp, Google Maps.
const order: ChannelId[] = ['telegram', 'viber', 'whatsapp', 'map'];

/** Главный канал — Viber (на нём визуальный акцент везде). */
export const primaryChannel: ChannelId = 'viber';

/** Канал карты — всегда во внешней вкладке со строгим noopener noreferrer. */
export const mapChannel: ChannelId = 'map';

export function getContactChannels(locale: Locale) {
  const m = getMessages(locale);
  return order.map((id) => ({
    id,
    href: contactLinks[id],
    label: m.contact[id],
    Icon: icons[id],
    external: id === 'telegram' || id === 'whatsapp' || id === 'map',
  }));
}
