'use client';

import { m } from 'motion/react';
import { EASE_QUIET } from '@/lib/heroTiming';
import { useHeroReady } from '@/lib/useHeroReady';

type Props = { title: string; subtitle: string };

/**
 * Заголовок и подзаголовок. Заголовок собирается по словам: каждое слово выезжает снизу из своей «маски»
 * (overflow-hidden), с каскадом. Только transform; анимации стартуют после сигнала `hero:ready`.
 * Весь текст лежит в h1 целиком — для скринридеров и поисковиков слова читаются как обычная фраза.
 */
export function HeroText({ title, subtitle }: Props) {
  const ready = useHeroReady();
  const words = title.split(' ');

  return (
    <>
      <h1
        id="hero-title"
        className="font-display text-h1 font-bold tracking-tight text-ink text-balance"
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <m.span
                className="inline-block will-change-transform"
                initial={{ y: '110%' }}
                animate={{ y: ready ? '0%' : '110%' }}
                transition={{ duration: 0.75, delay: 0.25 + i * 0.09, ease: EASE_QUIET }}
              >
                {word}
              </m.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h1>
      <m.p
        className="mt-4 max-w-measure text-body-lg text-ink-muted"
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.65, delay: 0.55, ease: EASE_QUIET }}
      >
        {subtitle}
      </m.p>
    </>
  );
}
