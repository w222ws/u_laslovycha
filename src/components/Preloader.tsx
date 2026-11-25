'use client';

import { useEffect, useState } from 'react';
import { hotel } from '@/content/hotel';

/**
 * Загрузка: светлый фон (bg-paper), знак бренда и тонкий горный хребет, который прорисовывается акцентом.
 * Уходит, когда страница реально готова (шрифты, картинка хиро), минимум 650мс для видимой драматургии,
 * максимум 1.6с (fallback). Отправляет `hero:ready` — анимации хиро ждут этот сигнал.
 * При reduced-motion оверлей не показывается, сигнал отправляется сразу.
 */
export function Preloader() {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let done = false;

    const notify = () => {
      document.documentElement.classList.add('hero-ready');
      window.dispatchEvent(new Event('hero:ready'));
    };

    if (reduced) {
      notify();
      setLeaving(true);
      return;
    }

    const finish = () => {
      if (done) return;
      done = true;
      notify();
      setLeaving(true);
    };

    const waits: Promise<unknown>[] = [];
    if (document.fonts?.ready) waits.push(document.fonts.ready.catch(() => null));
    if (document.readyState !== 'complete') {
      waits.push(new Promise((r) => window.addEventListener('load', () => r(null), { once: true })));
    }
    // Если фото хиро есть в DOM — ждём его декодирования.
    const heroImg = document.querySelector<HTMLImageElement>(`img[src="${hotel.heroPhoto}"]`);
    if (heroImg && !heroImg.complete) {
      waits.push(
        new Promise((r) => {
          heroImg.addEventListener('load', () => r(null), { once: true });
          heroImg.addEventListener('error', () => r(null), { once: true });
        }),
      );
    }
    // Минимум 650мс, чтобы хребет успел прорисоваться.
    const minWait = new Promise((r) => window.setTimeout(r, 650));
    const fallback = window.setTimeout(finish, 1600);

    Promise.all([Promise.all(waits), minWait]).then(() => {
      window.clearTimeout(fallback);
      finish();
    });

    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div
      aria-hidden="true"
      data-leaving={leaving}
      className="preloader fixed inset-0 z-70 grid place-items-center bg-paper"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="preloader-word font-display text-h3 font-bold tracking-tight text-ink">
          {hotel.name}
        </span>
        <svg
          viewBox="0 0 160 24"
          className="h-4 w-40 text-accent"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="preloader-ridge"
            d="M2 20 L22 10 L36 16 L54 4 L72 15 L92 6 L114 15 L134 7 L158 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
