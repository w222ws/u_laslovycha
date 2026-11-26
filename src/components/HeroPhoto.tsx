'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

/**
 * Фото в одном чистом скруглённом контейнере с мягкой тенью. Вход один и спокойный: контейнер проявляется
 * только по opacity — без сдвига и масштаба, поэтому кадр не дёргается. При скролле фото неподвижно.
 * Серверный <Photo> лежит в children — HTML и alt остаются в DOM для SEO.
 */
export function HeroPhoto({ children, className }: { children: ReactNode; className: string }) {
  const ready = useHeroReady();

  return (
    <m.div
      className={`overflow-hidden rounded-3xl bg-paper-deep shadow-float ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.7, ease: EASE_QUIET }}
    >
      <div className="absolute inset-0">{children}</div>
    </m.div>
  );
}
