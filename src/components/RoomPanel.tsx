import { HiCheck } from 'react-icons/hi2';
import type { ResolvedRoomType } from '@/content/rooms';
import type { Messages } from '@/lib/i18n';
import { RoomGallery } from './RoomGallery';

type Props = { type: ResolvedRoomType; labels: Messages['rooms'] };

/** Карточка выбранной вкладки на графитовой полосе. Интерактивна только галерея внутри. */
export function RoomPanel({ type, labels }: Props) {
  const isRoom = type.kind === 'room';
  const meta = [type.capacity, type.note].filter((part): part is string => Boolean(part));

  return (
    <div className="rounded-3xl border border-surface/15 bg-surface/5 p-4 md:p-6">
      <RoomGallery slots={type.photos} name={type.name} labels={labels} />

      <div className="px-1 pt-6 md:px-2">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label uppercase text-accent-soft">
          {meta.map((part, i) => (
            <span key={part} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-surface/30">
                  ·
                </span>
              )}
              {part}
            </span>
          ))}
        </p>
        <h3 className="mt-2 font-display text-h3 font-bold text-surface">{type.name}</h3>
        <p className="mt-2 max-w-measure text-body text-surface/70">{type.description}</p>
      </div>

      {/* Акцентная плашка-оффер: цена, условия и действие в одном глубоко-зелёном блоке. */}
      <section className="relative mt-7 overflow-hidden rounded-2xl border border-surface/10 bg-accent p-5 text-surface md:p-7">
        <RidgeDecor />

        <div className="relative">
          {isRoom && type.priceFrom ? (
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-small text-surface/70">{labels.from}</span>
              <span className="font-display text-price font-bold">{type.priceFrom}</span>
              <span className="text-small text-surface/80">{labels.priceUnit}</span>
            </p>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="font-display text-price font-bold">{labels.free}</p>
              <p className="rounded-full bg-surface/15 px-3 py-1 text-small font-semibold">
                {labels.included}
              </p>
            </div>
          )}

          <hr aria-hidden className="my-5 border-0 border-t border-dashed border-surface/25" />

          <h4 className="text-label uppercase text-surface/70">{type.conditionsTitle}</h4>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {type.conditions.map((item) => (
              <li key={item} className="flex items-start gap-3 text-small">
                <span
                  aria-hidden
                  className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-surface/15"
                >
                  <HiCheck size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* На телефоне кнопка во всю ширину и высотой 48px — удобно нажать большим пальцем. */}
          <a
            href="#contacts"
            className="mt-7 flex min-h-12 items-center justify-center rounded-full bg-surface px-7 text-small font-semibold text-accent transition-colors duration-hover hover:bg-accent-soft sm:inline-flex"
          >
            {isRoom ? labels.bookRoom : labels.contactUs}
          </a>
        </div>
      </section>
    </div>
  );
}

/** Линия хребта из логотипа в углу плашки — еле заметно. */
function RidgeDecor() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 40"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -top-1 right-0 h-14 w-64 text-surface/10"
    >
      <path
        d="M0 34 L28 12 L48 24 L76 4 L104 28 L132 8 L164 24 L192 8 L220 28 L240 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
