import type { Locale } from '@/content/hotel';
import { hotel } from '@/content/hotel';
import { getContactChannels, primaryChannel } from './contactChannels';

/** Десктоп-блок связи: кликабельный номер и три иконки мессенджеров одного визуального веса. */
export function HeaderContact({ locale }: { locale: Locale }) {
  const messengers = getContactChannels(locale).filter((c) => c.id !== 'map');
  return (
    <div className="flex items-center gap-4 rounded-full border border-line bg-surface/80 py-1.5 pr-1.5 pl-5 backdrop-blur">
      <a
        href={`tel:${hotel.contacts.phone}`}
        className="text-small font-semibold tracking-tight text-ink transition-colors duration-hover hover:text-accent"
      >
        {hotel.contacts.phoneDisplay}
      </a>
      <ul className="flex items-center gap-1.5">
        {messengers.map(({ id, href, label, Icon, external }) => {
          const isPrimary = id === primaryChannel;
          const cls = isPrimary
            ? 'bg-accent text-surface shadow-card hover:bg-accent-hover'
            : 'bg-paper text-ink hover:bg-accent-soft hover:text-accent';
          return (
            <li key={id}>
              <a
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`grid size-9 place-items-center rounded-full transition-colors duration-hover ${cls}`}
              >
                {/* Один размер глифа для всех трёх мессенджеров: w-4 h-4 внутри равных кнопок. */}
                <Icon aria-hidden className="h-4 w-4" size={16} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
