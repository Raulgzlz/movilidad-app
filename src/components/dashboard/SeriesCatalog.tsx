import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CalendarDays,
  Sparkles,
  ChevronRight,
  Flame,
  Wand2,
} from 'lucide-react';
import { db } from '../../db/dexie';
import { PREDEFINED_SERIES, type PredefinedSeries } from '../../data/series';
import { PreWorkoutModal } from './PreWorkoutModal';
import type { Exercise } from '../../types/exercise';

interface SeriesCatalogProps {
  onOpenQuiz: () => void;
}

export function SeriesCatalog({ onOpenQuiz }: SeriesCatalogProps) {
  const [selectedSeries, setSelectedSeries] = useState<{
    series: PredefinedSeries;
    exercises: Exercise[];
  } | null>(null);

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []);

  const openSeriesModal = (series: PredefinedSeries) => {
    if (!allExercises) return;

    let list = [...allExercises];

    if (series.exercisesQuery.category) {
      list = list.filter((e) => e.category === series.exercisesQuery.category);
    }
    if (series.exercisesQuery.position) {
      list = list.filter((e) => e.position === series.exercisesQuery.position);
    }
    if (series.exercisesQuery.difficulty) {
      list = list.filter((e) => e.difficulty === series.exercisesQuery.difficulty);
    }

    const limit = series.exercisesQuery.limit || 4;
    const finalExercises = list.slice(0, limit);

    setSelectedSeries({
      series,
      exercises: finalExercises.length > 0 ? finalExercises : allExercises.slice(0, 4),
    });
  };

  const quickSeries = PREDEFINED_SERIES.filter((s) => s.category === 'quick');
  const multidaySeries = PREDEFINED_SERIES.filter((s) => s.category === 'multiday');

  return (
    <section className="flex flex-col gap-6">
      {/* ── 1. Multi-Day Series (Programas Progresivos) ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
              Series de Varios Días
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Hábito progresivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {multidaySeries.map((series) => (
            <div
              key={series.id}
              onClick={() => openSeriesModal(series)}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.04)] hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-[11px] font-bold ring-2 ring-white dark:ring-surface">
                    1
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white text-[11px] font-bold ring-2 ring-white dark:ring-surface">
                    2
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-bold ring-2 ring-white dark:ring-surface">
                    3
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <Flame className="h-3 w-3 fill-current" />
                  {series.daysCount} DÍAS
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                  {series.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {series.subtitle}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{series.durationMinutes} min/día</span>
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Ver serie <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Quick & Easy Sessions (Rutinas Cortas) ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-50 uppercase tracking-wider">
              Rutinas Cortas (5-10 Min)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Un solo toque
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickSeries.map((series) => (
            <div
              key={series.id}
              onClick={() => openSeriesModal(series)}
              className="group rounded-3xl bg-white dark:bg-surface p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_6px_20px_-4px_rgba(15,23,42,0.03)] hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white mb-3 shadow-sm"
                  style={{ backgroundColor: series.badgeColor }}
                >
                  {series.title.charAt(0)}
                </span>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors leading-snug">
                  {series.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {series.subtitle}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="uppercase tracking-wider">{series.durationMinutes} MINUTOS</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Optional Custom Routine Builder Card ── */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white/10 dark:via-white/5 dark:to-white/10 p-5 sm:p-6 text-white shadow-xl flex items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            <Wand2 className="h-3 w-3" />
            Configurador Opcional
          </span>
          <h3 className="text-base sm:text-lg font-extrabold mt-1">
            ¿Quieres crear tu propia rutina?
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Elige articulaciones exactas, tiempo y nivel biomecánico.
          </p>
        </div>

        <button
          onClick={onOpenQuiz}
          className="shrink-0 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-3 px-4 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Crear a mi medida
        </button>
      </div>

      {/* Pre-Workout Modal with Duration Steppers (- 45s +) */}
      {selectedSeries && (
        <PreWorkoutModal
          open={Boolean(selectedSeries)}
          onClose={() => setSelectedSeries(null)}
          title={selectedSeries.series.title}
          subtitle={selectedSeries.series.subtitle}
          initialExercises={selectedSeries.exercises}
        />
      )}
    </section>
  );
}
