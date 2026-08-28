# Math Tooling Notebook — visual system

## Direction: the midnight mathematics railway

The product borrows the confidence and compression of a 1930s art-deco transit poster. Tool choice is presented as route-finding: **Estimate**, **Table**, **Graph**, and **Algebra** are four lines that meet at practice stations. This fits an adult returner because it makes mathematical work feel navigable rather than remedial. Ornament only reinforces direction, sequence, and tool identity.

This is an intentionally single-mode, dark “night service” treatment. A pale paper work surface inside each drill creates legible depth without introducing an unrelated second theme.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Night | `#0b2230` | Page background, poster field |
| Ink | `#07171f` | Deep controls and shadows |
| Paper | `#f4ecd8` | Notebook/task surfaces |
| Paper ink | `#17252b` | Text on paper |
| Station cream | `#fff8e7` | Main text on night |
| Brass | `#e7b84c` | Primary action/focus/Estimate line |
| Coral | `#f06f51` | Graph line and active route |
| Aqua | `#5fc2b4` | Table line/success |
| Lilac | `#a89ad7` | Algebra line |
| Muted night | `#b7c7c8` | Secondary text on night |
| Muted paper | `#526268` | Secondary text on paper |
| Danger | `#b83d3d` | Error state with icon/text |

All body pairings meet WCAG AA. State is always repeated with an icon, label, shape, or pattern—never color alone.

## Typography

- Display: `Georgia`, `Times New Roman`, serif in uppercase with restrained tracking. The sharp, engraved forms evoke transit-poster titling without downloading a font.
- Working text: `Avenir Next`, `Segoe UI`, system sans-serif. It is contemporary and highly legible for instructions and controls.
- Scale: 16px body, 18px lead, 20–24px section titles, clamp(40–72px) hero. Line height is 1.55; prose is capped near 68 characters. Numeric readouts use tabular figures.

No runtime font request is made. The system stacks keep the complete font payload at 0 KB.

## Spacing and composition

The base unit is 4px, with primary steps at 8, 12, 16, 24, 32, 48, 64, and 96px. Chamfered corners, double-keyline borders, radial station marks, and offset hard shadows establish depth. Cards are reserved for independent drills and quiz questions; connected learning sequences use a continuous route map.

Desktop uses a two-column workbench: stable drill context at left and active notebook at right. At 760px it becomes a single route; no essential control is dropped. Touch targets are at least 44px.

## Interaction grammar

- Gold is the “continue” signal. Coral identifies the current station.
- Selecting a tool resembles switching a transit route: the active tool gains a solid lower keyline and station marker.
- Reveals expand from their trigger within 180ms. Results arrive in place, announced through a polite live region.
- Completion stamps the station and advances only when the learner chooses; there are no coercive streaks.
- The scratchpad is forgiving: plain text, automatically saved locally, exportable, and clearable only after confirmation.

## Motion

One initial 360ms poster reveal and 180–220ms state transitions use only opacity and transform. No animation loops. Under `prefers-reduced-motion: reduce`, scrolling is instant and all transforms/transitions are removed; hierarchy remains through border weight, scale, and contrast.

## Asset plan and provenance

- Hero illustration: one original AI-generated portrait-format art-deco poster showing an abstract geometric railway of graph curves, plotted points, ruler marks, and a notebook desk. It sets the product’s mental model and contains no instructional claims.
- Functional icons, route marks, graph axes, and progress symbols are authored in HTML/CSS/canvas; no icon library.
- Social share preview is composed from the same generated poster crop.

### Prompt sheet

Subject: an abstract mathematical transit interchange, four colored rail lines turning into graph curves, plotted points, a small open notebook and brass drafting tools; no humans. World: 1930s metropolitan transit poster translated into a calm mathematical workbench. Materials: screen-printed paper, flat ink, fine paper grain, crisp geometric keylines. Light: warm brass highlights against deep midnight teal. Lens/composition: portrait poster, strong lower-left to upper-right route, generous negative space, readable at small size. Palette words: midnight teal, parchment cream, railway coral, oxidized aqua, muted lilac, brass gold. Negative list: **no text, no letters, no numbers, no watermark, no logos, no brands, no photorealism, no gradients, no neon, no people, no floating UI, no illegible pseudo-writing**.

Generated with the factory image deployment (`factory-image`, Azure OpenAI image generation) on 2026-08-28. The resulting image is original to this product and shipped as WebP/AVIF plus its source PNG and prompt sidecar in `assets/src/`.
