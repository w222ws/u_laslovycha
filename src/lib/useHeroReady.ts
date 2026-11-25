'use client';

import { useEffect, useState } from 'react';

/**
 * Хук «можно играть анимации Hero». Слушает событие `hero:ready`, которое отправит прелоадер,
 * когда шрифты, картинка хиро и DOM готовы. Fallback 2.5с — чтобы анимации никогда не зависли,
 * даже если кто-то картинку из DOM вынет.
 */
export function useHeroReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.documentElement.classList.contains('hero-ready')) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    window.addEventListener('hero:ready', onReady, { once: true });
    const fallback = window.setTimeout(() => setReady(true), 2500);
    return () => {
      window.removeEventListener('hero:ready', onReady);
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}
