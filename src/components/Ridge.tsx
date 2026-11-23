// Фирменный знак: тонкая линия хребта.

/** Маленький знак рядом со словесным логотипом. */
export function RidgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 16" fill="none" aria-hidden focusable={false} className={className}>
      <path
        d="M1 14 7 9l3 2 6-7 4 4 3-2 5 5 3-2 7 5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Длинный силуэт хребта в хиро: поднимается слева направо к кадру с фото. */
export function RidgeLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      focusable={false}
      className={className}
    >
      <path
        d="M0 110 48 98 84 104 132 76 168 88 216 54 246 68 292 36 330 60 372 46 420 72 462 42 506 58 552 24 600 16"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
