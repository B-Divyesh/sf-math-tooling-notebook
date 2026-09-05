# Learn which math tool to use — review 1

**Verdict: FAIL**

**Work order:** `math-tooling-notebook-review-1`  
**Reviewed on:** 2026-09-05  
**Live URL:** <https://math-tooling-notebook.sociobot.in/>  
**Implementation candidate:** `c1db683e994c3aadc33a10289164afcca165e732`  
**Documentation commit:** `45316b83750d3da96616de5b39bfdf736e1ee341`

## The job, audience, and first action

- **Job:** help an adult returning to mathematics choose when to estimate, make a table, draw a graph, or check algebra before formal study.
- **Audience:** adults rebuilding practical mathematics fluency.
- **First action seen before scrolling:** “Begin at station 01.” It opens an empty real notebook, not a sample. The required “Try it with sample data” action is absent.

I opened fresh desktop (1440 × 900) and phone (390 × 844) browser contexts before scrolling. Both loaded the same live candidate with no console or page errors. The live root HTML SHA-256 is `128da8545a032eba8d8d18d13eb9db9dc8ca4e07bca1451c73f9c4f8f7d04890`, matching this candidate’s fresh `dist/index.html`; live `sw.js` also matches the fresh build. The only commit after the implementation candidate is the previous documentation-only verification report, so no newer product image is required.

## Findings

| Severity | Finding | Evidence and required repair |
| --- | --- | --- |
| High | The required one-click sample sandbox does not exist. | There is no “Try it with sample data” action, no persistent “Demo — sample data, nothing is saved” label, no Reset demo/Start for real controls, no isolated `demo:` storage namespace, and no `.factory/demo.md`. Opening `/demo` returns HTTP 200 through the normal SPA fallback with the ordinary root title and empty storage; it is not a demo. Add a realistic seeded demo, persistent banner, reset/exit controls, isolated storage, direct `/demo` entry, and documentation. |
| High | Station 02 gives a mathematically false answer in a core drill. | The question asks for the first whole-number `x > 0` for which `2^x > 3x`. The first is `x = 4` because `16 > 12`. Live: selecting “x = 4” says “That does not agree yet”; selecting “x = 5” says “Correct—the check agrees” and persists completion. Its table only has `x` and `y` for `2^x`, and its explanation says `x = 5`. Change the answer to `x = 4`, show both quantities, correct the explanation, and add a mathematical regression test. |
| High | The required claims registry is missing, leaving 10 public operational-claim groups untested under the claims contract. | `.factory/claims.json` does not exist, so there are no declared claim commands to run and no `@claim:<id>` tests. The following public claims are unlisted: 20 drills; function plotter with an accessible table; estimation/table/graph/algebra practice; six-question five-of-six transfer target; local scratchpad autosave; text export; local progress/reset; offline use after first visit; no account/analytics/CDN/third-party scripts; and the promise that data stays on the device. Existing general tests do not meet the required one tagged observable test per claim. Add the registry and tags, or remove claims that cannot be proved from the demo. |
| Medium | The landing copy does not state the job in plain words and does not supply the required first-screen facts. | The live `<h1>` is “Find your route through the maths.” It is a metaphor rather than the user’s job. “Night service,” “route map,” “Final interchange,” and “Route ready” repeat that metaphor. The first screen has one local-storage statement, but not three short privacy/offline/price facts, and it does not say what happens after the first action. `.factory/copy-audit.md` is absent. Rewrite the first screen and headings in plain words and add the required copy audit. |
| Medium | Privacy and Terms do not meet the mobile target or shared-page structure requirements. | At 390px, Privacy has 17px wordmark, 28.05px return link, 20px inline `sociobot.in` link, and 16px Terms footer link. Terms has 17px wordmark, 28.05px return link, 20px inline privacy link, and 16px Privacy footer link. The legal pages also lack the required skip link and shared navigation/footer structure. Give every legal-page link a 44 × 44px target, retain visible focus, and use the same header/skip/footer skeleton as the notebook. |
| Medium | Required route and metadata structure is incomplete. | A deliberate request to `/not-a-real-page` returns the notebook shell with HTTP 200 and no designed 404 page; `public/404.html` and the `responseOverrides` configuration are absent. `/demo` also has the root title instead of “Demo — Math Tooling Notebook.” The root lacks canonical, Open Graph, Twitter-card, and apple-touch metadata; Privacy and Terms also lack descriptions and canonical/social metadata. Add a designed 404 with a way home, route-specific titles and metadata, canonical/OG/Twitter tags, and the required apple touch icon. |
| Low | The mutable service-worker script is cached as immutable for one year. | Live `/sw.js` returns `Cache-Control: public, max-age=31536000, immutable` because the `/*.js` route applies immutable caching to it. Fresh registration, update, and offline reload work now, but a non-hashed worker must revalidate so future releases can update reliably. Add a `/sw.js` cache override such as `no-cache` or short revalidation. |

There are no critical findings. There are 7 findings total: 3 high, 3 medium, and 1 low.

## Earlier finding disposition

| Earlier evidence | Current disposition | Evidence |
| --- | --- | --- |
| `verification.md`: main notebook header/footer links were below 44px at 390px. | Resolved on the notebook page. | The current main-page test passes in both Playwright projects; live main header/footer anchors are not in the sub-44px target list and have at least 8px spacing. |
| `verification-2.md`: station 02 used `x = 5` instead of `x = 4`. | Still open. | Reproduced live in a fresh desktop context exactly as described above. |
| `verification-2.md`: Privacy and Terms targets below 44px. | Still open and broader than previously listed. | Re-measured all visible legal-page links at 390px; the header, return, inline, and footer links remain below 44px. |
| `verification-2.md`: non-hashed `/sw.js` received immutable caching. | Still open. | Live response header remains `public, max-age=31536000, immutable`. |

## Checks and evidence

| Check | Result |
| --- | --- |
| Clean checkout setup | PASS — started clean at `45316b8`; `npm ci` installed 59 packages with 0 reported vulnerabilities. |
| Declared claim commands | FAIL — no `.factory/claims.json` exists, so none can be run; this is the high-severity claims finding above. |
| `npm test` | PASS — 8/8 Vitest and 20/20 Playwright checks; `test-results/.last-run.json` reports `passed`. |
| `npm run build` | PASS — TypeScript no-emit check and Vite build completed; `dist/index.html` exists. |
| Live URL verifier | PASS — root, Privacy, and Terms each returned 200 with title, `lang`, one `<h1>`, `<main>`, image alt coverage, labelled buttons, and no console errors. |
| Live Axe smoke check | PASS — no serious or critical violations on root, Privacy, or Terms at 390px. This does not excuse the manual touch-target finding. |
| Keyboard, focus, motion, reflow | PASS on the main page — first Tab reaches the skip link with a 3px visible brass outline; Enter moves to `#main`; Space operates the Estimate tool; reduced motion changes the poster animation to 0.01ms; no horizontal overflow at 390px, 320px, or 640px. |
| Normal, invalid, boundary, and recovery paths | PASS except station 02 correctness — invalid plot `2x` gives a specific error; equal axis bounds say “Each minimum must be smaller than its maximum”; corrected `sin(x)` restores a nine-row table. Scratchpad text persisted after reload; confirmed Reset local notebook removed its local-storage key. |
| Privacy and network request smoke check | PASS for observed live requests — fresh desktop and phone sessions requested only `https://math-tooling-notebook.sociobot.in`; no console errors appeared. The product has no cookies in its automated privacy test. The privacy promise remains formally untested because the claims registry is absent. |
| PWA and offline | PASS functionally — a fresh live context was service-worker controlled with cache `math-tooling-notebook-v2`; after `registration.update()`, offline reload kept the notebook and showed the offline notice. Cache policy remains a low-severity defect. |
| Internal links and routes | Root, Privacy, Terms, `/demo`, robots, and sitemap return 200. The unknown-path check is a finding because it returns the ordinary shell rather than a designed 404. External GitHub and sociobot links were not opened because they are outside this product’s permitted scope. |
| Performance | Fresh build payloads are 33,765-byte JS (12.66 KB gzip), 21,364-byte CSS (5.51 KB gzip), no fonts, and a 15,010-byte mobile hero. Lighthouse mobile JSON recorded Performance 96, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.0s, LCP 1.2s, TBT 230ms, CLS 0). The Lighthouse CLI wrote the JSON then exited with a browser-tab shutdown error, so this measurement is informational rather than a clean command pass. |

## What must change before acceptance

1. Build and document the isolated sample demo, then verify it from a fresh context.
2. Correct station 02 and add a direct semantic regression test.
3. Add `.factory/claims.json` and one tagged demo-based test for each remaining public claim.
4. Replace metaphor copy with the plain job, audience, action result, and three first-screen facts; add `.factory/copy-audit.md`.
5. Repair legal-page targets and shared structure, then retest at 390px.
6. Add the required 404, route metadata, and service-worker cache override.

The product cannot be accepted until there are zero findings and zero untested claims.
