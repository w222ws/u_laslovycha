// Единственный источник правды по отелю: контакты, адрес, координаты, удобства, отзывы.
// Телефон, Telegram, Viber меняются ТОЛЬКО здесь.

export type Locale = 'uk' | 'ru';

export type LocalizedText = Record<Locale, string>;

export const amenityIds = [
  'grill',
  'gazebo',
  'parking',
  'wifi',
  'sharedKitchen',
  'washingMachine',
  'fridge',
  'mountains',
] as const;

export type AmenityId = (typeof amenityIds)[number];

export const hotel = {
  name: 'У Ласловича (Рахів)',
  address: {
    // TODO: заменить на точный адрес
    uk: 'м. Рахів, Закарпатська область, Україна',
    ru: 'г. Рахов, Закарпатская область, Украина',
  },
  // TODO: заменить на точные с Google Maps
  coordinates: { lat: 48.0547, lng: 24.2019 },
  elevationMeters: 430,
  contacts: {
    // TODO: заменить на реальные контакты
    phone: '+380000000000',
    telegram: 'ulaslovycha',
    viber: '+380000000000',
  },
  // Фото хиро 4:5. Положить файл в public/photos/ и указать путь, напр. '/photos/hero.avif'.
  heroPhoto: null as string | null,
  checkIn: '14:00',
  checkOut: '12:00',
  amenities: [...amenityIds] satisfies AmenityId[],
  // TODO: заменить на отзывы с Google Maps
  reviews: [
    {
      author: 'Олена',
      rating: 5,
      text: {
        uk: 'Тихо, чисто, господар зустрів і все показав. Зранку виїхали на маршрут просто від дому.',
        ru: 'Тихо, чисто, хозяин встретил и всё показал. Утром выехали на маршрут прямо от дома.',
      },
    },
    {
      author: 'Андрій',
      rating: 5,
      text: {
        uk: 'Біля альтанки є мангал, ввечері сиділи там. До центру недалеко, парковка біля входу.',
        ru: 'Возле беседки есть мангал, вечером сидели там. До центра недалеко, парковка у входа.',
      },
    },
    {
      author: 'Марина',
      rating: 4,
      text: {
        uk: 'Світло вимикали, але все працювало від генератора. Номер теплий, Wi-Fi стабільний.',
        ru: 'Свет отключали, но всё работало от генератора. Номер тёплый, Wi-Fi стабильный.',
      },
    },
  ] satisfies { author: string; rating: number; text: LocalizedText }[],
} as const;

/** Все ссылки для связи собираются здесь. `message` — готовый текст для мессенджера. */
export function buildContactLinks(message: string) {
  const { phone, telegram, viber } = hotel.contacts;
  const { lat, lng } = hotel.coordinates;
  return {
    telegram: `https://t.me/${telegram}?text=${encodeURIComponent(message)}`,
    viber: `viber://chat?number=${encodeURIComponent(viber)}`,
    call: `tel:${phone}`,
    route: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  };
}
