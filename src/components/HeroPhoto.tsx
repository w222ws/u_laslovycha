'use client';

import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

/**
 * Фото в одном чистом скруглённом контейнере с мягкой тенью. Вход спокойный: контейнер проявляется (opacity + y),
 * кадр внутри медленно «оседает» (scale 1.08 → 1.03) только при входе. При скролле фото неподвижно.
 * Только transform/opacity. Серверный <Photo> лежит в children — HTML и alt остаются в DOM для SEO.
 */
export function HeroPhoto({ children, className }: { children: ReactNode; className: string }) {
  const ready = useHeroReady();

  return (
    <m.div
      className={`overflow-hidden rounded-3xl bg-paper-deep shadow-float will-change-transform ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.85, delay: 0.1, ease: EASE_QUIET }}
    >
      <m.div
        className="absolute inset-0 will-change-transform"
        initial={{ scale: 1.08 }}
        animate={{ scale: ready ? 1.03 : 1.08 }}
        transition={{ duration: 1.6, delay: 0.1, ease: EASE_QUIET }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
