import { pad2 } from '@/lib/format';

type Props = { n: number; id: string; title: string; lede?: string };

/** Шапка раздела: линия, номер, заголовок. Разделы отделяются линией и номером, не фоном. */
export function SectionHead({ n, id, title, lede }: Props) {
  return (
    <header className="grid grid-cols-4 gap-x-4 border-t border-line pt-6 lg:grid-cols-12 lg:gap-x-8">
      <p className="col-span-4 font-mono text-label uppercase text-rust-text lg:col-span-2 lg:pt-3">{pad2(n)}</p>
      <h2 id={id} className="col-span-4 mt-4 font-serif text-h2 font-medium lg:col-span-5 lg:mt-0">
        {title}
      </h2>
      {lede && (
        <p className="col-span-4 mt-6 max-w-measure text-ink-muted lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end">
          {lede}
        </p>
      )}
    </header>
  );
}
