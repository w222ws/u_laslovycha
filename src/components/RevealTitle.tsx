'use client';

import { m } from 'motion/react';
import { EASE_QUIET } from '@/lib/heroTiming';

/**
 * Заголовок раздела: слова выезжают снизу из своих «масок» с каскадом, когда заголовок попал в экран.
 * Тег остаётся обычным h2 с цельной фразой в DOM (слова разделены обычными пробелами) — для SEO и скринридеров.
 */
export function RevealTitle({ text, id, className }: { text: string; id: string; className: string }) {
  const words = text.split(' ');
  return (
    <m.h2
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -4% 0px' }}
      transition={{ staggerChildren: 0.05 }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <m.span
              className="inline-block will-change-transform"
              variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
              transition={{ duration: 0.5, ease: EASE_QUIET }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </m.h2>
  );
}
