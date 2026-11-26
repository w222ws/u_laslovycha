'use client';

import { useRef, useState, type TouchEvent } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import type { Messages } from '@/lib/i18n';
import { Photo } from './Photo';
import { PhotoLightbox } from './PhotoLightbox';

type Slot = { src: string; available: boolean };
type Props = { slots: Slot[]; name: string; labels: Messages['rooms'] };

const arrow =
  'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-surface/15 bg-ink/70 text-surface backdrop-blur-sm transition-colors duration-hover hover:bg-ink lg:grid';

/**
 * Галерея на 4 кадра: активный кадр мягко проявляется (opacity), остальные скрыты.
 * Листают миниатюры, стрелки и простой свайп.
 */
export function RoomGallery({ slots, name, labels }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // В лайтбоксе листаем только реально существующие кадры.
  const viewable = slots.filter((slot) => slot.available).map((slot) => slot.src);

  const scrollToSlide = (index: number) => setActive((index + slots.length) % slots.length);

  // Обычный свайп: сдвиг пальца больше порога листает кадр, вертикальный скролл страницы не мешает.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (t) touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) scrollToSlide(active + (dx < 0 ? 1 : -1));
  };

  const closeLightbox = () => {
    // Галерея остаётся на том кадре, на котором закрыли просмотр.
    if (lightbox !== null) {
      const slide = slots.findIndex((slot) => slot.src === viewable[lightbox]);
      if (slide >= 0) scrollToSlide(slide);
    }
    setLightbox(null);
  };

  return (
    <div>
      <div className="relative">
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="grid overflow-hidden rounded-2xl bg-paper-deep"
        >
          {slots.map((slot, i) => (
            <div
              key={slot.src}
              aria-hidden={i !== active}
              inert={i !== active}
              className={`col-start-1 row-start-1 transition-opacity duration-300 ease-out ${
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  const inLightbox = viewable.indexOf(slot.src);
                  if (inLightbox >= 0) setLightbox(inLightbox);
                }}
                disabled={!slot.available}
                aria-label={`${labels.openPhoto}: ${name}`}
                className="block aspect-4/3 w-full cursor-zoom-in disabled:cursor-default md:aspect-16/10"
              >
                <Photo
                  src={slot.src}
                  available={slot.available}
                  alt={`${name}, ${labels.slot} ${i + 1}`}
                  pending={`${labels.slot} ${i + 1}`}
                  eager={i === 0}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToSlide(active - 1)}
          aria-label={labels.prevPhoto}
          className={`${arrow} left-3`}
        >
          <HiChevronLeft aria-hidden size={20} />
        </button>
        <button
          type="button"
          onClick={() => scrollToSlide(active + 1)}
          aria-label={labels.nextPhoto}
          className={`${arrow} right-3`}
        >
          <HiChevronRight aria-hidden size={20} />
        </button>

        <p
          aria-hidden
          className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 text-label font-semibold text-surface backdrop-blur-sm"
        >
          {active + 1} / {slots.length}
        </p>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-2 md:gap-3">
        {slots.map((slot, i) => (
          <li key={slot.src}>
            <button
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`${labels.photo} ${i + 1}`}
              aria-current={i === active}
              className={`block aspect-4/3 w-full overflow-hidden rounded-xl border-2 bg-paper-deep transition-colors duration-hover ${
                i === active ? 'border-surface' : 'border-surface/15 hover:border-surface/50'
              }`}
            >
              <Photo
                src={slot.src}
                available={slot.available}
                alt={`${name}, ${labels.slot} ${i + 1}`}
                pending={String(i + 1)}
              />
            </button>
          </li>
        ))}
      </ul>

      {lightbox !== null && (
        <PhotoLightbox
          photos={viewable}
          index={lightbox}
          alt={name}
          labels={{ prev: labels.prevPhoto, next: labels.nextPhoto, close: labels.closePhoto }}
          onIndex={setLightbox}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
