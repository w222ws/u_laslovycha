// Порядок разделов страницы. Номер раздела = индекс + 1. Названия — messages/*.json → nav.
export const sectionIds = [
  'rooms',
  'amenities',
  'around',
  'gallery',
  'reviews',
  'directions',
  'faq',
  'contacts',
] as const;

export type SectionId = (typeof sectionIds)[number];
