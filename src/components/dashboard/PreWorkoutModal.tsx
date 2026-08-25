import { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { Exercise } from '../../types/exercise';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { todayKey } from '../../lib/routineEngine';

interface PreWorkoutModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  initialExercises: Exercise[];
}

export function PreWorkoutModal({
  open,
  onClose,
  title,
  subtitle,
  initialExercises,
}: PreWorkoutModalProps) {
  const startRoutine = useWorkoutStore((s) => s.startRoutine);
  const [durations] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialExercises.forEach((e) => {
      map[e.id] = e.default_duration_sec || 45;
    });
    return map;
  });

  if (!open || initialExercises.length === 0) return null;

  const totalSec = initialExercises.reduce(
    (acc, e) => acc + (durations[e.id] || e.default_duration_sec || 45),
    0,
  );
  const totalMins = Math.max(1, Math.ceil(totalSec / 60));

  const handleStart = () => {
    const customizedExercises = initialExercises.map((e) => ({
      ...e,
      default_duration_sec: durations[e.id] || e.default_duration_sec || 45,
    }));

    const routine: Routine = {
      id: `routine-${todayKey()}-${Date.now()}`,
      kind: 'hoy',
      label: title,
      exercises: customizedExercises,
      perExerciseSec: customizedExercises[0]?.default_duration_sec || 45,
      transitionSec: 5,
    };

    onClose();
    startRoutine(routine);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white dark:bg-surface border border-slate-200/80 dark:border-white/10 shadow-2xl animate-slide-up overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Close */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Vista Previa
            </span>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-2">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {subtitle || `${initialExercises.length} movimientos · Cero sudor · Enfoque articular`}
          </p>

          {/* Stats Bar (3 items) */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 dark:bg-white/5 p-2.5 border border-slate-200/60 dark:border-white/5 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {totalMins} min total
              </span>
              <span className="text-[10px] text-slate-400">Duración</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200/60 dark:border-white/5">
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                {initialExercises.length} ejercicios
              </span>
              <span className="text-[10px] text-slate-400">Secuencia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                Suave
              </span>
              <span className="text-[10px] text-slate-400">Intensidad</span>
            </div>
          </div>
        </div>

        {/* Scrollable Exercise Sequence */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 pt-3 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Secuencia de Movimientos
          </span>

          {initialExercises.map((ex, idx) => (
            <div
              key={ex.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {ex.name_es}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {ex.target_joints.join(', ')} · {ex.position === 'silla' ? '🪑 Silla' : '🧘 Suelo'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-700 dark:text-slate-300">
                <span>{durations[ex.id] || ex.default_duration_sec}s</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-surface">
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-4 px-6 shadow-lg shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Comenzar Rutina ▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
