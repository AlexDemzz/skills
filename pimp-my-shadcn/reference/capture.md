# Phase 1 — Capture the reference

Impeccable's `document` writes DESIGN.md from a project's own code and `extract` consolidates a project's own patterns. Neither fetches a URL. The scraping is yours; the **format** is impeccable's, so read `~/.claude/skills/impeccable/reference/document.md` once for the frontmatter schema, the eight sections and the sidecar schema, then write both files by hand.

## Get the renders

Save everything under `.scratch/design-ref/<slug>/`, numbered, and keep it out of git unless the project already tracks `.scratch`.

**A case study of images** (Framer or Webflow portfolio pages, Dribbble, Behance): fetch the HTML with `curl -sL`, grep the image URLs, download each at full resolution (Framer CDN: strip the `?width=` and append `?scale-down-to=2048`; other CDNs: drop the resize params). Strip the tags to read the copy. Read every image with the Read tool; the light and dark screens are usually separate images.

**A live site**: drive it with `agent-browser` (Playwright under a CLI, no extension needed):

```
agent-browser open <url>
agent-browser set viewport 1440 900
agent-browser eval "[...document.querySelectorAll('button,a')].filter(e=>/refuser|reject|decline|nécessaires/i.test(e.textContent)).map(e=>e.textContent.trim())"
agent-browser click "text=Refuser tous les cookies"      # decline first; pick the non-essential-off option
agent-browser screenshot --full /abs/path/<dir>/01-home-light.png
agent-browser set media dark && agent-browser screenshot --full /abs/path/<dir>/01-home-dark.png
```

The screenshot path is resolved against the CLI's own cwd, not yours: always pass it absolute.

Pull the computed truth the DOM gives for free with `agent-browser eval "<js>"`: read `:root` custom properties from every stylesheet rule (a site built on tokens hands you its palette by name), then collect, for `body`, headings, paragraphs, links, buttons, inputs, cards and nav items, the computed `color`, `background-color`, `border-color`, `border-radius`, `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `box-shadow`, `padding`, `height`. Save the JSON beside the renders. A site with no dark scheme is captured in light only; say so in the sidecar.

**Fallback when no browser tool answers**: headless Chrome takes the render alone (no DOM readout): `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --disable-gpu --force-device-scale-factor=1 --window-size=1440,4000 --virtual-time-budget=4000 --screenshot=<file>.png <url>`.

**Images the user pasted**: copy them into the folder and treat them as a case study.

## Sample exact pixels

Colours are never eyeballed. With ImageMagick (`magick`), on each render:

- Point samples for fills: `magick "$f" -format "%[hex:p{$x,$y}]" info:` on labelled points (`page-bg`, `sidebar-bg`, `card-bg`, `card-border`, `nav-active`, `btn-primary-fill`, `btn-primary-text`, `badge-green-wash`, `toggle-on`, `focus-halo`…). If the image was displayed to you scaled, multiply your coordinates by the ratio the Read tool reported.
- Dominant colour of a crop for fills and hairlines: `magick "$f" -crop ${w}x${h}+${x}+${y} +repage -format %c histogram:info:- | sort -rn | head -3`.
- Text colour: crop a word and take the darkest (light mode) or lightest (dark mode) entries of a 12-line histogram, which separates anti-aliased ink from its background.
- Shadows: sample a vertical run of pixels under a card edge; a flat design shows the background colour immediately.

The brand's famous hex is not automatically the primary: it is often a pressed state or a band behind a section. Take the live computed style of the actual primary button (`agent-browser get styles "<selector>"`) and let that decide. Slack's primary button is `#611F69`; the `#4A154B` everyone quotes is its pressed state and its dark band. Record the choice as an assumption in the ledger.

Run one `LIGHT` block and one `DARK` block. Sizes (font sizes, row heights, paddings, radii) are measured from the renders with the crop tool and are **estimates**: say so in the sidecar's `extensions.source.note`.

## Write DESIGN.md

The frontmatter is normative: `colors` with descriptive slugs (`ink`, `paper`, `paper-tint`, `hairline`, `signal-blue`, `go-green`…) and a `-dark` suffixed twin for every neutral that flips; `typography` roles with family, size, weight, line-height, tracking; `rounded` and `spacing` scales as the reference actually uses them; `components` for button variants, input, card, card-header, nav-item and nav-item-active, badges, chip, tooltip, each referencing `{colors.x}` and `{rounded.y}`.

The body follows the eight canonical sections. What earns its place there is what a later phase will need to decide a class: which surface each tonal step is used for, the named rules (signal-only colour, two weights, no shadows, wash pairing), the sizes of buttons, rows, headers, the sidebar width, the frame inset, the focus treatment, and the Do's and Don'ts.

## Write the sidecar

`.impeccable/design.json` (schemaVersion 2) carries `extensions.source` (where the renders came from, which screens, what is sampled versus estimated), `colorMeta` with tonal ramps, `typographyMeta`, layout metrics (row heights, sidebar width, frame inset), five to ten components as self-contained HTML + CSS, the narrative copied from the body, and the block the next phase runs on:

```json
"shadcnMapping": {
  "note": "Light / dark pairs for <css file path>.",
  "--background": ["#FFFFFF", "#171616"],
  "--foreground": ["#1D1D1D", "#E8E9E9"],
  "--card": [...], "--popover": [...],
  "--primary": [...], "--primary-foreground": [...],
  "--secondary": [...], "--secondary-foreground": [...],
  "--muted": [...], "--muted-foreground": [...],
  "--accent": [...], "--accent-foreground": [...],
  "--destructive": [...], "--border": [...], "--input": [...], "--ring": [...],
  "--chart-1": [...], "--chart-2": [...],
  "--sidebar": [...], "--sidebar-foreground": [...], "--sidebar-primary": [...],
  "--sidebar-accent": [...], "--sidebar-accent-foreground": [...], "--sidebar-border": [...], "--sidebar-ring": [...],
  "--radius": "0.5rem",
  "--color-success": [...], "--color-success-wash": [...],
  "--color-warning": [...], "--color-warning-wash": [...],
  "--color-info": [...], "--color-info-wash": [...]
}
```

Every shadcn variable the project's css file declares gets a pair; the grilling's accent decision fixes `--primary` and where the brand hue goes. Slots with no reference evidence (`--chart-3..5`) take the reference's neutrals and say so.

## Validate

```
node ~/.claude/skills/impeccable/scripts/context.mjs | grep -Ei "design|stale|warn|error"
node -e "import('$HOME/.claude/skills/impeccable/scripts/lib/design-parser.mjs').then(m => { const r = m.parseDesignMd(require('fs').readFileSync('DESIGN.md','utf8')); console.log(Object.keys(r.frontmatter.colors).length, 'colors', Object.keys(r)) })"
```

`parseDesignMd` returns `frontmatter`, `colors`, `typography`, `layout`, `components`, `dosDonts`; a frontmatter it cannot read shows up as a missing key, so the count of colours is the check. Commit `DESIGN.md` and the sidecar; if the repo formats Markdown, exempt `DESIGN.md` (reflowing merges its hand-wrapped lines).
