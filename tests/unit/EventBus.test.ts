import { describe, expect, it, vi } from 'vitest'; import { EventBus } from '../../src/core/EventBus';
interface Events extends Record<string, unknown> { score: number; }
describe('EventBus', () => { it('subscribes, emits, and unsubscribes', () => { const bus = new EventBus<Events>(); const handler = vi.fn(); const unsubscribe = bus.on('score', handler); bus.emit('score', 3); unsubscribe(); bus.emit('score', 5); expect(handler).toHaveBeenCalledOnce(); expect(handler).toHaveBeenCalledWith(3); }); });
