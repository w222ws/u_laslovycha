// Единственный источник правды по отелю: бренд, город, адрес, телефон, фото и ссылки для связи.
// Телефон, адрес и точка на карте меняются ТОЛЬКО здесь.

export type Locale = 'uk' | 'ru';
export type LocalizedText = Record<Locale, string>;

const PHONE_E164 = '+380680886599';
const PHONE_DISPLAY = '+380 68 088 65 99';
// WhatsApp/Telegram работают с номером без «+».
const PHONE_DIGITS = PHONE_E164.replace(/\D/g, '');

// TODO: владелец заменит на реальный адрес отеля.
const ADDRESS: LocalizedText = {
  uk: 'м. Рахів, Закарпатська область',
  ru: 'г. Рахов, Закарпатская область',
};

// Короткая share-ссылка на точку отеля в Google Maps.
const MAP_URL = 'https://maps.app.goo.gl/z9WkVCDU7wP4Wr5WA';

export const hotel = {
  name: 'У Ласловича',
  city: { uk: 'Рахів', ru: 'Рахов' } satisfies LocalizedText,
  region: { uk: 'Закарпаття', ru: 'Закарпатье' } satisfies LocalizedText,
  address: ADDRESS,
  mapUrl: MAP_URL,
  contacts: {
    phone: PHONE_E164,
    phoneDisplay: PHONE_DISPLAY,
  },
  // Один слот главного фото хиро. Файл кладётся в public/photos/hero.avif.
  // Пока его нет — на его месте рендерится чистая заглушка paper-deep.
  heroPhoto: '/photos/hero.avif',
} as const;

/** Единая сборка ссылок для связи. Без предзаполненного текста. */
export const contactLinks = {
  telegram: `https://t.me/${PHONE_E164}`,
  whatsapp: `https://wa.me/${PHONE_DIGITS}`,
  viber: `viber://chat?number=${encodeURIComponent(PHONE_E164)}`,
  call: `tel:${PHONE_E164}`,
  map: MAP_URL,
} as const;
