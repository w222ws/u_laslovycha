'use client';

import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

type Props = { labels: string[]; hint: string };

// Зубчатый круг («солнце»): радиусы чередуются, скруглённый join даёт мягкие зубцы.
function scallop(cx: number, cy: number, teeth: number, rOut: number, rIn: number): string {
  const parts: string[] = [];
  for (let k = 0; k < teeth * 2; k++) {
    const r = k % 2 === 0 ? rOut : rIn;
    const angle = (k / (teeth * 2)) * Math.PI * 2 - Math.PI / 2;
    parts.push(`${k === 0 ? 'M' : 'L'}${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `${parts.join(' ')} Z`;
}

// Все формы нарисованы в одной рамке 160×120. `inset` — «безопасная зона» под подпись внутри формы.
// Порядок совпадает с порядком подписей в messages: хозяева, кухня, подача, номера, санузел, вокзал.
// Цвета — только токены проекта. Длинные слова стоят в широких формах (дом, флаг, облако).
const SHAPES: {
  path: string;
  fill: string;
  text: string;
  inset: CSSProperties;
  cap?: string;
}[] = [
  {
    // Хата
    path: 'M80 12 L146 56 V106 H14 V56 Z',
    fill: 'text-accent',
    text: 'text-surface',
    inset: { left: '15%', right: '15%', top: '48%', bottom: '12%' },
  },
  {
    // Солнце
    path: scallop(80, 60, 14, 54, 47),
    fill: 'text-accent-soft',
    text: 'text-accent',
    inset: { left: '24%', right: '24%', top: '30%', bottom: '30%' },
  },
  {
    // Прапорец
    path: 'M14 16 H146 L126 60 L146 104 H14 Z',
    fill: 'text-surface',
    text: 'text-ink',
    inset: { left: '11%', right: '22%', top: '20%', bottom: '20%' },
  },
  {
    // Облако
    path: 'M40 100 A22 22 0 0 1 36 56 A28 28 0 0 1 86 40 A24 24 0 0 1 128 58 A20 20 0 0 1 124 100 Z',
    fill: 'text-surface',
    text: 'text-ink',
    inset: { left: '20%', right: '18%', top: '36%', bottom: '24%' },
  },
  {
    // Капля
    path: 'M80 8 C80 8 30 52 30 80 C30 104 52 114 80 114 C108 114 130 104 130 80 C130 52 80 8 80 8 Z',
    fill: 'text-accent-soft',
    text: 'text-accent',
    inset: { left: '27%', right: '27%', top: '48%', bottom: '14%' },
  },
  {
    // Гора со снежной шапкой
    path: 'M10 108 L54 30 L78 70 L100 42 L150 108 Z',
    cap: 'M54 30 L41 53 L49 49 L55 57 L63 49 L68 54 Z',
    fill: 'text-accent',
    text: 'text-surface',
    inset: { left: '22%', right: '22%', top: '58%', bottom: '8%' },
  },
];

// Стартовая раскладка в процентах доски: [x, y] для телефона (2 колонки) и для md+ (3 колонки, коллаж).
const MOBILE: [number, number][] = [[3, 2], [54, 6], [6, 35], [52, 38], [2, 68], [50, 70]];
const WIDE: [number, number][] = [[3, 8], [35, 3], [67, 12], [10, 54], [42, 58], [70, 50]];
const ROTATION = [-5, 4, -3, 6, -6, 3];

const KEY_STEP = 16;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function readOffset(el: HTMLElement) {
  return {
    x: parseFloat(el.style.getPropertyValue('--tx')) || 0,
    y: parseFloat(el.style.getPropertyValue('--ty')) || 0,
  };
}

/** Смещает наклейку, не выпуская её за доску. Базовая позиция (left/top) от transform не зависит. */
function place(el: HTMLElement, x: number, y: number) {
  const board = el.offsetParent as HTMLElement | null;
  let nx = x;
  let ny = y;
  if (board) {
    nx = clamp(x, -el.offsetLeft, board.clientWidth - el.offsetLeft - el.offsetWidth);
    ny = clamp(y, -el.offsetTop, board.clientHeight - el.offsetTop - el.offsetHeight);
  }
  el.style.setProperty('--tx', `${nx}px`);
  el.style.setProperty('--ty', `${ny}px`);
  return { x: nx, y: ny };
}

/**
 * Доска с наклейками-впечатлениями гостей. Их можно «отлепить» и перетащить мышью, пальцем или стрелками
 * внутри доски. Позиции хранятся прямо в CSS-переменных элементов (--tx/--ty), поэтому во время жеста
 * React не перерисовывается, а движение идёт на компоновщике (transform).
 */
export function ReviewStickers({ labels, hint }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topZ = useRef(10);
  const drag = useRef<{
    el: HTMLDivElement;
    id: number;
    x0: number;
    y0: number;
    tx0: number;
    ty0: number;
  } | null>(null);
  const hintId = useId();

  // Когда доска впервые появляется в экране — наклейки разок покачиваются; при ресайзе подтягиваем их внутрь.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          board.dataset.in = 'true';
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(board);

    const ro = new ResizeObserver(() => {
      for (const el of itemRefs.current) {
        if (!el) continue;
        const { x, y } = readOffset(el);
        place(el, x, y);
      }
    });
    ro.observe(board);

    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const { x, y } = readOffset(el);
    drag.current = { el, id: e.pointerId, x0: e.clientX, y0: e.clientY, tx0: x, ty0: y };
    el.dataset.lifted = 'true';
    topZ.current += 1;
    el.style.zIndex = String(topZ.current);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    place(d.el, d.tx0 + e.clientX - d.x0, d.ty0 + e.clientY - d.y0);
  };

  // Отпускаем: наклейка «приклеивается» с чуть другим наклоном, как будто её прижали рукой.
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    d.el.dataset.lifted = 'false';
    const base = Number(d.el.dataset.rot) || 0;
    d.el.style.setProperty('--rot', `${base + (Math.random() * 6 - 3)}deg`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = delta[e.key];
    if (!move) return;
    e.preventDefault();
    const el = e.currentTarget;
    const { x, y } = readOffset(el);
    place(el, x + move[0], y + move[1]);
    topZ.current += 1;
    el.style.zIndex = String(topZ.current);
  };

  return (
    <div
      ref={boardRef}
      className="sticker-board relative isolate h-80 rounded-3xl border border-line bg-paper-deep/60 md:h-64 lg:h-72"
    >
      <p id={hintId} className="sr-only">
        {hint}
      </p>

      {labels.map((label, i) => {
        const shape = SHAPES[i % SHAPES.length];
        const mobile = MOBILE[i % MOBILE.length];
        const wide = WIDE[i % WIDE.length];
        const rotation = ROTATION[i % ROTATION.length];
        if (!shape || !mobile || !wide || rotation === undefined) return null;

        return (
          <div
            key={label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            role="group"
            aria-label={label}
            aria-describedby={hintId}
            tabIndex={0}
            data-rot={rotation}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onKeyDown={onKeyDown}
            className="sticker absolute top-(--my) left-(--mx) w-32 md:top-(--wy) md:left-(--wx) md:w-36 lg:w-40"
            style={
              {
                '--mx': `${mobile[0]}%`,
                '--my': `${mobile[1]}%`,
                '--wx': `${wide[0]}%`,
                '--wy': `${wide[1]}%`,
                '--rot': `${rotation}deg`,
                '--d': `${i * 90}ms`,
              } as CSSProperties
            }
          >
            <div className="sticker-body relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 160 120"
                className={`block w-full ${shape.fill}`}
              >
                <path
                  d={shape.path}
                  fill="currentColor"
                  stroke="var(--color-surface)"
                  strokeWidth="7"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                />
                {shape.cap && <path d={shape.cap} fill="var(--color-surface)" opacity="0.9" />}
              </svg>
              <span
                className={`absolute flex items-center justify-center text-center font-display text-small leading-tight font-semibold text-balance ${shape.text}`}
                style={shape.inset}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
