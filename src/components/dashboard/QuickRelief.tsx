import { HeartPulse, ShieldAlert, Timer, Play } from 'lucide-react';
import { ZONE_OPTIONS } from '../quiz/zoneOptions';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { db } from '../../db/dexie';
import { todayKey } from '../../lib/routineEngine';

/**
 * "Alivio Rápido en 3 clics": toca la zona que te duele y arranca
 * inmediatamente 3 ejercicios de esa zona (sin quiz, sin tirarse al suelo).
 */
export function QuickRelief() {
  const startRoutine = useWorkoutStore((s) => s.startRoutine);

  const SOS_ZONES = ZONE_OPTIONS.filter((z) => z.id !== 'cuerpo_completo');

  const launchSos = async (zoneId: string, labelShort: string) => {
    const exercises = await db.exercises.toArray();
    const eligible = exercises.filter(
      (ex) =>
        (ex.category === zoneId ||
          (zoneId === 'cuello_toracico' && ex.category === 'hombros_munecas')) &&
        ex.position !== 'suelo',
    );

    const top = eligible
      .sort((a, b) => a.default_duration_sec - b.default_duration_sec)
      .slice(0, 3);

    if (top.length === 0) return;

    const day = todayKey();
    const routine: Routine = {
      id: `sos-${zoneId}-${day}`,
      kind: 'sos',
      label: `Alivio Rápido · ${labelShort}`,
      exercises: top,
      perExerciseSec: 35,
      transitionSec: 8,
    };
    startRoutine(routine);
  };

  return (
    <section className="glass rounded-3xl p-5 border border-border">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-500">
            <HeartPulse className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Alivio Rápido por Zona
            </h2>
            <p className="text-xs text-secondary">
              Toca la zona donde sientes tensión ahora mismo
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary rounded-full bg-slate-100 dark:bg-white/5 px-2.5 py-1">
          <Timer className="h-3 w-3" />
          ~90 seg
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {SOS_ZONES.map((zone) => (
          <button
            key={zone.id}
            onClick={() => void launchSos(zone.id, zone.labelShort)}
            className="group flex flex-col items-start justify-between rounded-2xl bg-slate-50 dark:bg-white/[0.03] p-3.5 border border-border hover:border-rose-500/30 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all duration-200 text-left active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-xs text-slate-700 dark:text-slate-300 group-hover:text-rose-500">
                <zone.Icon className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <Play className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity fill-current text-rose-500" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                {zone.labelShort}
              </span>
              <span className="text-[10px] text-secondary line-clamp-1 mt-0.5">
                {zone.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-500/20">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="leading-snug">
          Si el dolor es agudo, punzante o irradia a una extremidad, descansa y consulta a un especialista antes de continuar.
        </span>
      </div>
    </section>
  );
}
