import type { Scene } from './Scene';
import type { TimeSnapshot } from './Time';

export class SceneManager {
  private readonly scenes = new Map<string, Scene>();
  private active: Scene | undefined;
  private transition = Promise.resolve();

  get currentId(): string | undefined { return this.active?.id; }

  register(scene: Scene): void {
    if (this.scenes.has(scene.id)) throw new Error(`Scene already registered: ${scene.id}`);
    this.scenes.set(scene.id, scene);
  }

  change(id: string): Promise<void> {
    const target = this.scenes.get(id);
    if (!target) return Promise.reject(new Error(`Unknown scene: ${id}`));
    this.transition = this.transition.then(async () => {
      if (this.active === target) return;
      await this.active?.exit();
      this.active = target;
      await target.enter();
    });
    return this.transition;
  }

  update(time: TimeSnapshot): void { this.active?.update(time); }
  render(): void { this.active?.render(); }

  async dispose(): Promise<void> {
    await this.transition;
    await this.active?.exit();
    for (const scene of this.scenes.values()) scene.dispose();
    this.scenes.clear();
    this.active = undefined;
  }
}
