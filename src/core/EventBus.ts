export type EventMap = Record<string, unknown>;
export type EventHandler<T> = (payload: T) => void;

export class EventBus<Events extends EventMap> {
  private readonly handlers = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>();

  on<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): () => void {
    let group = this.handlers.get(type);
    if (!group) {
      group = new Set();
      this.handlers.set(type, group);
    }
    group.add(handler as EventHandler<Events[keyof Events]>);
    return () => this.off(type, handler);
  }

  off<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): void {
    const group = this.handlers.get(type);
    group?.delete(handler as EventHandler<Events[keyof Events]>);
    if (group?.size === 0) this.handlers.delete(type);
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    const group = this.handlers.get(type);
    if (!group) return;
    for (const handler of [...group]) handler(payload);
  }

  clear(): void { this.handlers.clear(); }
}
