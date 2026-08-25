import { cn } from '../common/Button';

interface TimerRingProps {
  total: number;
  remaining: number;
  size?: number;
  color?: string; // tailwind stroke color class
  label?: string;
  sublabel?: string;
  breathing?: boolean;
}

/**
 * Cuenta regresiva circular con animación de respiración.
 * El arco consume suavemente a lo largo de `total` segundos.
 */
export function TimerRing({
  total,
  remaining,
  size = 240,
  color = 'stroke-sage-500',
  label,
  sublabel,
  breathing = false,
}: TimerRingProps) {
  const stroke = 10;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  const progress = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const offset = c * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* anillos de respiración */}
      {breathing && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full border border-sage-500/40 animate-breathe',
          )}
        />
      )}
      {breathing && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-sage-500/25 animate-echo"
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-500/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn(color, 'transition-[stroke-dashoffset] duration-1000 ease-linear')}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-5xl font-bold leading-none text-ink-900 dark:text-ink-50">
          {Math.max(0, Math.ceil(remaining))}
        </span>
        {label && (
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-secondary">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="mt-0.5 text-xs text-secondary">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
