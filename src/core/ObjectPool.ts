export class ObjectPool<T> {
  private readonly available: T[] = [];
  constructor(private readonly create: () => T, private readonly reset: (value: T) => void, initialSize = 0, private readonly maxSize = 256) { for (let index = 0; index < initialSize; index += 1) this.available.push(create()); }
  acquire(): T { return this.available.pop() ?? this.create(); }
  release(value: T): void { this.reset(value); if (this.available.length < this.maxSize) this.available.push(value); }
  get retained(): number { return this.available.length; }
}
