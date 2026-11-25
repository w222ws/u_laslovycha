'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import type { ResolvedRoomType } from '@/content/rooms';
import type { Messages } from '@/lib/i18n';
import { Reveal } from './Reveal';
import { RoomPanel } from './RoomPanel';

type Props = { types: ResolvedRoomType[]; labels: Messages['rooms'] };

/**
 * Мастер-детейл: вкладки + одна активная карточка. Переключение обычное (opacity), без свайп-ленты и snap —
 * на телефоне это убирает лаги. Все панели в одной ячейке сетки, поэтому высота раздела не «гуляет».
 */
export function RoomsTabs({ types, labels }: Props) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = types[active];

  const select = (index: number) => setActive(index);

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
      <Reveal delay={0.1} from="left" className="lg:sticky lg:top-28 lg:col-span-4">
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
        {/* Все панели в одной ячейке сетки: высота равна самой высокой, раздел не «гуляет». Переключение обычное —
            без горизонтального скролла и snap: неактивные скрыты (invisible + inert), активная проявляется. */}
        <div className="grid">
          {types.map((type, i) => {
            const selected = i === active;
            return (
              <div
                key={type.id}
                role="tabpanel"
                id={`rooms-panel-${type.id}`}
                aria-labelledby={`rooms-tab-${type.id}`}
                aria-hidden={!selected}
                inert={!selected}
                className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                  selected ? 'opacity-100' : 'invisible opacity-0'
                }`}
              >
                <RoomPanel type={type} labels={labels} />
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
