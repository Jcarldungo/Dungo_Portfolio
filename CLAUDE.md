# CLAUDE.md — Dungo_Portfolio

Working notes for Claude Code sessions in this repo. Read this before making changes.

## What this is

A single-page developer portfolio for Jann Carl Dungo. Next.js 15 (App Router) +
React 19 + TypeScript, with a **hand-written CSS design system** under
`app/styles/`. Tailwind 3 is installed but only as a thin utility layer bridged
to the same CSS custom properties — the site's own stylesheets do the real work.

- Home (`/`) is the whole portfolio as anchor-linked sections: `#home`,
  `#projects`, `#stack`, `#about`, `#experience`, `#contact`.
- `/work/[slug]` is a full-screen case study per published project.
- Deployed on Vercel → https://janncarl.vercel.app

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # production build + type check — this is the gate; keep it green
npm run lint
```

There is no test suite. `npm run build` passing (type check included) is the bar.

## Where things live

| Concern | Path |
| --- | --- |
| **All editorial content** — projects, toolkit, certs, experience, `siteInfo` | `lib/content.ts` |
| Design tokens (colour, type scale, spacing, radius, transitions, z-index, `--shot-ratio`) | `app/styles/base/variables.css` |
| Keyframes + `.reveal*` utilities | `app/styles/base/animations.css` |
| Canonical breakpoints (desktop-first `max-width`) | `app/styles/base/breakpoints.css` |
| Section anchor order + labels | `lib/sections.ts` |
| Stylesheet load order | `app/globals.css` |
| Ambient blobs + particle canvas + the Level-3 gate | `components/AmbientBackground.tsx`, `app/styles/components/effects.css` |
| Theme resolution (pre-paint script + provider) | `app/layout.tsx`, `components/ThemeProvider.tsx` |
| Scroll-reveal engine / scroll-spy | `lib/useScrollReveal.ts`, `lib/useActiveSection.ts` |
| Page-load intro (cover → SDLC pipeline → line of intent → hero) | `components/HeroIntroGate.tsx`, `components/sections/HeroPipeline.tsx`, `app/styles/components/intro-gate.css`, `app/styles/sections/hero-pipeline.css` |

Fonts (via `next/font/google` in `app/layout.tsx`, all `display: swap`):
**Syne** (display), **DM Sans** (body), **JetBrains Mono** (mono).

Adding a project: add an entry to `projects` in `lib/content.ts`, drop
screenshots in `public/images/work/` captured at `--shot-ratio`, fill `screens`
/ `theBuild` / `whatItDoes` / `underTheHood` / `builtWith`. `draft: true` hides
it everywhere (catalogue, sitemap, detail route). There is deliberately no
placeholder card.

## Hard rails — do not cross these without asking the user

- **Monochrome palette is locked.** One `--accent`; `--green` / `--red` carry
  hue for status only (available / verified / invalid). No coloured theming,
  no gradient-text headings.
- **No new heavy dependencies.** No framer-motion, no GSAP. Motion is
  hand-authored CSS keyframes/transitions plus the existing `<canvas>` particle
  field and small rAF hooks. (A prior attempt to add `motion` for the intro was
  reverted — the intro is CSS-only for a reason: it can't leave the LCP element
  invisible.)
- **Never hard-code a colour, space, radius, or breakpoint.** Add or reuse a
  token in `variables.css`; use the documented breakpoints.
- **One signature visual device** — the `jann.js` code card in the hero. Don't
  add competing decorative devices.
- **`prefers-reduced-motion` honesty.** Level-2 entrance transforms off,
  Level-3 ambient (particles, blob drift) never mounts, reveals show content
  immediately, the intro gate is skipped entirely. Every hover effect needs a
  keyboard/focus + touch equivalent. Disables are targeted (see
  `app/styles/layout/responsive.css`), not a blanket `0.01ms` freeze.
- Primarily animate `transform` / `opacity`. No JS animation loops on mobile.
- `--ease-spring` (`cubic-bezier(0.16,1,0.3,1)`) is the signature curve;
  `--ease-out-soft` for small UI.
- Tone: professional developer/product portfolio — not "student portfolio",
  not "starter-kit". No emoji as UI chrome, no stat-counter rows, no rotating
  typewriter.
- Keep `npm run build` green and `main` deployable. Never commit to `main`
  directly — work on a branch.

## Creative latitude — take initiative here, on a branch, without asking

Within the rails above, be bold and iterate rather than asking permission:

- **Layout & composition** — propose and build ambitious section layouts, grid,
  spacing rhythm, editorial hierarchy, case-study structure.
- **Motion choreography** — richer entrance sequences, scroll-linked reveals,
  hover/focus micro-interactions, page transitions — using the CSS-first
  toolkit and the reduced-motion model.
- **Copy & narrative voice** — draft headlines, section intros, and project
  write-ups directly in `lib/content.ts`. Present the draft; don't ask the user
  to supply copy. Keep every claim factually accurate to the real projects and
  résumé.
- **Iterate then show** — make the change, report it with a one-line rationale
  and how to preview it. Course-correction happens after. Reserve questions for
  real forks: changing project facts, crossing a hard rail, or
  irreversible/outward actions.
- Always summarise what changed and how to view it (`npm run dev`, which route,
  which viewport).

## Voice guide (for any copy you write)

Direct, concrete, understated. Lead with what a thing does and what was hard,
not adjectives. Short sentences. No hype words ("cutting-edge", "passionate",
"seamless"), no emoji, no exclamation marks. Technical but readable — a senior
engineer explaining their work to another engineer. The existing `lib/content.ts`
copy is the reference for tone.

## Housekeeping note

`lib/content.ts` `siteInfo.email` reads `jcdungo20@gmail.com` (one "o"), but the
handle is `jcdungoo20` and the account email is `jcdungoo20@gmail.com` (two
"o"s). This looks like a typo — flag it for the user, don't silently change it
(it could be a real separate address).
