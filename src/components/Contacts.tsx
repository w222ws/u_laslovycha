import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { HiArrowUp } from 'react-icons/hi2';
import { contactLinks, hotel, type Locale } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';
import { getContactChannels, primaryChannel } from './contactChannels';
import { MotionRoot } from './MotionRoot';
import { Reveal } from './Reveal';

const linkClass =
  'inline-block text-small text-ink-muted transition-colors duration-hover hover:text-accent';

/**
 * #contacts: сверху плашка-«маршрутный билет» с телефоном, ниже футер из трёх колонок
 * (разделы / мессенджеры / где и когда) и нижняя строка с копирайтом и подписью разработчика.
 */
export function Contacts({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const c = m.contacts;
  const messengers = getContactChannels(locale).filter((ch) => ch.id !== 'map');
  const sections = [
    { href: '#rooms', label: m.nav.rooms },
    { href: '#reviews', label: m.nav.reviews },
    { href: '#faq', label: m.nav.faq },
  ];

  return (
    <section
      id="contacts"
      aria-labelledby="contacts-title"
      className="relative scroll-mt-16 border-t border-line bg-paper px-5 pt-16 pb-8 md:scroll-mt-20 md:px-8 md:pt-24 md:pb-10"
    >
      <MotionRoot>
      <div className="mx-auto max-w-page">
        {/* Плашка-билет. */}
        <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-accent px-6 py-8 text-surface shadow-card md:px-10 md:py-10">
          <svg
            aria-hidden="true"
            viewBox="0 0 400 160"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full text-surface/10"
            fill="none"
            stroke="currentColor"
          >
            <path d="M-20 50 Q 80 30 160 50 T 320 40 T 420 50" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d="M-20 90 Q 100 70 180 90 T 340 80 T 420 90" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d="M-20 130 Q 90 110 170 130 T 330 120 T 420 130" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          {/* Вырезы билета по бокам. */}
          <span aria-hidden className="absolute top-1/2 -left-3 hidden size-6 -translate-y-1/2 rounded-full bg-paper md:block" />
          <span aria-hidden className="absolute top-1/2 -right-3 hidden size-6 -translate-y-1/2 rounded-full bg-paper md:block" />
          <div className="relative flex flex-col gap-6 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10">
            <div className="max-w-measure">
              <p className="text-label uppercase text-accent-soft">{c.ticketKicker}</p>
              <h2
                id="contacts-title"
                className="mt-2 font-display text-h3 font-bold tracking-tight text-balance"
              >
                {c.title}
              </h2>
              <p className="mt-2 text-body text-surface/80">{c.ticketText}</p>

              {/* Маршрут «вокзал → отель»: пунктирная тропа в духе FAQ, конечная точка пульсирует. */}
              <div aria-hidden className="mt-6 flex items-center gap-3 text-label font-semibold uppercase text-surface/90">
                <span className="shrink-0">{c.routeFrom}</span>
                <span className="relative flex h-3 min-w-10 flex-1 items-center">
                  <span className="absolute inset-x-1 border-t border-dashed border-surface/50" />
                  <span className="absolute left-0 size-2 rounded-full bg-surface" />
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full bg-surface px-2 py-0.5 text-accent normal-case">
                    {c.distance}
                  </span>
                  <span className="absolute right-0 grid size-3 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-accent-soft" />
                    <span className="trail-pulse absolute inset-0 rounded-full border border-accent-soft" />
                  </span>
                </span>
                <span className="shrink-0">{hotel.name}</span>
              </div>
            </div>
            {/* Корешок билета: пунктирная перфорация + номер. */}
            <div className="relative flex flex-col items-start gap-4 border-t border-dashed border-surface/30 pt-6 md:items-center md:border-t-0 md:border-l md:pt-0 md:pl-10">
              <a
                href={contactLinks.call}
                aria-label={`${c.phoneLabel}: ${hotel.contacts.phoneDisplay}`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-surface px-6 py-3.5 font-display text-body-lg font-bold text-accent shadow-card transition-transform duration-hover hover:-translate-y-0.5"
              >
                <FaPhoneAlt aria-hidden size={16} />
                {hotel.contacts.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
        </Reveal>

        {/* Логотип + возврат наверх. */}
        <Reveal delay={0.05}>
        <div className="mt-12 flex items-start justify-between gap-6">
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-wordmark font-semibold tracking-tight text-ink">
              {hotel.name}
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
            <p className="mt-3 text-small text-ink-muted">{c.tagline}</p>
          </div>
          <a
            href="#top"
            aria-label={c.toTop}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition-[transform,border-color,color] duration-hover hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            <HiArrowUp aria-hidden size={18} />
          </a>
        </div>
        </Reveal>

        {/* Три колонки. */}
        <Reveal delay={0.08}>
        <div className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          <nav aria-label={c.sectionsTitle}>
            <h3 className="text-label uppercase text-ink-muted">{c.sectionsTitle}</h3>
            <ul className="mt-4 grid gap-2.5">
              {sections.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-label uppercase text-ink-muted">{c.messengersTitle}</h3>
            <ul className="mt-4 grid gap-2.5">
              {messengers.map(({ id, href, label, Icon, external }) => (
                <li key={id}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`${linkClass} group inline-flex items-center gap-2.5`}
                  >
                    <Icon
                      aria-hidden
                      size={16}
                      className={`shrink-0 transition-colors duration-hover group-hover:text-accent ${
                        id === primaryChannel ? 'text-accent' : 'text-ink-muted'
                      }`}
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label uppercase text-ink-muted">{c.whereTitle}</h3>
            <ul className="mt-4 grid gap-2.5 text-small text-ink-muted">
              <li>{c.place}</li>
              <li>{c.checkIn}</li>
              <li>
                <a
                  href={contactLinks.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-semibold text-accent transition-colors duration-hover hover:text-accent-hover"
                >
                  <FaMapMarkerAlt aria-hidden size={14} className="shrink-0" />
                  {c.openMap}
                </a>
              </li>
            </ul>
          </div>
        </div>
        </Reveal>

        {/* Хребет-разделитель и нижняя строка. */}
        <Reveal delay={0.05}>
        <svg
          aria-hidden
          viewBox="0 0 600 24"
          preserveAspectRatio="none"
          className="mt-12 h-5 w-full text-accent/30"
        >
          <path
            d="M0 20 L40 12 L70 17 L120 4 L170 18 L220 8 L270 16 L320 3 L370 17 L420 9 L470 18 L520 7 L570 15 L600 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-4 flex flex-col gap-2 text-small text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{c.rights}</p>
          <p>
            {c.creditLabel}{' '}
            <a
              href="https://t.me/off044"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-ink transition-colors duration-hover hover:text-accent"
            >
              Tarasov Kyrylo
            </a>
          </p>
        </div>
        </Reveal>
      </div>
      </MotionRoot>
    </section>
  );
}
