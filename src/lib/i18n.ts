import uk from '../../messages/uk.json';
import ru from '../../messages/ru.json';
import type { Locale } from '@/content/hotel';

export type Messages = typeof uk;

// ru обязан иметь ту же форму, что uk — иначе ошибка типов.
const dictionaries = { uk, ru } satisfies Record<Locale, Messages>;

export const getMessages = (locale: Locale): Messages => dictionaries[locale];

export const intlLocale: Record<Locale, string> = { uk: 'uk-UA', ru: 'ru-UA' };

export const localePath: Record<Locale, string> = { uk: '/', ru: '/ru/' };

/** Код языка в переключателе. */
export const localeCode: Record<Locale, string> = { uk: 'UA', ru: 'RU' };

/** Противоположный язык — для компактного переключателя одним кликом. */
export const otherLocale: Record<Locale, Locale> = { uk: 'ru', ru: 'uk' };

export const locales = ['uk', 'ru'] as const satisfies readonly Locale[];
