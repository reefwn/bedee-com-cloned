# 002 — Reset autoplay timer on manual carousel navigation

- **Status**: DONE
- **Commit**: 940b2c3
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 1 file (`app/src/blocks/components/HeroCarousel.tsx`), ~10 line change

## Problem

`app/src/blocks/components/HeroCarousel.tsx:16-29` (current):

```tsx
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5_000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  if (!slides?.length) return null
  const slide = slides[index]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)
  ...
```

The `setInterval` is created exactly once per mount (its dependency array is `[slides.length]`, which never changes after mount) and ticks every 5000ms regardless of what else happens. `go()`, called by the prev/next arrow buttons, updates `index` directly via `setIndex` but has no interaction with the timer at all.

Concretely: if a user manually clicks "next" at, say, the 4.8-second mark of the current auto-cycle, the interval still fires at the 5-second mark — 200ms after their manual click — and advances the slide *again*. The user asked for one slide forward and got two. This is the exact "anything triggered rapidly or reversible mid-motion... must use transitions or springs" / timer-coordination problem `AUDIT.md` §4 (Interruptibility) describes, applied to a timer instead of a gesture: the system's automatic behavior doesn't yield to the user's explicit input.

## Target

Manual navigation (prev or next) must restart the 5-second countdown from zero, so the next automatic advance is always a full 5 seconds after the *last* interaction (manual or automatic) — never sooner.

```tsx
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5_000)
    return () => window.clearInterval(timer)
  }, [slides.length, index]) // <-- `index` added: effect re-runs (timer restarts) on every change

  if (!slides?.length) return null
  const slide = slides[index]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length)
  ...
```

Adding `index` to the dependency array causes React to tear down and recreate the interval every time `index` changes — whether that change came from the autoplay tick itself or from a manual `go()` call. Either way, the new interval starts its 5-second countdown fresh at that moment. This is the simplest correct fix: no new state, no manual timer bookkeeping, no risk of drift between "the timer's internal clock" and "what triggered the last slide change."

## Repo conventions to follow

- This file already uses the `useEffect` + `setInterval` + cleanup pattern correctly (the `return () => window.clearInterval(timer)` cleanup on `:23` is correct and must be preserved exactly as-is — only the dependency array changes).
- No other component in this codebase manages a recurring timer, so there's no existing convention to reconcile with beyond "keep it a one-line dependency-array change" — don't introduce `useRef`-based manual interval tracking or a debounce library for this; the dependency-array approach is idiomatic React and the smallest possible diff.

## Steps

1. Open `app/src/blocks/components/HeroCarousel.tsx`.
2. Locate the `useEffect` block (starts at line 18, per the "Problem" excerpt above).
3. Change the dependency array on the last line of that `useEffect` from `[slides.length]` to `[slides.length, index]`.
4. Do not change anything else in the effect body, the cleanup function, or the `go()` function.

## Boundaries

- Do NOT touch the crossfade/entrance work from plan 001 — if plan 001 has already run, its JSX changes are unrelated to this fix and must be left as-is; this plan only touches the `useEffect` dependency array.
- Do NOT add `prefers-reduced-motion` handling here — that's plan 003's scope, though note: if plan 003 pauses autoplay entirely under reduced motion, this fix becomes moot in that state (the interval won't exist to reset) — no conflict, just don't duplicate that logic here.
- Do NOT change the 5000ms duration.
- Do NOT add a `useRef` for the timer, a debounce, or any new dependency — the one-line dependency-array change is the entire fix.
- If the `useEffect` you find has already been restructured (e.g. by another plan) such that it no longer matches the "Problem" excerpt, STOP and report instead of improvising.

## Verification

- **Mechanical**: from `app/`, run `npx tsc --noEmit -p tsconfig.json` (expect: no errors — this change has no type implications, but confirm nothing else broke). No build-affecting change; a full `npm run build` is optional but harmless to run.
- **Feel check**: open the homepage with the hero carousel visible (3+ slides). Watch one full autoplay cycle to confirm the 5-second timing is unchanged when the user does nothing. Then, timed carefully (e.g. count "one-one-thousand... four-one-thousand" then click), click the next arrow just before an expected auto-advance and confirm the slide advances exactly once (not twice back-to-back). Repeat by clicking prev. Confirm that after any manual click, the *next* automatic advance is a full ~5 seconds later, not near-immediate.
- **Done when**: manual prev/next clicks never result in a double-advance, and every automatic advance is preceded by a full 5-second gap since the last slide change of any kind (manual or automatic).
