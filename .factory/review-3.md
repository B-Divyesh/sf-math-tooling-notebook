# Choose the right maths tool — review 3

**Verdict:** **PASS**  
**Finding count:** **0**  
**Untested claim count:** **0**  
**Work order:** `math-tooling-notebook-review-3`  
**Reviewed on:** 2026-09-05  
**Live URL:** <https://math-tooling-notebook.sociobot.in>

## Candidate and documentation

- Implementation reviewed: `e46de7eb48ad295357549cedb83ba4ce44b529a7`
- Documentation and test base reviewed: `318206ade49865fce446bf3fe4a3a3d78e1f48d0`

The commits after the implementation candidate change only factory documents and the rendered-copy regression in `tests/app.spec.ts`. They do not change a production input. A fresh build's HTML, JavaScript, CSS, service worker, legal pages, and designed 404 byte-match HTTPS, so the live runtime is the implementation candidate above.

## Job, audience, and first action

- **Job:** choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**. It opens five completed drills and a filled scratchpad.

Fresh 1440 × 900 desktop and 390 × 844 phone contexts showed the job, audience, first action, action result, and three free/local/offline facts at `scrollY: 0`. All were inside the initial viewport. Neither context had a console error, page error, or horizontal overflow.

## Findings

None. There are zero critical, high, medium, or low findings.

## Sample and product paths

The first-screen action opened `/demo#practice` in both fresh profiles. It showed `5 / 20 complete`, the repeated-growth note, and the persistent label **Demo — sample data. Nothing is saved to your notebook.**

- A pre-seeded regular note and progress record stayed byte-for-byte unchanged through sample work and Reset demo.
- Reset demo restored drills 01–05 and the original populated note. Start for real deleted only `demo:math-tooling-notebook:v1` and restored the regular notebook.
- Station 02 showed `x = 4`, `16`, and `12`. Wrong-tool, empty-answer, and wrong-answer states gave specific feedback; `x = 4` then completed the drill with the correct explanation.
- Empty and invalid expressions, non-real values, and reversed bounds gave usable messages. A narrow `sin(x)` range recovered to a named graph and nine-row table.
- An empty quiz requested all six answers. Five correct produced `5/6`; retry cleared the choices; six correct produced `6/6`.
- Scratchpad save survived reload. Export produced the exact note in `math-tooling-notes.txt`. Clear handled cancellation and confirmation.
- Damaged regular storage displayed a specific recovery notice and left a usable empty notebook.
- The full live flow made requests only to the product origin, set no cookies, and left only the intended regular storage key after leaving Demo.

## Declared claims

The registry contains 11 entries and the browser suite contains exactly 11 unique matching tags. After `npm ci` in a fresh clone, every declared command ran separately and passed in desktop Chromium and the 390px phone project.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `twenty-drills` | PASS |
| `four-tool-practice` | PASS |
| `function-plotter-table` | PASS |
| `transfer-quiz` | PASS |
| `scratchpad-autosave` | PASS |
| `text-export` | PASS |
| `local-progress-reset` | PASS |
| `offline-reload` | PASS |
| `no-account-or-third-party-runtime` | PASS |
| `data-stays-on-device` | PASS |

The live landing page, Demo, Privacy, Terms, and README were cross-checked against the registry. No missing, false, incomplete, or untested public claim remains. The rendered-copy regression also passed with the current 98-entry copy audit.

## Earlier findings

| Earlier finding | Current disposition | Fresh evidence |
| --- | --- | --- |
| Main-page links were below 44 × 44px | Resolved | At 390px, 38 visible root-page links and buttons had minimum width and height of 44px. The broader interactive-target check found no undersized target. |
| Station 02 taught `x = 5` | Resolved | The live table showed both quantities at `x = 4`; the drill accepted that first crossing and explained `2⁴ = 16` and `3x = 12`. |
| Legal-page links were below 44 × 44px | Resolved | Every visible link and button on Privacy, Terms, and the designed 404 measured at least 44 × 44px at 390px. |
| `/sw.js` was cached as immutable | Resolved | Live `/sw.js` returned `Cache-Control: no-cache`; update left only cache `math-tooling-notebook-v3`, containing Root and Demo. |
| The isolated one-click sample was absent | Resolved | Fresh desktop and phone samples were populated, persistently labelled, resettable, disposable, and isolated from regular data. |
| Public claims lacked declared tests | Resolved | All 11 claims have one unique tagged observable test, and every command passed independently in both projects. |
| The first screen used metaphors instead of the job | Resolved | The job, audience, action result, and three plain facts appeared before scrolling on desktop and phone. |
| Route metadata and the designed 404 were incomplete | Resolved | Root, Demo, Privacy, Terms, and an unknown route had distinct titles, one h1, one main landmark, canonical metadata, and no missing alt text. The unknown route returned the designed HTTP 404 with a way home. |
| The copy audit was stale and incomplete | Resolved | The current audit matched the rendered landing page, and its regression passed in both browser projects. |

## Accessibility, privacy, routes, and offline use

- Fresh Axe runs found zero serious or critical violations on Root, Demo, Privacy, Terms, and the designed 404.
- The first Tab focused the skip link with a visible 3px brass outline. Enter reached `#main`; Space operated the tool control and retained focus.
- No route overflowed at 390px or 320px. All inspected phone targets met 44 × 44px.
- With reduced motion requested, the media query matched and the poster duration fell to `0.01ms`.
- Root, Demo, Privacy, Terms, robots, sitemap, and the service worker returned 200. All in-scope links returned 200. The deliberate unknown address correctly returned a rendered HTTP 404; its expected browser resource log is not a defect.
- Privacy removal is local: Reset local notebook deletes the product key, and browser site-data controls can remove the cache. There is no account or product database. The external privacy contact was identified but not opened because it is outside this product's authorised scope.
- A controlled live Demo reloaded offline with its sample label and offline notice. A live update retained only the current versioned cache.
- HTTPS supplied HSTS, CSP, `nosniff`, strict-origin referrer policy, and camera, microphone, and geolocation restrictions.

The product is static. Backend tenant isolation, rate limiting, restart persistence, CLI installation, library consumption, and desktop packaging checks do not apply. The brief does not benefit from an AI feature; local deterministic practice is the appropriate implementation.

## Clean-checkout and performance evidence

| Check | Result |
| --- | --- |
| Clean setup | PASS — Node 22.23.2; `npm ci` installed 59 packages and reported 0 vulnerabilities. |
| `npm test` | PASS — 9 unit tests and 48 browser executions. |
| `npm run build` | PASS — type checking and Vite build produced `dist/index.html`. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| Live URL verifier | PASS — Root, Demo, Privacy, and Terms had the required structure and zero console or page errors. |
| Live Lighthouse | PASS — Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 0.97s, LCP 1.10s, TBT 155ms, CLS 0, and no run warnings. |
| Interaction timing | PASS — maximum observed event duration was 40ms in the live phone exercise. |

The fresh build contains 36,271 bytes of JavaScript (13.34 KB gzip), 22,476 bytes of CSS (5.72 KB gzip), no font payload, and a 15,010-byte mobile hero. The 1200 × 630 social image and 180 × 180 touch icon have the required dimensions.

Fresh local and live SHA-256 values match:

- HTML: `b1cf4bbd413cabab5d1667ac7f160b8f3d71d5b8b45158c07882aba8370f3a25`
- JavaScript: `ecc536d739c0037bc18c4360608541c1f3d126ee65986c6f42ae31c08283231b`
- CSS: `cac14676856319b410fe6348aad76bf3287e9eac3fae94973e4900f99573b28e`

The service worker, Privacy, Terms, and designed 404 also matched byte-for-byte.

## Evidence

- `/work/.evidence/review3-live-browser.json`
- `/work/.evidence/review3-desktop-first-screen.png`
- `/work/.evidence/review3-phone-first-screen.png`
- `/work/.evidence/review3-lighthouse.json`
- `/work/.evidence/review3-url-root/`, `review3-url-demo/`, `review3-url-privacy/`, and `review3-url-terms/`

## Final decision

**PASS.** There are zero findings at every severity and zero untested claims.
