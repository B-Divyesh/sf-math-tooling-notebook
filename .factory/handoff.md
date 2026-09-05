# Math Tooling Notebook — repair handoff

## Status

**Ready for review.** The implementation commit is `e46de7eb48ad295357549cedb83ba4ce44b529a7`. It was deployed to <https://math-tooling-notebook.sociobot.in> on 2026-09-05. The live root HTML and deployed JavaScript byte-match the final local `dist/` build.

This document is committed separately from the implementation so review evidence does not change the deployed artifact. The documentation verification commit is `2c3e8f9091935d7bf8d9788b8a48087213d9376c`; this final attestation only records that SHA.

## Independent verification 3

**PASS on 2026-09-05.** The independent verifier reviewed implementation `e46de7eb48ad295357549cedb83ba4ce44b529a7` and documentation verification `2c3e8f9091935d7bf8d9788b8a48087213d9376c`; the report base was `349a268cf5e507e9305885f7eba9158cfab9ff85`.

It reran `npm ci`, `npm test` (9 unit and 46 browser executions), `npm run build`, and all 11 declared claim commands individually. Fresh live desktop and 390px phone checks covered the first screen, the isolated demo and reset/exit path, correct Station 02 maths, invalid/boundary/recovery plotter paths, quiz, keyboard/focus, reduced motion, touch targets, privacy requests, live offline/update behavior, legal pages, route titles, and the designed HTTP 404. Root, Demo, Privacy, Terms, and 404 had zero serious or critical Axe violations. There were **zero findings and zero untested claims**. See [verification-3.md](verification-3.md).

## Product job, audience, and first action

- **Job:** help people choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**. It opens five completed drills and a filled scratchpad in `/demo`.

Fresh HTTPS desktop (1440 × 900) and phone (390 × 844) contexts both reported that exact job, audience, and action at `scrollY: 0`. Both then opened the demo, showed `5 / 20 complete`, the persistent **Demo — sample data. Nothing is saved to your notebook.** label, only `demo:math-tooling-notebook:v1` storage, and a working **Reset demo** action. Neither context logged a console or page error.

## Repairs made

| Review finding | Disposition | Repair and evidence |
| --- | --- | --- |
| No isolated sample demo | Resolved | `/demo` and `?demo=1` use the isolated `demo:math-tooling-notebook:v1` namespace. The seeded sample has drills 01–05 complete and a realistic repeated-growth note. The banner supplies Reset demo and Start for real; the latter discards only demo state. [.factory/demo.md](demo.md) documents it. |
| Station 02 taught `x = 5` | Resolved | Station 02 accepts `x = 4`, renders `2^x` and `3x` in one table, and explains `16 > 12`. Unit and browser tests verify the first crossing mathematically and through the visible drill. |
| Claims registry missing | Resolved | [.factory/claims.json](claims.json) declares 11 observable public claims. Each has exactly one `@claim:<id>` Playwright flow and a documented command. |
| Landing copy was metaphor-first | Resolved | The first screen now says **Choose the right maths tool**, names adults returning to maths, gives the sample action and result, and lists free/privacy/offline facts. [.factory/copy-audit.md](copy-audit.md) records the landing copy audit and terminology. |
| Legal pages lacked shared structure and target size | Resolved | Privacy and Terms now have skip links, the standard header/nav/footer, metadata, visible focus, and 44 × 44px links including inline legal links. Mobile browser checks cover all legal and 404-page anchors. |
| Route metadata and 404 incomplete | Resolved | Root, Demo, Privacy, Terms, and 404 have titles, canonical/description/Open Graph/Twitter metadata, favicon, apple-touch icon, and product preview. `/demo` is the only SPA rewrite. An unknown path returns the designed `404.html` with HTTP 404. |
| Mutable worker cached immutable | Resolved | `/sw.js` has `Cache-Control: no-cache`; hashed assets remain immutable. The worker cache is now `math-tooling-notebook-v3` and the live demo reloads offline. |

Earlier findings are also closed: main-page header/footer targets remain compliant; Station 02 is now correct; legal targets are compliant; and the worker cache response is revalidating.

## Verification

Clean setup used Node 22 with `npm ci` (59 packages, 0 reported vulnerabilities).

| Check | Result |
| --- | --- |
| `npm test` | PASS — 9 Vitest tests and 46 Playwright executions across desktop and 390px mobile. Covers normal, invalid, boundary, recovery, keyboard, focus, real reset, reduced motion, update, offline, legal pages, 404, console errors, and accessibility. |
| `npm run build` | PASS — type check and Vite build produce `dist/index.html`. Final initial JS is 36,258 bytes (13.33 KB gzip); CSS is 22,476 bytes (5.72 KB gzip). |
| Every declared claim command | PASS — all 11 commands in `claims.json` ran individually through `npm run test:claims -- --grep @claim:<id>`. |
| URL verifier | PASS locally and live on root, Demo, Privacy, and Terms: title, `lang`, one h1, main landmark, image alt, labelled buttons, and zero browser errors. |
| Axe | PASS — live 390px checks on root, Demo, Privacy, Terms, and 404 each had zero serious or critical violations. |
| Static Web Apps routing emulator | PASS — `/demo` returned 200 and `/not-a-real-page` returned HTTP 404 with the designed 404 title and h1. |
| Lighthouse local mobile-style run | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 906ms, LCP 1,266ms, TBT 35ms, CLS 0. |
| Live HTTPS cold check | PASS — root, Demo, Privacy, and Terms returned 200. Unknown path returned 404. `/sw.js` returned `Cache-Control: no-cache`. |
| Live demo offline check | PASS — a fresh service-worker-controlled `/demo` context reloaded offline with the demo banner and offline notice. |
| Live identity | PASS — `dist/index.html` and live root SHA-256: `b1cf4bbd413cabab5d1667ac7f160b8f3d71d5b8b45158c07882aba8370f3a25`; final JavaScript and live JavaScript SHA-256: `ecc536d739c0037bc18c4360608541c1f3d126ee65986c6f42ae31c08283231b`. |

## How to run

```sh
npm ci
npm test
npm run build
```

Use `/demo` for the one-click sample. See [README.md](../README.md), [demo.md](demo.md), and [claims.json](claims.json) for full usage and individual claim commands.

## Known gaps and next steps

There are no known functional, accessibility, privacy, or deployment gaps from this repair. The brief’s adoption measure—half of new users completing five drills and choosing five of six quiz tools—requires privacy-respecting aggregate product research outside this local-first, no-analytics build. The app intentionally records no visitor analytics, so it does not claim that outcome has occurred.
