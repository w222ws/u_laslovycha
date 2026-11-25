'use client';

import { m } from 'motion/react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

type Fact = { title: string; text: string };

/**
 * Три плюса в самом тихом виде: просто текст в три колонки, без рамок, иконок и линий.
 * Вход — мягкий каскад (opacity + y). На телефоне подпись скрыта, остаются заголовки.
 */
export function HeroFacts({ facts }: { facts: Fact[] }) {
  const ready = useHeroReady();

  return (
    <ul className="grid grid-cols-3 divide-x divide-line">
      {facts.map((fact, i) => (
        <m.li
          key={fact.title}
          className="px-3 first:pl-0 last:pr-0 sm:px-5"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: 1.0 + i * 0.1, ease: EASE_QUIET }}
        >
          <p className="font-display text-small leading-snug font-semibold text-ink">{fact.title}</p>
          <p className="mt-1 hidden text-small leading-snug text-ink-muted sm:block">{fact.text}</p>
        </m.li>
      ))}
    </ul>
  );
}
