# Phase 4 — The iso page

The question: *are the tokens and the primitives enough to rebuild the chosen reference screen, in light and dark, with nothing but primitives and layout Tailwind in the consumer?* The page is a prototype in the `/mattpocock-skills:prototype` sense: throwaway, on its own branch when the project has production, folded back as fixes to primitives and a list of overrides.

## Before building

Open the reference render beside you and write the bill of materials: every region of the screen, the primitive and variant that renders it (`Sidebar` + `SidebarMenuButton isActive`, `Breadcrumb`, `Avatar`, `Badge variant="success"`, `Button variant="secondary"`, `HeroWash`, data grid for the details table, `Card` + `Select` + `Badge chip` rows for permissions, `Collapsible` for alert types…). Put it to the user and wait for the confirmation. Where the user is not reachable, proceed on the list and flag it as unconfirmed at the top of the page file and in the ledger.

## Build

`/dev/<page-slug>` beside the showcase, same gate. The component file opens with a comment naming it a prototype and the phase it answers. Rules while writing:

- Layout classes only in the consumer: flex, grid, gap, padding, max-width, widths of columns. A colour, border, radius or font class in the consumer is an override and goes on the ledger the moment you type it; if it is there because a primitive lacks a variant, stop and add the variant instead.
- Real copy from the reference, real-looking data, the provider's own mark when the reference shows one. Marks come from `simple-icons` (`siGithub.path`, `siGithub.hex`), which lacks several big brands (Slack, GM, OpenAI, IBM, Canva): those take a grey text wordmark, or an inlined object of the same `{path, hex}` shape. Every brand fill stays inside a `BrandMark`-style composition drawing `fill: #<hex>`, so the page itself writes no `fill-` class; brand colour on a provider's mark and name is the recorded override, the one kind usually allowed.
- Both modes from the same markup; a theme toggle in the page's corner for screenshots.
- The app frame around it when the reference has one.

## Compare

Screenshot light and dark at the reference's size, save to `.scratch/design-check/<page-slug>/`, and put each beside its render. Then `/impeccable critique` on the page with the render as the brief, and `/impeccable` detect on the page and the primitives it uses. Each deviation gets one of two fates:

1. **A primitive changes**: the page exposed a missing variant, a wrong size, a wrong default. Fix it in the components directory, extend the seam test, note it under *primitives that had to change*.
2. **A consumer override is recorded**: the reference does something the design system forbids for everyone else (a provider brand colour on a chip, a key/value block laid out as a card grid). Write the class, the reason, and the rule you propose for the ADR.

**Imagery does not flip.** A surface the reference keeps white in dark mode (pills on a photo band, a preview inside an image) is fate 1: the fix belongs in the primitive ([primitives.md](primitives.md)), never in a `dark:` class on the page.

Observations where the reference disagrees with DESIGN.md (a red count pill where DESIGN.md says orange) are noted, not acted on: DESIGN.md is the authority once Phase 1 sampled it.

## Done

- The page and the render sit side by side in light and dark and read as the same screen.
- Ledger entry: the verdict (yes, or what is still missing), the primitives that had to change (cherry-picked onto the primitives branch when there is one), the consumer overrides with their proposed rule, the critique observations not acted on, what was not covered (mobile, collapsed sidebar).
- The prototype branch holds the page; the primitive fixes reach the main line.
