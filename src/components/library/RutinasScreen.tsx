import { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  Activity,
  Play,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import { PREDEFINED_SERIES, type PredefinedSeries } from '../../data/series';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { useQuizStore } from '../../stores/useQuizStore';
import type { Category, Exercise } from '../../types/exercise';
import { cn } from '../common/Button';

interface RutinasScreenProps {
  onSelectSeries: (series: PredefinedSeries, exercises: Exercise[]) => void;
}

const CATEGORY_CHIPS: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'caderas_gluteos', label: 'Caderas' },
  { id: 'lumbar_core', label: 'Columna' },
  { id: 'cuello_toracico', label: 'Cuello & Espalda' },
  { id: 'hombros_munecas', label: 'Hombros' },
  { id: 'tobillos_piernas', label: 'Piernas & Tobillos' },
];

export function RutinasScreen({ onSelectSeries }: RutinasScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'todos'>('todos');
  const openQuiz = useQuizStore((s) => s.openQuiz);
  const startRoutine = useWorkoutStore((s) => s.startRoutine);

  const allExercises = useLiveQuery(() => db.exercises.toArray(), []) || [];

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchQuery =
        searchQuery.trim() === '' ||
        ex.name_es.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.target_joints.some((j) => j.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.cues_es.some((cue) =>
          cue.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchCategory =
        selectedCategory === 'todos' || ex.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [allExercises, searchQuery, selectedCategory]);

  const handleOpenPathSeries = (seriesId: string) => {
    const series = PREDEFINED_SERIES.find((s) => s.id === seriesId);
    if (!series || allExercises.length === 0) return;

    let list = [...allExercises];
    if (series.exercisesQuery.category) {
      list = list.filter((e) => e.category === series.exercisesQuery.category);
    }
    if (series.exercisesQuery.position) {
      list = list.filter((e) => e.position === series.exercisesQuery.position);
    }
    const limit = series.exercisesQuery.limit || 6;
    const finalExercises = list.slice(0, limit);
    onSelectSeries(series, finalExercises.length > 0 ? finalExercises : allExercises.slice(0, 6));
  };

  const handleLaunchSingle = (ex: Exercise) => {
    const routine: Routine = {
      id: `single-${ex.id}-${Date.now()}`,
      kind: 'custom',
      label: `Práctica · ${ex.name_es}`,
      exercises: [ex],
      perExerciseSec: ex.default_duration_sec,
      transitionSec: 5,
    };
    startRoutine(routine);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-3 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Explora tus Rutinas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Encuentra la rutina ideal para tu día o articulación
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por articulación, ejercicio o tiempo..."
          className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* THE 3 USER PATHS (High-Impact Hero Cards) */}
      <div className="flex flex-col gap-3.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          Elige Tu Camino de Movilidad
        </span>

        {/* Path 1: Moverse a Diario */}
        <div
          onClick={() => handleOpenPathSeries('quick-office-chair')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/15 dark:to-teal-500/10 border border-emerald-500/20 p-5 shadow-xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              5–8 Min Express
            </span>
          </div>
          <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-slate-50">
            🏃 Camino 1: Moverse a Diario
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Pausas en silla de oficina, desentumecimiento matutino y calma nocturna sin sudor.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Ver Rutinas Rápidas</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Path 2: Enfoque Articular */}
        <div
          onClick={() => handleOpenPathSeries('quick-hips-1')}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500/10 to-indigo-500/5 dark:from-sky-500/15 dark:to-indigo-500/10 border border-sky-500/20 p-5 shadow-xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-[10px] font-bold text-sky-700 dark:text-sky-300">
              Rango & FRC
            </span>
          </div>
          <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-slate-50">
            🎯 Camino 2: Enfoque Articular
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Apertura profunda de caderas (90/90), rotación de columna y movilidad de hombros.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Explorar Zonas Específicas</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Path 3: Creador a Medida */}
        <div
          onClick={openQuiz}
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-500/15 dark:to-orange-500/10 border border-amber-500/20 p-5 shadow-xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
              Configurador
            </span>
          </div>
          <h2 className="mt-3 text-base font-extrabold text-slate-900 dark:text-slate-50">
            ✨ Camino 3: Creador a Medida
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Diseña un flujo único eligiendo tu articulación diana, tiempo exacto y si prefieres silla o suelo.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Abrir Generador de Flujo</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Movement Catalog & Chips */}
      <div className="flex flex-col gap-3.5 mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-50">
            Catálogo de Movimientos ({filteredExercises.length})
          </h2>
        </div>

        {/* Category Chips Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer',
                selectedCategory === chip.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Exercises List */}
        <div className="flex flex-col gap-2.5">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => handleLaunchSingle(ex)}
              className="flex items-center justify-between rounded-2xl bg-white dark:bg-surface border border-slate-200/70 dark:border-white/5 p-3.5 shadow-2xs hover:border-emerald-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  {ex.default_duration_sec}s
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    {ex.name_es}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {ex.target_joints.join(', ')} · {ex.position === 'silla' ? '🪑 Silla' : '🧘 Suelo'}
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Play className="h-3.5 w-3.5 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
