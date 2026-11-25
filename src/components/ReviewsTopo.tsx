/**
 * Фон секции #reviews: две «спирали» из изолиний, как вид сверху на вершину с серпантином.
 * Двойная спираль (две руки со сдвигом на пол-оборота) с лёгкой неровностью радиуса, чтобы линия
 * не выглядела циркульной. Чисто декоративный слой: `aria-hidden`, `pointer-events-none`, под контентом.
 * Цвет — `accent` (токен проекта) с низкой прозрачностью.
 */

// Считается один раз при загрузке модуля: точки спирали r = a + b·θ с небольшой «волной» по радиусу.
function spiral(turns: number, a: number, b: number): string {
  const perTurn = 48;
  const steps = Math.round(turns * perTurn);
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / perTurn) * Math.PI * 2;
    const r = (a + b * theta) * (1 + 0.05 * Math.sin(theta * 2.3));
    const x = r * Math.cos(theta) * 1.12;
    const y = r * Math.sin(theta) * 0.92;
    parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(' ');
}

const SPIRAL = spiral(3.6, 5, 5.2);

function Spiral({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="-150 -140 300 280"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={SPIRAL} vectorEffect="non-scaling-stroke" />
      <path d={SPIRAL} transform="rotate(180)" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ReviewsTopo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden text-accent"
    >
      <Spiral className="absolute -top-24 -right-44 size-112 opacity-[0.16] md:-top-32 md:-right-32 md:size-160" />
      <Spiral className="absolute -bottom-28 -left-44 size-96 -scale-x-100 opacity-[0.13] md:-bottom-36 md:-left-36 md:size-128" />
    </div>
  );
}
