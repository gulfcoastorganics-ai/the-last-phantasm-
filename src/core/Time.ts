export interface TimeSnapshot { readonly deltaSeconds: number; readonly elapsedSeconds: number; readonly frame: number; }

export class Time {
  private elapsed = 0;
  private frames = 0;
  constructor(readonly maxDeltaSeconds = 0.1) {}

  step(rawDeltaSeconds: number): TimeSnapshot {
    const safe = Number.isFinite(rawDeltaSeconds) ? Math.max(0, rawDeltaSeconds) : 0;
    const deltaSeconds = Math.min(safe, this.maxDeltaSeconds);
    this.elapsed += deltaSeconds;
    this.frames += 1;
    return { deltaSeconds, elapsedSeconds: this.elapsed, frame: this.frames };
  }

  reset(): void { this.elapsed = 0; this.frames = 0; }
}
