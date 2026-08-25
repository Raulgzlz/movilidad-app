import { Flame, Clock, Activity, Sparkles } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import { useConsistency } from './StatsCard';
import { HeatmapGrid } from './HeatmapGrid';

export function TuViajeScreen() {
  const { streak } = useConsistency();
  const workouts = useLiveQuery(() => db.workouts.toArray(), []) || [];
  const completedCount = workouts.length;

  // Calculate total minutes
  const totalMinutes = Math.round(
    workouts.reduce((acc, w) => acc + (w.duration_seconds || 0), 0) / 60
  );

  return (
    <div className="flex flex-col gap-5 pb-28 pt-3 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Tu Viaje
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Constancia, rango de movimiento y hábitos de salud
        </p>
      </div>

      {/* Motivational Shout-out Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-500/25 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Progreso de la Semana
            </h2>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              🌟 ¡Gran constancia! Has completado <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{completedCount || 4} sesiones</span> y aumentado la fluidez de tus caderas y columna.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row: 3 Clean Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-3.5 shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-amber-500">
            <Flame className="h-4 w-4 fill-amber-500" />
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {streak || 1}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 text-center">
            Días Racha
          </span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-3.5 shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Clock className="h-4 w-4" />
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {totalMinutes || 35}m
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 text-center">
            Total Tiempo
          </span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-3.5 shadow-2xs flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
            <Activity className="h-4 w-4" />
            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {completedCount > 0 ? completedCount * 6 : 24}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 text-center">
            Movimientos
          </span>
        </div>
      </div>

      {/* Weekly Joint Balance Card */}
      <div className="rounded-3xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Balance Articular Semanal
          </h2>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Equilibrado
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Hips */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <span>🌿 Caderas & Glúteos</span>
              <span className="text-slate-400">40%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 w-[40%]" />
            </div>
          </div>

          {/* Spine */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <span>🧘 Columna & Espalda</span>
              <span className="text-slate-400">35%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-sky-500 w-[35%]" />
            </div>
          </div>

          {/* Shoulders */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <span>💪 Hombros & Cuello</span>
              <span className="text-slate-400">25%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-amber-500 w-[25%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 26-Week Consistency Calendar */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Consistencia Anual (26 Semanas)
        </h2>
        <HeatmapGrid />
      </div>
    </div>
  );
}
