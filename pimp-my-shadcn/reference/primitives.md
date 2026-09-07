# Phase 3 — Primitives

## Install

Everything the iso page and the scope need that is not installed yet, through the `/shadcn` skill, from the directory holding `components.json`:

```
<runner> shadcn@latest add <a> <b> <c> --dry-run     # read the file list: new versus overwritten
<runner> shadcn@latest add <a> <b> <c> -y -o
```

No preset flag: the style comes from `components.json`. Transitive overwrites (button, input, dialog pulled in by sidebar or command) are checked with `shadcn diff <name>` before accepting; run the install **before** restyling so the registry cannot clobber your edits. For a complex component the registry lacks, `shadcn search` and the third-party registries (`"registries": {"@reui": "https://reui.io/r/{name}.json"}` in `components.json`, then `add @reui/<name>`), never a hand-written primitive. Registry files import `cn` from the `cn` package and may open with `"use client"`; the shadcn vite and rhea templates ship that package, so the imports stand. Only a project whose `cn` lives elsewhere (`@acme/ui/lib/utils`) rewrites them, with a targeted `sed` on the new files, then the project's formatter. Radix-versus-base matters: read `base` from `shadcn info` and use `render` (base) or `asChild` (radix) accordingly.

## Restyle

Inside the components directory only. Two moves:

- **Base class string** for what every instance of a primitive shares: radius, height, border, focus ring, weight, no shadow, `transition-colors` instead of `transition-all`, no `active:translate-y-px` when the reference has no motion. Replace the whole string and leave a one-line comment naming the DESIGN.md rule it encodes.
- **CVA variant** for what the reference names as a distinct thing: `CardHeader variant="tinted"`, `Badge` `success | warning | info` as `bg-<tone>-wash text-<tone>`, `Badge count` (the orange pill after a nav label), `Badge chip` (raised fill, 6px), `TabsList` `line | pill`. When the reference's default disagrees with shadcn's default (underline tabs versus pill tabs), swap the default and keep the old look as a named variant; note the rename in the ledger since consumers change silently.

Variant substance sorts what survives: button `icon-round` = `icon-lg` minus `rounded-lg`, one call site → a `className` on the consumer; item size `sm` whose string equals `default` → fold into the base; tabs `line` nobody renders → delete; badge `new` (alert wash plus text, three call sites, a role the reference names) → keep, one concern and all.

The usual list, in the order the iso page needs them: button (sizes, secondary with hairline, ghost muted, destructive fill, 2px ring with offset), badge, card and card header, input, select, textarea, switch, tabs, tooltip, separator, item (side padding drops to 0 inside a padded card: `in-data-[slot=card-content]:px-0`), field rows (a `FieldLabel` wrapping a `Field` is the clickable row: radius, hairline, tint when checked), sheet, dialog, popover, dropdown menu, command, kbd, sidebar menu button (active pill on `bg-accent`, weight unchanged), the data grid (header height and tint, row height, soft dividers), and the compositions the reference has and shadcn does not (an app frame on a canvas, a hero band). Compositions are new files beside the primitives, built from tokens only.

**Imagery does not flip.** A primitive or composition carrying a photo or a product screenshot keeps its surface literal (`bg-white text-neutral-900`) and takes only tokens that read the same in both modes: the picture is part of the picture, not the chrome. A `.dark` value that inverts a chip or a label (a plum chip that goes white) is caught by reading the showcase in both modes before Phase 4, not by the iso page.

Edit with a guard so a silent no-op is impossible: an `Edit` whose old string is the full class string, or a script with `assert old in source`. A variant added in the middle of a CVA map carries its trailing comma; run the seam tests right after the batch, since the guard proves the replacement landed, not that the file still parses.

## Seam tests

One small test file per restyled primitive that exports its CVA: assert the class strings, not the DOM.

```ts
expect(buttonVariants({ variant: "secondary" })).toContain("border-border");
expect(badgeVariants({ variant: "success" })).toContain("bg-success-wash");
expect(buttonVariants()).not.toMatch(/shadow/);
```

Write them before the edit; they go red, the edit turns them green. Compositions get one render test on their data-slot and classes.

Exporting the variants from a ui file is expected, and `eslint-plugin-react-refresh` errors on every non-component export from a component file. Those errors, with the ones the registry ships (`setState` in `use-mobile`'s effect), are recorded in the ledger and left alone: a green lint is not a criterion of this phase.

## The showcase

`/dev/primitives` on the project's routing convention: one section per primitive showing every variant and size, the compositions with real-looking copy, a dialog trigger, a data grid with five rows, all wrapped in the app frame when there is one. Gate it the way the project gates devtools, so a production build drops it:

```tsx
component: import.meta.env.DEV ? PrimitivesPage : () => null
```

A project that ships to production and scans its bundle for devtools strings gets one string only the showcase emits; on a single-route template the showcase *is* the app, so there is nothing to gate and no bundle check to write. A template with no router renders the showcase from `?page=primitives` on its single route and reads `?theme=` for the mode; a template `ThemeProvider` that stores the choice in `localStorage.theme` gets the param written to storage at module load, before it mounts.

## Screenshots

Dev server on a port nobody else uses (in a worktree, never the main checkout's port: pass `--port <n> --strictPort`). Capture at 1440 wide, light then dark, top and bottom, plus the dialog open. With the theme in the URL, headless Chrome does it without a browser tool:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --disable-gpu --force-device-scale-factor=1 --window-size=1440,2300 --virtual-time-budget=4000 --screenshot=<dir>/light.png "http://localhost:<port>/?page=primitives&theme=light"
```

`agent-browser` (open, eval, screenshot) covers the dialog and hover states. Hide devtools overlays first. Keep PNGs under `.scratch/design-check/primitives/`, read each one and fix what it shows in one batch, recapture once; JPEGs of the final pass go to `docs/design/screenshots/`.

The ledger gets the images. On GitHub the API cannot attach files: commit the JPEGs and link them raw (`https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>`) in a two-column light/dark table on the issue comment.

## Done

- Every existing screen renders in both modes; typecheck and the full test suite are green; the light and dark screenshots are read and nothing in them contradicts DESIGN.md.
- Ledger entry: installed (with the one-line reason for any new dependency), restyled (per primitive, the reference values applied), new compositions, the default swaps, what keeps its registry look until a page uses it, and the screenshot table.
