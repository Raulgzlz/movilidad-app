export type Category =
  | 'cuello_toracico'
  | 'hombros_munecas'
  | 'lumbar_core'
  | 'caderas_gluteos'
  | 'tobillos_piernas'
  | 'cuerpo_completo';

export type Position = 'pie' | 'silla' | 'suelo' | 'pared';

export type Equipment = 'ninguno' | 'silla' | 'toalla' | 'pared' | 'esterilla';

export type Difficulty = 'principiante' | 'intermedio' | 'avanzado';

export type BreathingRhythm = 'lento_profundo' | 'continuo' | 'isometria';

export interface Exercise {
  id: string;
  name_es: string;
  name_en: string;
  category: Category;
  target_joints: string[];
  primary_muscles: string[];
  position: Position;
  equipment: Equipment;
  difficulty: Difficulty;
  default_duration_sec: number;
  bilateral: boolean;
  side_switch_sec?: number;
  video_url?: string;
  thumbnail_url?: string;
  cues_es: string[];
  breathing_rhythm: BreathingRhythm;
  contraindications: string[];
}

export interface WorkoutSession {
  id?: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  routine_id: string;
  duration_seconds: number;
  exercises_completed: string[];
  feedback_rating?: 1 | 2 | 3 | 4 | 5;
}

export interface UserProfile {
  id: string;
  created_at: string;
  name: string;
  primary_goal: string;
  daily_reminder_time?: string;
  streak_count: number;
  total_minutes: number;
  license_unlocked: boolean;
}
