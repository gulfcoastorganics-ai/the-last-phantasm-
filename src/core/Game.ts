import { AudioManager } from '../audio/AudioManager';
import { DebugOverlay } from '../debug/DebugOverlay';
import { PerformanceMonitor } from '../debug/PerformanceMonitor';
import { InputManager } from '../input/InputManager';
import { Camera } from '../rendering/Camera';
import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { SaveManager } from '../save/SaveManager';
import type { SettingsData } from '../save/SaveSchema';
import { EngineDemoScene } from '../scenes/EngineDemoScene';
import { LoadingScene } from '../scenes/LoadingScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { AppShell } from '../ui/AppShell';
import { loadConfig } from './Config';
import { GameLoop } from './GameLoop';
import { createLogger } from './Logger';
import { SceneManager } from './SceneManager';
import { Time } from './Time';

export class Game {
  private readonly config = loadConfig();
  private readonly save = new SaveManager(window.localStorage);
  private settings: SettingsData = this.save.settingsOrDefault();
  private readonly logger = createLogger(import.meta.env.DEV);
  private readonly shell: AppShell;
  private readonly renderer: CanvasRenderer;
  private readonly input: InputManager;
  private readonly camera: Camera;
  private readonly scenes = new SceneManager();
  private readonly performance = new PerformanceMonitor();
  private readonly debug: DebugOverlay;
  private readonly audio: AudioManager;
  private readonly loop: GameLoop;
  private disposed = false;

  constructor(root: HTMLElement) {
    this.camera = new Camera(this.config.camera.minZoom, this.config.camera.maxZoom);
    this.shell = new AppShell(root, {
      onNewGame: () => this.startNewGame(), onDemo: () => void this.changeScene('demo'),
      onSettings: () => this.shell.openSettings(), onCloseSettings: () => this.shell.closeSettings(),
      onSaveSmokeTest: () => this.saveSmokeTest(), onVolume: (value) => this.updateSettings({ masterVolume: value }),
      onMute: (value) => this.updateSettings({ muted: value }), onDebug: () => { this.debug.toggle(); this.updateSettings({ debug: this.debug.isEnabled }); },
      onZoom: (delta) => this.camera.setZoom(this.camera.zoom + delta), onFocus: () => this.camera.focus(),
    });
    this.renderer = new CanvasRenderer(this.shell.canvas, this.config.maxDevicePixelRatio);
    this.input = new InputManager(this.shell.canvas, (event) => this.renderer.toCanvasPoint(event));
    this.debug = new DebugOverlay(this.shell.debug);
    this.debug.setEnabled(this.settings.debug || this.config.debugInitiallyEnabled);
    this.audio = new AudioManager(this.settings);
    this.scenes.register(new LoadingScene(() => void this.scenes.change('menu')));
    this.scenes.register(new MainMenuScene(this.renderer, this.shell));
    this.scenes.register(new EngineDemoScene(this.renderer, this.camera, this.input, this.config.camera.keyboardPanSpeed));
    this.loop = new GameLoop((time) => {
      try {
        if (this.input.state('toggleDebug').pressed) this.debug.toggle();
        this.scenes.update(time); this.performance.sample(time.deltaSeconds); this.scenes.render();
        this.debug.update({ performance: this.performance.snapshot, viewport: this.renderer.viewport.size, scene: this.scenes.currentId ?? 'none', camera: this.camera, pointer: this.input.pointer, input: this.input.summary() });
        this.input.endFrame();
      } catch (error) { this.handleFatal(error); }
    }, new Time(this.config.maxDeltaSeconds));
  }

  async start(): Promise<void> {
    this.renderer.start(); this.input.start();
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('error', this.onWindowError);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection);
    await this.scenes.change('loading'); this.loop.start();
  }

  private async changeScene(id: string): Promise<void> { await this.audio.unlock(); await this.scenes.change(id); }
  private startNewGame(): void { this.save.saveCampaign({ startedAt: new Date().toISOString(), currentScene: 'demo' }); void this.changeScene('demo'); this.shell.announce('New chronicle initialized safely.'); }
  private saveSmokeTest(): void { const before = this.save.loadCampaign(); if (!before.ok) this.save.saveCampaign({ startedAt: new Date().toISOString(), currentScene: 'demo' }); const after = this.save.loadCampaign(); this.shell.announce(after.ok ? 'Save foundation test passed.' : `Save test failed: ${after.reason}.`); }
  private updateSettings(patch: Partial<SettingsData>): void { this.settings = { ...this.settings, ...patch }; this.save.saveSettings(this.settings); this.audio.update(this.settings); }
  private readonly onVisibility = (): void => this.loop.setPaused(document.hidden);
  private readonly onWindowError = (event: ErrorEvent): void => this.handleFatal(event.error ?? new Error(event.message));
  private readonly onUnhandledRejection = (event: PromiseRejectionEvent): void => this.handleFatal(event.reason);
  private handleFatal(error: unknown): void { this.logger.error('Fatal runtime error', error); this.loop.setPaused(true); this.shell.showFatal(error); }

  async dispose(): Promise<void> {
    if (this.disposed) return; this.disposed = true; this.loop.stop(); this.input.dispose(); this.renderer.dispose();
    document.removeEventListener('visibilitychange', this.onVisibility); window.removeEventListener('error', this.onWindowError); window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
    await this.scenes.dispose(); await this.audio.dispose(); this.shell.dispose();
  }
}
