import { hotel, type Locale } from '@/content/hotel';
import { minPrice, rooms } from '@/content/rooms';
import { formatPrice } from '@/lib/format';
import { fmt, getMessages, localePath } from '@/lib/i18n';
import { ContactButtons } from './ContactButtons';

export function Landing({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const other: Locale = locale === 'uk' ? 'ru' : 'uk';
  const { lat, lng } = hotel.coordinates;

  return (
    <main className="mx-auto max-w-page px-4 py-12 md:px-8 md:py-24">
      <nav aria-label={m.header.switchLabel} className="mb-12 flex justify-end font-mono text-label uppercase">
        <a className="text-ink-muted hover:text-spruce" href={localePath[other]} hrefLang={other} lang={other}>
          {other.toUpperCase()}
        </a>
      </nav>

      <p className="font-mono text-label uppercase text-rust-text">
        {m.hero.place} · {lat.toFixed(2)}°N {lng.toFixed(2)}°E · {hotel.elevationMeters} m
      </p>
      <h1 className="mt-4 font-serif text-h1 font-medium">{m.hero.title}</h1>
      <p className="mt-6 max-w-measure text-body-lg text-ink-muted">{m.hero.subtitle}</p>
      <p className="mt-6 font-mono text-body-lg">{fmt(m.hero.from, { price: formatPrice(minPrice, locale) })}</p>
      <div className="mt-8">
        <ContactButtons locale={locale} />
      </div>

      <section className="mt-24 border-t border-line pt-8">
        <p className="font-mono text-label uppercase text-ink-muted">01</p>
        <h2 className="mt-2 font-serif text-h2 font-medium">{m.rooms.heading}</h2>
        <ul className="mt-8">
          {rooms.map((room) => {
            const name = m.rooms[room.id];
            return (
              <li key={room.id} className="border-t border-line py-6">
                <h3 className="font-serif text-2xl font-medium">{name.name}</h3>
                <p className="mt-2 font-mono text-label uppercase text-ink-muted">
                  {fmt(m.rooms.capacity, { n: room.capacity })} · {fmt(m.rooms.count, { n: room.count })}
                </p>
                <p className="mt-2 font-mono">{fmt(m.hero.from, { price: formatPrice(room.priceFrom, locale) })}</p>
                <div className="mt-4">
                  <ContactButtons locale={locale} roomBookingName={name.bookingName} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
