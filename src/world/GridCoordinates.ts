export interface GridPoint { readonly x: number; readonly y: number; }
export interface GridPoint3 extends GridPoint { readonly elevation: number; }
export function gridKey(point: GridPoint): string { return `${point.x},${point.y}`; }
export function parseGridKey(key: string): GridPoint { const [x, y] = key.split(',').map(Number); if (x === undefined || y === undefined || !Number.isInteger(x) || !Number.isInteger(y)) throw new Error(`Invalid grid key: ${key}`); return { x, y }; }
