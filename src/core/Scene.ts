import type { TimeSnapshot } from './Time';

export interface Scene {
  readonly id: string;
  enter(): void | Promise<void>;
  update(time: TimeSnapshot): void;
  render(): void;
  exit(): void | Promise<void>;
  dispose(): void;
}
