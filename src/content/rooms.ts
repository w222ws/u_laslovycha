// Вкладки раздела #rooms: двухместные, четырёхместные номера и общая территория.
// Цены, тексты и условия правятся только здесь. Фото кладите в public/photos/ — отсутствующие
// на билде показываются аккуратной заглушкой слота.

import type { Locale, LocalizedText } from './hotel';

/** TODO: заменить placeholder-цены на реальные («от», за номер за сутки). */
export const PRICE_FROM_DOUBLE = 600;
export const PRICE_FROM_QUAD = 800;

type Four<T> = readonly [T, T, T, T];

type RoomTypeBase = {
  id: 'double' | 'quad' | 'common';
  /** Номер вкладки: «01», «02», «03». */
  number: string;
  /** Короткая подпись вкладки для мобильной сетки. */
  tabShort: LocalizedText;
  /** Полная подпись вкладки для десктопа. */
  tabFull: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  capacity: LocalizedText;
  conditionsTitle: LocalizedText;
  /** 6 пунктов — раскладываются в две колонки. */
  conditions: Record<Locale, readonly string[]>;
  /** Ровно 4 слота кадров. */
  photos: Four<string>;
};

export type SleepingRoomType = RoomTypeBase & {
  kind: 'room';
  /** Цена «от» за сутки, грн. */
  priceFrom: number;
  /** Пометка, что таких номеров в отеле несколько. */
  note: LocalizedText;
};
export type CommonAreaType = RoomTypeBase & { kind: 'common' };
export type RoomType = SleepingRoomType | CommonAreaType;

const roomsTitle: LocalizedText = { uk: 'Що входить / Умови', ru: 'Что входит / Условия' };

// TODO: уточнить у владельца точный список условий в номерах и общей зоне.
export const roomTypes = [
  {
    id: 'double',
    kind: 'room',
    number: '01',
    tabShort: { uk: '2 місця', ru: '2 места' },
    tabFull: { uk: 'Двомісні номери', ru: 'Двухместные номера' },
    name: { uk: 'Двомісний номер', ru: 'Двухместный номер' },
    description: {
      uk: 'Світлий номер на двох для спокійного відпочинку після прогулянок горами.',
      ru: 'Светлый номер на двоих для спокойного отдыха после прогулок по горам.',
    },
    capacity: { uk: '2 гості', ru: '2 гостя' },
    note: { uk: 'Кілька таких номерів', ru: 'Несколько таких номеров' },
    priceFrom: PRICE_FROM_DOUBLE,
    conditionsTitle: roomsTitle,
    conditions: {
      uk: [
        'Двоспальне ліжко або два окремих',
        'Свій санвузол',
        'Свіжа постіль та рушники',
        'Для двох',
        'Wi-Fi',
        'Вид на гори',
      ],
      ru: [
        'Двуспальная кровать или две отдельные',
        'Свой санузел',
        'Свежее постельное бельё и полотенца',
        'Для двоих',
        'Wi-Fi',
        'Вид на горы',
      ],
    },
    photos: [
      '/photos/room2-1.avif',
      '/photos/room2-2.avif',
      '/photos/room2-3.avif',
      '/photos/room2-4.avif',
    ],
  },
  {
    id: 'quad',
    kind: 'room',
    number: '02',
    tabShort: { uk: '4 місця', ru: '4 места' },
    tabFull: { uk: 'Чотиримісні номери', ru: 'Четырёхместные номера' },
    name: { uk: 'Чотиримісний номер', ru: 'Четырёхместный номер' },
    description: {
      uk: 'Номер на чотирьох для компанії чи сім’ї: усі разом, без розселення по різних кімнатах.',
      ru: 'Номер на четверых для компании или семьи: все вместе, без расселения по разным комнатам.',
    },
    capacity: { uk: '4 гості', ru: '4 гостя' },
    note: { uk: 'Кілька таких номерів', ru: 'Несколько таких номеров' },
    priceFrom: PRICE_FROM_QUAD,
    conditionsTitle: roomsTitle,
    conditions: {
      uk: [
        'Чотири спальні місця',
        'Свій санвузол',
        'Свіжа постіль та рушники',
        'Формат для компанії або сім’ї',
        'Wi-Fi',
        'Вид на гори',
      ],
      ru: [
        'Четыре спальных места',
        'Свой санузел',
        'Свежее постельное бельё и полотенца',
        'Формат для компании или семьи',
        'Wi-Fi',
        'Вид на горы',
      ],
    },
    photos: [
      '/photos/room4-1.avif',
      '/photos/room4-2.avif',
      '/photos/room4-3.avif',
      '/photos/room4-4.avif',
    ],
  },
  {
    id: 'common',
    kind: 'common',
    number: '03',
    tabShort: { uk: 'Кухня й двір', ru: 'Кухня и двор' },
    tabFull: { uk: 'Кухня, альтанка та двір', ru: 'Кухня, беседка и двор' },
    name: { uk: 'Кухня, альтанка та двір', ru: 'Кухня, беседка и двор' },
    description: {
      uk: 'Спільна кухня, крита альтанка з мангалом і простір для відпочинку у дворі — доступні всім гостям готелю.',
      ru: 'Общая кухня, крытая беседка с мангалом и пространство для отдыха во дворе — доступны всем гостям отеля.',
    },
    capacity: { uk: 'Спільне користування', ru: 'Совместное пользование' },
    conditionsTitle: { uk: 'Що доступно гостям', ru: 'Что доступно гостям' },
    conditions: {
      uk: [
        'Повністю обладнана кухня',
        'Посуд і техніка',
        'Крита альтанка зі столом',
        'Мангал, дрова та шампури',
        'Балкон-тераса з видом на гори',
        'Двір для відпочинку та парковка',
      ],
      ru: [
        'Полностью оборудованная кухня',
        'Посуда и техника',
        'Крытая беседка со столом',
        'Мангал, дрова и шампуры',
        'Балкон-терраса с видом на горы',
        'Двор для отдыха и парковка',
      ],
    },
    photos: [
      '/photos/common-1.avif',
      '/photos/common-2.avif',
      '/photos/common-3.avif',
      '/photos/common-4.avif',
    ],
  },
] as const satisfies readonly RoomType[];

/** Вкладка, подготовленная под язык и реальное наличие файлов (для client-острова). */
export type ResolvedRoomType = {
  id: RoomType['id'];
  kind: RoomType['kind'];
  number: string;
  tabShort: string;
  tabFull: string;
  name: string;
  description: string;
  capacity: string;
  /** Пометка «таких номеров несколько»; `null` у общей зоны. */
  note: string | null;
  /** Отформатированная цена «от» («1 200»); `null` у общей зоны. */
  priceFrom: string | null;
  conditionsTitle: string;
  conditions: string[];
  photos: { src: string; available: boolean }[];
};
