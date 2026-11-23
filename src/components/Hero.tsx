import { hotel, type Locale } from '@/content/hotel';
import { minPrice } from '@/content/rooms';
import { formatPrice, pad2 } from '@/lib/format';
import { fmt, getMessages } from '@/lib/i18n';
import { ContactButtons } from './ContactButtons';
import { Photo } from './Photo';
import { RidgeLine } from './Ridge';

export function Hero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const { lat, lng } = hotel.coordinates;
  const photoLabel = `${m.photo.placeholder} ${pad2(1)}`;

  return (
    <section id="hero" aria-labelledby="hero-title" className="mx-auto max-w-page px-4 pt-12 pb-16 md:px-8 md:pt-24 md:pb-24">
      <div className="grid grid-cols-4 gap-x-4 gap-y-20 lg:grid-cols-12 lg:gap-x-8">
        {/* Текст: 7 колонок */}
        <div className="col-span-4 flex flex-col lg:col-span-7">
          <p className="font-mono text-label uppercase text-rust-text">
            {m.hero.place} · {lat.toFixed(2)}°N {lng.toFixed(2)}°E · {hotel.elevationMeters} {m.hero.elevationUnit}
          </p>

          <h1 id="hero-title" className="mt-8 font-serif text-h1 font-medium text-balance md:mt-12">
            {m.hero.title}
          </h1>

          <p className="mt-8 max-w-measure text-body-lg text-ink-muted md:mt-10">{m.hero.subtitle}</p>

          <p className="mt-10 flex flex-wrap items-baseline gap-x-3 border-t border-line pt-6 md:mt-12">
            <span className="font-mono text-price">{fmt(m.hero.from, { price: formatPrice(minPrice, locale) })}</span>
            <span className="font-mono text-label uppercase text-ink-muted">/ {m.hero.perNight}</span>
          </p>

          <div className="mt-8">
            <ContactButtons locale={locale} />
          </div>

          {/* Хребет тянется от текста к кадру и уходит под рамку */}
          <RidgeLine className="ridge-draw mt-auto hidden h-32 w-[calc(100%+2rem)] translate-y-[-1.5rem] pt-16 text-rust lg:block" />
        </div>

        {/* Обложка: 5 колонок */}
        <figure className="relative col-span-4 mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div className="relative z-10 border border-line bg-paper p-3 md:p-4">
            <p className="absolute top-0 left-3 flex -translate-y-3/4 items-baseline gap-3 bg-paper pr-3 md:left-[-2rem] md:pl-2">
              <span className="font-serif text-issue text-rust">№&nbsp;{pad2(1)}</span>
              <span className="font-mono text-label uppercase text-ink-muted">/ {m.hero.issue}</span>
            </p>
            <Photo src={hotel.heroPhoto} alt={m.hero.photoAlt} ratio="4:5" placeholder={photoLabel} eager />
          </div>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4 font-mono text-label uppercase text-ink-muted">
            <span>
              {photoLabel} — {m.hero.photoCaption}
            </span>
            <span className="shrink-0">
              {m.hero.place}, {hotel.elevationMeters} {m.hero.elevationUnit}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
