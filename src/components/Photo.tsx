type Props = {
  /** Путь к .avif в public/photos/. */
  src: string;
  /** Файл уже лежит в public/photos/ — иначе показываем аккуратную заглушку. */
  available: boolean;
  alt: string;
  /** Подпись заглушки. `null` — чистая плашка paper-deep без текста. */
  pending?: string | null;
  eager?: boolean;
};

/**
 * Слот фото: сам снимок или ровная заглушка того же размера.
 * Пропорции и форму задаёт родитель. Снимок появляется с плавным CSS-fade через класс `photo-fade`
 * (opacity + transform, 60 FPS, с учётом prefers-reduced-motion).
 */
export function Photo({ src, available, alt, pending = null, eager = false }: Props) {
  if (available) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
        className="photo-fade block size-full object-cover object-center"
      />
    );
  }
  return (
    <div role="img" aria-label={alt} className="flex size-full items-center justify-center bg-paper-deep">
      {pending && <span className="text-label uppercase text-ink-muted">{pending}</span>}
    </div>
  );
}
