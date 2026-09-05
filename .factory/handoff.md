# Math Tooling Notebook — review handoff

## Verdict — FAIL

Review work order `math-tooling-notebook-review-1` reviewed live candidate `c1db683e994c3aadc33a10289164afcca165e732` on 2026-09-05. Documentation is at `45316b83750d3da96616de5b39bfdf736e1ee341`; the only newer commit before this review was report-only. Live root HTML and `sw.js` byte-match a fresh build of the implementation candidate.

The product has **7 findings** (3 high, 3 medium, 1 low) and **10 untested public-claim groups**, so it is not ready to accept. The high blockers are:

- no one-click, isolated sample-data demo or demo documentation;
- station 02 rejects the correct crossing `x = 4` and teaches `x = 5` instead;
- no `.factory/claims.json` or tagged claim tests.

The earlier legal mobile target issue and immutable service-worker cache remain. The main notebook’s old header/footer target issue is repaired, but every Privacy/Terms link still has a sub-44px target. The landing copy is not plain-language-first, and required 404, route metadata, and legal-page shared structure are incomplete.

Read [review-1.md](review-1.md) for exact evidence, check results, finding severity, prior-finding disposition, and acceptance steps.

## How this review was verified

- `npm ci`: PASS — 59 packages, 0 reported vulnerabilities.
- `npm test`: PASS — 8/8 Vitest and 20/20 Playwright tests.
- `npm run build`: PASS — TypeScript check and Vite build write `dist/`.
- Fresh live desktop and 390px phone browser contexts: no console/page errors; main page keyboard skip/focus, reduced motion, 320px/390px reflow, plotter invalid/boundary recovery, local persistence/reset, PWA update, and true offline reload passed.
- Live Axe smoke checks on root, Privacy, and Terms: zero serious/critical findings. The manual legal touch-target failure remains.
- Factory URL verifier passed on root, Privacy, and Terms. A Lighthouse mobile JSON recorded 96/100/100/100, but its CLI wrapper exited with a browser shutdown error after writing the report; treat that measurement as informational.

No product code was changed by this reviewer. Only the required review/handoff reports were updated.
