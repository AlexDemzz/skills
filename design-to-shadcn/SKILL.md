---
name: design-to-shadcn
description: Skin a shadcn + Tailwind v4 project's primitives from a website or screenshots — DESIGN.md from sampled pixels, tokens, skinned primitives, then an iso page that proves the skin.
argument-hint: <url | image paths | "reference already in DESIGN.md"> [page to rebuild iso]
disable-model-invocation: true
---

Take a design that exists somewhere else — a live website, a case study made of screenshots, a folder of images — and make this project's shadcn primitives wear it, **iso**: same colours, radii, type, spacing, states, in light and dark, and the reference wins every disagreement with taste. The consumer app never restyles; it only lays out. The proof is a page rebuilt from the primitives alone that a stranger cannot tell from the reference.

Four phases, each with its own reference file and its own completion criterion. Work them in order; each one is a commit. On a project with an issue tracker, they are the four tickets of a wayfinder map (see [Tracker](#tracker)); otherwise the ledger is a Markdown file.

## Setup

1. Load the `shadcn` skill with the Skill tool, from the directory holding `components.json` (in a monorepo, the ui package). It injects the project context and owns the CLI, the composition rules and the styling rules for every later phase. A directory without `components.json` is scaffolded first, style chosen by [reference/init.md](reference/init.md), then `info --json` is re-run.
2. Check for an existing `DESIGN.md` at the project root. An existing one is shown to the user before anything replaces it; when the argument says the reference is already in it, Phase 1 is `scripts/check-design.mjs` alone.
3. Read `DESIGN.md` when it exists, the css file with the shadcn variables, and every installed primitive under the components directory before deciding anything. The primitives are already bound to the shadcn variables; that binding is what makes the whole method work.
4. Fix the **scope**: the screens the skin must cover. Screens or images in the argument are the scope. A bare site URL is mapped first: dispatch one subagent per top-level navigation section, each returning the distinct screen templates it found with one URL apiece; the union is the scope.
5. Fix the **iso page**: the screen named in the argument, otherwise the screen in scope that exercises the most primitives (a settings or integration page beats a hero).

Write the scope and the iso page into the ledger before Phase 1.

## Phase 1 — Capture the reference into DESIGN.md

Read [reference/capture.md](reference/capture.md). Scrape the reference yourself (live DOM, or the images of a case study), sample exact pixels, then write `DESIGN.md` with its `shadcnMapping` block. Both modes are captured when the reference has both.

Done when `scripts/check-design.mjs` passes on `DESIGN.md` and the css file, sizes that are estimates are labelled so under `source`, and the reference renders are saved under `.scratch/design-ref/<slug>/` for the later phases.

## Phase 2 — Tokens

Read [reference/tokens.md](reference/tokens.md). Map `shadcnMapping` onto `:root` and `.dark` in the css file, one colour format throughout (OKLCH via `scripts/oklch.mjs`), new tones added inside `@theme inline`, `--radius` from the reference's button radius.

Done when both modes render with the new palette (a screenshot of the login or home page in each, under `.scratch/design-check/tokens/`), lint, format and typecheck pass, and `git diff --stat` shows the css file, `DESIGN.md` and the ledger only: **no component file**.

## Phase 3 — Primitives

Read [reference/primitives.md](reference/primitives.md). Install what the iso page and the scope need with the shadcn skill's add workflow; a primitive is never hand-written. Skin inside the primitives only: base class strings for what every instance shares, CVA variants for what the reference names (a tinted card header, a status badge, a chip, a count pill). Seam tests assert on the variant class strings. Build the `/dev/primitives` showcase, screenshot every primitive in light and dark, attach the screenshots to the ledger.

Done when every existing route has a light and a dark screenshot that renders, typecheck and the full test suite are green, the showcase screenshots are read with nothing in them contradicting `DESIGN.md` and are on the ledger, and the [variant substance](#variant-not-override) table covers every variant added or rewritten.

## Phase 4 — The iso page

Read [reference/iso-page.md](reference/iso-page.md). **Before writing it**, list the primitives and variants the page will use and get the list confirmed by the user. Build the page from primitives and layout Tailwind, then compare it region by region with the reference. Extend the [variant substance](#variant-not-override) table with whatever the page added, then answer the question the phase asks: *are the tokens and primitives enough?*

Done when, in light and dark, every region of the bill of materials has no deviation left without a fate (primitive fixed, override recorded, or noted against `DESIGN.md`), the ledger holds the verdict with the two lists (primitives that had to change, overrides the consumer needed), and the primitive fixes reach the main line.

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

## Tracker

On a repo with `docs/agents/issue-tracker.md`, chart the four phases as a wayfinder map with `/mattpocock-skills:wayfinder`: `task` tickets Capture, Tokens and Primitives, then a `prototype` ticket for the iso page, blocked in that order. Each phase's resolution is a comment on its ticket and one line in the map's Decisions-so-far. Without a tracker, the ledger is `docs/design/<slug>-skin.md`: a header naming the reference, the renders folder and the visual authority; a **Scope** section with the screens and the iso page; then one section per phase holding what was done, the facts later phases depend on, and what was left. Committed screenshots go under `docs/design/screenshots/`.
