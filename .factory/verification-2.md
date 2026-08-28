# Independent verification 2 — FAIL

**Work order:** `math-tooling-notebook-verify-2`  
**Candidate tested:** `c1db683e994c3aadc33a10289164afcca165e732` (`main`)  
**Live URL:** <https://math-tooling-notebook.sociobot.in/>  
**Date:** 2026-08-28

## Decision

**FAIL.** The live deployment byte-matches the candidate, the earlier main-page touch-target defect is repaired, and the build, tests, privacy, offline, accessibility automation, and performance gates otherwise pass. However, station 02 teaches and grades a mathematically wrong answer in a core drill. The Privacy and Terms screens also retain sub-44px header/footer touch targets. These are product defects, not a deployment-only failure.

## Defects

### High — station 02 rejects the first correct crossing value and teaches a later one

“See repeated growth” asks: “At which first whole-number x after 0 does 2ˣ exceed 3x?” The first such value is `x = 4`:

- `x = 1`: `2 < 3`
- `x = 2`: `4 < 6`
- `x = 3`: `8 < 9`
- `x = 4`: `16 > 12`

On both the local production build and the live deployment, selecting “x = 4” returns “That does not agree yet,” while “x = 5” returns “Correct—the check agrees,” stamps station 02 complete, and displays “At x = 5, 2⁵ = 32 while 3x = 15.” The supplied table shows only `2^x`, not the comparison values `3x`.

This is release-blocking because the product’s central job is to build trustworthy tool fluency, and the error occurs in the second of 20 required drills. Correct the keyed answer and explanation to `x = 4`; ideally show both compared quantities in the table. Add a semantic assertion for the expected answer rather than only checking that an answer exists.

### Medium — legal-page navigation targets remain below 44 × 44px

At `390 × 844` on the live deployment, the main notebook’s repaired header/footer targets are at least 44px high, but the separately styled legal pages do not meet the same product contract:

| Page | Target | Measured size |
| --- | --- | ---: |
| Privacy | Math Tooling Notebook | 236.92 × 17px |
| Privacy | Return to notebook | 164.03 × 28.05px |
| Privacy | Footer Terms | 41.23 × 16px |
| Terms | Math Tooling Notebook | 236.92 × 17px |
| Terms | Return to notebook | 164.03 × 28.05px |
| Terms | Footer Privacy | 50.70 × 16px |

The contract requires touch/click targets of at least 44 × 44 CSS pixels on every screen. Add real minimum boxes to legal-page header/footer links and cover both routes in the mobile target regression test.

### Low — the mutable service-worker URL is served as immutable for one year

`/sw.js` is not content-hashed but receives `Cache-Control: public, max-age=31536000, immutable` because `public/staticwebapp.config.json` applies that policy to `/*.js`. Manual update and offline reload worked in this run, but immutable caching is intended for hashed assets and increases future worker-update risk. Give `/sw.js` a revalidating/no-cache override while retaining immutable caching for hashed bundles.

## Clean-checkout quality gates

The worktree began clean at the exact requested commit. No product code was changed.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 59 packages installed; 0 vulnerabilities |
| Exact `npm test` | PASS — 8/8 Vitest tests and 20/20 Playwright tests |
| Desktop Playwright project | PASS — 10/10 |
| 390px mobile Playwright project | PASS — 10/10 |
| Exact `npm run build` | PASS — `tsc --noEmit` and Vite 7.3.6; `dist/index.html` produced |
| Lint/type checks | No lint script exists; the repository’s TypeScript check passed through `build` |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| Library/CLI consumer test | Not applicable; this is a static web application |

The authored tests do not catch the station 02 correctness defect because `src/drills.test.ts` only verifies that each configured answer points to a non-empty option.

## Independent product exercises

- Confirmed all 20 stations, four tool routes, the function plotter, scratchpad, local progress, and six-question transfer quiz are present.
- Exercised the first five drills, including wrong-tool feedback, the estimation reveal, empty-answer feedback, a wrong answer followed by recovery, next-station flow, and reload persistence. The UI reported `5 / 20 complete` and opened station 06 after reload. Station 02 required the incorrect configured answer described above.
- Submitted an empty transfer quiz and received its announced six-choice recovery message. A deliberate 5/6 result showed “Route ready” with item-level feedback; retry reset the form; six correct choices produced 6/6.
- Plotter cases: empty input, implicit multiplication (`2x`), unsupported `alert(1)`, non-real `sqrt(-1)`, equal axis bounds, and a valid narrow range around zero. Errors were specific and recoverable; the valid case restored a nine-row table and a range-specific canvas label. `sqrt(-1)` rendered nine `undefined` real-value cells without crashing.
- Scratchpad autosave persisted locally. Export downloaded `math-tooling-notes.txt` with exact content. Cancelling and accepting both Clear and Reset confirmations behaved correctly. Malformed local storage produced the documented recovery alert.

## Accessibility and responsive checks

- Axe through `@axe-core/playwright`: zero serious or critical findings on the local desktop notebook and live 390px notebook, Privacy, and Terms pages.
- Factory `verify-url.sh` passed locally and live: HTTP 200, correct title and `lang`, one `<h1>`, a `<main>`, no missing image alt, no unlabeled buttons, and no console/page errors.
- Keyboard-only traversal reached the page controls without a trap. The first Tab focused “Skip to notebook”; Enter moved to `#main`; Space operated the tool control and focus remained coherent; arrow keys changed native quiz radio choices. Focus used a visible 3px brass outline on the notebook and legal pages.
- The live notebook had no horizontal overflow at 390px (`390/390`) or the supported 320px floor (`320/320`). A 640px layout used as a 200%-zoom reflow equivalent also had no horizontal overflow. Desktop and mobile full-page screenshots were visually reviewed.
- With `prefers-reduced-motion: reduce`, the media query matched and the hero animation duration was effectively disabled (`0.01ms`).
- Every visible main-page anchor, button, and text input met the 44px minimum at 390px. Header navigation gaps remained at least 14px and legal navigation gaps at least 28px. The separate legal-page failure is listed above.
- The canvas has a descriptive accessible name and is followed by a value table. Main, Privacy, and Terms each have one `<h1>` and a main landmark.

## Privacy, requests, and browser policy

- Fresh local and live sessions made requests only to their own origin. No analytics, third-party runtime resources, CDN fonts, cookies, or session-storage entries were observed.
- User data used only `localStorage` key `math-tooling-notebook:v1`; the service-worker cache contained application shell files rather than user responses.
- Live HTTPS responses supplied HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions policy, and CSP: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.
- Root and legal HTML are revalidated with `public, must-revalidate, max-age=30`; hashed JS/CSS and image assets are one-year immutable. Conditional requests returned `304`. The non-hashed service-worker exception is noted above.

## Deployment identity, PWA, and performance

- Live HTML SHA-256 equals the candidate build: `128da8545a032eba8d8d18d13eb9db9dc8ca4e07bca1451c73f9c4f8f7d04890`.
- Live `index-Dtj1Mkuf.js`, `index-aLuAqVlB.css`, both WebP images, `sw.js`, Privacy, and Terms all byte-match `dist/`. JS SHA-256 is `c017483862ec170b06e04664277050145edf8b28045a80d56e2ffc12b38af971`; CSS is `aa3a11cbf4ee3feeb2a0e71a64e42066de0d1cfc947c806f2db4a5df0e9fdb9e`.
- The live worker controlled the page, `registration.update()` completed, only cache `math-tooling-notebook-v2` remained, its root and hashed assets were non-empty, and a true offline reload displayed the offline notice and usable notebook.
- Chrome parsed `manifest.webmanifest` with zero manifest errors despite the host’s generic `application/octet-stream` response type.
- Production payloads: 33,765 bytes JS (12.66 KB gzip), 21,364 bytes CSS (5.51 KB gzip), 0 font bytes, and 15,010 bytes for the selected mobile hero. These pass the 200 KB, 50 KB, 120 KB, and 300 KB budgets.
- Lighthouse 13.4.1, live mobile: Performance **96**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0s, LCP 1.1s, TBT 210ms, CLS 0, Speed Index 1.0s, TTI 1.5s. A synthetic mobile interaction run observed a maximum event duration of 48ms; field INP is unavailable for this fresh deployment test.

## Documentation and visual review

The README covers purpose, audience, run/test/build/deploy, local storage, privacy, and license. The MIT license is present. `.factory/design.md` records the product-specific midnight-mathematics-railway palette, type, spacing, responsive behavior, interaction and motion policies, original-asset prompt, model, date, and review. The delivered poster is responsive, explicitly sized, visually coherent, and disclosed in the footer.

## Retest exit criteria

1. Make station 02 accept `x = 4`, explain `2⁴ = 16 > 12`, and ideally display both `2^x` and `3x`; add a regression assertion for the mathematical result.
2. Make legal-page header/footer links at least 44 × 44px at 390px and add route-specific target tests.
3. Override `/sw.js` to revalidate instead of inheriting immutable hashed-asset caching.
4. Rerun `npm test`, `npm run build`, the station 02 live exercise, both legal-page mobile measurements, offline update/reload, and live byte-identity checks.
