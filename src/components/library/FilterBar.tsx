import { useState } from 'react';
import { Activity, Play, Sparkles } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/dexie';
import { cn } from '../common/Button';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import type { Category, Exercise } from '../../types/exercise';

const CATEGORY_FILTERS: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'cuello_toracico', label: 'Cuello' },
  { id: 'hombros_munecas', label: 'Hombros' },
  { id: 'lumbar_core', label: 'Lumbar' },
  { id: 'caderas_gluteos', label: 'Caderas' },
  { id: 'tobillos_piernas', label: 'Piernas/Tobillos' },
  { id: 'cuerpo_completo', label: 'Completo' },
];

const POSITION_FILTERS: { id: 'todos' | Exercise['position']; label: string }[] = [
  { id: 'todos', label: 'Cualquier postura' },
  { id: 'silla', label: 'En silla' },
  { id: 'pie', label: 'De pie' },
  { id: 'suelo', label: 'En suelo' },
  { id: 'pared', label: 'En pared' },
];

export function FilterBar() {
  const [category, setCategory] = useState<Category | 'todos'>('todos');
  const [position, setPosition] = useState<'todos' | Exercise['position']>('todos');
  const [officeOnly, setOfficeOnly] = useState(false);

  const startRoutine = useWorkoutStore((s) => s.startRoutine);
  const exercises = useLiveQuery(() => db.exercises.toArray(), []);
  const all = exercises ?? [];

  const filtered = all.filter((ex) => {
    if (category !== 'todos' && ex.category !== category) return false;
    if (position !== 'todos' && ex.position !== position) return false;
    if (officeOnly && ex.position === 'suelo') return false;
    return true;
  });

  const launchSingleExercise = (ex: Exercise) => {
    const routine: Routine = {
      id: `single-${ex.id}-${Date.now()}`,
      kind: 'sos',
      label: `Práctica · ${ex.name_es}`,
      exercises: [ex],
      perExerciseSec: ex.default_duration_sec,
      transitionSec: 5,
    };
    startRoutine(routine);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Barra superior con contador y filtro Modo Oficina */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-secondary">
          {filtered.length} de {all.length} movimientos
        </h2>
        <button
          onClick={() => setOfficeOnly((v) => !v)}
          className={cn(
            'chip cursor-pointer transition-all duration-300 ease-spring',
            officeOnly
              ? 'bg-sage-500/15 text-sage-600 ring-1 ring-sage-500/40 dark:text-sage-300'
              : 'bg-black/5 text-secondary ring-1 ring-transparent dark:bg-white/5',
          )}
        >
          Modo Oficina
        </button>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setCategory(f.id)}
            className={cn(
              'chip cursor-pointer transition-all duration-300 ease-spring',
              category === f.id
                ? 'bg-sage-500/15 text-sage-600 ring-1 ring-sage-500/40 dark:text-sage-300'
                : 'bg-black/5 text-secondary dark:bg-white/5 hover:opacity-80',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Postura */}
      <div className="flex flex-wrap gap-2">
        {POSITION_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setPosition(f.id)}
            className={cn(
              'chip cursor-pointer transition-all duration-300 ease-spring',
              position === f.id
                ? 'bg-skyx-400/15 text-skyx-500 dark:text-skyx-300 ring-1 ring-skyx-400/30'
                : 'bg-black/5 text-secondary dark:bg-white/5 hover:opacity-80',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de tarjetas */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((ex) => (
          <article
            key={ex.id}
            className="glass rounded-3xl p-5 transition-all duration-300 hover:ring-sage-500/25"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-tight text-ink-900 dark:text-ink-50">
                  {ex.name_es}
                </h3>
                <p className="mt-0.5 text-xs text-secondary">{ex.name_en}</p>
              </div>
              <span className="tabular shrink-0 rounded-full bg-sage-500/15 px-2.5 py-1 text-xs font-semibold text-sage-600 dark:text-sage-300">
                {ex.default_duration_sec}s
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              <span className="chip bg-black/5 text-secondary capitalize dark:bg-white/5">
                {ex.category.replace('_', ' ')}
              </span>
              <span className="chip bg-black/5 capitalize text-secondary dark:bg-white/5">
                {ex.position}
              </span>
              <span className="chip bg-black/5 capitalize text-secondary dark:bg-white/5">
                {ex.difficulty}
              </span>
              {ex.bilateral && (
                <span className="chip bg-skyx-400/10 text-skyx-400 dark:bg-skyx-400/10">
                  bilateral
                </span>
              )}
            </div>

            {ex.target_joints.length > 0 && (
              <p className="mt-3 text-xs text-secondary">
                <strong className="font-semibold text-ink-700 dark:text-ink-200">
                  Articulaciones:
                </strong>{' '}
                {ex.target_joints.join(', ')}
              </p>
            )}

            <ul className="mt-2.5 flex flex-col gap-1.5 text-xs text-secondary">
              {ex.cues_es.slice(0, 2).map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500/70" />
                  <span className="line-clamp-2 leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>

            {ex.contraindications.length > 0 && (
              <p className="mt-2.5 text-[11px] text-amber-600 dark:text-amber-300">
                ⚠ {ex.contraindications.join(' · ')}
              </p>
            )}

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-secondary flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-sage-400" />
                Respiración: {ex.breathing_rhythm.replace('_', ' ')}
              </span>
              <button
                onClick={() => launchSingleExercise(ex)}
                className="btn-primary h-9 px-3.5 text-xs gap-1.5 rounded-xl"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Practicar ({ex.default_duration_sec}s)
              </button>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl bg-black/[0.03] p-8 text-center dark:bg-white/[0.03]">
            <Activity className="h-6 w-6 text-secondary" />
            <p className="text-sm text-secondary">
              Ningún movimiento coincide con esos filtros.
            </p>
            <button
              onClick={() => {
                setCategory('todos');
                setPosition('todos');
                setOfficeOnly(false);
              }}
              className="text-xs font-semibold text-sage-600 dark:text-sage-300"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
