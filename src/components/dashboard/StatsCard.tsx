import { useLiveQuery } from 'dexie-react-hooks';
import { Clock, Flame, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import { db } from '../../db/dexie';
import { computeBestStreak, computeStreak } from '../../lib/stats';

export interface ConsistencyData {
  streak: number;
  bestStreak: number;
  totalMinutes: number;
  lastWorkoutDate: string | null;
}

const EMPTY: ConsistencyData = {
  streak: 0,
  bestStreak: 0,
  totalMinutes: 0,
  lastWorkoutDate: null,
};

/** Hook: estadísticas de consistencia en vivo (reactivo ante cambios Dexie). */
export function useConsistency(): ConsistencyData {
  return useLiveQuery(async (): Promise<ConsistencyData> => {
    const rows = await db.workouts.toArray();
    if (rows.length === 0 && !(await db.profile.get('local-user'))) {
      return EMPTY;
    }
    const dates = new Set(rows.map((r) => r.date));
    const profile = await db.profile.get('local-user');
    const last = [...rows].sort((a, b) => b.timestamp - a.timestamp)[0];
    return {
      streak: computeStreak(dates),
      bestStreak: computeBestStreak(dates),
      totalMinutes: profile?.total_minutes ?? 0,
      lastWorkoutDate: last?.date ?? null,
    };
  }, []) ?? EMPTY;
}

interface CellProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
}

function Cell({ icon, label, value, sub }: CellProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-secondary">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="tabular text-2xl font-bold leading-none">{value}</div>
      {sub && <div className="text-xs text-secondary">{sub}</div>}
    </div>
  );
}

export function StatsCard() {
  const { streak, bestStreak, totalMinutes, lastWorkoutDate } =
    useConsistency();

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const value =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;

  const lastLabel = lastWorkoutDate
    ? `${new Date(lastWorkoutDate + 'T00:00:00').toLocaleDateString('es', {
        day: 'numeric',
        month: 'short',
      })}`
    : '—';

  return (
    <section className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-secondary">
          Consistencia
        </h2>
        <span className="text-[11px] text-secondary">
          Última sesión · {lastLabel}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Cell
          icon={<Flame className="h-4 w-4" strokeWidth={1.8} />}
          label="Racha"
          value={`${streak}`}
          sub={streak === 1 ? 'día' : 'días'}
        />
        <Cell
          icon={<Trophy className="h-4 w-4" strokeWidth={1.8} />}
          label="Récord"
          value={`${bestStreak}`}
          sub={bestStreak === 1 ? 'día' : 'días'}
        />
        <Cell
          icon={<Clock className="h-4 w-4" strokeWidth={1.8} />}
          label="Minutos"
          value={value}
          sub="en total"
        />
      </div>
    </section>
  );
}
