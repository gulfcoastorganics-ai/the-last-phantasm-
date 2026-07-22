import { Time, type TimeSnapshot } from './Time';

export interface AnimationScheduler {
  request(callback: FrameRequestCallback): number;
  cancel(handle: number): void;
  now(): number;
}

const browserScheduler: AnimationScheduler = {
  request: (callback) => requestAnimationFrame(callback),
  cancel: (handle) => cancelAnimationFrame(handle),
  now: () => performance.now(),
};

export class GameLoop {
  private handle: number | undefined;
  private previousMs = 0;
  private paused = false;

  constructor(
    private readonly tick: (time: TimeSnapshot) => void,
    private readonly time = new Time(),
    private readonly scheduler = browserScheduler,
  ) {}

  start(): void {
    if (this.handle !== undefined) return;
    this.previousMs = this.scheduler.now();
    this.handle = this.scheduler.request(this.frame);
  }

  stop(): void {
    if (this.handle !== undefined) this.scheduler.cancel(this.handle);
    this.handle = undefined;
    this.time.reset();
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    this.previousMs = this.scheduler.now();
  }

  private readonly frame: FrameRequestCallback = (nowMs) => {
    this.handle = undefined;
    const delta = (nowMs - this.previousMs) / 1000;
    this.previousMs = nowMs;
    if (!this.paused) this.tick(this.time.step(delta));
    this.handle = this.scheduler.request(this.frame);
  };
}
