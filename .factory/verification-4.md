# Choose the right maths tool — verification 4

**Verdict:** **PASS**  
**Finding count:** **0**  
**Untested claim count:** **0**  
**Work order:** `math-tooling-notebook-verify-4`  
**Verified on:** 2026-09-05  
**Live URL:** <https://math-tooling-notebook.sociobot.in>

## Candidate and documentation

- Implementation reviewed: `e46de7eb48ad295357549cedb83ba4ce44b529a7`
- Copy-audit repair: `d2b79c88cd2f90c80189f1afeb6b754bb8348d08`
- Documentation reviewed: `ecfdf20fffa9905940df65505555f19317a0a5ab`

The commits after the implementation change only the copy audit, its rendered-browser regression, and reports. Production inputs are unchanged. A fresh build's HTML, JavaScript, CSS, service worker, legal pages, 404 page, and three WebP assets byte-match HTTPS. The live product is the implementation candidate above; no new product image is required.

## Job, audience, and first action

- **Job:** choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**. It opens five completed drills and a filled scratchpad.

Fresh 1440 × 900 desktop and 390 × 844 phone contexts showed the job, audience, action, action result, and three free/local/offline facts at `scrollY: 0`. All were inside the first viewport. Neither context had a console error, page error, or horizontal overflow.

## Findings

None. There are zero critical, high, medium, or low findings.

## Sample and main paths

Both fresh browser profiles clicked the first-screen action. Each opened `/demo#practice` with `5 / 20 complete`, the repeated-growth note, and the sticky label `Demo — sample data. Nothing is saved to your notebook.`

- Changing and resetting the sample restored drills 01–05 and the original note.
- A pre-seeded regular note and progress record stayed byte-for-byte unchanged.
- **Start for real** deleted only `demo:math-tooling-notebook:v1` and restored the regular notebook.
- Station 02 showed `x = 4`, `16`, and `12`; it accepted `x = 4` and explained the first crossing correctly.
- Wrong-tool, empty-answer, and wrong-answer states gave specific feedback and recovered to a correct completion.
- Empty and unsupported functions, non-real values, equal bounds, and reversed bounds gave usable errors. A narrow `sin(x)` range recovered to a named graph and nine-row table.
- An empty quiz requested all six choices. The tested answers produced `5/6`; retry cleared the form; six correct answers produced `6/6`.
- Scratchpad save survived reload. Export produced the exact note in `math-tooling-notes.txt`. Clear and reset both handled cancellation and confirmation correctly.
- Damaged local storage showed a specific recovery notice and left a usable empty notebook.

## Declared claims

The registry has 11 entries and 11 unique matching tags. Every declared command ran separately after `npm ci`; every command passed once in desktop Chromium and once at 390px mobile.

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

The live landing page, Demo, Privacy, Terms, and README were cross-checked against the registry. No missing, false, incomplete, or untested public claim remains. The repaired copy audit has 98 rendered copy entries; its browser guard proves completeness, word counts, the 22-word limit, and the banned-word check.

## Earlier findings

| Earlier finding | Current disposition | Fresh evidence |
| --- | --- | --- |
| Main-page links were below 44 × 44px | Resolved | The live phone audit checked every visible link, button, text field, text area, and labelled radio target; none was below 44 × 44px. |
| Station 02 taught `x = 5` | Resolved | The live table and answer path use the first correct crossing, `x = 4`, with both values shown. |
| Legal-page links were below 44 × 44px | Resolved | Every visible Privacy, Terms, and 404 target passed at 390px. |
| `/sw.js` was cached as immutable | Resolved | Live `/sw.js` returns `Cache-Control: no-cache`; update and offline reload passed. |
| The isolated one-click sample was absent | Resolved | Fresh desktop and phone samples were populated, labelled, resettable, disposable, and isolated from regular state. |
| Public claims lacked declared tests | Resolved | All 11 claims have one unique tagged outcome test, and all 11 commands passed independently. |
| The first screen used metaphors instead of the job | Resolved | The job, audience, action result, and three plain facts appear before scrolling on desktop and phone. |
| Route metadata and the designed 404 were incomplete | Resolved | Root, Demo, Privacy, Terms, and unknown routes have distinct titles and complete metadata; the unknown route returns the designed HTTP 404 with a home link. |
| The copy audit was stale and incomplete | Resolved | Live assets contain the repaired copy, and the rendered browser regression passed in both projects. |

## Quality checks

| Check | Result |
| --- | --- |
| Clean setup | PASS — Node 22.23.2; `npm ci` installed 59 packages with 0 vulnerabilities. |
| `npm test` | PASS — 9 Vitest tests and 48 Playwright executions. |
| `npm run build` | PASS — type check and Vite build produced `dist/index.html`. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| Live URL verifier | PASS — Root, Demo, Privacy, and Terms returned 200 with titles, `lang=en`, one h1, a main landmark, alt text, labelled buttons, and no browser errors. |
| Live Axe | PASS — zero serious or critical violations on Root, Demo, Privacy, Terms, and the designed 404. |
| Keyboard and focus | PASS — skip link, Enter, Space, native radio arrows, and traversal worked. Focus used a visible 3px brass outline. |
| Mobile and reflow | PASS — no overflow at 390px or the 320px reflow check; all inspected touch targets met 44px. |
| Reduced motion | PASS — the media query matched and poster motion dropped to `0.01ms`. |
| Offline and update | PASS — only cache `math-tooling-notebook-v3` remained; Root and Demo were cached; a controlled Demo reloaded offline with its label and notice. |
| Privacy | PASS — the full live flow requested only the product origin, set no cookie or session storage, and wrote only the selected local notebook namespace. |
| Routes and links | PASS — Root, Demo, Privacy, Terms, robots, sitemap, and service worker returned 200. The deliberate unknown path correctly returned the designed HTTP 404. The privacy contact link is explicitly marked as external. |
| Security | PASS — HTTPS supplied HSTS, CSP, `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation restrictions. |

The product is static. Backend tenant isolation, rate limits, restart persistence, CLI installation, and library consumer checks do not apply.

## Performance and deployment identity

The fresh build contains 36,271 bytes of JavaScript (13.34 KB gzip), 22,476 bytes of CSS (5.72 KB gzip), no font payload, and a 15,010-byte mobile hero. These are below the product budgets.

Live mobile Lighthouse scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.99s, LCP 1.12s, total blocking time 112ms, and CLS 0. A live phone interaction run observed a maximum event duration of 40ms. The Lighthouse run completed with no warnings.

Fresh local and live SHA-256 values match:

- HTML: `b1cf4bbd413cabab5d1667ac7f160b8f3d71d5b8b45158c07882aba8370f3a25`
- JavaScript: `ecc536d739c0037bc18c4360608541c1f3d126ee65986c6f42ae31c08283231b`
- CSS: `cac14676856319b410fe6348aad76bf3287e9eac3fae94973e4900f99573b28e`

## Evidence

- `/work/.evidence/verify4-live-browser.json`
- `/work/.evidence/verify4-desktop-first-screen.png`
- `/work/.evidence/verify4-phone-first-screen.png`
- `/work/.evidence/verify4-interaction.json`
- `/work/.evidence/verify4-lighthouse.json`
- `/work/.evidence/verify4-url-root/`, `verify4-url-demo/`, `verify4-url-privacy/`, and `verify4-url-terms/`

## Final decision

**PASS.** There are zero findings at every severity and zero untested claims.
