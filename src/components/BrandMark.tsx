type Props = { label: string; ariaLabel: string };

/** Знак «У Ласловича» с тонкой минималистичной линией горного хребта под словом. */
export function BrandMark({ label, ariaLabel }: Props) {
  return (
    <a
      href="#top"
      aria-label={ariaLabel}
      className="group flex flex-col items-start leading-none transition-colors duration-hover hover:text-accent"
    >
      <span className="font-display text-wordmark font-semibold tracking-tight text-current">
        {label}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 120 10"
        preserveAspectRatio="none"
        className="mt-1.5 h-2 w-[6.5rem] text-accent/70"
      >
        <path
          d="M0 8 L14 3 L24 6 L38 1 L52 7 L66 2 L82 6 L96 2 L110 7 L120 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </a>
  );
}
