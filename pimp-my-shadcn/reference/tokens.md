# Phase 2 — Tokens

The primitives are bound to the shadcn variables, so the palette lands in one file: the css file `components.json` names (`globals.css`, `index.css`). Nothing else changes in this phase.

## Convert

One format throughout. shadcn ships OKLCH, so convert the sampled hex:

```
node <skill base directory>/scripts/oklch.mjs "#1D1D1D" "#0271E6" ...
```

Greys come out as `oklch(L 0 0)`; keep them exact greys. Pipe the whole `shadcnMapping` through it and paste the table into the ledger so the review can re-derive any value.

## Map

Write the `:root` block from the light column and the `.dark` block from the dark column, one comment line at the top of each naming the reference. Rules that hold for every reference:

- `--primary` follows the reference's primary button, not its brand hue (the grilling decided this; do not relitigate).
- `--accent` is the active nav pill and hover fill; `--muted` the one-step-back surface (sidebar, card headers, table headers); `--secondary` the secondary button fill.
- `--border` and `--input` are the hairline; `--ring` is the focus colour, usually the reference's interactive hue; `--chart-1` the same hue.
- `--radius` is the reference's button radius in rem (8px → `0.5rem`), and the whole ramp is pinned in `@theme inline` (`--radius-sm/md/lg/xl`) to the DESIGN.md steps: a preset's multipliers off a single `--radius` leave the small step unusable.
- `--sidebar-*` mirror the sidebar surface, its border, its active item and its brand avatar.
- New tones (success, warning, info, a canvas, a wash) are declared in `:root` and `.dark` as plain variables and exposed in the existing `@theme inline` block as `--color-<name>: var(--<name>)`. `inline` is load-bearing: without it the `.dark` override never reaches the utility.

## Check the surfaces

After the write, open the app in both modes and look at every secondary surface: a `bg-secondary` button, a `bg-muted` header, a `bg-accent` hover. A reference whose secondary button is white with a hairline leaves `bg-secondary` invisible on a white page, because shadcn's secondary button has no border. Step the variable one tone back (paper-tint in light, paper-raised in dark), comment why in the css, and hand the hairline to Phase 3. Never fix it by editing a component here.

## Done

- Both modes render with the new palette (screenshot the login or the home page in each, keep them in `.scratch/design-check/tokens/`).
- Lint, format and typecheck pass.
- `git diff --stat` shows the css file, `DESIGN.md` and the ledger. No component file.
- Ledger entry: the variable-by-variable table, the deviations from `shadcnMapping` with their reasons, the slots that carry placeholder neutrals.
