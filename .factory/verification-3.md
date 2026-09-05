# Math Tooling Notebook verification 3 — PASS

**Work order:** `math-tooling-notebook-verify-3`  
**Date:** 2026-09-05  
**Verdict:** **PASS**  
**Finding count:** **0**  
**Untested claim count:** **0**  
**Live URL:** <https://math-tooling-notebook.sociobot.in>

## Candidate and documentation

- Implementation reviewed: `e46de7eb48ad295357549cedb83ba4ce44b529a7`
- Documentation verification: `2c3e8f9091935d7bf8d9788b8a48087213d9376c`
- Documentation attestation base: `349a268cf5e507e9305885f7eba9158cfab9ff85`

The fresh local `dist/index.html` and its referenced JavaScript exactly match the live root HTML and JavaScript. The live implementation is therefore the reviewed implementation candidate; the later commits named above are report-only.

## Job, audience, and first action

- **Job:** choose whether to estimate, make a table, draw a graph, or check algebra.
- **Audience:** adults returning to mathematics before a formal course.
- **First action:** **Try it with sample data**; it opens five completed drills and a filled scratchpad.

Fresh desktop (1440 × 900) and phone (390 × 844) contexts both showed the plain `Choose the right maths tool` heading, audience sentence, primary sample action, and free/local/offline facts at `scrollY: 0`. There were no console or page errors.

## Demo sandbox and product paths

In both fresh contexts the primary action opened `/demo#practice` with `5 / 20 complete`, a realistic repeated-growth note, and the persistent label `Demo — sample data. Nothing is saved to your notebook.` Reset restored the shipped five-drill note and progress. Start for real deleted only `demo:math-tooling-notebook:v1` and returned to the pre-seeded regular note unchanged. During the live demo flows, all observed requests stayed on the product origin and no errors occurred.

Live exercises passed:

- Station 02's table showed `x = 4`, `16`, and `12`; selecting `x = 4` returned `Correct—the check agrees.` and explained `2⁴ = 16 while 3x = 12`.
- Invalid plot `2x`, non-real `sqrt(-1)`, and invalid equal/reversed bounds gave recoverable feedback; `sin(x)` recovered to a nine-row value table.
- The transfer quiz returned its readiness state at the tested target and a fully correct six-answer run returned `6/6`.
- A service-worker-controlled live demo reloaded offline with the offline notice and demo banner. The live cache was `math-tooling-notebook-v3`; `/sw.js` uses `Cache-Control: no-cache`.

## Earlier finding disposition

| Earlier finding | Current disposition | Independent evidence |
| --- | --- | --- |
| Main header/footer targets below 44px | Resolved | Live 390px check found every visible root, legal, and 404 anchor at least 44 × 44px; no horizontal overflow. |
| Station 02 incorrectly taught `x = 5` | Resolved | Live Station 02 accepted `x = 4`, showed both comparison values, and displayed the correct explanation. |
| No isolated sample sandbox | Resolved | `/demo` is populated, persistent, resettable, and uses its own demo storage key without changing regular state. |
| Public claims were not declared/tested | Resolved | 11 claims are listed; each has exactly one matching tagged browser flow and every published command passed. |
| Metaphor-first landing copy | Resolved | The job, audience, action result, and three practical facts appear before scrolling on desktop and phone. |
| Legal-page skeleton and hit targets incomplete | Resolved | Live Privacy and Terms have their shared structure, titles, skip links, keyboard focus, and 44px visible links. |
| Missing route metadata and designed 404 | Resolved | Root, Demo, Privacy, Terms, and a deliberate unknown URL have route-appropriate titles; unknown URL returned the designed page with HTTP 404. |
| Mutable service worker cached immutable | Resolved | Live `/sw.js` returned `Cache-Control: no-cache`; offline reload and update cache checks passed. |

## Clean-checkout verification

`npm ci` completed from the supplied checkout (59 packages, no reported vulnerabilities). No product code was changed during this verification.

| Check | Result |
| --- | --- |
| `npm test` | PASS — 9 Vitest tests and 46 Playwright executions. |
| `npm run build` | PASS — type check passed and produced `dist/index.html`. Output: 36.27 KB JS (13.34 KB gzip), 22.48 KB CSS (5.72 KB gzip). |
| Claim registry integrity | PASS — all 11 IDs occur exactly once as `@claim:<id>` test tags. |
| Every declared claim command | PASS — each command below passed independently in Chromium and 390px mobile. |
| Live URL verifier | PASS — root, Demo, Privacy, and Terms each had a title, `lang`, one h1, main landmark, complete image alt coverage, labelled buttons, and no browser errors. |
| Live Axe | PASS — root, Demo, Privacy, Terms, and designed 404 had zero serious or critical violations at 390px. |
| Live mobile, keyboard, motion | PASS — no 390px overflow, all inspected targets at least 44px, skip link received a visible 3px focus outline, and reduced-motion poster duration was `0.01ms`. |
| Privacy and security | PASS — observed demo requests were same-origin only; live HTTPS sent CSP, HSTS, `nosniff`, strict-origin referrer policy, and permissions policy. |
| Live routes | PASS — `/`, `/demo`, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, and `/sw.js` returned 200; deliberate `/not-a-real-page` returned the designed HTTP 404. |

The fresh Lighthouse artifact recorded Performance 99, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.0 s, LCP 1.1 s, CLS 0). Lighthouse wrote the artifact, then its container browser tab crashed during post-audit screenshot handling and the wrapper exited non-zero; this is recorded accurately as informational rather than a product failure. The functional, accessibility, metadata, payload, and console checks above passed independently.

## Declared claims

All commands were run separately from the clean checkout and each passed with two browser executions (desktop and mobile).

| Claim ID | Command result |
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

## Final decision

**PASS.** There are zero findings at every severity and zero untested public claims.
