import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../types/user';

interface UserState {
  name: string;
  theme: ThemeMode;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  breathVoiceEnabled: boolean;
  settingsOpen: boolean;
  setName: (name: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  toggleBreathVoice: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: 'Tú',
      theme: 'light', // Modo claro/limpio por defecto
      soundEnabled: true,
      hapticsEnabled: true,
      breathVoiceEnabled: true,
      settingsOpen: false,
      setName: (name) => set({ name }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      toggleBreathVoice: () => set((s) => ({ breathVoiceEnabled: !s.breathVoiceEnabled })),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
    }),
    {
      name: 'movi-user-prefs',
      partialize: (s) => ({
        name: s.name,
        theme: s.theme,
        soundEnabled: s.soundEnabled,
        hapticsEnabled: s.hapticsEnabled,
        breathVoiceEnabled: s.breathVoiceEnabled,
      }),
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
