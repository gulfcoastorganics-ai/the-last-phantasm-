import type { SettingsData } from '../save/SaveSchema';

type AudioContextConstructor = new () => AudioContext;

export class AudioManager {
  private context: AudioContext | undefined;
  private master: GainNode | undefined;
  private settings: SettingsData;
  constructor(settings: SettingsData) { this.settings = settings; }

  async unlock(): Promise<boolean> {
    try {
      const Constructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
      if (!Constructor) return false;
      if (!this.context) { this.context = new Constructor(); this.master = this.context.createGain(); this.master.connect(this.context.destination); }
      this.apply(); await this.context.resume(); return this.context.state === 'running';
    } catch { return false; }
  }
  update(settings: SettingsData): void { this.settings = settings; this.apply(); }
  playEffect(kind: 'select' | 'move' | 'attack' | 'hit' | 'miss' | 'defeat' | 'ready' | 'victory' | 'loss'): void { if (!this.context || !this.master || this.settings.muted) return; const frequencies: Record<typeof kind, number> = { select: 520, move: 340, attack: 180, hit: 110, miss: 740, defeat: 90, ready: 620, victory: 880, loss: 120 }; const oscillator = this.context.createOscillator(); const gain = this.context.createGain(); const now = this.context.currentTime; oscillator.frequency.value = frequencies[kind]; oscillator.type = kind === 'hit' || kind === 'attack' ? 'sawtooth' : 'sine'; gain.gain.setValueAtTime(this.settings.sfxVolume * .08, now); gain.gain.exponentialRampToValueAtTime(.0001, now + .12); oscillator.connect(gain); gain.connect(this.master); oscillator.start(now); oscillator.stop(now + .12); oscillator.addEventListener('ended', () => { oscillator.disconnect(); gain.disconnect(); }, { once: true }); }
  private apply(): void { if (this.master) this.master.gain.value = this.settings.muted ? 0 : this.settings.masterVolume; }
  async dispose(): Promise<void> { if (this.context) await this.context.close(); this.context = undefined; this.master = undefined; }
}
