import { db } from '../db/dexie';
import type { Exercise } from '../types/exercise';

export interface LogPayload {
  routineId: string;
  durationSeconds: number;
  exercisesCompleted: string[];
  rating?: 1 | 2 | 3 | 4 | 5;
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysAgoKey(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localDateKey(d);
}

/** Racha actual: días consecutivos finalizando en hoy (o ayer si hoy aún no). */
export function computeStreak(activeDates: Set<string>): number {
  if (activeDates.has(localDateKey(new Date()))) {
    let streak = 0;
    let offset = 0;
    while (activeDates.has(daysAgoKey(offset))) {
      streak++;
      offset++;
    }
    return streak;
  }
  // Si hoy aún no hay registro, la racha sigue viva desde ayer
  let streak = 0;
  let offset = 1;
  while (activeDates.has(daysAgoKey(offset))) {
    streak++;
    offset++;
  }
  return streak;
}

/** Racha récord: mayor racha consecutiva histórica. */
export function computeBestStreak(activeDates: Set<string>): number {
  const sorted = [...activeDates].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    if (prev) {
      const prevDate = new Date(prev + 'T00:00:00');
      const curDate = new Date(key + 'T00:00:00');
      const diffDays = Math.round(
        (curDate.getTime() - prevDate.getTime()) / 86_400_000,
      );
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = key;
  }
  return best;
}

/**
 * Registra la sesión completada en Dexie y actualiza racha + minutos.
 * La "mejor racha" se calcula al vuelo para no duplicar estado.
 */
export async function logWorkout(payload: LogPayload): Promise<number | undefined> {
  const ts = Date.now();
  const date = localDateKey(new Date());

  const id = await db.workouts.add({
    date,
    timestamp: ts,
    routine_id: payload.routineId,
    duration_seconds: payload.durationSeconds,
    exercises_completed: payload.exercisesCompleted,
    feedback_rating: payload.rating,
  });

  // Minutos acumulados
  const profile = await db.profile.get('local-user');
  if (profile) {
    const minutes = Math.max(1, Math.round(payload.durationSeconds / 60));
    await db.profile.update('local-user', {
      total_minutes: profile.total_minutes + minutes,
    });
  }

  // Racha: recalculada desde el historial (fuente de verdad = tabla workouts)
  const rows = await db.workouts.orderBy('date').toArray();
  const dates = new Set(rows.map((r) => r.date));
  const streak = computeStreak(dates);
  if (profile && profile.id === 'local-user') {
    await db.profile.update('local-user', {
      streak_count: Math.max(profile.streak_count, streak),
    });
  }
  return id;
}

/** Datos de consistencia listos para renderizar (racha actual + récord). */
export async function getConsistency(): Promise<{
  streak: number;
  bestStreak: number;
  totalMinutes: number;
  lastWorkoutDate: string | null;
}> {
  const rows = await db.workouts.orderBy('timestamp').reverse().limit(500).toArray();
  const dates = new Set(rows.map((r) => r.date));
  const profile = await db.profile.get('local-user');
  return {
    streak: computeStreak(dates),
    bestStreak: computeBestStreak(dates),
    totalMinutes: profile?.total_minutes ?? 0,
    lastWorkoutDate: rows[0]?.date ?? null,
  };
}

/** Heatmap: mapa fecha -> minutos activos (últimos N días) para la cuadrícula. */
export async function getHeatmapData(days = 182): Promise<Map<string, number>> {
  void days;
  const rows = await db.workouts.orderBy('timestamp').reverse().limit(2000).toArray();
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.duration_seconds);
  }
  return map;
}

/** Utilidad: etiqueta humana del área objetivo. */
export function areaLabel(area: string): string {
  const map: Record<string, string> = {
    cuello_toracico: 'Cuello & Tórax',
    lumbar_core: 'Lumbar & Core',
    caderas_gluteos: 'Caderas & Glúteos',
    hombros_munecas: 'Hombros & Munecas',
    cuerpo_completo: 'Cuerpo Completo',
  };
  return map[area] ?? area;
}

/** Utilidad: nombre corto de un ejercicio para chips y listas. */
export function shortName(ex: Exercise): string {
  return ex.name_es.length > 34 ? ex.name_es.slice(0, 32) + '…' : ex.name_es;
}
