import Dexie, { type Table } from 'dexie';
import type { Exercise, UserProfile, WorkoutSession } from '../types/exercise';
import { initialExercises } from './seed';

class MovilidadDB extends Dexie {
  exercises!: Table<Exercise, string>;
  workouts!: Table<WorkoutSession, number>;
  profile!: Table<UserProfile, string>;

  constructor() {
    super('MovilidadLocalDB');
    this.version(1).stores({
      exercises: 'id, category, position, difficulty',
      workouts: '++id, date, timestamp, routine_id',
      profile: 'id',
    });
  }
}

export const db = new MovilidadDB();

// Sembrado idempotente en el primer arranque (o si está vacío).
db.on('populate', async () => {
  await db.exercises.bulkAdd(initialExercises);
  await db.profile.add({
    id: 'local-user',
    created_at: new Date().toISOString(),
    name: 'Tú',
    primary_goal: 'alivio_diario',
    streak_count: 0,
    total_minutes: 0,
    license_unlocked: true, // Desbloqueado en desarrollo (clave Gumroad opcional)
  });
});

export async function ensureSeeded(): Promise<void> {
  const count = await db.exercises.count();
  if (count < initialExercises.length) {
    await db.exercises.bulkPut(initialExercises);
  }
  const profile = await db.profile.get('local-user');
  if (!profile) {
    await db.profile.add({
      id: 'local-user',
      created_at: new Date().toISOString(),
      name: 'Tú',
      primary_goal: 'alivio_diario',
      streak_count: 0,
      total_minutes: 0,
      license_unlocked: true,
    });
  }
}
