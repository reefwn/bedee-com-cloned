# 003 — Respect prefers-reduced-motion in the hero carousel

- **Status**: DONE
- **Commit**: 940b2c3
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`app/src/blocks/components/HeroCarousel.tsx`); depends on plan 001 for the entrance transition it's gating

## Problem

`app/src/blocks/components/HeroCarousel.tsx` has no `prefers-reduced-motion` handling anywhere — confirmed by `grep -rn "prefers-reduced-motion" app/src` returning zero matches in the entire codebase. The hero carousel autoplays continuously (every 5000ms, `:20-22`) for as long as the homepage is open, and — once plan 001 lands — will also run a fade+rise entrance transition on every slide change.

`AUDIT.md` §6 is explicit: "Reduced motion means fewer and gentler animations, not zero — keep transitions that aid comprehension, remove position changes." An always-on, unstoppable 5-second content-change loop with a `translateY` entrance is precisely the pattern reduced-motion users need relief from — both the moving transform and the perpetual timed change.

## Target

Two independent behaviors, both gated on the same media query:

1. **Drop the `translateY` from the entrance transition** (opacity-only fade remains — per `AUDIT.md` §6's example: `@media (prefers-reduced-motion: reduce) { .element { animation: fade 0.2s ease; } }`, keep the fade, remove the movement).
2. **Stop autoplay entirely** when reduced motion is preferred. The carousel should still be fully navigable via the prev/next arrows — only the *automatic, timed* advancement stops. This is the JS-side equivalent of `AUDIT.md` §6's `useReducedMotion()` branch guidance, implemented here via `window.matchMedia` since this codebase has no motion library providing that hook.

```tsx
// target shape — see Steps for the exact diff
const [index, setIndex] = useState(0)
const prefersReducedMotion = useReducedMotionQuery() // see Steps for this small local hook

useEffect(() => {
  if (slides.length < 2 || prefersReducedMotion) return
  const timer = window.setInterval(() => {
    setIndex((current) => (current + 1) % slides.length)
  }, 5_000)
  return () => window.clearInterval(timer)
}, [slides.length, index, prefersReducedMotion])
```

```css
/* globals.css addition */
@media (prefers-reduced-motion: reduce) {
  .hero-slide {
    transition: opacity 200ms ease !important;
  }
}
```

(The `!important` is necessary and acceptable here specifically because this is a media-query override of an inline/arbitrary Tailwind transition value, not a specificity workaround for lazy CSS — this is the standard pattern for reduced-motion overrides per `AUDIT.md` §6's own example, which uses a plain override rule the same way.)

## Repo conventions to follow

- This codebase has no custom hooks directory and no motion library (`grep -rn "framer-motion\|useReducedMotion" app/src` — confirm this is still zero before starting; if a hook now exists from other work, reuse it instead of writing a new one). Write the smallest possible local hook inline in `HeroCarousel.tsx` rather than creating a new `hooks/` directory for a single 5-line hook — this matches the codebase's existing style of keeping component-specific logic co-located (e.g. `go()` is defined inline in the same file, not extracted).
- Depends on **plan 001**: that plan introduces the `key={index}` wrapper with the `[transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)]` and `[@starting-style]:` classes (or the `HeroCarousel.module.css` fallback if Tailwind's version required it). This plan needs a stable selector on that wrapper to override under the media query — add a plain class name (e.g. `hero-slide`) to it if one doesn't already exist, alongside the Tailwind/CSS-Modules classes from plan 001. **If plan 001 has not run yet, STOP and do that first** — this plan's CSS override has nothing to override without it.

## Steps

1. Confirm plan 001 has already been applied: open `app/src/blocks/components/HeroCarousel.tsx` and check that the slide wrapper has a `key={index}` and an opacity+transform transition (either Tailwind arbitrary-property classes or a `styles.slide` CSS Modules class from `HeroCarousel.module.css`). If it's still the old two-separate-`div`s structure with the inert `transition-opacity duration-500` class, stop and report — do plan 001 first.

2. Add a plain, stable class name to that same wrapper for the media-query override to target. If plan 001 used Tailwind arbitrary classes, add `hero-slide` alongside them, e.g.:
   ```tsx
   className="hero-slide flex flex-1 flex-col items-center gap-4 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] md:flex-row md:gap-12 [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
   ```
   If plan 001 used the `HeroCarousel.module.css` fallback instead, add the reduced-motion rule directly to that file (skip step 3's global CSS addition and put the block from step 3 inside `HeroCarousel.module.css` targeting `.slide` instead of `.hero-slide`).

3. If using the Tailwind/global-CSS path, open `app/src/app/(frontend)/globals.css` and add, after the `:root` block (added by plan 001, or after the `@tailwind` directives if plan 001 used the CSS Modules fallback and this `:root` doesn't exist — then add both):
   ```css
   @media (prefers-reduced-motion: reduce) {
     .hero-slide {
       transition: opacity 200ms ease !important;
     }
   }
   ```

4. In `HeroCarousel.tsx`, add a small local hook above the `HeroCarousel` function (or as the first lines inside it — either is fine, match whichever reads cleaner given the final file shape):
   ```tsx
   function usePrefersReducedMotion() {
     const [reduced, setReduced] = useState(false)
     useEffect(() => {
       const query = window.matchMedia('(prefers-reduced-motion: reduce)')
       setReduced(query.matches)
       const listener = (e: MediaQueryListEvent) => setReduced(e.matches)
       query.addEventListener('change', listener)
       return () => query.removeEventListener('change', listener)
     }, [])
     return reduced
   }
   ```

5. Inside `HeroCarousel`, call the hook and use it to gate the autoplay `useEffect`:
   ```tsx
   export function HeroCarousel({ slides }: { slides: Slide[] }) {
     const [index, setIndex] = useState(0)
     const prefersReducedMotion = usePrefersReducedMotion()

     useEffect(() => {
       if (slides.length < 2 || prefersReducedMotion) return
       const timer = window.setInterval(() => {
         setIndex((current) => (current + 1) % slides.length)
       }, 5_000)
       return () => window.clearInterval(timer)
     }, [slides.length, index, prefersReducedMotion])
     ...
   ```
   (This assumes plan 002 has already added `index` to the dependency array; if plan 002 hasn't run yet, the array is `[slides.length, prefersReducedMotion]` instead — either order of 002/003 is fine, just include whichever dependencies are already present plus `prefersReducedMotion`.)

## Boundaries

- Do NOT implement this before plan 001 — there is nothing to gate without it. If plan 001's structure doesn't match what this plan expects, stop and report rather than improvising a different entrance structure just to have something to gate.
- Do NOT hide or disable the prev/next arrow buttons under reduced motion — manual navigation must remain fully available; only *automatic, timed* advancement stops.
- Do NOT remove the entrance transition entirely under reduced motion — `AUDIT.md` §6 is explicit that reduced motion keeps opacity/color feedback and drops movement, not that it drops everything. The 200ms opacity-only fade must remain.
- Do NOT add a motion library (`framer-motion`, etc.) to get a `useReducedMotion()` hook — the ~8-line `matchMedia` hook in Step 4 is the entire dependency-free solution.
- Do NOT apply this media query globally to unrelated components — scope the CSS rule to the `.hero-slide` class only.

## Verification

- **Mechanical**: from `app/`, run `npx tsc --noEmit -p tsconfig.json` (expect: no errors) and `npm run build` (expect: clean build).
- **Feel check**: in Chrome DevTools, open the Rendering panel (⋮ menu → More tools → Rendering) and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Reload the homepage and confirm:
  - The hero carousel does NOT automatically advance after 5+ seconds of waiting (open the tab and just watch — no slide change should occur).
  - Clicking the prev/next arrows still navigates between slides.
  - The slide-change transition on manual click is now a quick ~200ms plain fade with no visible upward movement (compare against the un-reduced version, which has both fade and a slight rise).
  - Toggle the emulation back to "No emulation" and reload — confirm autoplay resumes and the full fade+rise entrance from plan 001 is back.
- **Done when**: autoplay is fully disabled under `prefers-reduced-motion: reduce` (manual nav still works), the entrance transition degrades to opacity-only at 200ms under that same condition, and behavior is unchanged when reduced motion is not requested.
