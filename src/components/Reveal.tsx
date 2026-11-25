'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_QUIET } from '@/lib/heroTiming';

type From = 'up' | 'left' | 'right';

const OFFSET: Record<From, { x: number; y: number }> = {
  up: { x: 0, y: 18 },
  left: { x: -18, y: 6 },
  right: { x: 18, y: 6 },
};

/**
 * Появление блока при первом попадании в экран: opacity + короткий сдвиг (снизу или сбоку), один раз.
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
      initial={{ opacity: 0, x: o.x, y: o.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -4% 0px' }}
      transition={{ duration: 0.5, delay: delay * 0.6, ease: EASE_QUIET }}
    >
      {children}
    </m.div>
  );
}
