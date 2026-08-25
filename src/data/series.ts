export interface PredefinedSeries {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  badgeColor: string;
  category: 'quick' | 'multiday' | 'targeted';
  daysCount?: number;
  currentDay?: number;
  exercisesQuery: {
    category?: string;
    position?: 'silla' | 'suelo' | 'pie' | 'pared';
    difficulty?: 'principiante' | 'intermedio';
    limit?: number;
  };
  exerciseIds?: string[];
}

export const PREDEFINED_SERIES: PredefinedSeries[] = [
  // ── QUICK & EASY (5-10 MIN) ──
  {
    id: 'quick-lumbar-1',
    title: 'Descompresión Lumbar 1',
    subtitle: 'Alivio rápido de discos y espalda baja',
    durationMinutes: 5,
    badgeColor: '#10B981', // Emerald
    category: 'quick',
    exercisesQuery: { category: 'lumbar_core', limit: 4 },
  },
  {
    id: 'quick-neck-1',
    title: 'Cuello & Trapecios 1',
    subtitle: 'Liberación de tensión cervical y pantalla',
    durationMinutes: 5,
    badgeColor: '#38BDF8', // Sky Blue
    category: 'quick',
    exercisesQuery: { category: 'cuello_toracico', limit: 4 },
  },
  {
    id: 'quick-hips-1',
    title: 'Apertura de Caderas',
    subtitle: 'Desbloqueo de flexores pélvicos',
    durationMinutes: 7,
    badgeColor: '#F59E0B', // Amber
    category: 'quick',
    exercisesQuery: { category: 'caderas_gluteos', limit: 5 },
  },
  {
    id: 'quick-office-chair',
    title: 'Pausa en la Silla (Oficina)',
    subtitle: '100% sentado, cero suelo ni sudor',
    durationMinutes: 5,
    badgeColor: '#8B5CF6', // Purple
    category: 'quick',
    exercisesQuery: { position: 'silla', limit: 4 },
  },
  {
    id: 'quick-morning-flow',
    title: 'Despertar Matutino',
    subtitle: 'Activa tu columna y desoxida articulaciones',
    durationMinutes: 8,
    badgeColor: '#EC4899', // Pink
    category: 'quick',
    exercisesQuery: { limit: 6 },
  },
  {
    id: 'quick-sleep-prep',
    title: 'Sueño Profundo & Relajación',
    subtitle: 'Estiramientos largos para apagar el sistema nervioso',
    durationMinutes: 10,
    badgeColor: '#6366F1', // Indigo
    category: 'quick',
    exercisesQuery: { position: 'suelo', limit: 6 },
  },

  // ── MULTIDAY SERIES (3-5 DÍAS) ──
  {
    id: 'multiday-lumbar-3',
    title: 'Serie Lumbar 3 Días',
    subtitle: 'Día 1: Descompresión · Día 2: McGill · Día 3: Movilidad',
    durationMinutes: 6,
    badgeColor: '#10B981',
    category: 'multiday',
    daysCount: 3,
    currentDay: 1,
    exercisesQuery: { category: 'lumbar_core', limit: 4 },
  },
  {
    id: 'multiday-neck-5',
    title: 'Reset Cervical & Postura 5 Días',
    subtitle: 'Programa progresivo para usuarios de ordenador',
    durationMinutes: 5,
    badgeColor: '#38BDF8',
    category: 'multiday',
    daysCount: 5,
    currentDay: 1,
    exercisesQuery: { category: 'cuello_toracico', limit: 4 },
  },
  {
    id: 'multiday-hips-3',
    title: 'Flexibilidad de Caderas 3 Días',
    subtitle: 'Apertura articular profunda y pelvis liberada',
    durationMinutes: 8,
    badgeColor: '#F59E0B',
    category: 'multiday',
    daysCount: 3,
    currentDay: 1,
    exercisesQuery: { category: 'caderas_gluteos', limit: 5 },
  },
];
