import type { Camera, Point } from '../rendering/Camera';
import type { ViewportSize } from '../rendering/Viewport';
import type { PerformanceSnapshot } from './PerformanceMonitor';

export interface DebugData { readonly performance: PerformanceSnapshot; readonly viewport: ViewportSize; readonly scene: string; readonly camera: Camera; readonly pointer: Point; readonly input: string; }
export class DebugOverlay {
  private enabled = false;
  constructor(private readonly element: HTMLElement) { this.element.hidden = true; }
  get isEnabled(): boolean { return this.enabled; }
  setEnabled(enabled: boolean): void { this.enabled = enabled; this.element.hidden = !enabled; }
  toggle(): void { this.setEnabled(!this.enabled); }
  update(data: DebugData): void {
    if (!this.enabled) return;
    const { performance, viewport, camera, pointer } = data;
    this.element.textContent = `FPS ${performance.fps} | ${performance.frameMs.toFixed(1)} ms\nCanvas ${viewport.width}×${viewport.height} @ ${viewport.dpr.toFixed(2)} DPR\nScene ${data.scene}\nCamera ${camera.x.toFixed(0)}, ${camera.y.toFixed(0)} | ${camera.zoom.toFixed(2)}×\nPointer ${pointer.x.toFixed(0)}, ${pointer.y.toFixed(0)}\nInput ${data.input}`;
  }
}
