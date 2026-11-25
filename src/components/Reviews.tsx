import { contactLinks, type Locale } from '@/content/hotel';
import { reviews } from '@/content/reviews';
import { getMessages, intlLocale } from '@/lib/i18n';
import { MotionRoot } from './MotionRoot';
import { Reveal } from './Reveal';
import { RevealTitle } from './RevealTitle';
import { ReviewStickers } from './ReviewStickers';
import { ReviewsCarousel, type ResolvedReview } from './ReviewsCarousel';
import { ReviewsTopo } from './ReviewsTopo';

/**
 * Светлая «гостевая книга» после тёмной полосы #rooms: заголовок, доска с перетаскиваемыми
 * наклейками-впечатлениями и лента реальных отзывов (`src/content/reviews.ts`).
 * Единственный переход в Google Maps — последняя карточка ленты (и ссылка в окне полного отзыва).
 */
export function Reviews({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const labels = m.reviews;
  const dateFormat = new Intl.DateTimeFormat(intlLocale[locale], { year: 'numeric', month: 'long' });

  // Дата необязательна: без неё строка не рисуется (даты не выдумываем).
  const resolved: ResolvedReview[] = reviews.map((review) => {
    const parsed = review.date ? new Date(review.date) : null;
    return {
      id: review.id,
      author: review.author,
      initial: review.author.trim().charAt(0).toUpperCase() || 'G',
      date: parsed && !Number.isNaN(parsed.getTime()) ? dateFormat.format(parsed) : null,
      rating: review.rating,
      quote: review.quote,
      lang: review.lang,
    };
  });

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative isolate scroll-mt-16 overflow-hidden bg-paper px-5 py-20 md:scroll-mt-20 md:px-8 md:py-28"
    >
      <ReviewsTopo />

      <MotionRoot>
      <div className="mx-auto max-w-page">
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <Reveal from="left" className="relative lg:col-span-4">
            {/* Большая декоративная кавычка за заголовком — «гостевая книга». */}
            <svg
              aria-hidden="true"
              viewBox="0 0 120 120"
              className="pointer-events-none absolute -top-7 -left-3 size-32 text-accent/25 md:-top-10 md:-left-4 md:size-44"
              fill="currentColor"
            >
              <path d="M18 70 Q18 44 44 38 L48 50 Q36 54 36 70 L52 70 L52 94 L28 94 Q18 94 18 84 Z M66 70 Q66 44 92 38 L96 50 Q84 54 84 70 L100 70 L100 94 L76 94 Q66 94 66 84 Z" />
            </svg>
            <RevealTitle
              id="reviews-title"
              text={labels.title}
              className="relative font-display text-h2 font-bold tracking-tight text-ink text-balance"
            />
          </Reveal>

          <Reveal delay={0.12} from="right" className="mt-8 lg:col-span-8 lg:mt-0">
            <ReviewStickers labels={labels.stickers} hint={labels.stickerHint} />
          </Reveal>
        </div>

        {resolved.length > 0 && (
          <Reveal delay={0.05}>
            <ReviewsCarousel reviews={resolved} labels={labels} mapUrl={contactLinks.map} />
          </Reveal>
        )}
      </div>
      </MotionRoot>
    </section>
  );
}
