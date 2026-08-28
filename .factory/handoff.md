# Handoff\n\n(written by the worker at the end of each work order)
# Math Tooling Notebook — build handoff

## Shipped

- A finished static Vite + TypeScript notebook for the adult-returner job in the research brief.
- 20 numbered drills across Estimate, Table, Graph, and Algebra routes. Every drill asks for a tool choice, explains why that tool leads, provides an appropriate work surface, checks an answer, and records completion locally.
- A standalone, responsive function plotter with adjustable ranges, a purpose-built expression parser, clear syntax errors, discontinuity handling, and a value-table alternative for every graph.
- A six-question transfer quiz with explanations and the brief’s 5/6 success target.
- A locally saved scratchpad with autosave, text export, confirmed deletion, and full-notebook reset.
- First-class new-user, invalid-expression, storage-error, and offline states. A service worker caches the app shell after the first successful visit.
- Responsive art-deco transit-poster visual system, an original generated hero illustration, keyboard/focus treatment, reduced-motion behavior, and 390px mobile layout.
- Local-first privacy notice, terms, MIT license, manifest, robots/sitemap, Azure Static Web Apps headers and cache rules, and expanded contributor/deployment docs.

## Verification

Run from a clean checkout with Node.js 20+:

```sh
npm ci
npm test
npm run build
```

- `npm test`: **8 unit tests + 10 Playwright checks passed** across desktop Chromium and a 390×844 mobile Chromium profile. Checks cover parser safety/precedence, curriculum integrity, end-to-end drill completion and persistence, plotter errors/recovery, legal routes, overflow, and Axe accessibility.
- `npm run build`: passed. Output is `dist/` with `dist/index.html` at its root.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Factory `verify-url.sh`: HTTP 200, 535 ms local load, no browser console errors, one `<h1>`, title/lang/main present, 0 missing image alts, and 0 unlabeled buttons.
- Lighthouse 12.8.2, mobile defaults against the production preview: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. FCP 0.9 s, LCP 1.2 s, TBT 40 ms, CLS 0, Speed Index 0.9 s.
- Production payload: 33.78 KB JS / 12.68 KB gzip; 20.97 KB CSS / 5.45 KB gzip; 0 KB web fonts. Responsive hero WebP is 16 KB mobile / 28 KB large.
- Generated artwork was visually reviewed for text artifacts, brands, unintended symbols, and seams. Prompt/model/date and review are in `.factory/design.md` and `assets/src/math-railway.prompt.json`.

## Known boundaries

- The plotter intentionally handles one explicit real-valued function at a time; comparison drills plot a difference function. It is a sampled inspection aid, not a CAS or safety-critical calculator.
- Progress is intentionally device/browser-local and does not sync. Private browsing or cleared site data removes it; scratchpad export is the portable option.
- Offline use begins after one successful online visit so the service worker can cache the versioned shell.

## Suggested next steps

- Observe anonymous aggregate page views and the stated five-drill/5-of-6 outcomes only if the factory adds a privacy-preserving, consent-appropriate counter later.
- User-test the wording with adult returners before expanding the drill set; resist turning the utility into a full curriculum.
