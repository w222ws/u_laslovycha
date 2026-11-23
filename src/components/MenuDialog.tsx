'use client';

import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { BurgerIcon, CloseIcon } from './icons';

type Props = {
  labels: { open: string; close: string; title: string };
  children: ReactNode;
};

/** Остров: кнопка-бургер + нативный <dialog>. Содержимое меню рендерится на сервере. */
export function MenuDialog({ labels, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    ref.current?.showModal();
    setOpen(true);
  };
  const close = () => ref.current?.close();

  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    const target = e.target as Element;
    // клик по подложке или по ссылке-якорю закрывает меню
    if (target === e.currentTarget || target.closest('a[href^="#"]')) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-menu"
        className="group -ml-2 inline-flex items-center gap-3 px-2 py-2 text-ink transition-colors duration-hover hover:text-spruce"
      >
        <BurgerIcon className="size-6 transition-transform duration-hover group-hover:translate-x-0.5" />
        <span className="font-mono text-label uppercase">{labels.open}</span>
      </button>

      <dialog
        id="site-menu"
        ref={ref}
        aria-label={labels.title}
        className="menu-dialog"
        onClick={onDialogClick}
        onClose={() => setOpen(false)}
      >
        <div className="flex min-h-full flex-col px-4 pb-8 md:px-12 md:pb-12">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line md:h-20">
            <button
              type="button"
              onClick={close}
              className="-ml-2 inline-flex items-center gap-3 px-2 py-2 transition-colors duration-hover hover:text-spruce"
            >
              <CloseIcon className="size-6" />
              <span className="font-mono text-label uppercase">{labels.close}</span>
            </button>
            <span className="font-mono text-label uppercase text-ink-muted">{labels.title}</span>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
