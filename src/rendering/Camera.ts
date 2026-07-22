export interface Point { readonly x: number; readonly y: number; }

export class Camera {
  x = 0;
  y = 0;
  zoom = 1;

  constructor(readonly minZoom = 0.5, readonly maxZoom = 3) {}

  pan(dx: number, dy: number): void { this.x += dx; this.y += dy; }
  focus(x = 0, y = 0): void { this.x = x; this.y = y; }

  setZoom(value: number, anchor?: Point, viewport?: Point): void {
    const next = Math.min(this.maxZoom, Math.max(this.minZoom, value));
    if (anchor && viewport && next !== this.zoom) {
      const world = this.screenToWorld(anchor, viewport);
      this.zoom = next;
      const after = this.screenToWorld(anchor, viewport);
      this.x += world.x - after.x;
      this.y += world.y - after.y;
      return;
    }
    this.zoom = next;
  }

  worldToScreen(point: Point, viewport: Point): Point {
    return { x: (point.x - this.x) * this.zoom + viewport.x / 2, y: (point.y - this.y) * this.zoom + viewport.y / 2 };
  }

  screenToWorld(point: Point, viewport: Point): Point {
    return { x: (point.x - viewport.x / 2) / this.zoom + this.x, y: (point.y - viewport.y / 2) / this.zoom + this.y };
  }
}
