import type { Locale } from '@/content/hotel';
import { firstPhoto, rooms } from '@/content/rooms';
import { sectionIds } from '@/content/sections';
import { formatPrice, pad2 } from '@/lib/format';
import { fmt, getMessages } from '@/lib/i18n';
import { ContactButtons } from './ContactButtons';
import { Photo } from './Photo';
import { SectionHead } from './SectionHead';

const sectionNo = sectionIds.indexOf('rooms') + 1;

export function Rooms({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  return (
    <section
      id="rooms"
      aria-labelledby="rooms-title"
      className="reveal mx-auto max-w-page scroll-mt-20 px-4 py-16 md:scroll-mt-24 md:px-8 md:py-24"
    >
      <SectionHead n={sectionNo} id="rooms-title" title={m.rooms.heading} lede={m.rooms.lede} />

      <div className="mt-16 grid gap-24 md:mt-24 md:gap-36">
        {rooms.map((room, i) => {
          const t = m.rooms.items[room.id];
          const flip = i % 2 === 1;
          const photoLabel = `${m.photo.placeholder} ${pad2(i + 2)}`;
          return (
            <article
              key={room.id}
              aria-labelledby={`room-${room.id}`}
              className="grid grid-cols-4 gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-x-8"
            >
              <figure className={`col-span-4 lg:col-span-7 lg:row-start-1 ${flip ? 'lg:col-start-6' : 'lg:col-start-1'}`}>
                <Photo src={firstPhoto(room)} alt={t.photoAlt} ratio="3:2" placeholder={photoLabel} />
                <figcaption className="mt-3 font-mono text-label uppercase text-ink-muted">
                  {photoLabel} — {t.name}
                </figcaption>
              </figure>

              <div
                className={`col-span-4 lg:col-span-4 lg:row-start-1 lg:self-center ${flip ? 'lg:col-start-1' : 'lg:col-start-9'}`}
              >
                <p className="font-mono text-label uppercase text-rust-text">
                  {pad2(sectionNo)}.{i + 1}
                </p>
                <h3 id={`room-${room.id}`} className="mt-3 font-serif text-h3 font-medium">
                  {t.name}
                </h3>
                <p className="mt-4 text-ink-muted">{t.description}</p>

                <dl className="mt-8 grid grid-cols-2 border-y border-line">
                  <div className="py-4 pr-4">
                    <dt className="font-mono text-label uppercase text-ink-muted">{m.rooms.capacity}</dt>
                    <dd className="mt-1 font-mono text-price">{room.capacity}</dd>
                  </div>
                  <div className="border-l border-line py-4 pl-4">
                    <dt className="font-mono text-label uppercase text-ink-muted">{m.rooms.count}</dt>
                    <dd className="mt-1 font-mono text-price">{room.count}</dd>
                  </div>
                </dl>

                <p className="mt-8 font-mono text-label uppercase text-ink-muted">{m.rooms.inside}</p>
                <ul className="mt-3">
                  {t.features.map((f) => (
                    <li key={f} className="border-b border-line py-2">
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="mt-8 flex flex-wrap items-baseline gap-x-3">
                  <span className="font-mono text-price">
                    {fmt(m.hero.from, { price: formatPrice(room.priceFrom, locale) })}
                  </span>
                  <span className="font-mono text-label uppercase text-ink-muted">/ {m.rooms.perNight}</span>
                </p>

                <p className="mt-6 font-mono text-label uppercase text-ink-muted">{m.rooms.book}</p>
                <div className="mt-3">
                  <ContactButtons locale={locale} roomBookingName={t.bookingName} stack />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
