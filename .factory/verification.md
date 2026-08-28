# Independent verification — FAIL

**Work order:** `math-tooling-notebook-verify-1`  
**Candidate tested:** `de7cf6c059b2023b83646ef9a55edf1fa1d47d7c` (`main`)  
**Live URL:** <https://math-tooling-notebook.sociobot.in/>  
**Date:** 2026-08-28

## Decision

**FAIL.** The candidate is deployed and its core product works, but it misses the factory's explicit 44 × 44 CSS-pixel touch-target requirement. On the actual 390px deployment the primary navigation links are only 19px high and the legal links are 22px high. This is a release-blocking acceptance-gate failure; it is not masked by the otherwise clean automated accessibility scans.

## Defects

### Medium — mobile links are below the required 44px touch target

At `390 × 844` on the live deployment, measured `getBoundingClientRect()` dimensions were:

| Interactive target | Measured size |
| --- | --- |
| Header “Drills” | 33 × 19px |
| Header “Transfer quiz” | 81 × 19px |
| Footer “Privacy” | 54 × 22px |
| Footer “Terms” | 44 × 22px |
| Footer “Source” | 51 × 22px |

The attached design/accessibility contract and repository `AGENTS.md` require touch/click targets of at least 44 × 44px. These links are usable with a mouse but impose unnecessarily precise taps for the mobile audience. Quiz answer labels were separately measured at 156 × 46px, so this is confined to navigation/legal links.

**Suggested remedy:** give the header and footer anchors a 44px minimum block size with horizontal/vertical padding while preserving their visual spacing, then rerun the 390px measurement and keyboard pass.

No critical or high defects were found.

## Clean-checkout quality gates

The worktree began at the requested candidate with no changes. `npm ci` installed 59 packages and reported 0 vulnerabilities.

| Check | Result |
| --- | --- |
| `npm run test:unit` | PASS — 8/8 Vitest tests |
| `npm run build` | PASS — TypeScript no-emit check and Vite production build |
| Exact `npm test` | PASS — 8/8 Vitest and 18/18 Playwright checks; `test-results/.last-run.json` reports `status: passed` |
| Explicit desktop browser project | PASS — 9/9 Chromium checks |
| Explicit 390px mobile browser project | PASS — 9/9 checks |
| Lint/type scripts | No separate lint script exists; `build` runs `tsc --noEmit` |

Production output was created in `dist/`. Initial application payloads are 33,765 bytes JS (12.66 KB gzip), 21,146 bytes CSS (5.49 KB gzip), 0 font bytes, and a 15,010-byte mobile hero image: all within the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB mobile-image budgets.

## Product and recovery exercises

Independent Chromium checks exercised the delivered application, not just source inspection:

- Completed graph drill 03 using the correct route and answer; completion persisted locally.
- Submitted a wrong answer first, received the corrective feedback, then selected the correct answer and completed the drill.
- Confirmed the graph drill exposes both its labelled canvas alternative and a values table.
- Used `sqrt(-1)` in the plotter: the real-valued sample table consistently reports `undefined` rather than throwing. Entered an invalid equal axis range and received “Each minimum must be smaller than its maximum.” Corrected it to `sin(x)` and the error cleared.
- Submitted the transfer quiz empty and received the announced six-choice recovery message. Completed all six correct choices (6/6), retried, and confirmed the form reset.
- Saved a scratchpad note, reloaded, and confirmed it persisted only in `localStorage`; exported it as `math-tooling-notes.txt`.
- The repository browser suite also passed normal drill completion, invalid expression recovery, local persistence, desktop and 390px overflow, legal routes, CSP, keyboard navigation, service-worker update, and offline reload.

## Accessibility, privacy, and browser policy

- Axe via `@axe-core/playwright`: zero serious or critical violations in both project profiles.
- Lighthouse 13.4.1 against the live mobile page: Performance **93**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.1s, LCP 1.2s, CLS 0, interactive 1.6s.
- Keyboard smoke test passed: the first Tab focuses “Skip to notebook”; its visible focus outline is `rgb(231, 184, 76) solid 3px`. The repository keyboard test found no trap and verified Space operation of the tool chooser.
- Under `prefers-reduced-motion: reduce`, the live 390px page matched the media preference, had no horizontal overflow (390/390), and the hero animation duration was effectively disabled (`1e-05s`).
- Live and local browser sessions produced zero page errors and zero console errors. No outbound third-party requests, cookies, analytics, CDN fonts, or scripts were observed. The only application storage key after use was `math-tooling-notebook:v1`.
- The live response is HTTPS and supplies HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions policy, and CSP: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`.

## Deployment identity, caching, and PWA

- `dist/index.html` SHA-256 equals the live HTML SHA-256: `e156e89772a49a975bd3117f8a1e0f1eb1ca57836639bad47fd750063ad821eb`.
- Live `index-BFUjQFE5.js` and `index-TJCa1_RA.css` bytes exactly match this candidate's `dist/` assets (SHA-256 `ac4cc50f…fe9dc628` and `bc327aeb…051e038`, respectively).
- Root HTML is short cached (`public, must-revalidate, max-age=30`); hashed JS, CSS, and WebP assets are `public, max-age=31536000, immutable`.
- The live 390px session registered and controlled the versioned service worker. The browser suite passed update cleanup, non-empty shell asset cache, and a true offline reload with the offline notice visible.

## Retest exit criteria

Increase all header/footer link hit areas to at least 44 × 44px at 390px (and retain 8px target separation), then rerun `npm test`, `npm run build`, the mobile touch-target measurement, and the live identity check.
