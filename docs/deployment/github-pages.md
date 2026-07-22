# GitHub Pages Deployment

Vite uses `/the-last-phantasm-/` for production builds and `/` during local development. A deployment workflow should install locked dependencies, run `npm run check`, and publish `dist/` as the Pages artifact.

Do not commit `dist/` unless repository policy changes. GitHub Pages must be configured to deploy through GitHub Actions. Because the application is currently a single entry point with no history-mode router, no 404 fallback is needed.
