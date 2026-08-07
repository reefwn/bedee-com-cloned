# 005 — Add shared easing tokens to tailwind.config.ts

- **Status**: DONE
- **Commit**: 940b2c3
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`app/tailwind.config.ts`), additive only

## Problem

`app/tailwind.config.ts` (current, full file):

```ts
import type { Config } from 'tailwindcss'

// Palette + type scale transplanted verbatim from plans/03-replication-prompt.md §2 —
// same-brand migration, no color reassignment.
const config: Config = {
  content: [
    './src/app/(frontend)/**/*.{ts,tsx}',
    './src/blocks/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#081F7C', // Deep Blue
        secondary: '#317DF5', // BeDee Blue
        tertiary: '#455FA5', // Slate Blue
        accent: '#FF4C14', // Alert Coral
        ink: '#222222',
        muted: '#666666',
        'panel-1': '#F4F8FF',
        'panel-2': '#F4F7FC',
        'footer-bg': '#F0F0F0',
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'sans-serif'],
      },
      borderRadius: {
        pill: '50px',
      },
    },
  },
  plugins: [],
}

export default config
```

There is no `transitionTimingFunction` or `transitionDuration` entry anywhere in `theme.extend`, and no motion tokens exist in `app/src/app/(frontend)/globals.css` either (confirmed via `grep -rn "ease\|transition\|@keyframes" "app/src/app/(frontend)/globals.css"` returning zero matches before this plan). The one deliberate easing curve in the codebase — `app/src/blocks/components/HeroCarousel.tsx`'s hero entrance (`cubic-bezier(0.25,0.1,0.25,1)` pre-plan-001, or `var(--ease-out)` post-plan-001) — has no shared home the way `colors`/`borderRadius`/`fontFamily` already do in this exact file. Every future motion decision in this codebase currently has to either hand-type a cubic-bezier or invent its own token from scratch.

## Target

Add `transitionTimingFunction` entries to `theme.extend`, following the exact same shape as the existing `colors`/`borderRadius` entries in the same object — named, commented with their purpose, values pulled verbatim from `AUDIT.md` §2:

```ts
theme: {
  extend: {
    colors: { /* ...unchanged... */ },
    fontFamily: { /* ...unchanged... */ },
    borderRadius: { /* ...unchanged... */ },
    transitionTimingFunction: {
      'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)', // entrances/exits — starts fast, feels responsive
      'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)', // on-screen movement/morphing
    },
  },
},
```

This generates Tailwind utility classes `ease-out-strong` and `ease-in-out-strong` for use anywhere a component needs strong custom easing via a plain utility class (as opposed to the `var(--ease-out)` CSS-variable form plan 001 uses for its `@starting-style`/arbitrary-property transition, which cannot consume a Tailwind theme value directly — the two forms coexist deliberately, see Repo conventions below).

## Repo conventions to follow

- Exact pattern to imitate: the existing `borderRadius: { pill: '50px' }` entry in this same file — a single-purpose named token with an inline comment explaining what it's for, added to `theme.extend`, nothing else touched.
- **Why this plan doesn't replace plan 001's `--ease-out` CSS variable**: Tailwind's `theme.extend.transitionTimingFunction` only produces utility classes (`ease-out-strong`); it does not expose the underlying value as a `var()` usable inside arbitrary-property syntax like `[transition:opacity_400ms_var(--ease-out)]` or inside a `@starting-style` block, which plan 001 needs. The two token forms — a Tailwind theme entry for utility-class consumers, and a `:root` CSS variable in `globals.css` for arbitrary-property/`@starting-style` consumers — are complementary, not duplicative: this plan's `ease-out-strong` utility is for any *future* component that just needs `className="... ease-out-strong duration-200"` without the `@starting-style` complexity plan 001 requires. Do not attempt to unify them into one mechanism — that would require a Tailwind plugin, which is out of scope for a token-naming cleanup.
- If plan 001 has already run, its `--ease-out` CSS variable in `globals.css` should use the **same numeric value** as this plan's `out-strong` token (`cubic-bezier(0.23, 1, 0.32, 1)`) — confirm they match; if plan 001 used a different value for any reason, treat that as a drift signal and report it rather than silently reconciling.

## Steps

1. Open `app/tailwind.config.ts`.
2. Inside `theme.extend`, after the `borderRadius: { pill: '50px' }` entry, add:
   ```ts
   transitionTimingFunction: {
     'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)', // entrances/exits — starts fast, feels responsive
     'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)', // on-screen movement/morphing
   },
   ```
3. Do not add a `transitionDuration` extension — this codebase's existing duration values (`duration-500`, `duration-[160ms]`, etc.) are all expressed as plain Tailwind utilities or arbitrary values inline at each call site, and `AUDIT.md`'s duration guidance is a *budget table* to consult per-element (button vs. modal vs. marketing), not a fixed token set — codifying durations as named tokens would misrepresent them as interchangeable, which they aren't.

## Boundaries

- Do NOT modify `colors`, `fontFamily`, or `borderRadius` — additive change only.
- Do NOT add `transitionDuration` tokens (see Step 3's rationale).
- Do NOT retrofit `HeroCarousel.tsx` or any other component to consume the new `ease-out-strong`/`ease-in-out-strong` utility classes as part of this plan — plan 001 already handles the hero's own easing via its CSS-variable form for `@starting-style` compatibility; this plan only adds the token for future use. If you find yourself wanting to change `HeroCarousel.tsx`, stop — that's plan 001's file, not this one's.
- Do NOT add a Tailwind plugin or restructure the config file's shape beyond the one new key.

## Verification

- **Mechanical**: from `app/`, run `npx tsc --noEmit -p tsconfig.json` (expect: no errors — this is a config-only change with no TS surface) and `npm run build` (expect: clean build). Confirm the new utility classes actually generate: after building, search the built CSS output (or run `npx tailwindcss -i ./src/app/\(frontend\)/globals.css -o /tmp/check.css` from `app/` and `grep -c "ease-out-strong\|ease-in-out-strong" /tmp/check.css`) — if neither class appears in the compiled output, the classes aren't being used anywhere yet (expected, since Step 3 explicitly defers consumption) and Tailwind's JIT may tree-shake unused theme values from utility generation until a class is referenced in `content`-scanned files; this is normal and not a failure — the config entry existing correctly is what matters, not present usage.
- **Feel check**: not applicable — this plan has no visual output on its own (no component consumes the new tokens yet). Skip this section's usual slow-motion/DevTools checks.
- **Done when**: `tailwind.config.ts` contains the two new `transitionTimingFunction` entries with the exact cubic-bezier values above, the config file still type-checks and builds cleanly, and no other file was modified.
