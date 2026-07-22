import type { Scene } from '../core/Scene';
import type { TimeSnapshot } from '../core/Time';
import { MapLoader } from '../data/tactical/MapLoader';
import type { TacticalMap } from '../data/tactical/TacticalMap';
import type { InputManager } from '../input/InputManager';
import type { Camera, Point } from '../rendering/Camera';
import type { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TacticalRenderPipeline } from '../rendering/tactical/TacticalRenderPipeline';
import { TileHighlights } from '../rendering/TileHighlights';
import type { AppShell } from '../ui/AppShell';
import type { GridPoint } from '../world/GridCoordinates';
import { gridKey } from '../world/GridCoordinates';
import { IsometricGrid } from '../world/IsometricGrid';
import { movementRange, type ReachableTile } from '../world/MovementRange';
import { Pathfinder } from '../world/Pathfinder';

export interface TacticalSceneDebug { readonly tile?: Point; readonly elevation?: number; readonly terrain?: string; readonly selected?: Point; readonly pathNodes: number; readonly drawCalls: number; }

export class EngineDemoScene implements Scene {
  readonly id = 'demo'; private readonly loader = new MapLoader(); private readonly pathfinder = new Pathfinder(); private readonly highlights = new TileHighlights(); private readonly pipeline = new TacticalRenderPipeline();
  private map: TacticalMap | undefined; private grid: IsometricGrid | undefined; private selected: GridPoint | undefined; private hovered: GridPoint | undefined; private path: readonly GridPoint[] = []; private range: ReadonlyMap<string, ReachableTile> = new Map(); private readonly abort = new AbortController();
  private highlightSignature = '';
  constructor(private readonly renderer: CanvasRenderer, readonly camera: Camera, private readonly input: InputManager, private readonly panSpeed: number, private readonly shell: AppShell, private readonly isDebugEnabled: () => boolean) {}
  async enter(): Promise<void> {
    const result = await this.loader.loadUrl(`${import.meta.env.BASE_URL}maps/tactical-demo.json`, this.abort.signal);
    if (!result.ok) { this.shell.announce(`Map unavailable: ${result.message}`); return; }
    this.map = result.map; this.grid = new IsometricGrid(result.map.data); this.selected = { x: 1, y: 4 }; this.refreshRange(); this.fitMap(); this.shell.updateTacticalStatus('Select a tile. Blue tiles are reachable within 6 movement points.');
  }
  update(time: TimeSnapshot): void {
    const map = this.map; const grid = this.grid; if (!map || !grid) return;
    let dx = 0; let dy = 0; if (this.input.state('panLeft').down) dx -= 1; if (this.input.state('panRight').down) dx += 1; if (this.input.state('panUp').down) dy -= 1; if (this.input.state('panDown').down) dy += 1;
    if (dx || dy) this.camera.panInertial(dx * this.panSpeed / this.camera.zoom, dy * this.panSpeed / this.camera.zoom);
    if (this.input.dragDelta.x || this.input.dragDelta.y) this.camera.pan(-this.input.dragDelta.x / this.camera.zoom, -this.input.dragDelta.y / this.camera.zoom);
    if (this.input.wheelDelta) this.camera.setZoomSmooth(this.camera.zoom * Math.exp(-this.input.wheelDelta * .0015));
    if (this.input.state('focus').pressed) this.fitMap();
    if (this.input.pointerActive && this.input.pointerType === 'mouse' && !this.input.pointerDown) this.camera.edgeScroll(this.input.pointer, this.viewportPoint(), time.deltaSeconds);
    this.camera.update(time.deltaSeconds, matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.hovered = grid.screenToGrid(this.input.pointer, this.viewportPoint(), this.camera, map);
    if (this.input.pointerPressed && this.hovered) { this.selected = this.hovered; this.refreshRange(); this.highlightSignature = ''; }
    const signature = `${this.selected ? gridKey(this.selected) : ''}|${this.hovered ? gridKey(this.hovered) : ''}`; if (signature !== this.highlightSignature) { this.highlightSignature = signature; this.refreshHighlights(); }
  }
  render(): void { if (!this.map || !this.grid) { this.renderer.begin('#0b1017'); return; } this.pipeline.render({ renderer: this.renderer, camera: this.camera, map: this.map, grid: this.grid, highlights: this.highlights, selected: this.selected, hovered: this.hovered, debug: this.isDebugEnabled(), path: this.path }); }
  exit(): void { this.shell.updateTacticalStatus(); }
  dispose(): void { this.abort.abort(); this.highlights.clear(); this.pathfinder.clearCache(); }
  get debugSnapshot(): TacticalSceneDebug { const tile = this.hovered && this.map?.get(this.hovered.x, this.hovered.y); return { tile: this.hovered, elevation: tile?.elevation, terrain: tile?.terrain.name, selected: this.selected, pathNodes: this.path.length, drawCalls: this.pipeline.drawCalls }; }
  private refreshRange(): void { if (!this.map || !this.selected) return; this.range = movementRange(this.map, this.selected, 6, { elevationPenalty: 1, maxElevationDelta: 1 }); }
  private refreshHighlights(): void {
    const map = this.map; if (!map) return; this.highlights.set('movement', [...this.range.values()].map((reachable) => ({ point: reachable.point, kind: 'movement' as const, label: reachable.remaining.toFixed(1) })));
    this.highlights.set('selection', this.selected ? [{ point: this.selected, kind: 'selection' }] : []); this.highlights.set('hover', this.hovered ? [{ point: this.hovered, kind: this.range.has(gridKey(this.hovered)) ? 'hover' : 'invalid' }] : []);
    this.highlights.set('objectives', map.data.objectives.flatMap((objective) => objective.x === undefined || objective.y === undefined ? [] : [{ point: { x: objective.x, y: objective.y }, kind: 'objective' as const }]));
    this.highlights.set('spawns', map.data.spawnPoints.map((spawn) => ({ point: { x: spawn.x, y: spawn.y }, kind: 'spawn' as const })));
    if (this.selected && this.hovered) { const result = this.pathfinder.find(map, this.selected, this.hovered, { elevationPenalty: 1, maxElevationDelta: 1 }); this.path = result.path; const reachable = this.range.get(gridKey(this.hovered)); const tile = map.get(this.hovered.x, this.hovered.y); this.shell.updateTacticalStatus(`${tile?.terrain.name ?? 'Unknown'} ${this.hovered.x},${this.hovered.y} · elevation ${tile?.elevation ?? 0} · ${reachable ? `${reachable.remaining.toFixed(1)} movement remaining` : 'not reachable'}`); }
  }
  private fitMap(): void { const map = this.map; const grid = this.grid; if (!map || !grid) return; const corners = [{ x: 0, y: 0 }, { x: map.data.width - 1, y: 0 }, { x: 0, y: map.data.height - 1 }, { x: map.data.width - 1, y: map.data.height - 1 }].map((point) => grid.gridToWorld({ ...point, elevation: map.require(point.x, point.y).elevation })); const xs = corners.map((point) => point.x); const ys = corners.map((point) => point.y); this.camera.fitBounds({ x: Math.min(...xs) - grid.halfWidth, y: Math.min(...ys) - map.data.elevationStep - grid.halfHeight }, { x: Math.max(...xs) + grid.halfWidth, y: Math.max(...ys) + grid.halfHeight }, this.viewportPoint(), 72); }
  private viewportPoint(): Point { return { x: this.renderer.viewport.size.width, y: this.renderer.viewport.size.height }; }
}
