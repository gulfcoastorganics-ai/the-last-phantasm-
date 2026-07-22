import { TacticalMap } from './TacticalMap';
import { validateMap, type ValidationIssue } from './MapValidator';

export type MapLoadResult = { readonly ok: true; readonly map: TacticalMap; readonly warnings: readonly ValidationIssue[] } | { readonly ok: false; readonly message: string; readonly issues: readonly ValidationIssue[] };

export class MapLoader {
  load(input: unknown): MapLoadResult {
    const result = validateMap(input);
    if (!result.ok) return { ok: false, message: 'Map validation failed.', issues: result.issues };
    try { return { ok: true, map: new TacticalMap(result.value), warnings: result.warnings }; }
    catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'Map construction failed.', issues: [] }; }
  }
  async loadUrl(url: string, signal?: AbortSignal): Promise<MapLoadResult> {
    try { const response = await fetch(url, { signal }); if (!response.ok) return { ok: false, message: `Map request failed with ${response.status}.`, issues: [] }; return this.load(await response.json() as unknown); }
    catch (error) { return { ok: false, message: error instanceof Error ? error.message : 'Map request failed.', issues: [] }; }
  }
}
