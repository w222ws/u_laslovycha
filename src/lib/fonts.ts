import { Manrope, Onest } from 'next/font/google';

// Заголовки и словесный знак.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-manrope',
});

// Основной текст и цифры.
const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-onest',
});

export const fontClassName = `${manrope.variable} ${onest.variable}`;
