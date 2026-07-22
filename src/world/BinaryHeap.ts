export class BinaryHeap<T> {
  private readonly items: T[] = [];
  constructor(private readonly score: (item: T) => number) {}
  get size(): number { return this.items.length; }
  push(item: T): void { this.items.push(item); this.bubbleUp(this.items.length - 1); }
  pop(): T | undefined { const root = this.items[0]; const tail = this.items.pop(); if (this.items.length && tail !== undefined) { this.items[0] = tail; this.sinkDown(0); } return root; }
  private bubbleUp(index: number): void { const item = this.items[index]; if (item === undefined) return; while (index > 0) { const parentIndex = Math.floor((index - 1) / 2); const parent = this.items[parentIndex]; if (parent === undefined || this.score(item) >= this.score(parent)) break; this.items[parentIndex] = item; this.items[index] = parent; index = parentIndex; } }
  private sinkDown(index: number): void { const length = this.items.length; const item = this.items[index]; if (item === undefined) return; while (true) { const left = index * 2 + 1; const right = left + 1; let best = index; if (left < length && this.score(this.items[left] as T) < this.score(this.items[best] as T)) best = left; if (right < length && this.score(this.items[right] as T) < this.score(this.items[best] as T)) best = right; if (best === index) break; this.items[index] = this.items[best] as T; this.items[best] = item; index = best; } }
}
