import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Sparkles, Play, ShieldCheck } from 'lucide-react';
import { db } from '../../db/dexie';
import { useWorkoutStore, type Routine } from '../../stores/useWorkoutStore';
import { todayKey } from '../../lib/routineEngine';
import { cn } from '../common/Button';

interface BodyZone {
  id: string;
  name: string;
  sub: string;
  cx: number;
  cy: number;
  reliefPct: number;
  color: string;
  exercisesCount: number;
}

export function BodyTensionMap() {
  const [activeZoneId, setActiveZoneId] = useState<string>('cuello_toracico');
  const startRoutine = useWorkoutStore((s) => s.startRoutine);

  const workouts = useLiveQuery(() => db.workouts.toArray(), []);
  const count = workouts?.length || 0;

  const ZONES: BodyZone[] = [
    {
      id: 'cuello_toracico',
      name: 'Cuello & Cervical',
      sub: 'Trapecios y base del cráneo',
      cx: 80,
      cy: 48,
      reliefPct: Math.min(96, 74 + count * 3),
      color: '#10B981',
      exercisesCount: 8,
    },
    {
      id: 'hombros_munecas',
      name: 'Hombros & Escápulas',
      sub: 'Manguito rotador y dorsales',
      cx: 50,
      cy: 75,
      reliefPct: Math.min(92, 68 + count * 3),
      color: '#10B981',
      exercisesCount: 6,
    },
    {
      id: 'lumbar_core',
      name: 'Espalda Baja & Lumbar',
      sub: 'Descompresión de discos L4-S1',
      cx: 80,
      cy: 135,
      reliefPct: Math.min(88, 62 + count * 4),
      color: '#F59E0B',
      exercisesCount: 7,
    },
    {
      id: 'caderas_gluteos',
      name: 'Caderas & Pelvis',
      sub: 'Flexores de cadera y glúteos',
      cx: 80,
      cy: 172,
      reliefPct: Math.min(94, 70 + count * 3),
      color: '#10B981',
      exercisesCount: 9,
    },
    {
      id: 'tobillos_piernas',
      name: 'Piernas & Tobillos',
      sub: 'Isquios, gemelos y fascia',
      cx: 74,
      cy: 245,
      reliefPct: Math.min(90, 65 + count * 3),
      color: '#10B981',
      exercisesCount: 5,
    },
  ];

  const activeZone = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];
  const overallScore = Math.round(
    ZONES.reduce((acc, z) => acc + z.reliefPct, 0) / ZONES.length,
  );

  const launchZoneRelief = async (zoneId: string, label: string) => {
    const all = await db.exercises.toArray();
    const matches = all.filter(
      (e) =>
        e.category === zoneId ||
        (zoneId === 'cuello_toracico' && e.category === 'hombros_munecas'),
    );
    const selected = matches.slice(0, 3);
    if (selected.length === 0) return;

    const routine: Routine = {
      id: `zone-${zoneId}-${todayKey()}`,
      kind: 'sos',
      label: `Alivio · ${label}`,
      exercises: selected,
      perExerciseSec: 40,
      transitionSec: 10,
    };
    startRoutine(routine);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-surface p-5 sm:p-6 shadow-[0_8px_30px_-6px_rgba(15,23,42,0.04)] border border-slate-100 dark:border-white/5 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400">
            Biometría & Tensión
          </span>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Mapa de Alivio Muscular
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{overallScore}/100 Óptimo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* Sleek Minimalist Silhouette SVG */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-50/80 to-slate-100/40 dark:from-white/[0.03] dark:to-transparent border border-slate-100 dark:border-white/5 relative overflow-hidden">
          <svg
            viewBox="0 0 160 300"
            className="h-56 w-auto drop-shadow-xs select-none"
            fill="none"
          >
            {/* Minimalist modern human form */}
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Cabeza */}
            <circle
              cx="80"
              cy="28"
              r="14"
              className="fill-slate-100 dark:fill-white/10 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="1.5"
            />
            {/* Cuello y Trapecios */}
            <path
              d="M74 42 L86 42 L94 56 L66 56 Z"
              className="fill-slate-100 dark:fill-white/10 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="1.5"
            />
            {/* Torso */}
            <path
              d="M66 56 L94 56 L90 148 L70 148 Z"
              className="fill-slate-100/70 dark:fill-white/5 stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="1.5"
            />
            {/* Brazos */}
            <path
              d="M66 58 C54 75, 48 115, 45 155"
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M94 58 C106 75, 112 115, 115 155"
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Piernas */}
            <path
              d="M72 148 L68 280"
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M88 148 L92 280"
              className="stroke-slate-300 dark:stroke-slate-700"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Glowing Interactive Joint Target Nodes */}
            {ZONES.map((zone) => {
              const isSelected = activeZoneId === zone.id;
              return (
                <g
                  key={zone.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setActiveZoneId(zone.id)}
                >
                  {/* Aura pulsante en la zona seleccionada */}
                  {isSelected && (
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r="14"
                      className="fill-emerald-500/20 animate-ping"
                    />
                  )}
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={isSelected ? 8 : 6}
                    fill={zone.color}
                    className="transition-all duration-300 drop-shadow-md"
                  />
                  <circle
                    cx={zone.cx}
                    cy={zone.cy}
                    r={isSelected ? 3 : 2}
                    fill="#FFFFFF"
                  />
                </g>
              );
            })}
          </svg>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-2">
            Toca una zona para descomprimir
          </span>
        </div>

        {/* Info & Action Card for Selected Zone */}
        <div className="sm:col-span-7 flex flex-col justify-between gap-3 h-full">
          <div className="rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] p-4 border border-slate-100 dark:border-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {activeZone.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeZone.sub}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                {activeZone.reliefPct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3.5 h-2 w-full rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${activeZone.reliefPct}%`,
                  backgroundColor: activeZone.color,
                }}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {activeZone.exercisesCount} ejercicios biomecánicos disponibles para liberar tensión acumulada.
            </p>

            <button
              onClick={() => void launchZoneRelief(activeZone.id, activeZone.name)}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-4 text-xs font-bold shadow-md transition-all hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Aliviar {activeZone.name} (3 min)
            </button>
          </div>

          {/* Quick Zone Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ZONES.map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZoneId(z.id)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer',
                  activeZoneId === z.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200/70 dark:border-white/10 hover:border-slate-300'
                )}
              >
                {z.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
