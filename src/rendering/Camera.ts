export interface Point { readonly x: number; readonly y: number; }

export class Camera {
  x = 0;
  y = 0;
  zoom = 1;
  private targetX = 0;
  private targetY = 0;
  private targetZoom = 1;
  private velocityX = 0;
  private velocityY = 0;
  private following: (() => Point) | undefined;

  constructor(readonly minZoom = 0.5, readonly maxZoom = 3) {}

  pan(dx: number, dy: number): void { this.x += dx; this.y += dy; this.targetX = this.x; this.targetY = this.y; }
  panInertial(dx: number, dy: number): void { this.velocityX += dx; this.velocityY += dy; }
  focus(x = 0, y = 0): void { this.x = x; this.y = y; this.targetX = x; this.targetY = y; this.velocityX = 0; this.velocityY = 0; }
  focusSmooth(x: number, y: number, zoom = this.targetZoom): void { this.targetX = x; this.targetY = y; this.targetZoom = this.clampZoom(zoom); }
  follow(provider?: () => Point): void { this.following = provider; }
  update(deltaSeconds: number, reducedMotion = false): void {
    const follow = this.following?.(); if (follow) { this.targetX = follow.x; this.targetY = follow.y; }
    if (reducedMotion) { this.x = this.targetX; this.y = this.targetY; this.zoom = this.targetZoom; this.velocityX = 0; this.velocityY = 0; return; }
    const positionBlend = 1 - Math.exp(-10 * deltaSeconds); const zoomBlend = 1 - Math.exp(-12 * deltaSeconds);
    this.x += (this.targetX - this.x) * positionBlend + this.velocityX * deltaSeconds;
    this.y += (this.targetY - this.y) * positionBlend + this.velocityY * deltaSeconds;
    this.zoom += (this.targetZoom - this.zoom) * zoomBlend;
    const damping = Math.exp(-7 * deltaSeconds); this.velocityX *= damping; this.velocityY *= damping;
  }

  setZoom(value: number, anchor?: Point, viewport?: Point): void {
    const next = this.clampZoom(value);
    if (anchor && viewport && next !== this.zoom) {
      const world = this.screenToWorld(anchor, viewport);
      this.zoom = next;
      this.targetZoom = next;
      const after = this.screenToWorld(anchor, viewport);
      this.x += world.x - after.x;
      this.y += world.y - after.y;
      return;
    }
    this.zoom = next;
    this.targetZoom = next;
  }

  setZoomSmooth(value: number): void { this.targetZoom = this.clampZoom(value); }
  fitBounds(min: Point, max: Point, viewport: Point, padding = 48): void {
    const width = Math.max(1, max.x - min.x); const height = Math.max(1, max.y - min.y);
    const availableWidth = Math.max(1, viewport.x - padding * 2); const availableHeight = Math.max(1, viewport.y - padding * 2);
    this.focusSmooth((min.x + max.x) / 2, (min.y + max.y) / 2, Math.min(availableWidth / width, availableHeight / height));
  }
  edgeScroll(pointer: Point, viewport: Point, deltaSeconds: number, margin = 32, speed = 360): void {
    let dx = 0; let dy = 0; if (pointer.x < margin) dx = -1; else if (pointer.x > viewport.x - margin) dx = 1; if (pointer.y < margin) dy = -1; else if (pointer.y > viewport.y - margin) dy = 1;
    if (dx || dy) this.pan(dx * speed * deltaSeconds / this.zoom, dy * speed * deltaSeconds / this.zoom);
  }

  worldToScreen(point: Point, viewport: Point): Point {
    return { x: (point.x - this.x) * this.zoom + viewport.x / 2, y: (point.y - this.y) * this.zoom + viewport.y / 2 };
  }

  screenToWorld(point: Point, viewport: Point): Point {
    return { x: (point.x - viewport.x / 2) / this.zoom + this.x, y: (point.y - viewport.y / 2) / this.zoom + this.y };
  }
  private clampZoom(value: number): number { return Math.min(this.maxZoom, Math.max(this.minZoom, value)); }
}
