'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// Фичи анимаций подгружаются отдельным чанком уже после первого рендера — на LCP не влияют.
const loadFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

/** Один провайдер на хиро: ленивые фичи + автоматическое уважение prefers-reduced-motion. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
