'use client';

import { useRef, useState, type KeyboardEvent, type CSSProperties } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { contactLinks } from '@/content/hotel';

type Item = { stop: string; q: string; a: string; action: string };
type Props = { items: Item[]; brand: string; selectHint: string; mapLabel: string };

/**
 * Интерактивный «маршрут». Слева/сверху — вертикальная тропа с 5 крупными цифрами-узлами, справа/снизу —
 * карточка-ответ, которая въезжает при каждой смене остановки (key → remount → `.faq-answer-in` keyframes).
 * ARIA-tabs: стрелки, Home/End переключают узлы. Весь motion — CSS, в DOM один ответ за раз.
 */
export function FaqTrail({ items, brand, selectHint, mapLabel }: Props) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLElement>(null);
  const current = items[active];

  const select = (index: number) => {
    setActive(index);
    // На узких экранах ответ находится ниже тропы — прокручиваем к нему, чтобы было понятно, что ответ сменился.
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    const last = items.length - 1;
    let next: number;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = active === last ? 0 : active + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = active === 0 ? last : active - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  if (!current) return null;

  return (
    <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
      <ol
        role="tablist"
        aria-orientation="vertical"
        aria-label={selectHint}
        onKeyDown={onKeyDown}
        className="relative lg:col-span-5"
      >
        {items.map((item, i) => {
          const selected = i === active;
          const num = String(i + 1).padStart(2, '0');
          return (
            <li key={item.stop} className="relative pb-6 pl-14 last:pb-0 md:pl-20">
              {/* Пунктирная тропа между узлами. */}
              {i < items.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-11 bottom-0 left-5 w-px border-l border-dashed border-surface/25 md:top-15 md:left-7"
                />
              )}

              <button
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`faq-tab-${i}`}
                aria-selected={selected}
                aria-controls="faq-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className="group flex w-full items-start gap-5 text-left"
              >
                {/* Кружок-узел с цифрой + пульсирующее кольцо вокруг активного. */}
                <span
                  aria-hidden
                  className={`absolute top-0 left-0 grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-hover md:size-14 ${
                    selected
                      ? 'scale-110 border-accent bg-accent text-surface'
                      : 'border-surface/30 bg-ink text-surface/70 group-hover:border-surface'
                  }`}
                >
                  <span className="font-display text-small font-bold md:text-body">{num}</span>
                  {selected && (
                    <span className="trail-pulse pointer-events-none absolute inset-0 rounded-full border border-accent" />
                  )}
                </span>

                <div className="min-w-0 flex-1 pt-1 md:pt-3">
                  <p
                    className={`text-label uppercase transition-colors duration-hover ${
                      selected ? 'text-accent-soft' : 'text-surface/45 group-hover:text-accent-soft'
                    }`}
                  >
                    {item.stop}
                  </p>
                  <p
                    className={`mt-1 font-display text-small font-semibold text-balance transition-colors duration-hover md:text-body ${
                      selected ? 'text-surface' : 'text-surface/55 group-hover:text-surface'
                    }`}
                  >
                    {item.q}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Карточка-ответ. На lg+ — sticky, чтобы не прыгала при смене узлов. */}
      <article
        ref={panelRef}
        key={current.stop}
        role="tabpanel"
        id="faq-panel"
        aria-labelledby={`faq-tab-${active}`}
        className="faq-answer-in mt-8 overflow-hidden rounded-3xl bg-accent p-6 text-surface shadow-float lg:col-span-7 lg:mt-0 lg:sticky lg:top-28 md:p-8"
        style={{ ['--d' as string]: '0ms' } as CSSProperties}
      >
        <p className="flex items-center gap-2 text-label uppercase text-surface/65">
          <RidgeMark />
          {brand}
        </p>
        <p className="mt-3 font-display text-h3 font-bold text-surface text-balance">{current.q}</p>
        <p className="mt-4 text-body text-surface">{current.a}</p>

        {current.action === 'map' && (
          <div className="mt-6">
            <a
              href={contactLinks.map}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 text-small font-semibold text-accent transition-colors duration-hover hover:bg-accent-soft"
            >
              <FaMapMarkerAlt aria-hidden size={14} />
              {mapLabel}
            </a>
          </div>
        )}
      </article>
    </div>
  );
}

/** Миниатюрная линия хребта — подпись бренда в карточке, та же что в логотипе. */
function RidgeMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 10"
      className="h-2 w-10 text-surface/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 8 L12 3 L22 6 L34 2 L48 7 L60 3 L74 6 L80 4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
