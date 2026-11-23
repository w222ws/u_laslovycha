import { Fragment } from 'react';
import type { Locale } from '@/content/hotel';
import { getMessages, localeCode, localePath, locales } from '@/lib/i18n';

export function LangSwitch({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  return (
    <nav aria-label={m.header.switchLabel} className="flex items-center gap-2 font-mono text-label uppercase">
      {locales.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && (
            <span aria-hidden className="text-line">
              /
            </span>
          )}
          {l === locale ? (
            <span aria-current="true" className="text-ink">
              {localeCode[l]}
            </span>
          ) : (
            <a
              href={localePath[l]}
              hrefLang={l}
              lang={l}
              className="text-ink-muted transition-colors duration-hover hover:text-spruce"
            >
              {localeCode[l]}
            </a>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
