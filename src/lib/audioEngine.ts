// Web Audio API: campanadas armónicas de meditación (432Hz / 528Hz)
// y generador de paisaje sonoro relajante (Sonido Zen / Ocean Calm)
// 100% sintetizado localmente sin archivos externos ni dependencias de red.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private ambientPlaying = false;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;

  setMuted(m: boolean) {
    this.muted = m;
    if (m && this.ambientPlaying) {
      this.stopAmbient();
    }
  }

  isMuted() {
    return this.muted;
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  // Campanada de inicio / cambio de ejercicio (cuenco tibetano armónico a 528Hz)
  playChime(freq = 528, duration = 2.0) {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Segundo armónico sutil a 2x frecuencia para dar cuerpo de campana
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      gain2.gain.setValueAtTime(0.04, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      // Tercer armónico a 1.5x (quinta perfecta)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      gain3.gain.setValueAtTime(0.02, ctx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      // Decaimiento exponencial suave
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + duration);
      osc2.start(now);
      osc2.stop(now + duration);
      osc3.start(now);
      osc3.stop(now + duration);
    } catch {
      // Silencioso si el usuario aún no interactúa con el DOM
    }
  }

  // Tono de cambio de lado bilateral (dos notas suaves ascendentes)
  playSideSwitchChime() {
    if (this.muted) return;
    try {
      this.playChime(432, 1.2);
      setTimeout(() => this.playChime(576, 1.5), 180);
    } catch {}
  }

  // Tick de cuenta regresiva (3, 2, 1)
  playTick() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Campanada de victoria al completar la sesión (acorde mayor de tres notas)
  playCompletionFanfare() {
    if (this.muted) return;
    try {
      const notes = [528, 660, 792, 1056];
      notes.forEach((note, i) => {
        setTimeout(() => this.playChime(note, 2.5), i * 150);
      });
    } catch {}
  }

  // Generador de Paisaje Zen (ruido rosa filtrado que simula olas u océano suave)
  toggleAmbient(enable?: boolean): boolean {
    const shouldPlay = enable ?? !this.ambientPlaying;
    if (shouldPlay) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.ambientPlaying;
  }

  isAmbientPlaying(): boolean {
    return this.ambientPlaying;
  }

  private startAmbient() {
    if (this.ambientPlaying || this.muted) return;
    try {
      const ctx = this.getContext();
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generar ruido rosa / browniano relajante
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filtro pasa-bajas suave (sonido de brisa marina)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3.0);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
      this.ambientPlaying = true;
    } catch {}
  }

  private stopAmbient() {
    if (!this.ambientPlaying) return;
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          try {
            if (this.ambientSource && 'stop' in this.ambientSource) {
              (this.ambientSource as AudioBufferSourceNode).stop();
            }
            this.ambientSource = null;
            this.ambientGain = null;
            this.ambientPlaying = false;
          } catch {}
        }, 1100);
      } else {
        this.ambientPlaying = false;
      }
    } catch {
      this.ambientPlaying = false;
    }
  }
}

export const sound = new AudioEngine();
