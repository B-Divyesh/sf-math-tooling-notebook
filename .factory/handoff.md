# Math Tooling Notebook — repair handoff

## Outcome

Work order `math-tooling-notebook-repair-2` repairs every release-blocking finding in independent report commit `56f193cd21203b2a0afdbf94c72cafd88e6de282` for candidate `de7cf6c059b2023b83646ef9a55edf1fa1d47d7c`.

The reported 390px touch-target failure is fixed. Header and footer anchors now use real 44 × 44px minimum boxes while retaining the existing midnight-railway visual treatment. The linked brand also receives the same minimum height, and its wordmark collapses below 350px so the supported 320px floor keeps safe target separation. The artifact remains a Vite/TypeScript `static-web` build with `dist/index.html` at its root.

Implementation commit: `291329f` (`fix: meet mobile touch target contract`).

## Reproduction and regression coverage

Before the repair, the local production build reproduced the verifier's live values exactly:

| Target | Before | Live after repair |
| --- | ---: | ---: |
| Drills | 32.91 × 18.59px | 44 × 44px |
| Transfer quiz | 80.94 × 18.59px | 80.94 × 44px |
| Privacy | 53.75 × 21.69px | 53.75 × 44px |
| Terms | 43.80 × 21.69px | 44 × 44px |
| Source | 50.83 × 21.69px | 50.83 × 44px |

The root cause was that these anchors remained inline text boxes; their parents supplied visual spacing but no tappable height. They are now centered `inline-flex` targets with 44px minimum width and height.

`tests/app.spec.ts` now measures every visible header/footer anchor at 390 × 844 in both browser projects, asserts the exact expected target set, requires width and height ≥44px, and requires gaps ≥8px. Live gaps are 14px in the primary navigation and 28px in the legal navigation. The 390px document remains 390/390px with no horizontal overflow.

## Verification evidence

Run from a clean checkout with Node.js 20+:

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

Results on 2026-08-28:

- `npm ci`: 59 packages installed, 0 vulnerabilities.
- `npm test`: 8/8 Vitest tests and 20/20 Playwright tests passed across desktop Chromium and the 390 × 844 mobile/touch profile.
- Browser coverage passed drill completion/persistence, plotter error recovery, strict CSP, keyboard focus continuity, legal routes, 390px overflow, the exact touch-target regression, service-worker update, true offline reload, local-only storage, third-party request detection, and Axe serious/critical checks.
- `npm run build`: TypeScript no-emit check and Vite production build passed. There is no separate lint script. Package/consumer testing is not applicable to this static application.
- `npm audit --audit-level=high`: 0 vulnerabilities. `git diff --check`: clean.
- Production payload: 33,765-byte JS (12.66 KB gzip), 21,364-byte CSS (5.51 KB gzip), no webfonts, and a 15,010-byte mobile hero image; all remain within the product budgets.
- Local factory `verify-url.sh`: HTTP 200, no console/page errors, title and `lang` present, one `<h1>`, `<main>` present, 0 missing image alts, and 0 unlabeled buttons.
- Desktop and full-page 390px screenshots were reviewed; navigation hierarchy and spacing remain consistent with `.factory/design.md`.
- Live Lighthouse 13.4.1 mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.1s, LCP 1.1s, TBT 0ms, CLS 0, Speed Index 1.1s.

## Live policy, privacy, offline, and identity

- Deployed with `/opt/fleet/lib/deploy-static.sh math-tooling-notebook dist`.
- Azure deployment ID: `21c2d7fa-ad18-40a2-ae56-a5b0d6d77de7`.
- Azure host: `gentle-moss-0ea1beb0f.7.azurestaticapps.net`; custom domain status: `Ready`.
- Live URL: <https://math-tooling-notebook.sociobot.in/>.
- Post-deploy `verify-url.sh`: HTTP 200 in 779ms, no console/page errors, correct title/`lang`, one `<h1>`, `<main>`, 0 missing image alts, and 0 unlabeled buttons.
- Live 390px keyboard smoke: first Tab focuses “Skip to notebook” with a 3px brass outline. Reduced-motion animation duration is effectively disabled (`1e-05s`). Axe reports 0 serious/critical violations.
- Live privacy smoke: no cookies, analytics, third-party requests, CDN scripts, or fonts. Scratchpad data creates only `math-tooling-notebook:v1` in `localStorage`.
- The live service worker controls the page, uses `math-tooling-notebook-v2`, and reloads successfully offline with the offline notice visible.
- HTTPS responses retain HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions policy, and the strict self-only CSP. Root HTML is short-cached; hashed assets are immutable for one year.
- Live assets byte-match `dist`: HTML SHA-256 `128da8545a032eba8d8d18d13eb9db9dc8ca4e07bca1451c73f9c4f8f7d04890`; CSS `index-aLuAqVlB.css` SHA-256 `aa3a11cbf4ee3feeb2a0e71a64e42066de0d1cfc947c806f2db4a5df0e9fdb9e`; JS `index-Dtj1Mkuf.js` SHA-256 `c017483862ec170b06e04664277050145edf8b28045a80d56e2ffc12b38af971`.

## Known boundaries

- The plotter is a sampled, real-valued inspection aid rather than a computer algebra system.
- Progress is device/browser-local and does not sync. Clearing site data removes it; scratchpad export is the portable option.
- Offline use starts after one successful online visit so the versioned shell can be cached.

No repair-specific gaps remain.
