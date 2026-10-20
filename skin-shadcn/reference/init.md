# Scaffolding a blank project

Only for a directory with no `components.json`. An existing project keeps its base, style and template.

The shadcn skill runs `init`; this file only picks the `--preset` style.

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
