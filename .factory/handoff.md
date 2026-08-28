# Math Tooling Notebook — repair handoff

## Repair outcome

Candidate `8415f8660a5fdb57ae67851a1c4ff8e630762aac` was repaired and redeployed as the same `static-web` artifact at <https://math-tooling-notebook.sociobot.in>.

The failure was a runtime `style="width:…"` attribute on the drill progress fill while Azure served `style-src 'self'`. The production browser correctly rejected that attribute. The repair keeps the policy unchanged and strict: the progress display is now a semantic `<progress>` element styled entirely by the external stylesheet. No hash, nonce, or `unsafe-inline` exception was added.

The release also rotates the offline cache, makes navigations network-first with an offline fallback, prevents conditional `304` responses from creating empty precache entries, and preserves keyboard focus when a tool choice rerenders the workbench. These changes ensure returning offline users can move off the failed candidate safely.

## Failure reproduction

Before the repair, the factory verifier was run against the live candidate:

```text
GET https://math-tooling-notebook.sociobot.in -> 200
errors: ["Applying inline style violates the following Content Security Policy directive 'style-src 'self''…"]
exit: 1
```

The deployed JavaScript contained `<i style="width:${percent}%">`, matching the browser report. The live response already had the intended strict policy, so the root cause was application markup rather than deployment configuration.

## Regression coverage

- The Vite production preview imports and serves the CSP directly from `public/staticwebapp.config.json`, so browser tests exercise the deployment policy.
- The focused CSP check asserts `style-src 'self'`, rejects `unsafe-inline`, finds zero rendered `[style]` attributes, exercises the progress value, and fails on CSP console messages.
- Browser coverage also checks keyboard focus continuity, service-worker activation/update and non-empty cached assets, a true offline reload, local-only storage/no third-party requests, Axe serious/critical findings, desktop/mobile flows, legal pages, and 390 px overflow.

## Verification evidence

Run from a clean checkout with Node.js 20+:

```sh
npm ci
npm test
npm run build
```

Results on 2026-08-28:

- `npm ci`: 59 packages installed; 0 vulnerabilities.
- `npm test`: 8/8 Vitest unit tests and 18/18 Playwright tests passed across desktop Chromium and the 390×844 mobile profile.
- Focused CSP regression: 2/2 desktop/mobile checks passed.
- `npm run build` (the original production build command): passed; `dist/index.html` is at the deployment root.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Built-markup scan: zero inline `style` attributes.
- Production payload: 33.77 KB raw / 12.66 KB gzip JavaScript; 21.15 KB raw / 5.49 KB gzip CSS; 0 KB fonts. This is below the 200 KB JS and 50 KB CSS budgets.
- Factory local `verify-url.sh`: HTTP 200, zero console errors, title and `lang` present, one `<h1>`, `<main>` present, 0 missing image alts, and 0 unlabeled buttons.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 50 ms, CLS 0, Speed Index 0.9 s.
- Desktop and mobile screenshots were visually reviewed; the native progress treatment remains consistent with the midnight railway system and does not overflow.

## Deployment and live identity

- Repair commit deployed: `97b2ceb` (`fix: remove CSP-blocked progress style`).
- Deployment command: `/opt/fleet/lib/deploy-static.sh math-tooling-notebook dist`.
- Azure Static Web Apps deployment ID: `37dd2b12-7082-4e91-85fb-18f5e4c3db7d`.
- Azure host: `gentle-moss-0ea1beb0f.7.azurestaticapps.net`; custom domain status: `Ready`.
- Live asset identity: `assets/index-BFUjQFE5.js` and `assets/index-TJCa1_RA.css`.
- Live CSP: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.
- Post-deploy factory verifier: HTTP 200 in 870 ms, `errors: []`, title `Math Tooling Notebook — practise the tools around mathematics`, `lang="en"`, one `<h1>`, `<main>` present, 0 missing image alts, and 0 unlabeled buttons.

## Known boundaries

- The plotter remains a sampled, real-valued inspection aid rather than a computer algebra system.
- Progress remains device/browser-local and does not sync. Clearing site data removes it; scratchpad export is the portable option.
- Offline use starts after one successful online visit so the versioned shell can be cached.

No repair-specific gaps remain.
