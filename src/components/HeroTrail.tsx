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
      {/* Десктоп. */}
      <svg
        className="hidden size-full lg:block"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Contours
          paths={[
            'M -20 150 Q 220 110 420 160 T 820 140 T 1240 170',
            'M -20 220 Q 240 180 460 235 T 860 210 T 1240 240',
            'M -20 600 Q 200 560 420 610 T 820 590 T 1240 620',
            'M -20 680 Q 220 640 440 690 T 840 670 T 1240 700',
          ]}
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -20 700 C 200 630 280 770 470 690 S 760 520 900 565 S 1120 380 1240 300"
          delay={0.2}
          duration={2.4}
          className="text-ink/30"
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M 470 690 C 560 765 700 775 830 725"
          delay={1.1}
          duration={1.2}
          className="text-ink/25"
        />
        <DashedDraw
          vw={1200}
          vh={800}
          d="M -20 140 C 160 90 300 210 470 150 S 700 70 830 120"
          delay={0.5}
          duration={2.2}
          dash="2 10"
          className="text-accent/40"
        />
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
