# Choose the right maths tool — review 2

**Verdict: FAIL**  
**Finding count:** **1** (low)  
**Untested claim count:** **0**  
**Work order:** `math-tooling-notebook-review-2`  
**Reviewed on:** 2026-09-05  
**Live URL:** <https://math-tooling-notebook.sociobot.in>  
**Implementation candidate:** `e46de7eb48ad295357549cedb83ba4ce44b529a7`  
**Documentation reviewed:** `6d374df32fddaf7c64bf5ef17c295100ab93e41e`

The three commits after the implementation candidate change only `.factory/handoff.md` and `.factory/verification-3.md`. A fresh production build at the documentation commit byte-matches the live root HTML and JavaScript, so the live implementation is the candidate above.

## Job, audience, and first action

- **Job:** choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**. It opens five completed drills and a filled scratchpad.

I opened the live root in fresh 1440 × 900 desktop and 390 × 844 phone contexts before scrolling. Both showed `Choose the right maths tool`, the audience sentence, the sample action and its result, and the three free, local-data, and offline facts at `scrollY: 0`. Both had no console or page error and no horizontal overflow.

## Finding

| Severity | Finding | Evidence and required repair |
| --- | --- | --- |
| Low | The required landing-page copy audit is stale and incomplete. | `.factory/copy-audit.md` records “Pick the simplest useful view.” The shipped source and live page say “Pick the lightest useful view.” The audit also omits visible landing-page sentences, including “Choose the simplest tool that answers this job directly.” and the footer sentence “Practice choosing maths tools before formal study.” The plain-words contract requires every landing-page sentence with its word count. Regenerate the audit from the shipped copy, include every sentence, and rerun the banned-word and 22-word checks. The live copy itself had no banned terms or lines over 22 words in this review. |

There are no critical, high, or medium findings. This documentation defect does not break the product paths, but the work order permits PASS only with zero findings.

## Demo and product paths

The sample action opened `/demo#practice` with the route title `Demo — Math Tooling Notebook`, `5 / 20 complete`, the repeated-growth sample note, and the persistent label `Demo — sample data. Nothing is saved to your notebook.`

- Reset demo restored drills 01–05 and the original note.
- A pre-seeded regular note and progress record remained byte-for-byte unchanged during demo use.
- Start for real deleted only `demo:math-tooling-notebook:v1` and restored the pre-seeded regular notebook.
- Station 02 showed the row `4, 16, 12`, accepted `x = 4`, and explained `2⁴ = 16 while 3x = 12`.
- The plotter gave clear errors for `2x`, non-real `sqrt(-1)`, equal bounds, and reversed bounds. `sin(x)` recovered to a named canvas and nine-row table.
- An empty transfer quiz requested all six choices. The declared answer set produced `5/6` and `READY TO PRACTISE`.
- Scratchpad autosave survived reload. Export downloaded `math-tooling-notes.txt` with the exact entered text.
- Clear notes preserved text after cancel and removed it after confirmation. Malformed local storage produced a specific recovery notice without a browser error.

## Earlier finding disposition

| Earlier finding | Current disposition | Fresh evidence |
| --- | --- | --- |
| Main header/footer targets below 44px | Resolved | Every inspected visible interactive target on root, Demo, Privacy, Terms, and 404 was at least 44 × 44 CSS px at 390px. |
| Station 02 taught `x = 5` | Resolved | The live drill accepted `x = 4`, showed both compared values, and explained the first crossing correctly. |
| No isolated one-click sample | Resolved | The live sample was populated, persistently labelled, resettable, and isolated from the pre-seeded regular key. |
| Public claims lacked a registry and tagged checks | Resolved | Eleven unique registry entries each have exactly one matching tag; every declared command passed independently. |
| Landing copy used route metaphors instead of the job | Resolved in the product | Desktop and phone showed the job, audience, action result, and three facts before scrolling. The separate audit-document defect is the finding above. |
| Legal pages lacked the shared structure and 44px targets | Resolved | Privacy and Terms had skip links, shared header/footer navigation, one h1, main landmarks, route titles, and compliant targets. |
| Route metadata and designed 404 were missing | Resolved | Root, Demo, Privacy, Terms, and unknown-route titles were correct. A deliberate unknown URL returned the designed page with HTTP 404 and a way home. |
| The mutable service worker was cached as immutable | Resolved | Live `/sw.js` returned `Cache-Control: no-cache`; update and offline reload succeeded with cache `math-tooling-notebook-v3`. |

## Declared claims

All eleven commands in `.factory/claims.json` were run separately from the clean checkout. Each passed in Chromium and the 390px mobile project.

| Claim ID | Result |
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

No unlisted or untested operational claim remained after cross-checking the live page, Privacy, Terms, and README.

## Verification evidence

| Check | Result |
| --- | --- |
| Clean setup | PASS — Node 22.23.2; `npm ci` installed 59 packages and reported 0 vulnerabilities. |
| `npm test` | PASS — 9 Vitest tests and all 46 Playwright executions across desktop and mobile. |
| `npm run build` | PASS — type check and Vite build produced `dist/index.html`; initial JavaScript is 36,271 bytes (13.34 KB gzip), CSS is 22,476 bytes (5.72 KB gzip), fonts are 0 bytes, and the selected mobile hero is 15,010 bytes. |
| Live identity | PASS — local and live HTML SHA-256 are `b1cf4bbd413cabab5d1667ac7f160b8f3d71d5b8b45158c07882aba8370f3a25`; local and live JavaScript SHA-256 are `ecc536d739c0037bc18c4360608541c1f3d126ee65986c6f42ae31c08283231b`. |
| Worker URL verifier | PASS — root, Demo, Privacy, and Terms each returned 200 with a title, `lang`, one h1, a main landmark, complete image alt coverage, labelled buttons, and no browser errors. |
| Accessibility | PASS — live root, Demo, Privacy, Terms, and designed 404 had zero serious or critical Axe findings. Heading order was valid. The first Tab reached the skip link with a visible 3px brass outline; Enter moved to `#main`; Space operated the selected tool without losing focus. |
| Responsive and motion | PASS — no overflow at 390px or the 320px reflow equivalent; every inspected target met 44px; reduced motion changed the poster animation to 0.01ms. |
| Privacy | PASS — the full live sample, drill, plotter, quiz, export, reload, and exit flow made requests only to the product origin. There were no cookies or session-storage entries. |
| Offline and update | PASS — a fresh service-worker-controlled Demo context updated, retained only cache `math-tooling-notebook-v3`, and reloaded offline with the sample label and offline notice. |
| Routes and links | PASS for in-scope URLs — `/`, `/demo`, `/privacy/`, `/terms/`, robots, sitemap, and service worker returned 200. The deliberate unknown route returned the expected designed HTTP 404. The external `sociobot.in` contact link was identified but not opened because it is outside this product's authorised scope. |
| Security headers | PASS — HTTPS returned HSTS, CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation restrictions. |
| Lighthouse | Informational result: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.2s, TBT 170ms, CLS 0. Lighthouse wrote a complete JSON artifact with no run warnings, then its container browser tab crashed and the wrapper exited non-zero. Independent browser and payload checks above passed. |
| Backend, CLI, library, desktop artifact | Not applicable — this is a static web product with no backend or installed consumer artifact. |

Review evidence is stored in `/work/.evidence/review-2-live-browser.json`, the two first-screen PNGs, the URL-verifier folders, and `/work/.evidence/review-2-lighthouse.json`.

## Final decision

**FAIL.** The product implementation and all eleven public claims passed, with zero untested claims. One low-severity documentation finding remains in the mandatory copy audit, so this review cannot declare PASS.
