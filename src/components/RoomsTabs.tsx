'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { ResolvedRoomType } from '@/content/rooms';
import type { Messages } from '@/lib/i18n';
import { Reveal } from './Reveal';
import { RoomPanel } from './RoomPanel';

type Props = { types: ResolvedRoomType[]; labels: Messages['rooms'] };

/**
 * Мастер-детейл.
 *   Мобилка: горизонтальный трек с тремя панелями, нативный scroll-snap — палец тянет карточку
 *            за собой, инерцию считает компоновщик браузера. Активная вкладка синхронизируется
 *            через IntersectionObserver. Кнопки-табы остаются рабочими и «прыгают» к нужной карточке.
 *   Десктоп: слева вертикальный список вкладок, справа одна активная карточка; смена через `.enter`
 *            (key на обёртке → remount → `transform` + `opacity` без тяжёлых либ).
 */
export function RoomsTabs({ types, labels }: Props) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  // Флаг мобильного режима: IO активен только пока трек — горизонтальный скроллер.
  const [isMobile, setIsMobile] = useState(false);
  const current = types[active];

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Мобилка: активная вкладка обновляется, когда панель заняла больше 60% трека.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isMobile) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < 0.6) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { root: track, threshold: [0, 0.6, 1] },
    );
    for (const child of Array.from(track.children)) io.observe(child);
    return () => io.disconnect();
  }, [isMobile, types.length]);

  const select = (index: number) => {
    setActive(index);
    const track = trackRef.current;
    if (!track) return;
    const panel = track.children[index] as HTMLElement | undefined;
    if (!panel) return;
    // Прокручиваем только если трек реально горизонтальный скроллер (мобилка).
    if (track.scrollWidth <= track.clientWidth) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({
      left: panel.offsetLeft - track.offsetLeft,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = types.length - 1;
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
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
      <Reveal delay={0.1} from="left" className="lg:col-span-4">
      <div
        role="tablist"
        aria-label={labels.tabsLabel}
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:gap-3"
      >
        {types.map((type, i) => {
          const selected = i === active;
          return (
            <button
              key={type.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`rooms-tab-${type.id}`}
              aria-selected={selected}
              aria-controls={`rooms-panel-${type.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={`relative flex min-h-16 flex-col items-start gap-1 rounded-2xl border px-3 py-3 text-left transition-colors duration-hover lg:min-h-0 lg:flex-row lg:items-baseline lg:gap-5 lg:px-6 lg:py-5 ${
                selected
                  ? 'border-accent bg-accent text-surface'
                  : 'border-surface/15 bg-transparent text-surface hover:border-surface/40 hover:bg-surface/5'
              }`}
            >
              <span
                className={`relative font-display text-small font-bold transition-colors duration-hover lg:text-h3 ${
                  selected ? 'text-accent-soft' : 'text-surface/50'
                }`}
              >
                {type.number}
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-display text-small font-semibold lg:hidden">
                  {type.tabShort}
                </span>
                <span className="hidden font-display text-body font-semibold lg:inline">
                  {type.tabFull}
                </span>
                <span
                  className={`hidden text-label uppercase lg:inline ${
                    selected ? 'text-surface/70' : 'text-surface/60'
                  }`}
                >
                  {type.capacity}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      </Reveal>

      <Reveal delay={0.2} from="right" className="lg:col-span-8">
        {/* Мобилка: три панели на одной горизонтали, нативный scroll-snap. */}
        <div
          ref={trackRef}
          className="snap-track -mx-5 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth md:-mx-8 lg:hidden"
        >
          {types.map((type, i) => (
            <div
              key={type.id}
              data-index={i}
              role="tabpanel"
              id={`rooms-panel-${type.id}`}
              aria-labelledby={`rooms-tab-${type.id}`}
              aria-hidden={i !== active}
              className="w-full shrink-0 snap-start px-5 md:px-8"
            >
              <RoomPanel type={type} labels={labels} />
            </div>
          ))}
        </div>

        {/* Десктоп: одна активная карточка с мягким появлением на смене вкладки. */}
        <div
          key={current.id}
          role="tabpanel"
          id={`rooms-panel-${current.id}-desktop`}
          aria-labelledby={`rooms-tab-${current.id}`}
          className="enter hidden lg:block"
        >
          <RoomPanel type={current} labels={labels} />
        </div>
      </Reveal>
    </div>
  );
}
