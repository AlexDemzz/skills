# Scaffolding a blank project

Only for a directory with no `components.json`. An existing project keeps its base, style and template: read them from `shadcn info --json` and move on.

## The command

```
<runner> shadcn@latest init --template <template> --name <dir> --base <base> --preset <style> --no-monorepo -y
```

- `<runner>`: the package runner the project (or the user) uses: `npx`, `pnpm dlx`, `bunx --bun`.
- `<template>`: `next`, `vite`, `start`, `react-router`, `astro`, `laravel`. A throwaway copy uses `vite` (tested); a real project uses its framework.
- `<base>`: `base` (recommended by the CLI), `radix`, or `aria`. Presets do not encode the base, so the flag is always passed.
- `<style>`: one of the named styles below. Named styles only: the CLI rejects `base-nova`-style names, and the `/shadcn` skill forbids building `ui.shadcn.com/init?…` URLs by hand. A preset code from the builder (`--preset a2r6bw`) is accepted when the user hands one over.

Then re-run `shadcn info --json`.

## Picking the style

Look at the reference before scaffolding: the primary button's radius, the density of a form or a table, and the heading typeface decide the style. Pick the closest row; the ledger records the choice and the two cues that drove it.

| style | character | pick it when the reference… |
| --- | --- | --- |
| `vega` | the classic shadcn look | is a generic SaaS UI with medium radius and default spacing |
| `nova` | reduced padding and margins | is compact but keeps shadcn's geometry |
| `maia` | soft, rounded, generous spacing | has large radii and airy layouts (consumer, marketing-led product) |
| `lyra` | boxy and sharp, mono-friendly | has square corners, hairline borders, monospace or technical type |
| `mira` | compact, made for dense interfaces | is a data-heavy admin or dashboard |
| `luma` | rounded geometry, soft elevation, breathable (macOS-like) | has pill-ish controls, soft shadows, open spacing |
| `rhea` | Luma's shape, tighter spacing and smaller controls | has Luma's softness in a focused product UI (settings, integrations) |
| `sera` | editorial: serif headings, uppercase tracking, underline controls, square corners | is print-like, typography-first |

Only the style survives the later phases: colours, radius ramp and fonts are overwritten by Phase 2 from the captured `shadcnMapping`. The style's icon library and body font (`nova` Geist, `maia` Figtree, `lyra` JetBrains Mono, `sera` Noto Sans + Playfair) are a starting point, and the reference's font wins in Phase 2.
