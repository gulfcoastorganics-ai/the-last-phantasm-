import './styles/main.css';
import { Game } from './core/Game';

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('Application root is missing.');

const game = new Game(root);
void game.start().catch((error: unknown) => {
  console.error('Application failed to start', error);
  root.innerHTML = `<main class="boot-error" role="alert"><h1>The chronicle could not begin</h1><p>This browser could not initialize the game. Reload or try a current browser.</p></main>`;
});

if (import.meta.hot) import.meta.hot.dispose(() => void game.dispose());
