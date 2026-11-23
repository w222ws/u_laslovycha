import { currency } from '@/content/rooms';
import type { Locale } from '@/content/hotel';
import { intlLocale } from './i18n';

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
