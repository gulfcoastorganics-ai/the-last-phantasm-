export const SAVE_VERSION = 1;
export interface CampaignData { readonly startedAt: string; readonly currentScene: string; }
export interface SettingsData { readonly masterVolume: number; readonly musicVolume: number; readonly sfxVolume: number; readonly muted: boolean; readonly debug: boolean; readonly screenShake?: boolean; }
export interface SaveEnvelope<T> { readonly version: number; readonly savedAt: string; readonly data: T; }
export const DEFAULT_SETTINGS: SettingsData = { masterVolume: 0.8, musicVolume: 0.7, sfxVolume: 0.8, muted: false, debug: false, screenShake: false };

export function isCampaignEnvelope(value: unknown): value is SaveEnvelope<CampaignData> {
  if (!isObject(value) || value.version !== SAVE_VERSION || !isObject(value.data)) return false;
  return typeof value.savedAt === 'string' && typeof value.data.startedAt === 'string' && typeof value.data.currentScene === 'string';
}
export function isSettingsEnvelope(value: unknown): value is SaveEnvelope<SettingsData> {
  if (!isObject(value) || value.version !== SAVE_VERSION || !isObject(value.data)) return false;
  const data = value.data;
  return typeof value.savedAt === 'string' && isVolume(data.masterVolume) && isVolume(data.musicVolume) && isVolume(data.sfxVolume) && typeof data.muted === 'boolean' && typeof data.debug === 'boolean' && (data.screenShake === undefined || typeof data.screenShake === 'boolean');
}
function isObject(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function isVolume(value: unknown): value is number { return typeof value === 'number' && value >= 0 && value <= 1; }
