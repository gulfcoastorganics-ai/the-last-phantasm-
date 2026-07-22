export interface ViewportSize { readonly width: number; readonly height: number; readonly dpr: number; }

export class Viewport {
  private observer: ResizeObserver | undefined;
  private current: ViewportSize = { width: 1, height: 1, dpr: 1 };
  constructor(private readonly canvas: HTMLCanvasElement, private readonly maxDpr: number) {}
  get size(): ViewportSize { return this.current; }

  start(onResize: (size: ViewportSize) => void): void {
    const resize = (): void => {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(this.maxDpr, Math.max(1, window.devicePixelRatio || 1));
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.current = { width, height, dpr };
      onResize(this.current);
    };
    this.observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize);
    this.observer?.observe(this.canvas);
    window.addEventListener('resize', resize);
    this.fallbackResize = resize;
    resize();
  }

  private fallbackResize: (() => void) | undefined;
  dispose(): void { this.observer?.disconnect(); if (this.fallbackResize) window.removeEventListener('resize', this.fallbackResize); }
}
