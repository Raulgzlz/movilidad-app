// Screen WakeLock API con fallback silencioso: evita el bloqueo de
// pantalla durante el flujo guiado. Requiere gesto del usuario (lo pedimos
// desde el botón "Iniciar" del dashboard).
let currentLock: WakeLockSentinel | null = null;

export async function requestWakeLock(): Promise<void> {
  if (!('wakeLock' in navigator)) return;
  try {
    const casted = (
      navigator as unknown as {
        wakeLock: { request: (t: 'screen') => Promise<WakeLockSentinel> };
      }
    ).wakeLock.request('screen');
    const lock = await casted;
    currentLock = lock;
    lock.addEventListener('release', () => {
      if (currentLock === lock) currentLock = null;
    });
  } catch {
    // navegador no soportado o sin permiso: continuamos sin bloqueo
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (currentLock) {
    try {
      await currentLock.release();
    } catch {
      // ya fue liberada
    }
    currentLock = null;
  }
}

// Re-solicitar al volver al primer plano (los móviles la liberan al pasar a fondo)
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && !currentLock) {
    void requestWakeLock();
  }
};
document.addEventListener('visibilitychange', onVisibilityChange);
