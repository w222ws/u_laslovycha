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

/** Номер раздела/фото: 1 → «01». */
export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** +380XXXXXXXXX → +380 XX XXX XX XX */
export function formatPhone(e164: string): string {
  const m = /^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(e164);
  return m ? `+380 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : e164;
}
