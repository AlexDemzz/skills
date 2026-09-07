---
name: pimp-my-shadcn
description: Copy a design from a website or screenshots onto a shadcn + Tailwind v4 project — DESIGN.md from sampled pixels, tokens, restyled primitives, then an iso page that proves the copy.
argument-hint: <url | image paths | "reference already in DESIGN.md"> [page to rebuild iso]
disable-model-invocation: true
---

Take a design that exists somewhere else — a live website, a case study made of screenshots, a folder of images — and make this project's shadcn primitives wear it, **iso**: same colours, radii, type, spacing, states, in light and dark. The consumer app never restyles; it only lays out. The proof is a page rebuilt from the primitives alone that a stranger cannot tell from the reference.

Four phases, each with its own reference file and its own completion criterion. Work them in order; each one is a commit. On a project with an issue tracker, they are the four tickets of a wayfinder map (see [Tracker](#tracker)); otherwise the ledger is a Markdown file.

## Setup

1. Check for an existing `DESIGN.md` at the project root. An existing one is shown to the user before anything replaces it.
2. Run `npx shadcn@latest info --json` (or the project's package runner) from the directory holding `components.json`. In a monorepo that is the ui package, not the root. Note `base` (base, radix or aria), `style`, the css file path, and the installed components. A blank directory is scaffolded first with the named style closest to the reference, following [reference/init.md](reference/init.md), then info is re-run.
3. Read `DESIGN.md`, the css file with the shadcn variables, and every installed primitive under the components directory before deciding anything. The primitives are already bound to the shadcn variables; that binding is what makes the whole method work.

## Grill before charting

Six decisions shape every later edit. Ask them with a recommended answer each, in one round, and record the answers in the ledger. When the user is not reachable, take the recommended answer and write it down as an assumption.

1. **Fidelity.** Iso copy (recommended) or adaptation? Iso means the reference wins every disagreement with taste.
2. **Where the brand accent lands.** Look at the reference's primary button before answering: if it is ink or white, the accent is *not* `--primary`. A lime brand on an ink-button reference goes to `--sidebar-primary` (avatar only) and `--primary` stays ink. Zero new colour variables unless the reference has a hue shadcn has no slot for (status tones).
3. **Scope.** Which screens of the reference the system must cover. Default: all of them.
4. **The override rule.** Every look lives in the primitives; the consumer writes layout classes only (`flex`, `gap`, `grid`, `max-w`, `p-`). A consumer override is allowed only when a phase records it in the ledger with the reason. That list feeds the ADR.
5. **The iso page.** Which reference screen the final proof rebuilds. Pick the one that exercises the most primitives (a settings or integration page beats a hero).
6. **Where the proofs live.** A `/dev/primitives` showcase and a `/dev/<page>` mock-up on the project's routing convention, gated the way the project gates devtools so a production build drops them. A template with no router uses `?page=` and `?theme=` on its single route; with no production build there is nothing to gate.

## Phase 1 — Capture the reference into DESIGN.md

Read [reference/capture.md](reference/capture.md). Scrape the reference yourself (live DOM, or the images of a case study), sample exact pixels, then write `DESIGN.md` with its `shadcnMapping` block. Both modes are captured when the reference has both.

Done when `scripts/check-design.mjs` passes on `DESIGN.md` and the css file, sizes that are estimates are labelled so under `source`, and the reference renders are saved under `.scratch/design-ref/<slug>/` for the later phases.

## Phase 2 — Tokens

Read [reference/tokens.md](reference/tokens.md). Map `shadcnMapping` onto `:root` and `.dark` in the css file, one colour format throughout (OKLCH via `scripts/oklch.mjs`), new tones added inside `@theme inline`, `--radius` from the reference's button radius.

Done when the existing app renders in both modes with the new palette, lint and typecheck pass, and **no component file changed**. Any surface that vanished (white on white) is fixed by stepping the variable one tone back, with the reason written beside it in the css and in the ledger; the border it needs is Phase 3's job.

## Phase 3 — Primitives

Read [reference/primitives.md](reference/primitives.md). Install what the iso page and the scope need through the `/shadcn` skill (registry first, third-party registries second, hand-written never). Restyle inside the primitives only: base class strings for what every instance shares, CVA variants for what the reference names (a tinted card header, a status badge, a chip, a count pill). Seam tests assert on the variant class strings. Build the `/dev/primitives` showcase, screenshot every primitive in light and dark, attach the screenshots to the ledger.

Done when every existing screen still renders, typecheck and the seam tests are green, the light and dark screenshots are on the ledger, and the [variant substance](#variant-not-override) table covers every variant added or rewritten.

## Phase 4 — The iso page

Read [reference/iso-page.md](reference/iso-page.md). **Before writing it**, list the primitives and variants the page will use and get the list confirmed by the user. Build the page from primitives and layout Tailwind. Compare with the reference side by side; every deviation is either fixed in a primitive or recorded as a consumer override. Extend the [variant substance](#variant-not-override) table with whatever the page added, then answer the question the phase asks: *are the tokens and primitives enough?*

Done when the page sits beside the reference in light and dark and the ledger holds the two lists: primitives that had to change, overrides the consumer needed.

## Variant, not override

The question the user will ask about any element: *is this a variant or an override?* The answer has to be *variant* and you have to prove it by pointing at the primitive. Symptoms of an override sneaking in: a colour, radius, border or font class in the consumer, a `dark:` modifier in the consumer, an `Item` carrying side padding inside a padded `Card`, a toggle row that is not a `FieldLabel` wrapping a `Field` so the whole row is clickable.

**Variant substance.** A variant encodes a role the reference reuses: a distinct meaning (brand CTA, nav link, hero band, "New" flag) that appears at least twice, or that changes at least two CSS concerns (colour, radius, height, padding, typography, border, shadow). Anything else is a consumer class in disguise:

- one utility, one call site, no role (a button size whose only difference is `rounded-full`) → a `className` on the consumer, recorded in the ledger's override list;
- a variant every call uses, or one whose string equals the default → fold into the base string and delete the variant;
- an unused variant → delete.

Table every added or rewritten variant into the ledger before the phase is done — examples in [reference/primitives.md](reference/primitives.md):

```
| variant | adds vs default | concerns | sites | KEEP / DEMOTE / FOLD |
```

## Tables

Data tables use a TanStack-bound grid from a registry (ReUI Data Grid is the precedent), restyled to the reference's table, not the shadcn `table` primitive. A key/value block of three rows is a `Card` with a grid, not a data grid.

## Tracker

On a repo with `docs/agents/issue-tracker.md`, chart the four phases as a wayfinder map with `/mattpocock-skills:wayfinder`: one `research` ticket (which primitives exist for this project's shadcn base, install commands, tone-token method), then `task` tickets Tokens and Primitives, then a `prototype` ticket for the iso page, blocked in that order. Each phase's resolution is a comment on its ticket and one line in the map's Decisions-so-far. Without a tracker, the ledger is `docs/design/<slug>-copy.md`: a header naming the reference, the renders folder and the visual authority; a **Grilling** section with the six answers; then one section per phase holding what was done, the facts later phases depend on, and what was left. Committed screenshots go under `docs/design/screenshots/`.
