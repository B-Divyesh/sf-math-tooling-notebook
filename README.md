# Math Tooling Notebook

Math Tooling Notebook helps adults returning to mathematics choose a maths tool before a formal course. The drills cover estimates, tables, graphs, and algebra checks.

Start with [sample data](https://math-tooling-notebook.sociobot.in/demo). It opens five completed drills and a filled scratchpad without changing your own notebook.

## What it does

- Includes 20 short drills across estimate, table, graph, and algebra checks.
- Draws a function graph and shows its values in an accessible table.
- Includes a six-question transfer quiz with a five-out-of-six target.
- Saves scratchpad notes and progress in this browser.
- Exports scratchpad notes as a `.txt` file.
- Lets you reset stored notebook data.
- Works offline after the first visit.
- Is free to use with no account, payment, analytics, CDN assets, or third-party runtime requests.

This is a practice utility, not an exam-preparation service, formal course, CAS, or safety-critical calculator.

## Run and test

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm test` runs unit tests and Playwright checks at desktop and 390px mobile widths. `npm run build` type-checks the project and writes the static site to `dist/`, with `dist/index.html` at its root.

Every visitor-facing operational claim is listed in [.factory/claims.json](.factory/claims.json). Run an individual claim check from a clean setup with its documented command, for example:

```sh
npm run test:claims -- --grep @claim:offline-reload
```

## Demo and data

`/demo` is the one-click sample. It uses the separate `demo:math-tooling-notebook:v1` browser-storage key. **Reset demo** restores the shipped sample. **Start for real** discards demo data and returns to the regular notebook. See [.factory/demo.md](.factory/demo.md) for the exact sample and reset behaviour.

Regular progress and notes use only the `math-tooling-notebook:v1` browser-storage key. The app makes no runtime requests beyond its own origin. See [Privacy](https://math-tooling-notebook.sociobot.in/privacy/) and [Terms](https://math-tooling-notebook.sociobot.in/terms/).

## Deploy

Deploy the contents of `dist/` to Azure Static Web Apps. The factory owns infrastructure, DNS, and deployment. `public/staticwebapp.config.json` provides navigation fallback, a designed 404 response, security headers, and caching rules. The non-hashed service worker is revalidated with `no-cache`; hashed assets are immutable.

## Product sources

- [Opportunity brief](.factory/brief.json)
- [Visual system and asset provenance](.factory/design.md)
- [Demo sandbox](.factory/demo.md)
- [Claims registry](.factory/claims.json)
- [Build handoff](.factory/handoff.md)

## License

Code is available under the [MIT License](LICENSE). The generated hero artwork is original to this product. Its prompt and provenance are recorded in `assets/src/` and [.factory/design.md](.factory/design.md).
