'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

type Props = {
  labels: { open: string; close: string; title: string };
  children: ReactNode;
};

// Шейп и габариты один-в-один с LangToggle: 44px (тач-цель), rounded-full border-line bg-surface/80.
// z-30 выше оверлея (z-20) в контексте шапки — крестик всегда виден и кликабелен.
const btnBase =
  'burger relative z-30 inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface/80 text-ink transition-colors duration-hover hover:border-accent hover:text-accent';

/**
 * Остров: кнопка-бургер в шапке + полноэкранный оверлей (без native <dialog>, чтобы
 * бургер физически оставался на месте, а две полоски плавно трансформировались в крестик).
 * Z-index: шапка выше оверлея, поэтому кнопка видна и кликабельна в обоих состояниях.
 */
export function MenuDialog({ labels, children }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  // Esc закрывает меню + блокировка скролла страницы под оверлеем.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    // На десктопе бургер скрыт — оверлей не должен остаться открытым после ресайза.
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onMq);
    window.addEventListener('keydown', onKey);
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  // Клик по якорной ссылке внутри меню — закрываем.
  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    // Сначала снимаем блокировку скролла, потом едем к якорю — иначе скролл под overflow:hidden глохнет.
    e.preventDefault();
    const hash = link.getAttribute('href') ?? '';
    close();
    requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      history.replaceState(null, '', hash);
    });
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        data-open={open}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        className={btnBase}
      >
        <span aria-hidden className="burger-icon">
          <span className="burger-line burger-line-top" />
          <span className="burger-line burger-line-bottom" />
        </span>
      </button>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        aria-hidden={!open}
        inert={!open}
        data-open={open}
        onClick={onOverlayClick}
        className="mobile-menu-overlay fixed inset-0 z-20 overflow-y-auto"
      >
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-20 pb-[max(2rem,env(safe-area-inset-bottom))] md:pt-24">
          {children}
        </div>
      </div>
    </>
  );
}
