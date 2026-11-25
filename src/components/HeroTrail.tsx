'use client';

import { m, useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

/**
 * Фон хиро в духе топокарты: тонкие изогипсы и закрученные пунктирные тропы с развилкой.
 * Тропа «рисуется»: сплошная маска-линия (pathLength 0 → 1) открывает пунктир под ней, так штрихи не искажаются.
 * Полностью декоративно: aria-hidden, под контентом, без событий мыши. Две раскладки — под телефон и под десктоп.
 * Старт после сигнала `hero:ready`; при reduced-motion тропа сразу целиком.
 */

type Draw = { d: string; delay: number; duration: number; className: string; dash?: string };

function DashedDraw({ d, delay, duration, className, dash = '3 9', vw, vh }: Draw & { vw: number; vh: number }) {
  const ready = useHeroReady();
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const maskId = `trail-${id}`;

  return (
    <>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={vw} height={vh}>
        <m.path
          d={d}
          fill="none"
          stroke="white"
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: ready || reduce ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE_QUIET }}
        />
      </mask>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray={dash}
        mask={`url(#${maskId})`}
        className={className}
      />
    </>
  );
}

/** Остановка на тропе: кружок-«станция» в духе узлов FAQ-тропы. Появляется после того, как тропа дорисована. */
function Stop({ cx, cy, r, filled = false, delay }: { cx: number; cy: number; r: number; filled?: boolean; delay: number }) {
  const ready = useHeroReady();
  const reduce = useReducedMotion();
  const show = ready || reduce;
  return (
    <m.g
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.4 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: EASE_QUIET }}
    >
      {filled ? (
        <circle cx={cx} cy={cy} r={r} fill="var(--color-accent)" />
      ) : (
        <>
          <circle cx={cx} cy={cy} r={r} fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.8" />
          <circle cx={cx} cy={cy} r={r / 3} fill="var(--color-accent)" />
        </>
      )}
    </m.g>
  );
}

function Contours({ paths }: { paths: string[] }) {
  return (
    <g stroke="var(--color-line)" strokeWidth="1" fill="none" opacity="0.8">
      {paths.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}

export function HeroTrail() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Десктоп: тропы огибают текст — идут вдоль верхнего и нижнего краёв и уходят под фото. Каждая со своей формой. */}
      <svg
        className="hidden size-full lg:block"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Contours
          paths={[
            'M -20 36 Q 300 -10 620 50 T 1240 30',
            'M -20 775 Q 300 740 620 790 T 1240 765',
          ]}
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -40 215 C 180 175 330 235 520 195 S 790 150 950 215 S 1120 240 1260 180"
          delay={0.3}
          duration={2.6}
          dash="8 9"
          className="text-ink/40"
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -40 170 C 160 200 340 140 560 165 S 830 195 1000 130 S 1180 95 1260 110"
          delay={0.7}
          duration={2.4}
          dash="2 10"
          className="text-accent/55"
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -40 700 C 160 660 310 710 470 675 S 710 650 870 560 S 1100 440 1260 400"
          delay={0.2}
          duration={3}
          dash="8 9"
          className="text-ink/45"
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -40 740 C 130 715 230 750 390 722 S 650 745 830 690 S 1050 590 1260 580"
          delay={0.6}
          duration={3}
          dash="2 10"
          className="text-accent/55"
        />
        <Stop cx={520} cy={195} r={9} delay={2.4} />
        <Stop cx={560} cy={165} r={5} filled delay={2.6} />
        <Stop cx={470} cy={675} r={9} delay={2.8} />
        <Stop cx={390} cy={722} r={5} filled delay={3} />
      </svg>

      {/* Телефон и планшет. */}
      <svg
        className="size-full lg:hidden"
        viewBox="0 0 420 780"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Contours
          paths={[
            'M -10 130 Q 110 110 220 140 T 430 125',
            'M -10 185 Q 130 160 240 195 T 430 180',
            'M -10 580 Q 120 560 230 595 T 430 580',
            'M -10 640 Q 130 615 250 650 T 430 640',
          ]}
        />
        <DashedDraw
          vw={420}
          vh={780}
          d="M 440 60 C 340 140 420 260 300 320 S 120 430 190 520 S 340 650 -20 760"
          delay={0.2}
          duration={2.4}
          className="text-ink/30"
        />
        <DashedDraw
          vw={420}
          vh={780}
          d="M 300 320 C 360 360 400 400 440 425"
          delay={1.2}
          duration={0.9}
          className="text-ink/25"
        />
        <DashedDraw
          vw={420}
          vh={780}
          d="M -10 110 C 60 60 160 70 200 120 S 140 200 60 190"
          delay={0.5}
          duration={1.8}
          dash="2 10"
          className="text-accent/40"
        />
      </svg>
    </div>
  );
}
