# Math Tooling Notebook — verification 4 handoff

## Status

**PASS — independent verification complete with zero findings and zero untested claims.** The product implementation remains `e46de7eb48ad295357549cedb83ba4ce44b529a7`; the audit and browser-regression repair is `d2b79c88cd2f90c80189f1afeb6b754bb8348d08`; documentation reviewed through `ecfdf20fffa9905940df65505555f19317a0a5ab`. No shipped application asset changed.

Verification 4 repeated the live desktop and phone sample flows in fresh contexts, ran all 11 claim commands separately, ran the full 9-unit/48-browser suite, built `dist/`, checked all prior findings, and compared fresh output with HTTPS. Live mobile Lighthouse scored 99/100/100/100 with 1.12s LCP and zero CLS. Root, Demo, Privacy, Terms, and the designed HTTP 404 had zero serious or critical Axe findings. See [verification-4.md](verification-4.md).

The prior review found that `.factory/copy-audit.md` was stale (`Pick the simplest useful view` rather than the shipped `Pick the lightest useful view`) and omitted landing-page copy. The regenerated audit is an exact inventory of fresh `/` copy: header, first screen, method, all initial drill labels, first drill, plotter, quiz, notes, reset, footer, image description, and input help. Every entry has an exact word count and banned-word result. The new browser regression reads the rendered page, checks that every audited copy unit is present, then validates the word counts, 22-word limit, and banned list. It does not assert source strings.

## Job, audience, and first action

- **Job:** help people choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**. It opens five completed drills and a filled scratchpad in `/demo`.

Fresh HTTPS desktop (1440 × 900) and phone (390 × 844) contexts both showed that exact job, audience, action, result, and three facts at `scrollY: 0`. Both entered the sample, displayed `5 / 20 complete`, the persistent **Demo — sample data. Nothing is saved to your notebook.** label, and the repeated-growth scratchpad note. **Reset demo** restored the shipped sample while a pre-seeded regular note stayed unchanged. Neither context recorded a console or page error.

## Earlier finding disposition

| Finding | Current disposition | Evidence |
| --- | --- | --- |
| Sample flow was not isolated | Resolved | `/demo` uses only `demo:math-tooling-notebook:v1`; Reset restores the sample and Start for real discards only that key. |
| Station 02 taught `x = 5` | Resolved | The visible table and drill accept `x = 4`, show `16` and `12`, and explain the first crossing. |
| Public claims lacked declared tests | Resolved | Eleven claims have one tagged, demo-based browser outcome test each. |
| Landing copy was metaphor-first | Resolved | The first screen gives the job, audience, action result, and free/local/offline facts. |
| Copy audit was stale and incomplete | Resolved in `d2b79c8` | The complete current-copy audit and rendered-output regression now prevent copy-audit drift. |
| Legal pages lacked shared structure or target size | Resolved | Browser checks cover titles, landmarks, skip links, and 44 × 44px visible links at 390px. |
| Route metadata and designed 404 were incomplete | Resolved | Root, Demo, Privacy, Terms, and the designed HTTP 404 have distinct titles and valid routes. |
| Mutable service worker was immutable-cached | Resolved | Live `/sw.js` responds with `Cache-Control: no-cache`; the worker update and offline-reload test pass. |

## Verification

Clean setup used Node `v22.23.2` and `npm ci` (59 packages; 0 reported vulnerabilities).

| Check | Result |
| --- | --- |
| `npm test` | PASS — 9 Vitest tests and 48 Playwright executions across desktop and 390px mobile. The two added executions cover the rendered copy audit. |
| `npm run build` | PASS — type check passed and created `dist/index.html`. Initial JS: 36.27 KB (13.34 KB gzip); CSS: 22.48 KB (5.72 KB gzip). |
| Each declared claim command | PASS — all 11 commands below passed independently in both browser projects. |
| Local accessibility | PASS — the suite's Axe check found zero serious or critical violations on root, Privacy, Terms, and 404. Keyboard, focus, reduced-motion, mobile target, and no-overflow checks passed. |
| Factory URL verifier | PASS — fresh live root returned 200 in 543ms with the required title, `lang=en`, one h1, main landmark, image alt text, labelled buttons, and zero console errors. |
| Live mobile Axe | PASS — root, Demo, Privacy, Terms, and the designed 404 had zero serious or critical violations. |
| Live HTTPS routes | PASS — `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; deliberate `/not-a-real-page` returned the designed HTTP 404. |
| Live security/cache | PASS — `/sw.js` returned `no-cache` with the existing CSP and HSTS headers. |
| Live identity | PASS — final local root and JS SHA-256 values exactly match live: `b1cf4bbd413cabab5d1667ac7f160b8f3d71d5b8b45158c07882aba8370f3a25` and `ecc536d739c0037bc18c4360608541c1f3d126ee65986c6f42ae31c08283231b`. |

```sh
npm run test:claims -- --grep @claim:demo-isolation
npm run test:claims -- --grep @claim:twenty-drills
npm run test:claims -- --grep @claim:four-tool-practice
npm run test:claims -- --grep @claim:function-plotter-table
npm run test:claims -- --grep @claim:transfer-quiz
npm run test:claims -- --grep @claim:scratchpad-autosave
npm run test:claims -- --grep @claim:text-export
npm run test:claims -- --grep @claim:local-progress-reset
npm run test:claims -- --grep @claim:offline-reload
npm run test:claims -- --grep @claim:no-account-or-third-party-runtime
npm run test:claims -- --grep @claim:data-stays-on-device
```

## Delivery and remaining work

`.factory/catalog-description.txt` is a 61-character verb-first description and is copied verbatim to `/work/.evidence/catalog-description.txt`.

No product-code deployment was necessary: the repaired commit changes the audit and its test only, and the freshly built production HTML and JavaScript are byte-identical to the existing live implementation. The product has no paid offer or billing dependency.

There are no known functional, accessibility, privacy, offline, claim, or copy-audit gaps. The brief's adoption measure remains intentionally unmeasured because the product has no analytics; it does not claim that result has occurred.

## How to run

```sh
npm ci
npm test
npm run build
```

Use `/demo` for the isolated one-click sample. See [README.md](../README.md), [demo.md](demo.md), and [claims.json](claims.json) for product usage and claim coverage.
