// Монохромные линейные иконки 1.5px (в духе Phosphor Light), без зависимостей.
type IconProps = { className?: string };

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export function TelegramIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M8.25 12.64 16.7 20.06a.75.75 0 0 0 1.23-.4L21.75 3.12a.1.1 0 0 0-.13-.11L2.66 10.44a.57.57 0 0 0 .1 1.09l5.49 1.11Z" />
      <path d="m8.25 12.64 13.45-9.63" />
      <path d="m12.43 16.31-2.9 3a.75.75 0 0 1-1.28-.53v-6.14" />
    </svg>
  );
}

export function ViberIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 2.75c-5.1 0-8.25 2.3-8.25 7.75 0 3.05.95 5.05 2.6 6.2v3.8l2.75-2.35c.9.2 1.9.3 2.9.3 5.1 0 8.25-2.3 8.25-7.95S17.1 2.75 12 2.75Z" />
      <path d="M9.35 7.6c.4-.4 1.05-.33 1.35.13l.62.95c.24.37.2.86-.12 1.17l-.32.32c.33.95 1.08 1.7 2.03 2.03l.32-.32c.31-.32.8-.36 1.17-.12l.95.62c.46.3.53.95.13 1.35l-.4.4c-.62.62-1.57.74-2.35.32a8.9 8.9 0 0 1-3.42-3.42c-.42-.78-.3-1.73.32-2.35l-.28-.08Z" />
      <path d="M13 6.25a4 4 0 0 1 4 4" />
      <path d="M13 8.5a1.75 1.75 0 0 1 1.75 1.75" />
    </svg>
  );
}

export function PhoneIcon({ className = 'size-5' }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20.85 14.86 16.43 12.88a1.5 1.5 0 0 0-1.42.13l-2.36 1.98c-1.45-.7-2.94-2.18-3.64-3.61l1.95-2.32a1.5 1.5 0 0 0 .12-1.41L9.15 3.15a1.5 1.5 0 0 0-1.56-.89A5.27 5.27 0 0 0 3 7.5c0 7.44 6.06 13.5 13.5 13.5a5.27 5.27 0 0 0 5.24-4.59 1.5 1.5 0 0 0-.89-1.55Z" />
    </svg>
  );
}

export function BurgerIcon({ className = 'size-6' }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M3 8h18" />
      <path d="M3 16h12" />
    </svg>
  );
}

export function CloseIcon({ className = 'size-6' }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5.5 5.5 18.5 18.5" />
      <path d="M18.5 5.5 5.5 18.5" />
    </svg>
  );
}
