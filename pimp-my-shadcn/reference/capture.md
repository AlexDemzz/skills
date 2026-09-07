# Phase 1 — Capture the reference

Scrape the reference yourself, sample exact pixels, then write `DESIGN.md`: the one document every later phase reads, and the visual authority once written.

## Get the renders

Save everything under `.scratch/design-ref/<slug>/`, numbered, and keep it out of git unless the project already tracks `.scratch`.

**A case study of images** (Framer or Webflow portfolio pages, Dribbble, Behance): fetch the HTML with `curl -sL`, grep the image URLs, download each at full resolution (Framer CDN: strip the `?width=` and append `?scale-down-to=2048`; other CDNs: drop the resize params). Strip the tags to read the copy. Read every image with the Read tool; the light and dark screens are usually separate images.

**Staging is not design.** A case study mounts each screen for display: a rounded window inset on a grey or coloured desk, a browser bar, a device bezel, a drop shadow, a gradient backdrop. The tell is repetition: the same mount around every screen, screen edges cut the same way. Everything outside the screen's own edge is the portfolio's staging and never enters `DESIGN.md`: no backdrop colour, no window radius, no inset, no mount shadow. Sample and measure inside the screen only, as if it filled a viewport. A product that draws its own frame shows it on the live site; a screenshot cannot prove it.

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

Pull the computed truth the DOM gives for free with `agent-browser eval "<js>"`: read `:root` custom properties from every stylesheet rule (a site built on tokens hands you its palette by name), then collect, for `body`, headings, paragraphs, links, buttons, inputs, cards and nav items, the computed `color`, `background-color`, `border-color`, `border-radius`, `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `box-shadow`, `padding`, `height`. Save the JSON beside the renders. A site with no dark scheme is captured in light only; say so under `source`.

**Fallback when no browser tool answers**: headless Chrome takes the render alone (no DOM readout): `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --disable-gpu --force-device-scale-factor=1 --window-size=1440,4000 --virtual-time-budget=4000 --screenshot=<file>.png <url>`.

**Images the user pasted**: copy them into the folder and treat them as a case study.

## Sample exact pixels

Colours are never eyeballed. With ImageMagick (`magick`), on each render:

- Point samples for fills: `magick "$f" -format "%[hex:p{$x,$y}]" info:` on labelled points (`page-bg`, `sidebar-bg`, `card-bg`, `card-border`, `nav-active`, `btn-primary-fill`, `btn-primary-text`, `badge-green-wash`, `toggle-on`, `focus-halo`…). If the image was displayed to you scaled, multiply your coordinates by the ratio the Read tool reported.
- Dominant colour of a crop for fills and hairlines: `magick "$f" -crop ${w}x${h}+${x}+${y} +repage -format %c histogram:info:- | sort -rn | head -3`.
- Text colour: crop a word and take the darkest (light mode) or lightest (dark mode) entries of a 12-line histogram, which separates anti-aliased ink from its background.
- Shadows: sample a vertical run of pixels under a card edge; a flat design shows the background colour immediately.

The brand's famous hex is not automatically the primary: it is often a pressed state or a band behind a section. Take the live computed style of the actual primary button (`agent-browser get styles "<selector>"`) and let that decide. Slack's primary button is `#611F69`; the `#4A154B` everyone quotes is its pressed state and its dark band. Record the choice as an assumption in the ledger.

Run one `LIGHT` block and one `DARK` block. Sizes (font sizes, row heights, paddings, radii) are measured from the renders with the crop tool and are **estimates**: say so under `source`.

## Write DESIGN.md

One file at the project root, YAML frontmatter and a Markdown body. The frontmatter is normative and every colour in it is a sampled hex:

```yaml
---
source:
  reference: <url or "case study: <url>">
  renders: .scratch/design-ref/<slug>/
  sampled: colours          # magick point samples
  estimated: sizes, radii   # measured on the renders
  modes: light, dark        # or "light only"
colors:                     # descriptive slugs; a -dark twin for every neutral that flips
  ink: "#1D1D1D"
  paper: "#FFFFFF"
  paper-dark: "#171616"
  signal-blue: "#2F6BFF"
typography:                 # one entry per role: family, size, weight, line-height, tracking
  body: { family: Inter, size: 14px, weight: 400, line-height: 20px }
  heading: { family: Inter, size: 22px, weight: 500, line-height: 28px, tracking: -0.01em }
rounded: { control: 8px, card: 12px, pill: 9999px }
spacing: { row: 34px, control: 32px, gutter: 24px }
components:                 # button variants, input, card, card-header, nav-item, nav-item-active, badge, chip, tooltip
  button-primary: { fill: "{colors.ink}", text: "{colors.paper}", radius: "{rounded.pill}", height: 32px }
shadcnMapping:              # light / dark pair for every variable the css file declares
  "--background": ["#FFFFFF", "#171616"]
  "--foreground": ["#1D1D1D", "#E8E9E9"]
  "--primary": ["#1D1D1D", "#E8E9E9"]
  "--radius": "0.5rem"
  "--color-success": ["#1F8A4C", "#5BD48A"]
---
```

`shadcnMapping` is the block Phase 2 runs on: every variable the project's css file declares in `:root` gets a pair, the grilling's accent decision fixes `--primary` and where the brand hue goes, new tones take a `--color-<name>` key, and a slot with no reference evidence (`--chart-3..5`) takes the reference's neutrals with a comment saying so.

The body carries what a later phase needs to decide a class, under these headings: **Overview** (the reference in one paragraph), **Colour** (which surface each tonal step is used for, the named rules: signal-only colour, wash pairing), **Typography** (the weights in use and where), **Shape and depth** (radius families, shadows or their absence), **Layout** (sidebar width, row heights, header height, content max-width), **Components** (sizes and states of buttons, inputs, rows, badges), **States** (focus, hover, active, disabled), **Do / Don't**.

## Validate

```
node <skill base directory>/scripts/check-design.mjs DESIGN.md <css file>
```

It reads the frontmatter, checks the required keys, that every colour is a six-digit hex, that every `{colors.x}` / `{rounded.y}` reference resolves, that every variable in the css file's `:root` has its light/dark pair in `shadcnMapping`, and that the body carries the eight headings. Silence is the pass. Commit `DESIGN.md`; if the repo formats Markdown, exempt it (reflowing merges its hand-wrapped lines).
