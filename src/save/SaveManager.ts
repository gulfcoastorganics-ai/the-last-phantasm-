import { DEFAULT_SETTINGS, SAVE_VERSION, isCampaignEnvelope, isSettingsEnvelope, type CampaignData, type SaveEnvelope, type SettingsData } from './SaveSchema';

export interface StorageAdapter { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
export type LoadResult<T> = { readonly ok: true; readonly data: T } | { readonly ok: false; readonly reason: 'missing' | 'corrupted' | 'outdated'; readonly raw?: string };

export class SaveManager {
  static readonly campaignKey = 'tlp.campaign'; static readonly settingsKey = 'tlp.settings';
  constructor(private readonly storage: StorageAdapter) {}
  saveCampaign(data: CampaignData): void { this.write(SaveManager.campaignKey, data); }
  saveSettings(data: SettingsData): void { this.write(SaveManager.settingsKey, data); }
  loadCampaign(): LoadResult<CampaignData> { return this.read(SaveManager.campaignKey, isCampaignEnvelope); }
  loadSettings(): LoadResult<SettingsData> { return this.read(SaveManager.settingsKey, isSettingsEnvelope); }
  settingsOrDefault(): SettingsData { const result = this.loadSettings(); return result.ok ? { ...DEFAULT_SETTINGS, ...result.data } : { ...DEFAULT_SETTINGS }; }
  resetCampaign(): void { this.storage.removeItem(SaveManager.campaignKey); }
  resetSettings(): void { this.storage.removeItem(SaveManager.settingsKey); }
  exportCampaign(): string | undefined { return this.storage.getItem(SaveManager.campaignKey) ?? undefined; }
  importCampaign(raw: string): boolean { const parsed = this.parse(raw, isCampaignEnvelope); if (!parsed.ok) return false; this.storage.setItem(SaveManager.campaignKey, raw); return true; }

  private write<T>(key: string, data: T): void { const envelope: SaveEnvelope<T> = { version: SAVE_VERSION, savedAt: new Date().toISOString(), data }; this.storage.setItem(key, JSON.stringify(envelope)); }
  private read<T>(key: string, guard: (value: unknown) => value is SaveEnvelope<T>): LoadResult<T> { const raw = this.storage.getItem(key); if (raw === null) return { ok: false, reason: 'missing' }; return this.parse(raw, guard); }
  private parse<T>(raw: string, guard: (value: unknown) => value is SaveEnvelope<T>): LoadResult<T> {
    try { const value: unknown = JSON.parse(raw); if (!guard(value)) { const version = typeof value === 'object' && value !== null && 'version' in value ? value.version : undefined; return { ok: false, reason: version !== SAVE_VERSION ? 'outdated' : 'corrupted', raw }; } return { ok: true, data: value.data }; }
    catch { return { ok: false, reason: 'corrupted', raw }; }
  }
}
