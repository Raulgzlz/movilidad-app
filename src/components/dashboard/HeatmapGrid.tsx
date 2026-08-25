import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import type { WorkoutSession } from '../../types/exercise';

const DAYS_SHOWN = 182; // 26 semanas

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function minutesFor(rows: WorkoutSession[], key: string): number {
  let sum = 0;
  for (const r of rows) if (r.date === key) sum += r.duration_seconds;
  return sum;
}

function level(minutes: number): number {
  if (minutes <= 0) return 0;
  if (minutes < 5) return 1;
  if (minutes < 10) return 2;
  if (minutes < 20) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  'bg-ink-500/10',
  'bg-sage-500/30',
  'bg-sage-500/55',
  'bg-sage-500/80',
  'bg-sage-400',
];

const MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

interface Cell {
  key: string;
  level: number;
  isFuture: boolean;
  month: number;
}

export function HeatmapGrid() {
  const sessions = useLiveQuery(() => db.workouts.toArray(), []);
  const rows = sessions ?? [];

  // Construye la cuadrícula: columnas = semanas (viernes/domingo → sábado)
  const cells = useMemo<Cell[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // alinea el inicio al domingo de la semana más lejana
    const start = new Date(today);
    start.setDate(start.getDate() - (start.getDay() + DAYS_SHOWN - 1));

    const grid: Cell[] = [];
    let cursor = new Date(start);
    for (let i = 0; i < DAYS_SHOWN + 7; i++) {
      if (cursor.getTime() > today.getTime()) {
        break; // solo días hasta hoy (sin celdas de futuro)
      }
      const key = dateKey(cursor);
      grid.push({
        key,
        level: level(minutesFor(rows, key)),
        isFuture: false,
        month: cursor.getMonth(),
      });
      cursor = new Date(cursor.getTime() + 86_400_000);
    }
    return grid;
  }, [rows]);

  const weeks = useMemo<Cell[][]>(() => {
    const result: Cell[][] = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [cells]);

  // etiquetas de mes por columna (cambio de mes respecto a la celda anterior)
  const monthLabels = weeks.map((week, i) => {
    const first = week[0];
    if (!first) return '';
    const prev = i > 0 ? weeks[i - 1] : undefined;
    const prevLast = prev ? prev[prev.length - 1] : undefined;
    if (!prevLast || first.month !== prevLast.month) {
      return MONTH_LABELS[first.month];
    }
    return '';
  });

  return (
    <section className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-secondary">
          Actividad · últimos 26 semanas
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] text-secondary">
          <span>menos</span>
          {LEVEL_CLASSES.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
          ))}
          <span>más</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
        <div className="min-w-[520px]">
          <div className="mb-1 ml-8 flex h-4">
            {monthLabels.map((label, i) => (
              <span
                key={i}
                className="w-[13px] text-[10px] text-secondary"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex">
            {/* etiquetas de día de la semana */}
            <div className="mr-1 flex w-7 flex-col">
              {['D', '', 'L', '', 'X', '', 'S'].map((d, i) => (
                <span key={i} className="h-[13px] text-[10px] leading-[13px] text-secondary">
                  {d}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap">
              {weeks.map((week, wi) => (
                <div key={wi} className="mr-[3px] flex flex-col gap-[3px]">
                  {week.map((cell) => (
                    <span
                      key={cell.key}
                      title={
                        cell.isFuture
                          ? ''
                          : `${cell.key} · ${minutesFor(rows, cell.key)} min`
                      }
                      className={`h-[13px] w-[13px] rounded-[3px] ${
                        cell.level === -1
                          ? 'bg-transparent'
                          : LEVEL_CLASSES[cell.level]
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
