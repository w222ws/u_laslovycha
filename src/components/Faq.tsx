import { contactLinks, hotel, type Locale } from '@/content/hotel';
import { PRICE_FROM_DOUBLE, PRICE_FROM_QUAD } from '@/content/rooms';
import { getMessages, intlLocale } from '@/lib/i18n';
import { getContactChannels } from './contactChannels';
import { FaqTrail } from './FaqTrail';
import { MotionRoot } from './MotionRoot';
import { Reveal } from './Reveal';
import { RevealTitle } from './RevealTitle';

const pill =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-surface/25 bg-surface/10 px-4 md:min-h-11 text-small font-semibold text-surface transition-colors duration-hover hover:border-surface hover:bg-surface hover:text-accent';

/**
 * «Часті питання» как маршрут знакомства: 5 остановок с крупными номерами 01–05 и пунктирной тропой
 * между ними. Цены в ответе подставляются из `rooms.ts` — не разойдутся с секцией #rooms.
 * Контакты лежат одной финальной карточкой, а не дублируются в каждом ответе.
 */
export function Faq({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const labels = m.faq;
  const money = new Intl.NumberFormat(intlLocale[locale]);
  const byId = new Map(getContactChannels(locale).map((channel) => [channel.id, channel]));
  // Телефон — кнопкой на всю ширину, мессенджеры под ним в ряд (на телефоне только иконки): Viber, Telegram, WhatsApp.
  const messengers = (['viber', 'telegram', 'whatsapp'] as const).flatMap((id) => {
    const channel = byId.get(id);
    return channel ? [channel] : [];
  });

  const items = labels.items.map((item) => ({
    stop: item.stop,
    q: item.q,
    a: item.a
      .replace('{double}', money.format(PRICE_FROM_DOUBLE))
      .replace('{quad}', money.format(PRICE_FROM_QUAD)),
    action: item.action,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="on-dark relative isolate scroll-mt-16 overflow-hidden bg-ink text-surface md:scroll-mt-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <RidgeEdge />
      <FaqTopo />

      <MotionRoot>
      <div className="mx-auto max-w-page px-5 pt-14 pb-14 md:px-8 md:pt-24 md:pb-24">
        <RevealTitle
          id="faq-title"
          text={labels.title}
          className="font-display text-h2 font-bold tracking-tight text-surface text-balance"
        />

        <Reveal delay={0.1}>
        <FaqTrail
          items={items}
          brand={labels.brand}
          selectHint={labels.selectHint}
          mapLabel={m.contact.map}
        />
        </Reveal>

        <Reveal delay={0.05}>
        <div className="mt-12 flex flex-col gap-4 rounded-3xl border border-surface/15 bg-surface/5 p-5 md:mt-16 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="font-display text-body font-semibold text-surface">
              {labels.stillQuestions}
            </p>
            <p className="mt-1 max-w-measure text-small text-surface/70">{labels.stillAnswer}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
            <a
              href={contactLinks.call}
              className="col-span-3 inline-flex min-h-12 items-center justify-center rounded-full bg-surface px-5 text-small font-semibold text-accent transition-colors duration-hover hover:bg-accent-soft md:min-h-11"
            >
              {hotel.contacts.phoneDisplay}
            </a>
            {messengers.map(({ id, href, label, Icon, external }) => (
              <a
                key={id}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                className={pill}
              >
                <Icon aria-hidden size={18} />
                <span className="sr-only md:not-sr-only">{label}</span>
              </a>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
      </MotionRoot>

      <RidgeEdge flip />
    </section>
  );
}

/* ─────────────────────────── Decor ─────────────────────────── */

/** Тонкие изолинии рельефа в фоне тёмной полосы: те же мотивы, что в #rooms и #reviews. */
function FaqTopo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-surface"
    >
      <svg
        viewBox="-230 -200 460 400"
        className="absolute -top-20 -right-28 size-96 opacity-[0.08] md:-top-24 md:-right-24 md:size-128"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path
          d="M 160 -40 C 170 -90 100 -130 20 -110 C -70 -85 -140 -20 -100 60 C -60 130 60 160 150 110 C 220 70 220 10 160 -40 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 130 -30 C 135 -70 80 -100 15 -85 C -50 -65 -110 -15 -80 50 C -45 110 55 135 125 95 C 180 65 180 15 130 -30 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 100 -20 C 102 -55 65 -75 15 -60 C -35 -45 -80 -10 -60 40 C -32 90 50 110 100 80 C 140 60 140 20 100 -20 Z"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        viewBox="0 0 300 220"
        className="absolute -bottom-10 -left-16 size-80 opacity-[0.07] md:-bottom-16 md:-left-12 md:size-112"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M -20 180 Q 40 140 110 170 Q 180 200 260 160 Q 320 130 340 100" vectorEffect="non-scaling-stroke" />
        <path d="M -20 150 Q 50 110 120 140 Q 200 170 270 125 Q 330 95 340 70" vectorEffect="non-scaling-stroke" />
        <path d="M -20 120 Q 60 80 130 110 Q 210 140 275 95 Q 330 60 340 40" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/** Рваный силуэт хребта: граница тёмной полосы сверху и снизу (`flip`). */
function RidgeEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-8 w-full text-ink md:h-14 ${
        flip ? '-mt-px rotate-180' : '-mb-px'
      }`}
    >
      <path
        fill="currentColor"
        d="M0 60 V40 L90 24 L170 36 L270 10 L370 32 L470 18 L560 38 L680 6 L790 34 L880 20 L990 40 L1090 14 L1190 36 L1290 22 L1380 34 L1440 26 V60 Z"
      />
    </svg>
  );
}
