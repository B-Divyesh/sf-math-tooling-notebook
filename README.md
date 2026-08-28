# Math Tooling Notebook

Math Tooling Notebook is a free, local-first practice utility for adults returning to mathematics. Instead of teaching another content sequence, it builds fluency with the working loop around mathematics: decide when to **estimate**, make a **table**, draw a **graph**, or use an **algebraic check**.

Live: <https://math-tooling-notebook.sociobot.in>

## What it includes

- 20 guided tool-literacy drills in five short zones
- A no-eval function plotter with adjustable axes and accessible value tables
- Estimation reveals, pattern tables, graph inspections, and algebra checks
- A six-situation transfer quiz with a five-out-of-six target
- A scratchpad with local autosave and plain-text export
- Local progress, an explicit reset, and offline support after the first visit
- Privacy and terms pages; no accounts, analytics, CDN assets, or third-party scripts

The plotter supports numbers, `x`, parentheses, `+`, `-`, `*`, `/`, `^`, the constants `pi` and `e`, and `sin`, `cos`, `tan`, `sqrt`, `abs`, `log`, `ln`, and `exp`.

## Who it is for

It is designed for an adult who wants practical confidence before beginning a formal mathematics course. It is not an exam-preparation product, a computer algebra system, or a replacement for professional calculation software.

## Develop and verify

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs unit tests and Playwright flows at desktop and 390px mobile widths. The exact production build command is `npm run build`; it writes the static deployment to `dist/`, with `dist/index.html` at the root.

## Deployment

Deploy the contents of `dist/` to Azure Static Web Apps. `public/staticwebapp.config.json` supplies SPA fallback, security headers, and immutable asset caching. The factory owns infrastructure, DNS, and deployment.

## Product sources

- [Opportunity brief](.factory/brief.json)
- [Visual system and asset provenance](.factory/design.md)
- [Build handoff](.factory/handoff.md)

## Privacy and license

User progress and notes remain in browser `localStorage`. See `/privacy/` in the app for the complete notice. Code is available under the [MIT License](LICENSE). The generated hero image is original to this product; its prompt and provenance are recorded in `assets/src/` and `.factory/design.md`.
