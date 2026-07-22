export interface GameConfig {
  readonly maxDeltaSeconds: number;
  readonly maxDevicePixelRatio: number;
  readonly camera: { readonly minZoom: number; readonly maxZoom: number; readonly keyboardPanSpeed: number };
  readonly debugInitiallyEnabled: boolean;
}

export const DEFAULT_CONFIG: GameConfig = Object.freeze({
  maxDeltaSeconds: 0.1,
  maxDevicePixelRatio: 2,
  camera: Object.freeze({ minZoom: 0.5, maxZoom: 3, keyboardPanSpeed: 420 }),
  debugInitiallyEnabled: false,
});

export function loadConfig(overrides: Partial<GameConfig> = {}): GameConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
    camera: { ...DEFAULT_CONFIG.camera, ...overrides.camera },
  };
}
