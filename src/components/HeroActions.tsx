'use client';

import { m } from 'motion/react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

type Link = { label: string; href: string };

/**
 * Две кнопки под фото, на уровне большого пальца. Одна высота, один радиус, чёткая иерархия:
 * основная — сплошной акцент с белым текстом и стрелкой, которая сдвигается при наведении;
 * вторичная — прозрачная с тонкой графитовой рамкой, при наведении заливается белым.
 * Вход: последними, снизу (opacity + y). Hover/active — только transform и цвет.
 */
export function HeroActions({ primary, secondary }: { primary: Link; secondary: Link }) {
  const ready = useHeroReady();

  return (
    <m.div
      className="grid grid-cols-2 gap-3"
      initial={{ opacity: 0, y: 18 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.65, delay: 1.0, ease: EASE_QUIET }}
    >
      <a
        href={primary.href}
        className="inline-flex h-13 items-center justify-center rounded-2xl bg-accent px-5 text-small font-semibold text-surface transition-[background-color,transform] duration-300 hover:bg-accent-hover active:scale-[0.98]"
      >
        {primary.label}
      </a>
      <a
        href={secondary.href}
        className="inline-flex h-13 items-center justify-center rounded-2xl border border-ink/20 px-5 text-small font-semibold text-ink transition-[background-color,border-color,transform] duration-300 hover:border-ink hover:bg-surface active:scale-[0.98]"
      >
        {secondary.label}
      </a>
    </m.div>
  );
}
