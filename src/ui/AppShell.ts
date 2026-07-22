export interface MenuCallbacks { onNewGame(): void; onDemo(): void; onSettings(): void; onCloseSettings(): void; onSaveSmokeTest(): void; onVolume(value: number): void; onMute(value: boolean): void; onDebug(): void; onZoom(delta: number): void; onFocus(): void; }

export class AppShell {
  readonly canvas: HTMLCanvasElement;
  readonly debug: HTMLElement;
  readonly menu: HTMLElement;
  readonly settings: HTMLDialogElement;
  readonly announcement: HTMLElement;
  private readonly demoControls: HTMLElement;
  private readonly disposers: Array<() => void> = [];

  constructor(root: HTMLElement, callbacks: MenuCallbacks) {
    root.innerHTML = `<main class="game-shell"><canvas id="game-canvas" aria-label="Isometric tactical engine playfield"></canvas><section id="main-menu" class="menu-panel" aria-labelledby="game-title"><p class="eyebrow">A tactical chronicle</p><h1 id="game-title">The Last Phantasm</h1><p class="subtitle">Sprint 2 — Tactical Engine Foundation</p><div class="menu-actions"><button data-action="new">New Game</button><button data-action="demo">Tactical Engine Demo</button><button data-action="settings" class="secondary">Settings</button></div></section><nav id="demo-controls" class="demo-controls" aria-label="Camera controls" hidden><button data-action="zoom-in" aria-label="Zoom in">+</button><button data-action="zoom-out" aria-label="Zoom out">−</button><button data-action="focus">Fit Map</button><button data-action="save">Test Save</button><button data-action="debug">Debug</button></nav><aside id="tactical-status" class="tactical-status" aria-live="polite" hidden></aside><pre id="debug-overlay" class="debug-overlay" hidden></pre><p id="announcement" class="announcement" aria-live="polite"></p><dialog id="settings-dialog"><form method="dialog"><div class="dialog-heading"><h2>Settings</h2><button data-action="close" aria-label="Close settings">×</button></div><label>Master volume <input data-setting="volume" type="range" min="0" max="1" step="0.05" value="0.8"></label><label class="check"><input data-setting="mute" type="checkbox"> Mute audio</label><p>Audio starts only after interaction. Camera motion uses direct input and honors reduced-motion preferences.</p></form></dialog><section id="fatal-error" class="fatal-error" role="alert" hidden><h2>The chronicle could not begin</h2><p data-error-message></p><button data-action="reload">Reload</button></section></main>`;
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
    const volume = this.required(root, '[data-setting="volume"]', HTMLInputElement);
    const mute = this.required(root, '[data-setting="mute"]', HTMLInputElement);
    const onVolume = (): void => callbacks.onVolume(volume.valueAsNumber);
    const onMute = (): void => callbacks.onMute(mute.checked);
    volume.addEventListener('input', onVolume);
    mute.addEventListener('change', onMute);
    this.disposers.push(() => volume.removeEventListener('input', onVolume), () => mute.removeEventListener('change', onMute));
  }

  showMenu(visible: boolean): void { this.menu.hidden = !visible; this.demoControls.hidden = visible; }
  updateTacticalStatus(message?: string): void { const element = document.querySelector<HTMLElement>('#tactical-status'); if (!element) return; element.hidden = !message; element.textContent = message ?? ''; }
  openSettings(): void { if (typeof this.settings.showModal === 'function') this.settings.showModal(); else this.settings.setAttribute('open', ''); }
  closeSettings(): void { this.settings.close?.(); this.settings.removeAttribute('open'); }
  announce(message: string): void { this.announcement.textContent = message; }
  showFatal(error: unknown): void { const panel = document.querySelector<HTMLElement>('#fatal-error'); if (!panel) return; const message = panel.querySelector<HTMLElement>('[data-error-message]'); if (message) message.textContent = error instanceof Error ? error.message : 'An unexpected error occurred.'; panel.hidden = false; }
  dispose(): void { for (const dispose of this.disposers) dispose(); }
  private bind(root: HTMLElement, selector: string, event: string, callback: () => void): void { const element = this.required(root, selector, HTMLElement); element.addEventListener(event, callback); this.disposers.push(() => element.removeEventListener(event, callback)); }
  private required<T extends Element>(root: ParentNode, selector: string, constructor: { new(...args: never[]): T }): T { const element = root.querySelector(selector); if (!(element instanceof constructor)) throw new Error(`Required UI element missing: ${selector}`); return element; }
}
