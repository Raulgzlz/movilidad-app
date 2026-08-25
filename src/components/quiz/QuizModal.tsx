import { useCallback, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ZONE_OPTIONS } from './zoneOptions';
import { useQuizStore, QUIZ_STEPS } from '../../stores/useQuizStore';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { db } from '../../db/dexie';
import { generateRoutine } from '../../lib/routineEngine';
import type { TargetArea } from '../../types/user';

const DURATIONS: { value: 5 | 10 | 15; label: string; sub: string }[] = [
  { value: 5, label: '5 min', sub: 'Reset Express' },
  { value: 10, label: '10 min', sub: 'Estándar' },
  { value: 15, label: '15 min', sub: 'Liberación Profunda' },
];

const ENVIRONMENTS: {
  value: 'cualquiera' | 'oficina';
  label: string;
  sub: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { value: 'cualquiera', label: 'En casa', sub: 'Puedo usar el suelo', Icon: BedDouble },
  { value: 'oficina', label: 'En la oficina', sub: 'Silla o de pie, sin suelo', Icon: Building2 },
];

const DIFFICULTIES: {
  value: 'principiante' | 'intermedio' | 'avanzado';
  label: string;
  sub: string;
}[] = [
  { value: 'principiante', label: 'Principiante', sub: 'Movimientos suaves' },
  { value: 'intermedio', label: 'Intermedio', sub: 'Mayor rango y control' },
  { value: 'avanzado', label: 'Avanzado', sub: 'Profundidad y fuerza' },
];

export function QuizModal() {
  const { open, step, answers, setAnswer, next, prev, closeQuiz, resetQuiz, isComplete } =
    useQuizStore();
  const startRoutine = useWorkoutStore((s) => s.startRoutine);
  const [generating, setGenerating] = useState(false);

  const stepId = QUIZ_STEPS[step];

  const options: {
    id: string;
    label: string;
    sub: string;
    Icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  }[] = useMemo(() => {
    if (stepId === 'zona')
      return ZONE_OPTIONS.map((z) => ({
        id: z.id as string,
        label: z.label,
        sub: z.description,
        Icon: z.Icon as never,
      }));
    if (stepId === 'tiempo')
      return DURATIONS.map((d) => ({ id: String(d.value), label: d.label, sub: d.sub }));
    if (stepId === 'entorno')
      return ENVIRONMENTS.map((e) => ({ id: e.value, label: e.label, sub: e.sub, Icon: e.Icon }));
    return DIFFICULTIES.map((d) => ({ id: d.value, label: d.label, sub: d.sub }));
  }, [stepId]);

  const currentAnswer: string | undefined =
    stepId === 'zona'
      ? (answers.targetArea as string)
      : stepId === 'tiempo'
        ? (answers.durationMinutes as unknown as string)
        : stepId === 'entorno'
          ? answers.environment
          : answers.difficulty;

  const handleSelect = (id: string) => {
    if (!open) return;
    if (stepId === 'zona') setAnswer('targetArea', id as TargetArea);
    else if (stepId === 'tiempo') setAnswer('durationMinutes', Number(id) as 5 | 10 | 15);
    else if (stepId === 'entorno') setAnswer('environment', id as 'cualquiera' | 'oficina');
    else setAnswer('difficulty', id as 'principiante' | 'intermedio' | 'avanzado');

    // auto-avance si no es el último paso
    if (step < QUIZ_STEPS.length - 1) {
      setTimeout(() => next(), 250);
    }
  };

  const generate = useCallback(async () => {
    const a = useQuizStore.getState().answers;
    if (!a.targetArea || !a.durationMinutes || !a.environment || !a.difficulty) return;
    setGenerating(true);
    try {
      const all = await db.exercises.toArray();
      const exercises = generateRoutine(all, {
        targetArea: a.targetArea,
        durationMinutes: a.durationMinutes,
        environment: a.environment,
        difficulty: a.difficulty,
      });
      if (exercises.length === 0) return;

      const kind = a.environment === 'oficina' ? 'quiz' : 'quiz';
      const routine: Routine = {
        id: `flow-${a.targetArea}-${a.durationMinutes}m-${a.environment}`,
        kind,
        label: `Flujo personalizado · ${a.durationMinutes} min`,
        exercises,
        perExerciseSec: a.durationMinutes === 5 ? 35 : 45,
        transitionSec: a.durationMinutes === 5 ? 10 : 15,
      };
      closeQuiz();
      // micro-pausa para que el modal cierre antes de arrancar (UX más suave)
      setTimeout(() => startRoutine(routine), 350);
    } finally {
      setGenerating(false);
    }
  }, [closeQuiz, startRoutine]);

  return (
    <Modal
      open={open}
      onClose={() => {
        resetQuiz();
        closeQuiz();
      }}
      title={
        stepId === 'zona'
          ? '¿Dónde sientes la tensión?'
          : stepId === 'tiempo'
            ? '¿Cuánto tienes?'
            : stepId === 'entorno'
              ? '¿Dónde entrenas?'
              : '¿Tu nivel?'
      }
      subtitle={
        stepId === 'zona'
          ? 'El motor prioriza el 70% de los movimientos hacia esa zona.'
          : stepId === 'tiempo'
            ? 'Cada minuto ≈ un ejercicio completo + transición.'
            : stepId === 'entorno'
              ? 'Oficina excluye todo movimiento en el suelo.'
              : 'Ajustamos rango e intensidad del flujo.'
      }
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          {QUIZ_STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ease-spring ${
                i <= step ? 'w-6 bg-sage-500' : 'w-3 bg-ink-500/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            resetQuiz();
            closeQuiz();
          }}
          className="btn-ghost flex h-9 w-9 rounded-xl"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const selected = currentAnswer === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`group flex items-center gap-3 rounded-2xl p-4 text-left ring-1 transition-all duration-300 ease-spring ${
                selected
                  ? 'bg-sage-500/15 ring-sage-500/50 shadow-[0_8px_30px_-14px_rgba(16,185,129,0.5)]'
                  : 'ring-transparent bg-black/[0.03] hover:bg-black/[0.05] dark:bg-white/[0.04] dark:hover:bg-white/[0.07]'
              } ${generating ? 'pointer-events-none opacity-60' : ''}`}
            >
              {opt.Icon && (
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    selected
                      ? 'bg-sage-500/25 text-sage-600 dark:text-sage-300'
                      : 'bg-black/5 text-secondary dark:bg-white/5'
                  }`}
                >
                  <opt.Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{opt.label}</span>
                <span className="block truncate text-xs text-secondary">
                  {opt.sub}
                </span>
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-spring ${
                  selected
                    ? 'bg-sage-500 text-white scale-100'
                    : 'scale-75 bg-black/10 opacity-0 dark:bg-white/10'
                }`}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button
          variant="glass"
          disabled={step === 0 || generating}
          onClick={prev}
          className="h-11 w-11 !px-0"
          aria-label="Anterior"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        {step === QUIZ_STEPS.length - 1 ? (
          <Button
            onClick={() => void generate()}
            disabled={!isComplete() || generating}
            className="min-w-44"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? 'Generando…' : 'Comenzar Flujo'}
          </Button>
        ) : (
          <Button
            onClick={next}
            disabled={!currentAnswer}
            className="min-w-40"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Modal>
  );
}
