export type TargetArea =
  | 'cuello_toracico'
  | 'hombros_munecas'
  | 'lumbar_core'
  | 'caderas_gluteos'
  | 'tobillos_piernas'
  | 'cuerpo_completo';

export interface QuizAnswers {
  targetArea: TargetArea;
  durationMinutes: 5 | 10 | 15;
  environment: 'cualquiera' | 'oficina';
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
}

export type ThemeMode = 'dark' | 'light';

export interface UserPreferences {
  theme: ThemeMode;
  soundEnabled: boolean;
  name: string;
  primary_goal: string;
}
