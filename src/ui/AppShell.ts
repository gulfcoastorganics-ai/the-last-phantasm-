export interface MenuCallbacks { onNewGame(): void; onDemo(): void; onSettings(): void; onCloseSettings(): void; onSaveSmokeTest(): void; onVolume(value: number): void; onMute(value: boolean): void; onScreenShake(value: boolean): void; onDebug(): void; onZoom(delta: number): void; onFocus(): void; onExitBattle(): void; }
export interface BattleCallbacks { move(): void; attack(): void; wait(): void; endTurn(): void; cancel(): void; inspect(): void; restart(): void; facing(value: 'north' | 'east' | 'south' | 'west'): void; }
export interface BattleHudModel { readonly active: string; readonly stats: string; readonly weapon: string; readonly statuses: string; readonly timeline: string; readonly objective: string; readonly preview?: string; readonly log: readonly string[]; readonly terminal?: 'Victory' | 'Defeat'; }

export class AppShell {
  readonly canvas: HTMLCanvasElement;
  readonly debug: HTMLElement;
  readonly menu: HTMLElement;
  readonly settings: HTMLDialogElement;
  readonly announcement: HTMLElement;
  private readonly demoControls: HTMLElement;
  private readonly disposers: Array<() => void> = [];
  private battleCallbacks: BattleCallbacks | undefined;

  constructor(root: HTMLElement, callbacks: MenuCallbacks) {
    root.innerHTML = `<main class="game-shell"><canvas id="game-canvas" aria-label="Isometric tactical combat battlefield"></canvas><section id="main-menu" class="menu-panel" aria-labelledby="game-title"><p class="eyebrow">A tactical chronicle</p><h1 id="game-title">The Last Phantasm</h1><p class="subtitle">Sprint 3 — Combat Prototype</p><div class="menu-actions"><button data-action="new">New Battle</button><button data-action="demo">Combat Prototype</button><button data-action="settings" class="secondary">Settings</button></div></section><nav id="demo-controls" class="demo-controls" aria-label="Camera controls" hidden><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="zoom-out" aria-label="Zoom out">−</button><button data-action="focus">Fit Map</button><button data-action="save">Test Save</button><button data-action="debug">Debug</button></nav><section id="battle-hud" class="battle-hud" hidden><aside class="unit-panel"><strong data-hud="active"></strong><span data-hud="stats"></span><span data-hud="weapon"></span><span data-hud="statuses"></span></aside><aside class="initiative-panel"><span>Next</span><strong data-hud="timeline"></strong></aside><aside class="objective-panel" data-hud="objective"></aside><div class="command-menu" aria-label="Battle commands"><button data-battle="move">Move</button><button data-battle="attack">Attack</button><button data-battle="wait">Wait</button><button data-battle="end">End Turn</button><button data-battle="inspect">Inspect</button><button data-battle="cancel">Cancel</button><span class="facing-controls" aria-label="Choose facing"><button data-facing="north" aria-label="Face north">N</button><button data-facing="east" aria-label="Face east">E</button><button data-facing="south" aria-label="Face south">S</button><button data-facing="west" aria-label="Face west">W</button></span></div><aside class="action-preview" data-hud="preview" hidden></aside><details class="battle-log"><summary>Battle log</summary><ol data-hud="log"></ol></details><div class="battle-result" data-hud="result" hidden><strong></strong><button data-battle="restart">Restart</button><button data-action="exit-battle">Exit</button></div></section><aside id="tactical-status" class="tactical-status" aria-live="polite" hidden></aside><pre id="debug-overlay" class="debug-overlay" hidden></pre><p id="announcement" class="announcement" aria-live="polite"></p><dialog id="settings-dialog"><form method="dialog"><div class="dialog-heading"><h2>Settings</h2><button data-action="close" aria-label="Close settings">×</button></div><label>Master volume <input data-setting="volume" type="range" min="0" max="1" step="0.05" value="0.8"></label><label class="check"><input data-setting="mute" type="checkbox"> Mute audio</label><p>Audio starts only after interaction. Camera motion uses direct input and honors reduced-motion preferences.</p></form></dialog><section id="fatal-error" class="fatal-error" role="alert" hidden><h2>The chronicle could not begin</h2><p data-error-message></p><button data-action="reload">Reload</button></section></main>`;
    root.querySelector('dialog form')?.insertAdjacentHTML('beforeend', '<label class="check"><input data-setting="shake" type="checkbox"> Screen shake</label>');
    root.querySelector('#fatal-error')?.insertAdjacentHTML('beforeend', '<button data-action="fatal-menu">Return to menu</button>');
    this.canvas = this.required(root, '#game-canvas', HTMLCanvasElement);
    this.debug = this.required(root, '#debug-overlay', HTMLElement);
    this.menu = this.required(root, '#main-menu', HTMLElement);
    this.settings = this.required(root, '#settings-dialog', HTMLDialogElement);
    this.announcement = this.required(root, '#announcement', HTMLElement);
    this.demoControls = this.required(root, '#demo-controls', HTMLElement);
    this.bind(root, '[data-action="new"]', 'click', callbacks.onNewGame);
    this.bind(root, '[data-action="demo"]', 'click', callbacks.onDemo);
    this.bind(root, '[data-action="settings"]', 'click', callbacks.onSettings);
    this.bind(root, '[data-action="close"]', 'click', callbacks.onCloseSettings);
    this.bind(root, '[data-action="save"]', 'click', callbacks.onSaveSmokeTest);
    this.bind(root, '[data-action="debug"]', 'click', callbacks.onDebug);
    this.bind(root, '[data-action="zoom-in"]', 'click', () => callbacks.onZoom(0.2));
    this.bind(root, '[data-action="zoom-out"]', 'click', () => callbacks.onZoom(-0.2));
    this.bind(root, '[data-action="focus"]', 'click', callbacks.onFocus);
    this.bind(root, '[data-action="reload"]', 'click', () => window.location.reload());
    this.bind(root, '[data-action="exit-battle"]', 'click', callbacks.onExitBattle);
    this.bind(root, '[data-action="fatal-menu"]', 'click', callbacks.onExitBattle);
    for (const action of ['move','attack','wait','end','cancel','inspect','restart'] as const) this.bind(root, `[data-battle="${action}"]`, 'click', () => this.dispatchBattle(action));
    for (const facing of ['north','east','south','west'] as const) this.bind(root, `[data-facing="${facing}"]`, 'click', () => this.battleCallbacks?.facing(facing));
    const volume = this.required(root, '[data-setting="volume"]', HTMLInputElement);
    const mute = this.required(root, '[data-setting="mute"]', HTMLInputElement);
    const shake = this.required(root, '[data-setting="shake"]', HTMLInputElement);
    const onVolume = (): void => callbacks.onVolume(volume.valueAsNumber);
    const onMute = (): void => callbacks.onMute(mute.checked);
    const onShake = (): void => callbacks.onScreenShake(shake.checked);
    volume.addEventListener('input', onVolume);
    mute.addEventListener('change', onMute);
    shake.addEventListener('change', onShake);
    this.disposers.push(() => volume.removeEventListener('input', onVolume), () => mute.removeEventListener('change', onMute), () => shake.removeEventListener('change', onShake));
  }

  showMenu(visible: boolean): void { this.menu.hidden = !visible; this.demoControls.hidden = visible; }
  setBattleCallbacks(callbacks?: BattleCallbacks): void { this.battleCallbacks = callbacks; const hud = document.querySelector<HTMLElement>('#battle-hud'); if (hud) hud.hidden = !callbacks; }
  renderBattleHud(model: BattleHudModel): void { const set = (name: string, value: string): void => { const element = document.querySelector<HTMLElement>(`[data-hud="${name}"]`); if (element) element.textContent = value; }; set('active', model.active); set('stats', model.stats); set('weapon', model.weapon); set('statuses', model.statuses); set('timeline', model.timeline); set('objective', model.objective); const preview = document.querySelector<HTMLElement>('[data-hud="preview"]'); if (preview) { preview.hidden = !model.preview; preview.textContent = model.preview ?? ''; } const log = document.querySelector<HTMLOListElement>('[data-hud="log"]'); if (log) { log.replaceChildren(...model.log.slice(-8).map((message) => { const item = document.createElement('li'); item.textContent = message; return item; })); } const result = document.querySelector<HTMLElement>('[data-hud="result"]'); if (result) { result.hidden = !model.terminal; const label = result.querySelector('strong'); if (label) label.textContent = model.terminal ?? ''; } }
  updateTacticalStatus(message?: string): void { const element = document.querySelector<HTMLElement>('#tactical-status'); if (!element) return; element.hidden = !message; element.textContent = message ?? ''; }
  openSettings(): void { if (typeof this.settings.showModal === 'function') this.settings.showModal(); else this.settings.setAttribute('open', ''); }
  closeSettings(): void { this.settings.close?.(); this.settings.removeAttribute('open'); }
  announce(message: string): void { this.announcement.textContent = message; }
  showFatal(error: unknown): void { const panel = document.querySelector<HTMLElement>('#fatal-error'); if (!panel) return; const message = panel.querySelector<HTMLElement>('[data-error-message]'); if (message) message.textContent = error instanceof Error ? error.message : 'An unexpected error occurred.'; panel.hidden = false; }
  hideFatal(): void { const panel = document.querySelector<HTMLElement>('#fatal-error'); if (panel) panel.hidden = true; }
  dispose(): void { for (const dispose of this.disposers) dispose(); }
  private bind(root: HTMLElement, selector: string, event: string, callback: () => void): void { const element = this.required(root, selector, HTMLElement); element.addEventListener(event, callback); this.disposers.push(() => element.removeEventListener(event, callback)); }
  private dispatchBattle(action: 'move' | 'attack' | 'wait' | 'end' | 'cancel' | 'inspect' | 'restart'): void { const callbacks = this.battleCallbacks; if (!callbacks) return; if (action === 'end') callbacks.endTurn(); else callbacks[action](); }
  private required<T extends Element>(root: ParentNode, selector: string, constructor: { new(...args: never[]): T }): T { const element = root.querySelector(selector); if (!(element instanceof constructor)) throw new Error(`Required UI element missing: ${selector}`); return element; }
}
