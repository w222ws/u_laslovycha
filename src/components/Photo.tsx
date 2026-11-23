const ratioClass = {
  '4:5': 'aspect-[4/5]',
  '3:2': 'aspect-[3/2]',
  '1:1': 'aspect-square',
} as const;

type Props = {
  src: string | null | undefined;
  alt: string;
  ratio: keyof typeof ratioClass;
  /** Подпись заглушки, напр. «ФОТО 01». */
  placeholder: string;
  eager?: boolean;
};

/** Фото AVIF из public/photos/ или заглушка paper-deep тех же пропорций. */
export function Photo({ src, alt, ratio, placeholder, eager = false }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`${ratioClass[ratio]} block w-full object-cover`}
      />
    );
  }
  return (
    <div role="img" aria-label={alt} className={`${ratioClass[ratio]} flex w-full items-center justify-center bg-paper-deep`}>
      <span className="font-mono text-label uppercase text-ink-muted">{placeholder}</span>
    </div>
  );
}
