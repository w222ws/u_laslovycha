'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';
import type { Locale } from '@/content/hotel';
import type { Messages } from '@/lib/i18n';

/** Отзыв, уже подготовленный сервером: дата отформатирована, инициал посчитан. */
export type ResolvedReview = {
  id: string;
  author: string;
  initial: string;
  /** Отформатированная дата или `null`, если в контенте её нет. */
  date: string | null;
  rating: number;
  quote: string;
  lang: Locale;
};

type Labels = Messages['reviews'];
type Props = { reviews: ResolvedReview[]; labels: Labels; mapUrl: string };

/** Длиннее — карточка обрезается до 6 строк и получает кнопку «Читати повністю». */
const LONG_QUOTE = 200;

const navButton =
  'grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors duration-hover hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Положение карточки в колоде по её глубине: 0 — верхняя, 1–2 — стопка под ней, отрицательная — уже улетела.
 * `exit` — в какую сторону карточка улетела (-1 влево, 1 вправо): при возврате она прилетает оттуда же.
 */
function deckVars(depth: number, exit: number): CSSProperties {
  const vars = (dx: string, dy: string, dr: string, ds: string, op: string, z: string) =>
    ({ '--dx': dx, '--dy': dy, '--dr': dr, '--ds': ds, '--do': op, '--dz': z }) as CSSProperties;
  if (depth < 0) return vars(`${exit * 140}%`, '-6%', `${exit * 18}deg`, '0.95', '0', '60');
  if (depth === 0) return vars('0px', '0px', '0deg', '1', '1', '50');
  if (depth === 1) return vars('0px', '14px', '2deg', '0.95', '1', '49');
  if (depth === 2) return vars('0px', '28px', '-2deg', '0.9', '0.7', '48');
  return vars('0px', '28px', '0deg', '0.9', '0', '47');
}

/** Числовые параметры слоёв колоды: нужны, чтобы плавно подтягивать нижние карточки следом за пальцем. */
const STACK = [
  { dy: 0, dr: 0, ds: 1, op: 1 },
  { dy: 14, dr: 2, ds: 0.95, op: 1 },
  { dy: 28, dr: -2, ds: 0.9, op: 0.7 },
  { dy: 28, dr: 0, ds: 0.9, op: 0 },
];
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Во время жеста подтягивает карточки стопки к следующему слою (p: 0 — на месте, 1 — заняла место выше). */
function pullStack(items: HTMLElement[], from: number, p: number) {
  for (let k = 1; k <= 2; k += 1) {
    const el = items[from + k];
    if (!el) continue;
    const a = STACK[Math.min(k, 3)]!;
    const b = STACK[k - 1]!;
    el.dataset.following = 'true';
    el.style.setProperty('--dy', `${lerp(a.dy, b.dy, p)}px`);
    el.style.setProperty('--dr', `${lerp(a.dr, b.dr, p)}deg`);
    el.style.setProperty('--ds', String(lerp(a.ds, b.ds, p)));
    el.style.setProperty('--do', String(lerp(a.op, b.op, p)));
  }
}

/** Вернуть карточки стопки на их слои (откат жеста). */
function resetStack(items: HTMLElement[], from: number) {
  for (let k = 1; k <= 2; k += 1) {
    const el = items[from + k];
    if (!el) continue;
    const a = STACK[k]!;
    delete el.dataset.following;
    el.style.setProperty('--dy', `${a.dy}px`);
    el.style.setProperty('--dr', `${a.dr}deg`);
    el.style.setProperty('--ds', String(a.ds));
    el.style.setProperty('--do', String(a.op));
  }
}

/**
 * Лента отзывов.
 *   Телефон и планшет: «колода» — одна карточка на экране, остальные стопкой под ней. Карточку можно
 *   смахнуть в любую сторону (она улетает веером) или листать кнопками ‹ ›.
 *   Десктоп (lg+): горизонтальная лента с нативным scroll-snap; краевые карточки наклоняются и уезжают.
 * Вся анимация — transform + opacity на компоновщике.
 */
export function ReviewsCarousel({ reviews, labels, mapUrl }: Props) {
  const total = reviews.length + 1; // последняя карточка — «Більше відгуків»
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const exitDirs = useRef<number[]>([]);
  const dragRef = useRef<{
    el: HTMLElement;
    id: number;
    x0: number;
    y0: number;
    lastX: number;
    lastT: number;
    velocity: number;
    moved: boolean;
  } | null>(null);

  const [current, setCurrent] = useState(0);
  const [isDeck, setIsDeck] = useState(false);
  const [edge, setEdge] = useState({ start: true, end: false });
  const [opened, setOpened] = useState<ResolvedReview | null>(null);

  // Колода работает до lg, лента — с lg.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsDeck(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Десктоп: полоса прогресса и доступность кнопок следуют за прокруткой ленты.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDeck) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      const share = (track.scrollLeft + track.clientWidth) / track.scrollWidth;
      if (barRef.current) barRef.current.style.transform = `scaleX(${share})`;
      const start = track.scrollLeft <= 4;
      const end = track.scrollLeft >= max - 4;
      setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isDeck]);

  // Колода: полоса прогресса показывает номер карточки.
  useEffect(() => {
    if (isDeck && barRef.current) barRef.current.style.transform = `scaleX(${(current + 1) / total})`;
  }, [isDeck, current, total]);

  const goNext = (dir: number) => {
    if (current >= total - 1) return;
    exitDirs.current[current] = dir;
    setCurrent(current + 1);
  };
  const goPrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.querySelector('li');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * step, behavior: smooth ? 'smooth' : 'auto' });
  };

  const onPrev = () => (isDeck ? goPrev() : scrollByCard(-1));
  const onNext = () => (isDeck ? goNext(-1) : scrollByCard(1));

  /* ── Жест колоды: тянем верхнюю карточку, на отпускании либо улетает, либо возвращается ── */

  const items = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const restCard = (el: HTMLElement, index: number) => {
    delete el.dataset.dragging;
    // Откат с лёгкой «пружинкой» (overshoot), а не сухой возврат.
    el.dataset.returning = 'true';
    resetStack(items(), index);
    el.style.setProperty('--dx', '0px');
    el.style.setProperty('--dy', '0px');
    el.style.setProperty('--dr', '0deg');
  };

  const onDeckDown = (e: PointerEvent<HTMLLIElement>, index: number) => {
    if (!isDeck || index !== current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Кнопки и ссылки внутри карточки остаются обычными кнопками и ссылками.
    if ((e.target as Element).closest('button, a')) return;
    dragRef.current = {
      el: e.currentTarget,
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
      moved: false,
    };
    delete e.currentTarget.dataset.returning;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onDeckMove = (e: PointerEvent<HTMLLIElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      d.el.dataset.dragging = 'true';
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    // Последняя карточка не улетает: тянется с сопротивлением, как резинка.
    const lastCard = current >= total - 1;
    const x = lastCard ? dx * 0.25 : dx;
    d.el.style.setProperty('--dx', `${x}px`);
    d.el.style.setProperty('--dy', `${dy * 0.2}px`);
    d.el.style.setProperty('--dr', `${clamp(x / 16, -18, 18)}deg`);
    if (!lastCard) pullStack(items(), current, clamp(Math.abs(dx) / 140, 0, 1));
  };

  const onDeckUp = (e: PointerEvent<HTMLLIElement>, index: number) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (!d.moved) return;
    const dx = e.clientX - d.x0;
    const flick = Math.abs(d.velocity) > 0.5 && Math.abs(dx) > 30;
    if ((Math.abs(dx) > 90 || flick) && index < total - 1) {
      delete d.el.dataset.dragging;
      for (const el of items()) delete el.dataset.following;
      exitDirs.current[index] = (flick ? d.velocity : dx) < 0 ? -1 : 1;
      setCurrent(index + 1);
    } else {
      restCard(d.el, index);
    }
  };

  const onDeckCancel = (e: PointerEvent<HTMLLIElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;
    if (d.moved) restCard(d.el, current);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!isDeck) return; // в ленте стрелки листают нативно
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext(-1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  const prevDisabled = isDeck ? current === 0 : edge.start;
  const nextDisabled = isDeck ? current >= total - 1 : edge.end;

  return (
    <div className="mt-12 max-lg:mx-auto max-lg:max-w-md md:mt-16">
      {/* Одна разметка на оба режима: до lg карточки лежат стопкой в одной ячейке сетки (одинаковой высоты),
          с lg — обычная горизонтальная лента. Трек на десктопе выходит за поля, чтобы следующая карточка
          подглядывала, а py/-my оставляют место под тень и наклон. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={labels.trackLabel}
        onKeyDown={onKeyDown}
        className="snap-track grid max-lg:pb-8 lg:-mx-8 lg:-my-4 lg:flex lg:scroll-pl-8 lg:snap-x lg:snap-mandatory lg:gap-5 lg:overflow-x-auto lg:overscroll-x-contain lg:px-8 lg:py-4"
      >
        {reviews.map((review, i) => (
          <DeckItem
            key={review.id}
            index={i}
            current={current}
            isDeck={isDeck}
            exit={exitDirs.current[i] ?? -1}
            handlers={{ onDeckDown, onDeckMove, onDeckUp, onDeckCancel }}
          >
            <ReviewCard review={review} labels={labels} onOpen={setOpened} />
          </DeckItem>
        ))}
        <DeckItem
          index={reviews.length}
          current={current}
          isDeck={isDeck}
          exit={exitDirs.current[reviews.length] ?? -1}
          handlers={{ onDeckDown, onDeckMove, onDeckUp, onDeckCancel }}
        >
          <MoreCard labels={labels} mapUrl={mapUrl} />
        </DeckItem>
      </ul>

      <p className="sr-only" aria-live="polite">
        {isDeck ? `${current + 1} / ${total}` : ''}
      </p>

      <div className="mt-2 flex items-center gap-5 lg:mt-6">
        <span aria-hidden className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <span
            ref={barRef}
            className="absolute inset-0 origin-left bg-accent"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={prevDisabled}
            aria-label={labels.prevReviews}
            className={navButton}
          >
            <HiChevronLeft aria-hidden size={20} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            aria-label={labels.nextReviews}
            className={navButton}
          >
            <HiChevronRight aria-hidden size={20} />
          </button>
        </div>
      </div>

      {opened && (
        <ReviewDialog
          review={opened}
          labels={labels}
          mapUrl={mapUrl}
          onClose={() => setOpened(null)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Deck item ─────────────────────────── */

type Handlers = {
  onDeckDown: (e: PointerEvent<HTMLLIElement>, index: number) => void;
  onDeckMove: (e: PointerEvent<HTMLLIElement>) => void;
  onDeckUp: (e: PointerEvent<HTMLLIElement>, index: number) => void;
  onDeckCancel: (e: PointerEvent<HTMLLIElement>) => void;
};

function DeckItem({
  index,
  current,
  isDeck,
  exit,
  handlers,
  children,
}: {
  index: number;
  current: number;
  isDeck: boolean;
  exit: number;
  handlers: Handlers;
  children: ReactNode;
}) {
  const depth = index - current;
  // В колоде кликабельна только верхняя карточка: остальные скрыты от фокуса и скринридеров.
  const hidden = isDeck && depth !== 0;
  return (
    <li
      inert={hidden}
      aria-hidden={hidden ? true : undefined}
      onPointerDown={(e) => handlers.onDeckDown(e, index)}
      onPointerMove={handlers.onDeckMove}
      onPointerUp={(e) => handlers.onDeckUp(e, index)}
      onPointerCancel={handlers.onDeckCancel}
      className="deck-card fly-card w-full lg:w-80 lg:shrink-0 lg:snap-start"
      style={deckVars(depth, exit)}
    >
      {children}
    </li>
  );
}

/* ─────────────────────────── Card ─────────────────────────── */

function Avatar({ initial }: { initial: string }) {
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-small font-bold text-accent"
    >
      {initial}
    </span>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span role="img" aria-label={`${label}: ${rating}/5`} className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 24 24"
          className={`size-3.5 ${i <= rating ? 'text-accent' : 'text-line'}`}
          fill="currentColor"
        >
          <path d="M12 2 L14.9 8.3 L21.8 9.3 L16.9 14.1 L18.1 21 L12 17.8 L5.9 21 L7.1 14.1 L2.2 9.3 L9.1 8.3 Z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({
  review,
  labels,
  onOpen,
}: {
  review: ResolvedReview;
  labels: Labels;
  onOpen: (review: ResolvedReview) => void;
}) {
  const long = review.quote.length > LONG_QUOTE;
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-5 shadow-card md:p-6">
      <header className="flex items-center gap-3">
        <Avatar initial={review.initial} />
        <div className="min-w-0">
          <p className="truncate font-display text-small font-semibold text-ink">{review.author}</p>
          {review.date && <p className="text-label uppercase text-ink-muted">{review.date}</p>}
        </div>
      </header>

      <div className="mt-4">
        <Stars rating={review.rating} label={labels.ratingLabel} />
      </div>

      {/* Оригинал отзыва: на RU-странице он остаётся украинским, поэтому явный lang. */}
      <blockquote
        lang={review.lang}
        className={`mt-3 flex-1 text-body text-ink ${long ? 'line-clamp-6' : ''}`}
      >
        {review.quote}
      </blockquote>

      {long && (
        <button
          type="button"
          onClick={() => onOpen(review)}
          className="mt-3 inline-flex min-h-10 items-center self-start text-small font-semibold text-accent transition-colors duration-hover hover:text-accent-hover"
        >
          {labels.readMore}
        </button>
      )}
    </article>
  );
}

/** Последняя карточка ленты: единственный переход на все отзывы в Google Maps. */
function MoreCard({ labels, mapUrl }: { labels: Labels; mapUrl: string }) {
  return (
    <article className="flex h-full flex-col justify-between gap-6 rounded-3xl bg-accent p-5 text-surface md:p-6">
      <div>
        <span
          aria-hidden
          className="inline-flex items-center gap-2 rounded-full bg-surface/15 px-3 py-1.5 text-label font-semibold uppercase"
        >
          <FaMapMarkerAlt size={12} />
          Google Maps
        </span>
        <p className="mt-5 font-display text-h3 font-bold text-balance">{labels.moreTitle}</p>
      </div>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-surface px-6 text-small font-semibold text-accent transition-colors duration-hover hover:bg-accent-soft"
      >
        <FaMapMarkerAlt aria-hidden size={14} />
        {labels.moreButton}
      </a>
    </article>
  );
}

/* ─────────────────────────── Dialog ─────────────────────────── */

/**
 * Полный текст отзыва. Портал в <body>: у предков ленты есть transform (анимация карточек),
 * а он превращает `position: fixed` в позиционирование относительно предка.
 * Закрытие: Esc, клик по фону, крестик. Скролл страницы блокируется, фокус возвращается на кнопку.
 */
function ReviewDialog({
  review,
  labels,
  mapUrl,
  onClose,
}: {
  review: ResolvedReview;
  labels: Labels;
  mapUrl: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      const first = focusable?.[0];
      const last = focusable?.[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={review.author}
      onClick={onClose}
      className="lightbox fixed inset-0 z-60 flex items-center justify-center bg-ink/60 p-4"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="enter relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-surface p-6 shadow-float md:p-8"
      >
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label={labels.closeDialog}
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-ink transition-colors duration-hover hover:bg-paper hover:text-accent"
        >
          <HiXMark aria-hidden size={22} />
        </button>

        <header className="flex items-center gap-3 pr-10">
          <Avatar initial={review.initial} />
          <div className="min-w-0">
            <p className="font-display text-body font-semibold text-ink">{review.author}</p>
            {review.date && <p className="text-label uppercase text-ink-muted">{review.date}</p>}
          </div>
        </header>

        <div className="mt-4">
          <Stars rating={review.rating} label={labels.ratingLabel} />
        </div>

        <blockquote lang={review.lang} className="mt-4 text-body text-ink">
          {review.quote}
        </blockquote>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-accent px-6 text-small font-semibold text-surface transition-colors duration-hover hover:bg-accent-hover sm:inline-flex"
        >
          <FaMapMarkerAlt aria-hidden size={14} />
          {labels.moreButton}
        </a>
      </div>
    </div>,
    document.body,
  );
}
