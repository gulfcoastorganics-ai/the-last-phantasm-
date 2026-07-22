import { describe, expect, it } from 'vitest'; import { Time } from '../../src/core/Time';
describe('Time', () => { it('clamps long and invalid deltas', () => { const time = new Time(.1); expect(time.step(5).deltaSeconds).toBe(.1); expect(time.step(-1).deltaSeconds).toBe(0); expect(time.step(Number.NaN).deltaSeconds).toBe(0); }); });
