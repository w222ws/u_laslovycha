import type { Locale } from '@/content/hotel';
import { roomTypes, type ResolvedRoomType } from '@/content/rooms';
import { getMessages, intlLocale } from '@/lib/i18n';
import { photoExists } from '@/lib/photoExists';
import { MotionRoot } from './MotionRoot';
import { Reveal } from './Reveal';
import { RevealTitle } from './RevealTitle';
import { RoomsTabs } from './RoomsTabs';
import { RoomsTopo } from './RoomsTopo';

export function Rooms({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const money = new Intl.NumberFormat(intlLocale[locale]);

  // Локализуем и проверяем фото на сервере: в клиентский остров уходят только строки и флаги наличия файлов.
  const types: ResolvedRoomType[] = roomTypes.map((type) => ({
    id: type.id,
    kind: type.kind,
    number: type.number,
    tabShort: type.tabShort[locale],
    tabFull: type.tabFull[locale],
    name: type.name[locale],
    description: type.description[locale],
    capacity: type.capacity[locale],
    note: type.kind === 'room' ? type.note[locale] : null,
    priceFrom: type.kind === 'room' ? money.format(type.priceFrom) : null,
    conditionsTitle: type.conditionsTitle[locale],
    conditions: [...type.conditions[locale]],
    photos: type.photos.map((src) => ({ src, available: photoExists(src) })),
  }));

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="scroll-mt-16 md:scroll-mt-20">
      <RidgeEdge />

      {/* Графитовая полоса (`ink`) на всю ширину: контраст со светлым Хиро. Только токены проекта. */}
      <div className="on-dark relative isolate overflow-hidden bg-ink text-surface">
        <RoomsTopo />
        <div className="mx-auto max-w-page px-5 py-14 md:px-8 md:py-24">
          <MotionRoot>
            <RevealTitle
              id="rooms-title"
              text={m.rooms.title}
              className="font-display text-h2 font-bold tracking-tight text-balance text-surface"
            />
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-measure text-body-lg text-surface/70">{m.rooms.intro}</p>
            </Reveal>

            <div className="mt-10">
              <RoomsTabs types={types} labels={m.rooms} />
            </div>
          </MotionRoot>
        </div>
      </div>

      <RidgeEdge flip />
    </section>
  );
}

/** Рваный силуэт хребта: граница между светлой страницей и тёмной полосой (`flip` — нижний край). */
function RidgeEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-8 w-full text-ink md:h-14 ${
        flip ? '-mt-px rotate-180' : '-mb-px'
      }`}
    >
      <path
        fill="currentColor"
        d="M0 60 V40 L90 24 L170 36 L270 10 L370 32 L470 18 L560 38 L680 6 L790 34 L880 20 L990 40 L1090 14 L1190 36 L1290 22 L1380 34 L1440 26 V60 Z"
      />
    </svg>
  );
}
