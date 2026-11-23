'use client';

import { useEffect, useState } from 'react';
import { PhoneIcon, TelegramIcon, ViberIcon } from './icons';

type Props = {
  watchId: string;
  links: { telegram: string; viber: string; call: string };
  labels: { title: string; telegram: string; viber: string; call: string };
};

/** Остров: нижняя панель связи на мобайле, появляется, когда хиро ушёл за экран. */
export function MobileContactBar({ watchId, links, labels }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) setVisible(!entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  const cell = 'flex h-14 items-center justify-center gap-2 text-small font-medium transition-colors duration-hover';

  return (
    <nav
      aria-label={labels.title}
      data-visible={visible}
      inert={!visible}
      className="contact-bar fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid grid-cols-3 divide-x divide-line">
        <a href={links.telegram} target="_blank" rel="noopener" className={`${cell} bg-spruce text-paper active:bg-ink`}>
          <TelegramIcon />
          {labels.telegram}
        </a>
        <a href={links.viber} className={`${cell} text-spruce active:bg-paper-deep`}>
          <ViberIcon />
          {labels.viber}
        </a>
        <a href={links.call} className={`${cell} text-spruce active:bg-paper-deep`}>
          <PhoneIcon />
          {labels.call}
        </a>
      </div>
    </nav>
  );
}
