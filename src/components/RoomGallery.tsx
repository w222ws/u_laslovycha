'use client';

import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import type { Messages } from '@/lib/i18n';
import { Photo } from './Photo';
import { PhotoLightbox } from './PhotoLightbox';

type Slot = { src: string; available: boolean };
type Props = { slots: Slot[]; name: string; labels: Messages['rooms'] };

const arrow =
  'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-surface/15 bg-ink/70 text-surface backdrop-blur-sm transition-colors duration-hover hover:bg-ink lg:grid';

/**
 * Галерея на 4 кадра. Листание — нативным scroll-snap: палец тянет кадр за собой, инерцию и
 * снэп считает компоновщик браузера, поэтому свайп на телефоне ровный и без JS в кадре.
 * Активный кадр отслеживает IntersectionObserver; миниатюры и стрелки прокручивают трек.
 */
export function RoomGallery({ slots, name, labels }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // В лайтбоксе листаем только реально существующие кадры.
  const viewable = slots.filter((slot) => slot.available).map((slot) => slot.src);

  // Активный кадр — тот, что занял больше половины трека.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { root: track, threshold: 0.6 },
    );
    for (const slide of Array.from(track.children)) observer.observe(slide);
    return () => observer.disconnect();
  }, [slots.length]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + slots.length) % slots.length;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: target * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
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
          ref={trackRef}
          className="snap-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl bg-paper-deep"
        >
          {slots.map((slot, i) => (
            <div key={slot.src} data-index={i} className="w-full shrink-0 snap-start">
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
