'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode };

/**
 * Прозрачная шапка сверху страницы. При скролле получает сплошной светлый фон и границу.
 * Тонкая акцентная полоса внизу — прогресс прокрутки страницы (requestAnimationFrame, без JS в кадре).
 */
export function SiteHeader({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(window.scrollY / total, 0), 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      // isolate — свой stacking context: что бы ни рисовали секции ниже, хедер остаётся сверху.
      // bg-paper без прозрачности и без backdrop-blur: на тёмной полосе #rooms прозрачный размытый
      // слой давал «мутный» хедер и на iOS Safari иногда переставал перехватывать клики.
      className="fixed inset-x-0 top-0 z-50 isolate border-b border-transparent transition-colors duration-hover data-[scrolled=true]:border-line data-[scrolled=true]:bg-paper"
    >
      {children}
      {/* Прогресс прокрутки: при scrollY=0 scaleX=0 — линия не видна; дальше растёт плавно. */}
      <span
        ref={barRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
        style={{ transform: 'scaleX(0)' }}
      />
    </header>
  );
}
