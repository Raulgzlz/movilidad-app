import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../types/user';

interface UserState {
  name: string;
  theme: ThemeMode;
  soundEnabled: boolean;
  setName: (name: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSound: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Tú',
      theme: 'light', // Modo claro/limpio por defecto
      soundEnabled: true,
      setName: (name) => set({ name }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
    }),
    {
      name: 'movi-user-prefs',
      partialize: (s) => ({ name: s.name, theme: s.theme, soundEnabled: s.soundEnabled }),
    },
  ),
);

function applyTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Aplica el tema guardado al arrancar (por defecto 'light')
if (typeof document !== 'undefined') {
  const stored = localStorage.getItem('movi-user-prefs');
  try {
    const parsed = stored ? JSON.parse(stored) : null;
    const theme = parsed?.state?.theme as ThemeMode | undefined;
    applyTheme(theme ?? 'light');
  } catch {
    applyTheme('light');
  }
  useUserStore.subscribe((s) => applyTheme(s.theme));
}
