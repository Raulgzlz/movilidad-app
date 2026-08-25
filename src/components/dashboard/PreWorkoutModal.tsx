import { useState } from 'react';
import { Play, Minus, Plus, Armchair, Footprints, Move, Landmark, ShieldCheck, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Exercise } from '../../types/exercise';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { todayKey } from '../../lib/routineEngine';

const POSITION_ICONS: Record<Exercise['position'], typeof Armchair> = {
  silla: Armchair,
  pie: Footprints,
  suelo: Move,
  pared: Landmark,
};

const BADGE_COLORS = [
  'bg-emerald-500 text-white',
  'bg-sky-500 text-white',
  'bg-amber-500 text-white',
  'bg-pink-500 text-white',
  'bg-purple-500 text-white',
  'bg-indigo-500 text-white',
];

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
  // Estado local para permitir ajustar la duración individual de cada ejercicio (- 45s +)
  const [durations, setDurations] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialExercises.forEach((e) => {
      map[e.id] = e.default_duration_sec || 45;
    });
    return map;
  });

  if (!open || initialExercises.length === 0) return null;

  const updateDuration = (id: string, delta: number) => {
    setDurations((prev) => {
      const current = prev[id] || 45;
      const next = Math.max(15, Math.min(180, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const totalSec = initialExercises.reduce(
    (acc, e) => acc + (durations[e.id] || e.default_duration_sec || 45),
    0,
  );
  const totalMins = Math.ceil(totalSec / 60);

  const handleStart = () => {
    // Aplicar las duraciones personalizadas
    const customizedExercises = initialExercises.map((e) => ({
      ...e,
      default_duration_sec: durations[e.id] || e.default_duration_sec || 45,
    }));

    const routine: Routine = {
      id: `custom-series-${todayKey()}`,
      kind: 'hoy',
      label: title,
      exercises: customizedExercises,
      perExerciseSec: customizedExercises[0]?.default_duration_sec || 45,
      transitionSec: 10,
    };

    onClose();
    startRoutine(routine);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {totalMins} MINUTOS
            </span>
            <Heart className="h-4 w-4 text-slate-300 hover:text-pink-500 cursor-pointer transition-colors" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {subtitle}. Ajusta la duración de cada movimiento si lo deseas.
          </p>
        </div>

        {/* Exercises List with Duration Steppers (- 45s +) */}
        <div className="flex flex-col gap-2.5 my-2">
          {initialExercises.map((ex, index) => {
            const PositionIcon = POSITION_ICONS[ex.position] || Armchair;
            const badgeClass = BADGE_COLORS[index % BADGE_COLORS.length];
            const currentDuration = durations[ex.id] || ex.default_duration_sec || 45;

            return (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] p-3.5 border border-slate-200/70 dark:border-white/5 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Circular Avatar Badge (Bend Style) */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold shadow-sm ${badgeClass}`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {ex.name_es}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 capitalize">
                        <PositionIcon className="h-3 w-3" />
                        {ex.position}
                      </span>
                      {ex.bilateral && <span>· 🔄 Bilateral</span>}
                    </div>
                  </div>
                </div>

                {/* Duration Stepper Controls (- 45s +) */}
                <div className="flex items-center gap-1.5 shrink-0 ml-2 bg-white dark:bg-surface rounded-xl p-1 border border-slate-200/80 dark:border-white/10 shadow-xs">
                  <button
                    onClick={() => updateDuration(ex.id, -15)}
                    aria-label="Disminuir tiempo"
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all active:scale-90 cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="tabular text-xs font-extrabold text-slate-800 dark:text-slate-200 w-9 text-center">
                    {currentDuration}s
                  </span>
                  <button
                    onClick={() => updateDuration(ex.id, 15)}
                    aria-label="Aumentar tiempo"
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all active:scale-90 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audio features indicator */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 py-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Campanas 528Hz · Olas Zen · Aviso cambio de lado</span>
        </div>

        {/* Sticky Start Button */}
        <div className="pt-2">
          <Button
            size="lg"
            onClick={handleStart}
            className="w-full text-base font-extrabold shadow-lg shadow-emerald-500/25"
          >
            <Play className="h-5 w-5 fill-current" />
            INICIAR SESIÓN ({totalMins} MIN)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
