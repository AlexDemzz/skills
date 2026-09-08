---
name: shadcn-composition-patterns
description: Build or review a compound component on shadcn primitives with the shadcn rigour — data-slot, spread props, className variants, polymorphic root.
argument-hint: <component to build | file to review>
disable-model-invocation: true
---

Build a component the way shadcn builds its own — a **compound**: one file, one prefixed family of parts, each part a single element the consumer styles and replaces from the call site. The same laws grade an existing component in review.

The React theory (why compounds, why no boolean props, lifting state into a provider) is the `vercel-composition-patterns` skill; this skill is the shadcn layer on top of it.

## Setup

1. Load the `shadcn` skill with the Skill tool, from the directory holding `components.json` (in a monorepo, the ui package). It injects the project context, owns the CLI and the styling rules, and its `base` field (`base` or `radix`) decides the polymorphism law below.
2. Read the argument. A component to build → **build** mode; a file path → **review** mode, every law below graded against the file.
3. `ls` the components directory before writing anything: the need may already be a primitive or an existing compound. In build mode a match ends the task with a pointer to it.

## Placement

- Used in ONE consumer → declared in that consumer's file. No new file.
- Shared → the project's existing component convention (a design-system folder beside `ui/`, a feature folder). Without one, `components/ui/` beside the shadcn primitives.

## Laws

Every law is checkable on the file alone.

- **Compound, prefixed named exports.** `export { Navbar, NavbarTitle, NavbarActions }` — one root plus parts, the prefix carried by every part. The consumer composes the tree; the component owns no layout decision the consumer could make.
- **Each part is one element.** Root element carries `data-slot="<part-kebab>"`, `className={cn(base, className)}` and `{...props}` spread last. Props typed from the rendered element: `React.ComponentProps<"nav">`, or `React.ComponentProps<typeof Button>` when the part wraps a primitive. Spacing between parts lives on the parent's classes, so a part renders its element and nothing around it.
- **`children` over slot props.** Content the consumer decides (an icon, a trailing action, a title) arrives as `children`, with a sensible default when the part is empty. A prop like `icon`, `RightComponent` or `renderTitle` is a part waiting to be named.
- **Variants at the call site.** A one-off look is `className` from the consumer. A `cva` `variant`/`size` on a home compound is earned only when the look is purely visual AND each variant has several consumers; a variant with one consumer is that consumer's `className`. A visual toggle expressed as a boolean prop (`borderless`, `compact`) fails this law.
- **Polymorphic root, navigation-agnostic.** Every part that a consumer may turn into a link or a button takes the element from the consumer, defaulting to a plain tag. A part backed by a shadcn primitive already has it (`render` on base, `asChild` on radix). A custom part gets it per the project `base`:
  - `base` → `useRender` + `mergeProps` from `@base-ui/react`.
  - `radix` → `Slot` from `@radix-ui/react-slot` behind an `asChild` prop.
  Link inference stays out of the component: no auto-`<Link>`, no anchor derived from a `url` data prop. Interactive styling gates on the rendered tag — `[a,button]:hover:bg-foreground/5` activates only once the consumer rendered an anchor or a button.
- **Styling from outside targets `data-slot`.** The consumer restyles a part with `[&_[data-slot=item-title]]:font-semibold` on the root's `className`. Tailwind v4 needs the bracket form for custom data attributes (`data-[state=open]:…`); a bare `data-state-open:` variant fails silently.

## Skeleton

```tsx
import { cn } from "@/lib/utils";

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      className={cn("flex items-center gap-4 px-4 py-3", className)}
      data-slot="navbar"
      {...props}
    />
  );
}

function NavbarTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn("text-base font-semibold", className)}
      data-slot="navbar-title"
      {...props}
    />
  );
}

export { Navbar, NavbarTitle };
```

Polymorphic root, `base`:

```tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

function JobCard({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn("group flex gap-4 rounded-lg p-4 [a,button]:hover:bg-foreground/5", className),
        "data-slot": "job-card",
      },
      props
    ),
  });
}
```

Polymorphic root, `radix`:

```tsx
import { Slot } from "@radix-ui/react-slot";

function JobCard({
  asChild,
  className,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("group flex gap-4 rounded-lg p-4 [a,button]:hover:bg-foreground/5", className)}
      data-slot="job-card"
      {...props}
    />
  );
}
```

The consumer supplies the element and the child styling:

```tsx
// base
<JobCard className="[&_[data-slot=job-card-title]]:text-primary" render={<Link to="/jobs/$id" params={{ id }} />}>
  <JobCardTitle>{job.title}</JobCardTitle>
</JobCard>

// radix
<JobCard asChild>
  <Link to={`/jobs/${id}`}>
    <JobCardTitle>{job.title}</JobCardTitle>
  </Link>
</JobCard>
```

## Done when

- Build: the file exports one prefixed family, every part passes every law, and one consumer renders it with a call-site `className` and, where a link applies, the consumer-supplied element. The project's lint and typecheck pass on the file.
- Review: every law reported per part as pass or fail with the offending line, and the fix stated in the law's terms.
