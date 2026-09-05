# Demo sandbox

## Entry point

Open `/demo` or click **Try it with sample data** on the first screen. The landing action opens `/demo#practice`, so the first view is a populated notebook rather than an empty form.

## Shipped sample

The demo starts with drills 01–05 complete and a scratchpad note that checks the repeated-growth comparison at `x = 4`:

- `2^4 = 16`
- `3 × 4 = 12`

It then opens drill 06. The function plotter starts with `sin(x) + 0.25*x`, and the transfer quiz is ready to answer.

## Isolation and reset

Demo data uses only `localStorage` key `demo:math-tooling-notebook:v1`. The regular notebook uses `math-tooling-notebook:v1`; demo code never reads or writes that key.

The persistent banner says **Demo — sample data. Nothing is saved to your notebook.**

- **Reset demo** restores the shipped five-drill sample and its note.
- **Start for real** deletes the demo key and returns to `/`. It keeps any regular notebook data untouched.

The claim tests in `tests/app.spec.ts` enter this URL from a fresh browser context. The demo-isolation test pre-seeds regular storage and proves it is unchanged after the sample flow.
