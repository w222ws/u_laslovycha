// Типы номеров. Третий тип = один объект в массиве + тексты в messages/*.json (rooms.<id>).

export const rooms = [
  { id: 'double', capacity: 2, count: 4, priceFrom: 1200, photos: [] },
  { id: 'quad', capacity: 4, count: 4, priceFrom: 2000, photos: [] },
] as const satisfies readonly {
  id: string;
  capacity: number;
  count: number;
  priceFrom: number;
  photos: readonly string[];
}[];

export type Room = (typeof rooms)[number];
export type RoomId = Room['id'];

export const currency = 'UAH';
export const minPrice = Math.min(...rooms.map((r) => r.priceFrom));
