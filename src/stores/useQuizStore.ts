import { create } from 'zustand';
import type { QuizAnswers } from '../types/user';

type QuizStepId = 'zona' | 'tiempo' | 'entorno' | 'nivel';

export const QUIZ_STEPS: QuizStepId[] = ['zona', 'tiempo', 'entorno', 'nivel'];

interface QuizState {
  open: boolean;
  step: number;
  answers: Partial<QuizAnswers>;
  openQuiz: () => void;
  closeQuiz: () => void;
  resetQuiz: () => void;
  setAnswer: <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => void;
  next: () => void;
  prev: () => void;
  isComplete: () => boolean;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  open: false,
  step: 0,
  answers: {},
  openQuiz: () => set({ open: true, step: 0, answers: {} }),
  closeQuiz: () => set({ open: false }),
  resetQuiz: () => set({ step: 0, answers: {} }),
  setAnswer: (key, value) =>
    set((s) => ({ answers: { ...s.answers, [key]: value } })),
  next: () =>
    set((s) => ({ step: Math.min(s.step + 1, QUIZ_STEPS.length - 1) })),
  prev: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  isComplete: () => {
    const a = get().answers;
    return Boolean(a.targetArea && a.durationMinutes && a.environment && a.difficulty);
  },
}));
