import type { Camera, Point } from '../rendering/Camera';
import type { ViewportSize } from '../rendering/Viewport';
import type { PerformanceSnapshot } from './PerformanceMonitor';

export interface TacticalDebugData { readonly tile?: Point; readonly elevation?: number; readonly terrain?: string; readonly selected?: Point; readonly pathNodes: number; readonly drawCalls: number; }
export interface DebugData { readonly performance: PerformanceSnapshot; readonly updateMs: number; readonly renderMs: number; readonly viewport: ViewportSize; readonly scene: string; readonly camera: Camera; readonly pointer: Point; readonly input: string; readonly tactical?: TacticalDebugData; }
export class DebugOverlay {
  private enabled = false;
  constructor(private readonly element: HTMLElement) { this.element.hidden = true; }
  get isEnabled(): boolean { return this.enabled; }
  setEnabled(enabled: boolean): void { this.enabled = import.meta.env.DEV && enabled; this.element.hidden = !this.enabled; }
  toggle(): void { this.setEnabled(!this.enabled); }
  update(data: DebugData): void {
    if (!this.enabled) return;
    const { performance, viewport, camera, pointer } = data;
    const tactical = data.tactical; const tacticalText = tactical ? `\nTile ${formatPoint(tactical.tile)} | elevation ${tactical.elevation ?? '—'}\nTerrain ${tactical.terrain ?? '—'} | selected ${formatPoint(tactical.selected)}\nPath nodes ${tactical.pathNodes} | draw calls ${tactical.drawCalls}` : '';
    this.element.textContent = `FPS ${performance.fps} | frame ${performance.frameMs.toFixed(1)} ms\nUpdate ${data.updateMs.toFixed(2)} ms | render ${data.renderMs.toFixed(2)} ms\nCanvas ${viewport.width}×${viewport.height} @ ${viewport.dpr.toFixed(2)} DPR\nScene ${data.scene}\nCamera ${camera.x.toFixed(0)}, ${camera.y.toFixed(0)} | ${camera.zoom.toFixed(2)}×\nPointer ${pointer.x.toFixed(0)}, ${pointer.y.toFixed(0)}\nInput ${data.input}${tacticalText}`;
  }
}
function formatPoint(point?: Point): string { return point ? `${point.x},${point.y}` : '—'; }
