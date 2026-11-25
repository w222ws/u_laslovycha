import { getMessages, localeCode, localePath, otherLocale } from '@/lib/i18n';
import type { Locale } from '@/content/hotel';

/** Компактная кнопка-переключатель: показывает текущий язык, ведёт на другой. */
export function LangToggle({ locale, className = '' }: { locale: Locale; className?: string }) {
  const m = getMessages(locale);
  const target = otherLocale[locale];
  return (
    <a
      href={localePath[target]}
      hrefLang={target}
      lang={target}
      aria-label={`${m.header.switchLabel}: ${localeCode[target]}`}
      className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface/80 px-3 text-small font-semibold tracking-wide text-ink transition-colors duration-hover hover:border-accent hover:text-accent ${className}`}
    >
      {localeCode[locale]}
    </a>
  );
}
