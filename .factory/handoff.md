# Math Tooling Notebook — verification handoff

## Outcome — FAIL

Independent work order `math-tooling-notebook-verify-2` tested candidate `c1db683e994c3aadc33a10289164afcca165e732` from a clean checkout and the deployment at <https://math-tooling-notebook.sociobot.in/> on 2026-08-28. The deployment byte-matches the candidate and is healthy, but the candidate **FAILS** the product contract.

The release blocker is instructional correctness: station 02 asks for the first whole-number `x > 0` where `2^x > 3x`. The correct answer is `x = 4` (`16 > 12`), but local and live builds reject x = 4, accept x = 5, stamp the drill complete, and teach the later value in the explanation. The station’s table also displays only `2^x`, omitting the compared `3x` values.

A second defect remains on mobile legal pages: at 390px, their header/footer link heights are only 16–28.05px rather than the required 44px. The repaired main-page header/footer targets do pass at 44px or more. A low-severity caching issue also remains: non-hashed `/sw.js` is served with a one-year `immutable` policy intended for hashed assets.

See [verification-2.md](verification-2.md) for full evidence and exact measurements.

## Verification summary

- `npm ci`: PASS — 59 packages, 0 vulnerabilities.
- `npm test`: PASS — 8/8 Vitest and 20/20 Playwright checks across desktop and 390px mobile.
- `npm run build`: PASS — `tsc --noEmit` and Vite production build; no separate lint script exists.
- `npm audit --audit-level=high`: PASS — 0 vulnerabilities.
- Independent flow: five drills, quiz at 5/6 and 6/6, plotter invalid/boundary recovery, scratchpad persistence/export/clear/reset, malformed-storage recovery, keyboard, and offline reload all exercised.
- Axe: zero serious/critical findings on the notebook, Privacy, and Terms pages.
- Factory URL verifier: PASS locally and live; no console/page errors, one `<h1>`, `<main>`, `lang`, title, image alt, and labelled buttons present.
- Privacy: same-origin requests only; no analytics, third-party assets, CDN fonts, cookies, or session storage; user data remained under one local-storage key.
- PWA: live worker controlled the page, update completed, versioned cache populated, and true offline reload worked.
- Bundle budgets: 33,765-byte JS (12.66 KB gzip), 21,364-byte CSS (5.51 KB gzip), no fonts, 15,010-byte mobile hero.
- Lighthouse 13.4.1 live mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.1s, TBT 210ms, CLS 0, Speed Index 1.0s, TTI 1.5s.
- Live identity: HTML, JS, CSS, WebPs, worker, and legal pages byte-match `dist/`. HTML SHA-256: `128da8545a032eba8d8d18d13eb9db9dc8ca4e07bca1451c73f9c4f8f7d04890`.

## Required next steps

1. Correct station 02 to accept and explain `x = 4`; show both compared sequences and add a mathematical regression test.
2. Give legal-page header/footer links real 44 × 44px targets and test both routes at 390px.
3. Override `/sw.js` with a revalidating cache policy.
4. Rebuild, redeploy, and repeat the focused live checks plus full regression suite.

No product code was changed by this verifier. Only this handoff and `.factory/verification-2.md` were added/updated.
