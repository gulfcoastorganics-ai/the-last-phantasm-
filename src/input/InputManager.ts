import type { InputAction, ActionState } from './InputAction';
import type { Point } from '../rendering/Camera';

const KEY_MAP: Readonly<Record<string, InputAction>> = {
  ArrowLeft: 'panLeft', KeyA: 'panLeft', ArrowRight: 'panRight', KeyD: 'panRight',
  ArrowUp: 'panUp', KeyW: 'panUp', ArrowDown: 'panDown', KeyS: 'panDown',
  Enter: 'confirm', Escape: 'cancel', KeyF: 'focus', Backquote: 'toggleDebug',
  KeyH: 'cursorLeft', KeyL: 'cursorRight', KeyK: 'cursorUp', KeyJ: 'cursorDown',
  KeyM: 'commandMove', KeyR: 'commandAttack', KeyE: 'endTurn', KeyI: 'inspect',
};

export class InputManager {
  pointer: Point = { x: 0, y: 0 };
  pointerDown = false;
  pointerPressed = false;
  pointerActive = false;
  pointerType = 'mouse';
  dragDelta: Point = { x: 0, y: 0 };
  wheelDelta = 0;
  private readonly actions = new InputActionTracker();
  private lastPointer: Point | undefined;

  constructor(private readonly target: HTMLElement, private readonly toLocal: (event: PointerEvent | WheelEvent) => Point) {}

  start(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.target.addEventListener('pointerdown', this.onPointerDown);
    this.target.addEventListener('pointermove', this.onPointerMove);
    this.target.addEventListener('pointerup', this.onPointerUp);
    this.target.addEventListener('pointercancel', this.onPointerUp);
    this.target.addEventListener('wheel', this.onWheel, { passive: false });
  }

  state(action: InputAction): ActionState { return this.actions.state(action); }
  summary(): string { return this.actions.summary(); }
  endFrame(): void { this.actions.endFrame(); this.dragDelta = { x: 0, y: 0 }; this.wheelDelta = 0; this.pointerPressed = false; }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const action = KEY_MAP[event.code]; if (!action) return;
    this.actions.press(action);
  };
  private readonly onKeyUp = (event: KeyboardEvent): void => {
    const action = KEY_MAP[event.code]; if (!action) return;
    this.actions.release(action);
  };
  private readonly onPointerDown = (event: PointerEvent): void => {
    this.pointerDown = true; this.pointerPressed = true; this.pointerActive = true; this.pointerType = event.pointerType || 'mouse'; this.pointer = this.toLocal(event); this.lastPointer = this.pointer;
    this.target.setPointerCapture?.(event.pointerId);
  };
  private readonly onPointerMove = (event: PointerEvent): void => {
    this.pointerActive = true; this.pointerType = event.pointerType || 'mouse'; this.pointer = this.toLocal(event);
    if (this.pointerDown && this.lastPointer) this.dragDelta = { x: this.dragDelta.x + this.pointer.x - this.lastPointer.x, y: this.dragDelta.y + this.pointer.y - this.lastPointer.y };
    this.lastPointer = this.pointer;
  };
  private readonly onPointerUp = (event: PointerEvent): void => { this.pointerDown = false; this.lastPointer = undefined; this.target.releasePointerCapture?.(event.pointerId); };
  private readonly onWheel = (event: WheelEvent): void => { event.preventDefault(); this.wheelDelta += event.deltaY; this.pointer = this.toLocal(event); };

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown); window.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('pointerdown', this.onPointerDown); this.target.removeEventListener('pointermove', this.onPointerMove);
    this.target.removeEventListener('pointerup', this.onPointerUp); this.target.removeEventListener('pointercancel', this.onPointerUp);
    this.target.removeEventListener('wheel', this.onWheel); this.actions.clear();
  }
}

export class InputActionTracker {
  private readonly down = new Set<InputAction>();
  private readonly pressed = new Set<InputAction>();
  private readonly released = new Set<InputAction>();
  press(action: InputAction): void { if (!this.down.has(action)) this.pressed.add(action); this.down.add(action); }
  release(action: InputAction): void { if (this.down.delete(action)) this.released.add(action); }
  state(action: InputAction): ActionState { return { down: this.down.has(action), pressed: this.pressed.has(action), released: this.released.has(action) }; }
  summary(): string { return [...this.down].join(', ') || 'idle'; }
  endFrame(): void { this.pressed.clear(); this.released.clear(); }
  clear(): void { this.down.clear(); this.pressed.clear(); this.released.clear(); }
}
