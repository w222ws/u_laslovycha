'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_QUIET } from '@/lib/heroTiming';

type From = 'up' | 'left' | 'right';

const OFFSET: Record<From, { x: number; y: number }> = {
  up: { x: 0, y: 26 },
  left: { x: -28, y: 10 },
  right: { x: 28, y: 10 },
};

/**
 * Появление блока при первом попадании в экран: opacity + сдвиг (снизу или сбоку) + едва заметный scale, один раз.
 * Без состояния React (никаких лишних рендеров): whileInView из motion, только transform/opacity.
 * Нужен MotionRoot выше по дереву. Весь контент лежит в DOM; без JS показывает noscript-страховка в layout.
 */
export function Reveal({
  children,
  delay = 0,
  from = 'up',
  className,
}: {
  children: ReactNode;
  delay?: number;
  from?: From;
  className?: string;
}) {
  const o = OFFSET[from];
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, x: o.x, y: o.y, scale: 0.985 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE_QUIET }}
    >
      {children}
    </m.div>
  );
}
