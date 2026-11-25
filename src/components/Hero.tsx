import { hotel, type Locale } from '@/content/hotel';
import { getMessages } from '@/lib/i18n';
import { photoExists } from '@/lib/photoExists';
import { HeroActions } from './HeroActions';
import { HeroFacts } from './HeroFacts';
import { HeroPhoto } from './HeroPhoto';
import { HeroText } from './HeroText';
import { HeroTrail } from './HeroTrail';
import { MotionRoot } from './MotionRoot';
import { Photo } from './Photo';

/**
 * Hero на один экран (на очень низких экранах допускается небольшая прокрутка). Анимации стартуют после
 * сигнала `hero:ready` от прелоадера.
 *
 * Телефон (сверху вниз): заголовок и подзаголовок → фото (забирает свободную высоту) → плюсы → кнопки.
 * Десктоп: слева текст и плюсы, справа фото, а кнопки — прямо под ним.
 */
export function Hero({ locale }: { locale: Locale }) {
  const m = getMessages(locale);
  const src = hotel.heroPhoto;
  // На этапе билда проверяем, лежит ли файл в public/photos/.
  // Пока нет — рендерим чистую заглушку paper-deep без битых картинок.
  const available = photoExists(src);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate mx-auto flex min-h-dvh max-w-page flex-col px-5 pt-18 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-8 md:pt-24 md:pb-8 lg:max-h-240"
    >
      <MotionRoot>
        <HeroTrail />
        <div className="flex min-h-0 flex-1 flex-col gap-5 lg:grid lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-12 lg:gap-y-6">
          <div className="order-1 lg:col-span-6 lg:row-start-1 lg:self-center">
            <HeroText title={m.hero.title} subtitle={m.hero.subtitle} />
          </div>

          <div className="relative order-2 min-h-64 flex-1 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:min-h-0">
            <HeroPhoto className="absolute inset-0">
              <Photo src={src} available={available} alt={m.hero.photoAlt} pending={null} eager />
            </HeroPhoto>
          </div>

          <div className="order-3 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-end">
            <HeroFacts facts={m.hero.facts} />
          </div>

          <div className="order-4 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:self-end">
            <HeroActions
              primary={{ label: m.hero.primaryCta, href: '#contacts' }}
              secondary={{ label: m.hero.secondaryCta, href: '#rooms' }}
            />
          </div>
        </div>
      </MotionRoot>
    </section>
  );
}
