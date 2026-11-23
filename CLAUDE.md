# CLAUDE.md — У Ласловича (Рахів)

## Стек и деплой
- Next.js 16 (App Router), React 19, TypeScript strict (`.ts` / `.tsx`), Tailwind 4 (`@theme`), пакетный менеджер `pnpm`.
- Статический экспорт под Netlify: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, `netlify.toml`. Сборка: `pnpm build` -> `out`.
- Языки: UA на `/` (`lang="uk"`), RU на `/ru/` (`lang="ru"`). Словари в `messages/uk.json` и `messages/ru.json` через route groups `(uk)` и `(ru)/ru`. Никаких сторонних i18n-библиотек, авторедиректов, бэкенда, БД, CMS, Zod, тестов, Playwright и cookie-баннеров.
- Компоненты серверные по умолчанию. `'use client'` только в точечных интерактивных «островах».

## Текущий объём страницы
- На `/` и `/ru/` только: шапка (`SiteHeader`), мобильная нижняя панель связи (`MobileContactBar`) и хиро (`Hero`). Остальные секции (номера, отзывы, FAQ, галерея, карта, футер) добавляем только по отдельной просьбе.

## Источники правды
- `src/content/hotel.ts` — название, адрес, координаты, высота, контакты (телефон, Telegram, WhatsApp, Viber), 3 фото-слота хиро с подписями «Фото 01–03», рейтинг Google, заезд/выезд, удобства, отзывы и единая функция ссылок `buildContactLinks` (Telegram, WhatsApp, Viber, `tel:`, Google Maps).
- `src/content/rooms.ts` — номера (`satisfies`), минимальная цена и диапазон мест; цены через `Intl.NumberFormat` (`formatPrice`, символ `₴`).
- `messages/uk.json` и `messages/ru.json` — тексты и `alt` без хардкода цифр и телефонов.
- `src/styles/tokens.css` — `@theme`: цвета, шрифты, размеры текста, скругления, тени, тайминги. Дефолтная палитра Tailwind сброшена.

## Визуальный стиль и UI
При расхождении с `TZ.md` по визуалу (палитра «Горный журнал», радиус 0, без теней, Phosphor) приоритет у этого раздела.
- Светлый коммерческий стиль с тёплым оттенком. Токены:
  | Токен | HEX | Где |
  | --- | --- | --- |
  | `paper` | #F7F7F5 | фон страницы |
  | `paper-deep` | #ECECE8 | заглушки фото |
  | `surface` | #FFFFFF | карточки |
  | `line` | #E5E5E0 | границы карточек, разделители |
  | `ink` | #18181B | основной текст |
  | `ink-muted` | #52525B | вторичный текст |
  | `accent` | #2C4C3B | главный акцент, кнопка связи (`accent-hover` #213A2D) |
  | `accent-soft` | #EBF1EC | мягкие бейджи |
- Карточка: `bg-surface border border-line shadow-card rounded-2xl`. Тени только `shadow-card` и `shadow-float`.
- Скругления только `rounded-xl` / `rounded-2xl` / `rounded-full`. Без кислотных градиентов, тяжёлого glassmorphism, шума и клише «уютный» / «незабываемый».
- Шрифты (`next/font/google`, `subsets: ['latin', 'cyrillic']`): `Literata` (заголовки, знак), `Onest` (текст), `IBM Plex Mono` (метки, координаты, цены).
- Адаптив: стандартный десктоп и стандартный мобайл (без лишних слов вроде «Меню» в шапке).
- Иконки: только `iconoir-react` — и только для звонка, локации и соцсетей/мессенджеров (нигде больше иконки не лепим). Логотипа Viber в iconoir нет — используем `ChatBubble` с подписью/`aria-label` «Viber».
- Связь: одна кнопка связи (`ContactButton`) с быстрым выбором иконками Telegram, WhatsApp, Viber и звонка (`tel:`). Порядок каналов везде один, список — `getContactChannels`.

## Правила работы
- Всегда перечитывай `CLAUDE.md` и `TZ.md` перед задачей.
- Не добавляй библиотеки, тесты и лишние зависимости без явной просьбы.
- После изменений проверяй TypeScript (`pnpm exec tsc --noEmit`) и останавливайся после текущего шага.

# CLAUDE.md — У Ласловича (Рахів)

## Стек и деплой
- Next.js 16 (App Router), React 19, TypeScript strict (`.ts` / `.tsx`), Tailwind 4 (`@theme`), пакетный менеджер `pnpm`.
- Статический экспорт под Netlify: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, `netlify.toml`. Сборка: `pnpm build` -> `out`.
- Языки: UA на `/` (`lang="uk"`), RU на `/ru/` (`lang="ru"`). Словари в `messages/uk.json` и `messages/ru.json` через route groups `(uk)` и `(ru)/ru`. Никаких сторонних i18n-библиотек, авторедиректов, бэкенда, БД, CMS, Zod, тестов, Playwright и cookie-баннеров.
- Компоненты серверные по умолчанию. `'use client'` только в точечных интерактивных «островах».

## Источники правды
- `src/content/hotel.ts` — название, адрес, координаты, контакты, заезд/выезд, удобства, «поблизости», FAQ, отзывы и единая функция генерации ссылок (Telegram, Viber, WhatsApp, `tel:`, Google Maps).
- `src/content/rooms.ts` — номера (`satisfies`, цены через `Intl.NumberFormat`).
- `messages/uk.json` и `messages/ru.json` — тексты и `alt` без хардкода цифр и телефонов.
- `src/styles/tokens.css` — `@theme`: цвета, шрифты, отступы, скругления, тайминги.

## Визуальный стиль и UI
- Спокойный, технологичный коммерческий интерфейс: фон `#F7F7F5`, чистые карточки `#FFFFFF` с границей `#E5E5E0` и лёгкой тенью, основной текст `#18181B`, вторичный `#52525B`, главный акцент `#2C4C3B`, мягкие бейджи `#EBF1EC`.
- Скругления (`rounded-xl` / `rounded-2xl` / `rounded-full`) и аккуратные тени разрешены. Без кислотных градиентов, тяжёлого glassmorphism, шума и клише «уютный» / «незабываемый».
- Шрифты (`next/font/google`, `subsets: ['latin', 'cyrillic']`): `Literata` (заголовки), `Onest` (текст), `IBM Plex Mono` (метки, координаты, цены).
- Иконки: `react-icons` для мессенджеров/связи, локации/карты и меню.
- Итоговые разделы лендинга: Шапка (лого + бургер-меню с `UA / RU`, навигацией и контактами), Хиро, Номера и цены (`#rooms`), Отзывы (`#reviews`), FAQ (`#faq`), Футер с контактами и картой (`#contacts`).

## Правила работы
- Всегда перечитывай `CLAUDE.md` и `TZ.md` перед задачей.
- Не добавляй библиотеки, тесты и лишние зависимости без явной просьбы.
- После изменений проверяй TypeScript (`pnpm exec tsc --noEmit`) и останавливайся после текущего шага.
