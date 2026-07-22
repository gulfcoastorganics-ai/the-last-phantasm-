import type { Camera, Point } from './Camera';
import { Viewport, type ViewportSize } from './Viewport';

export class CanvasRenderer {
  readonly context: CanvasRenderingContext2D;
  readonly viewport: Viewport;
  constructor(readonly canvas: HTMLCanvasElement, maxDpr: number) {
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Canvas 2D is not supported by this browser.');
    this.context = context;
    this.viewport = new Viewport(canvas, maxDpr);
  }
  start(): void { this.viewport.start(() => undefined); }
  begin(background = '#100d17'): void {
    const { width, height, dpr } = this.viewport.size;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.context.fillStyle = background;
    this.context.fillRect(0, 0, width, height);
  }
  withCamera(camera: Camera, draw: (context: CanvasRenderingContext2D, size: ViewportSize) => void): void {
    const size = this.viewport.size;
    this.context.save();
    this.context.translate(size.width / 2, size.height / 2);
    this.context.scale(camera.zoom, camera.zoom);
    this.context.translate(-camera.x, -camera.y);
    draw(this.context, size);
    this.context.restore();
  }
  toCanvasPoint(event: PointerEvent | WheelEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  dispose(): void { this.viewport.dispose(); }
}
