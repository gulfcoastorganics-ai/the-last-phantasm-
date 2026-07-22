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
  private apply(): void { if (this.master) this.master.gain.value = this.settings.muted ? 0 : this.settings.masterVolume; }
  async dispose(): Promise<void> { if (this.context) await this.context.close(); this.context = undefined; this.master = undefined; }
}
