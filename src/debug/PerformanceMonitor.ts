export interface PerformanceSnapshot { readonly fps: number; readonly frameMs: number; }
export class PerformanceMonitor {
  private frames = 0; private accumulated = 0; private snapshotValue: PerformanceSnapshot = { fps: 0, frameMs: 0 };
  sample(deltaSeconds: number): void { this.frames += 1; this.accumulated += deltaSeconds; if (this.accumulated >= 0.5) { this.snapshotValue = { fps: Math.round(this.frames / this.accumulated), frameMs: (this.accumulated / this.frames) * 1000 }; this.frames = 0; this.accumulated = 0; } }
  get snapshot(): PerformanceSnapshot { return this.snapshotValue; }
}
