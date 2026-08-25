import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Play,
  Sparkles,
  Clock,
  Armchair,
  Move,
} from 'lucide-react';
import { db } from '../../db/dexie';
import { PREDEFINED_SERIES, type PredefinedSeries } from '../../data/series';
import { PreWorkoutModal } from './PreWorkoutModal';
import type { Exercise } from '../../types/exercise';

interface BendHomeScreenProps {
  streak?: number;
}

export function BendHomeScreen({ streak: _streak }: BendHomeScreenProps) {
  const [selectedSeries, setSelectedSeries] = useState<{
    series: PredefinedSeries;
    exercises: Exercise[];
  } | null>(null);

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []) || [];

  // Date format in Spanish
  const dateStr = useMemo(() => {
    const now = new Date();
    return now
      .toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })
      .toUpperCase();
  }, []);

  const openSeries = (series: PredefinedSeries) => {
    if (allExercises.length === 0) return;

    let list = [...allExercises];
    if (series.exercisesQuery.category) {
      list = list.filter((e) => e.category === series.exercisesQuery.category);
    }
    if (series.exercisesQuery.position) {
      list = list.filter((e) => e.position === series.exercisesQuery.position);
    }

    const limit = series.exercisesQuery.limit || 6;
    const finalExercises = list.slice(0, limit);

    setSelectedSeries({
      series,
      exercises: finalExercises.length > 0 ? finalExercises : allExercises.slice(0, 6),
    });
  };

  const openQuickFilter = (type: '5min' | '10min' | 'chair' | 'floor') => {
    if (allExercises.length === 0) return;

    if (type === 'chair') {
      const chairExercises = allExercises.filter((e) => e.position === 'silla');
      setSelectedSeries({
        series: {
          id: 'filter-chair',
          title: 'Pausa Activa en Silla',
          subtitle: '100% sentado · Cero sudor ni suelo',
          durationMinutes: 5,
          badgeColor: '#8B5CF6',
          category: 'quick',
          exercisesQuery: { position: 'silla', limit: 5 },
        },
        exercises: chairExercises.slice(0, 5),
      });
      return;
    }

    if (type === '5min') {
      setSelectedSeries({
        series: {
          id: 'filter-5min',
          title: 'Movilidad Express 5 Min',
          subtitle: 'Desbloqueo rápido de cuerpo completo',
          durationMinutes: 5,
          badgeColor: '#10B981',
          category: 'quick',
          exercisesQuery: { limit: 4 },
        },
        exercises: allExercises.slice(0, 4),
      });
      return;
    }

    if (type === '10min') {
      setSelectedSeries({
        series: {
          id: 'filter-10min',
          title: 'Rutina Completa 10 Min',
          subtitle: 'Apertura articular profunda y movilidad',
          durationMinutes: 10,
          badgeColor: '#38BDF8',
          category: 'quick',
          exercisesQuery: { limit: 8 },
        },
        exercises: allExercises.slice(0, 8),
      });
      return;
    }

    // Floor
    const floorExercises = allExercises.filter((e) => e.position === 'suelo');
    setSelectedSeries({
      series: {
        id: 'filter-floor',
        title: 'Fluidez en Suelo',
        subtitle: 'Estiramientos largos y descompresión',
        durationMinutes: 8,
        badgeColor: '#EC4899',
        category: 'quick',
        exercisesQuery: { position: 'suelo', limit: 6 },
      },
      exercises: floorExercises.slice(0, 6),
    });
  };

  const openJointFocus = (category: string, title: string, subtitle: string) => {
    const list = allExercises.filter((e) => e.category === category);
    setSelectedSeries({
      series: {
        id: `joint-${category}`,
        title,
        subtitle,
        durationMinutes: 7,
        badgeColor: '#10B981',
        category: 'targeted',
        exercisesQuery: { category, limit: 5 },
      },
      exercises: list.slice(0, 5).length > 0 ? list.slice(0, 5) : allExercises.slice(0, 5),
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2 animate-fade-in">
      {/* Date & Greeting */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {dateStr}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-0.5">
          Buenos Días. Listo para moverte.
        </h1>
      </div>

      {/* 1-TAP DAILY HERO CARD (Matching Stitch Screen 1) */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 shadow-xl shadow-emerald-600/20 transition-all hover:shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Rutina del Día</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-100">8 MIN</span>
        </div>

        <div className="mt-4">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Movilidad Matutina Completa
          </h2>
          <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed max-w-xs">
            Desbloqueo suave de columna, cuello y caderas para empezar el día con agilidad.
          </p>
        </div>

        {/* Circular Poses Preview Badges */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {['#10B981', '#38BDF8', '#F59E0B', '#EC4899'].map((color, i) => (
              <div
                key={i}
                style={{ backgroundColor: color }}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-emerald-700 flex items-center justify-center text-[10px] font-extrabold shadow-xs"
              >
                {i + 1}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const morning = PREDEFINED_SERIES.find((s) => s.id === 'quick-morning-flow');
              if (morning) openSeries(morning);
              else openQuickFilter('10min');
            }}
            className="flex items-center gap-2 rounded-full bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-2.5 text-xs font-extrabold shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Comenzar Ahora</span>
          </button>
        </div>
      </div>

      {/* QUICK FILTER CHIPS */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Filtros Rápidos
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => openQuickFilter('5min')}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            <span>5 min Express</span>
          </button>
          <button
            onClick={() => openQuickFilter('10min')}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            <span>10 min Estándar</span>
          </button>
          <button
            onClick={() => openQuickFilter('chair')}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Armchair className="h-3.5 w-3.5 text-purple-500" />
            <span>En Silla / Oficina</span>
          </button>
          <button
            onClick={() => openQuickFilter('floor')}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500/40 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Move className="h-3.5 w-3.5 text-pink-500" />
            <span>En Suelo</span>
          </button>
        </div>
      </div>

      {/* JOINT FOCUS GRID (Matching Stitch Screen 1) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Enfoque Articular Directo
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Rango de Movimiento
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Caderas */}
          <div
            onClick={() =>
              openJointFocus('caderas_gluteos', 'Apertura de Cadera', 'Desbloqueo de flexores y rotación 90/90')
            }
            className="group rounded-3xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-4 shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer active:scale-98"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold text-sm mb-3 group-hover:scale-110 transition-transform">
              🦴
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Caderas & Glúteos
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Apertura 90/90 · 6 min
            </p>
          </div>

          {/* Card 2: Columna */}
          <div
            onClick={() =>
              openJointFocus('lumbar_core', 'Columna & Espalda', 'Rotación torácica y flexión suave')
            }
            className="group rounded-3xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-4 shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer active:scale-98"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm mb-3 group-hover:scale-110 transition-transform">
              🧘
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Columna & Espalda
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Rotación & Fluidez · 7 min
            </p>
          </div>

          {/* Card 3: Hombros */}
          <div
            onClick={() =>
              openJointFocus('cuello_toracico', 'Hombros & Cuello', 'Rango de movimiento y postura')
            }
            className="group rounded-3xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-4 shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer active:scale-98"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-extrabold text-sm mb-3 group-hover:scale-110 transition-transform">
              💪
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Hombros & Cuello
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Rango Articular · 5 min
            </p>
          </div>

          {/* Card 4: Piernas */}
          <div
            onClick={() =>
              openJointFocus('tobillos_piernas', 'Tobillos & Piernas', 'Cadena posterior y estabilidad')
            }
            className="group rounded-3xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-4 shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer active:scale-98"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-extrabold text-sm mb-3 group-hover:scale-110 transition-transform">
              🦶
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Tobillos & Piernas
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cadena Posterior · 6 min
            </p>
          </div>
        </div>
      </div>

      {/* Pre-workout slide-up modal */}
      {selectedSeries && (
        <PreWorkoutModal
          open={!!selectedSeries}
          onClose={() => setSelectedSeries(null)}
          title={selectedSeries.series.title}
          subtitle={selectedSeries.series.subtitle}
          initialExercises={selectedSeries.exercises}
        />
      )}
    </div>
  );
}
