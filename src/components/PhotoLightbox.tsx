'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';

type Props = {
  photos: readonly string[];
  index: number;
  alt: string;
  labels: { prev: string; next: string; close: string };
  onIndex: (next: number) => void;
  onClose: () => void;
};

const ctrl =
  'grid size-11 place-items-center rounded-full bg-surface/90 text-ink shadow-card transition-colors duration-hover hover:bg-surface hover:text-accent';

/**
 * Просмотр фото крупнее. Рендерится порталом в <body>: у предков с анимацией остаётся transform,
 * а он превращает `position: fixed` в позиционирование относительно предка.
 * Закрытие: клик по фону, крестик, Esc. Стрелки ← → листают, Tab зациклен внутри окна.
 */
export function PhotoLightbox({ photos, index, alt, labels, onIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = photos.length;

  // Блокировка скролла страницы, фокус на «закрыть» и возврат фокуса после закрытия.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && total > 1) {
        onIndex((index - 1 + total) % total);
      } else if (e.key === 'ArrowRight' && total > 1) {
        onIndex((index + 1) % total);
      } else if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onIndex, onClose]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const endX = e.changedTouches[0]?.clientX;
        if (touchX.current === null || endX === undefined || total < 2) return;
        const dx = endX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) onIndex((index + (dx < 0 ? 1 : -1) + total) % total);
      }}
      className="lightbox on-dark fixed inset-0 z-60 flex items-center justify-center bg-ink/90 p-4 md:p-10"
    >
      <img
        key={photos[index]}
        src={photos[index]}
        alt={`${alt} ${index + 1}/${total}`}
        onClick={(e) => e.stopPropagation()}
        className="photo-fade max-h-[82dvh] max-w-full rounded-2xl object-contain shadow-float"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className={`absolute top-4 right-4 md:top-6 md:right-6 ${ctrl}`}
      >
        <HiXMark aria-hidden size={22} />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + total) % total);
            }}
            aria-label={labels.prev}
            className={`absolute top-1/2 left-3 -translate-y-1/2 md:left-6 ${ctrl}`}
          >
            <HiChevronLeft aria-hidden size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % total);
            }}
            aria-label={labels.next}
            className={`absolute top-1/2 right-3 -translate-y-1/2 md:right-6 ${ctrl}`}
          >
            <HiChevronRight aria-hidden size={22} />
          </button>
          <p
            aria-hidden
            className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-surface/90 px-3 py-1 text-small font-semibold text-ink"
          >
            {index + 1} / {total}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}
