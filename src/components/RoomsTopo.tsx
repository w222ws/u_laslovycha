/**
 * Топографический фон тёмной полосы #rooms: изолинии высот вокруг двух «вершин» и тонкие линии
 * карпатского хребта. Чисто декоративный слой: `aria-hidden`, `pointer-events-none`, лежит под контентом.
 * Цвет — `surface` (токен проекта) с низкой прозрачностью, так что чтению, галерее и свайпу не мешает.
 */

// Вложенные «кольца» одной органичной петли: разный масштаб и поворот дают неровные горизонтали.
// `w` — толщина: каждая третья линия плотнее, как индексная горизонталь на карте.
const RINGS = [
  { t: 'rotate(-15) scale(1.75 1.5)', w: 1.25 },
  { t: 'rotate(-8) scale(1.4 1.2)', w: 0.8 },
  { t: 'rotate(0) scale(1.05 0.95)', w: 0.8 },
  { t: 'translate(6 -4) rotate(12) scale(0.84 0.72)', w: 1.25 },
  { t: 'translate(12 -8) rotate(25) scale(0.64 0.54)', w: 0.8 },
  { t: 'translate(16 -10) rotate(40) scale(0.46 0.37)', w: 0.8 },
  { t: 'translate(18 -12) rotate(55) scale(0.28 0.22)', w: 1.25 },
] as const;

const LOOP =
  'M -100 -10 C -95 -60 -40 -95 15 -90 C 75 -85 110 -40 100 15 C 92 65 45 98 -10 92 C -65 88 -105 50 -100 -10 Z';

function Contours({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-230 -200 460 400"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {RINGS.map((ring) => (
        <path
          key={ring.t}
          d={LOOP}
          transform={ring.t}
          strokeWidth={ring.w}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function RoomsTopo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-surface"
    >
      {/* Вершина справа сверху — за заголовком, где свободно. */}
      <Contours className="absolute -top-16 -right-32 h-72 w-80 opacity-[0.12] md:-top-24 md:-right-16 md:h-[26rem] md:w-[30rem]" />
      {/* Вторая, поменьше, слева внизу. */}
      <Contours className="absolute -bottom-20 -left-32 h-64 w-72 opacity-[0.10] md:-bottom-28 md:-left-20 md:h-80 md:w-96" />

      {/* Тонкие линии хребта у нижнего края: два слоя, дальний бледнее. */}
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-20 w-full md:h-32"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          opacity="0.10"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          d="M0 90 L110 70 L210 84 L330 52 L450 80 L560 62 L690 88 L820 48 L930 76 L1050 58 L1170 82 L1290 60 L1440 78"
        />
        <path
          opacity="0.16"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          d="M0 118 L80 100 L190 112 L300 88 L420 110 L540 94 L650 116 L780 84 L900 108 L1020 92 L1140 114 L1260 96 L1440 110"
        />
      </svg>
    </div>
  );
}
