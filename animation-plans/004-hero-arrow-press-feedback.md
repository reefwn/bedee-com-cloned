# 004 — Add press/hover feedback to hero carousel arrow buttons

- **Status**: DONE
- **Commit**: 940b2c3
- **Severity**: LOW
- **Category**: Physicality & origin / Missed opportunity
- **Estimated scope**: 1 file (`app/src/blocks/components/HeroCarousel.tsx`), 2 button elements

## Problem

`app/src/blocks/components/HeroCarousel.tsx:66-83` (current):

```tsx
{slides.length > 1 && (
  <>
    <button
      aria-label="Previous slide"
      onClick={() => go(-1)}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
    >
      ‹
    </button>
    <button
      aria-label="Next slide"
      onClick={() => go(1)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
    >
      ›
    </button>
  </>
)}
```

Both buttons have a focus-visible ring (good, added in prior work) but zero hover or press feedback for mouse/pointer users — clicking `‹`/`›` gives no visual confirmation the click registered beyond the slide actually changing (which, per plan 001, may take up to 400ms to become visible). `AUDIT.md` §3 is explicit: "Pressable elements with no press feedback" is a named hunt target, and the prescribed fix is `transform: scale(0.97)` on `:active` with a fast, snappy transition.

## Target

Exact values from `AUDIT.md` §3 and §2:

- **Press feedback**: `scale(0.97)` on `:active`, `transition: transform 160ms ease-out` (duration from `AUDIT.md` §2's "Button press feedback: 100–160ms" bucket — use the top of the range since this is a larger tap target than a typical small icon button).
- **Hover feedback**: a subtle opacity change, gated behind `(hover: hover) and (pointer: fine)` per `AUDIT.md` §6 — "touch fires false hovers on tap," so ungated `:hover` would leave mobile Safari/Chrome showing a "stuck" hover state after a tap.

```tsx
/* target */
<button
  aria-label="Previous slide"
  onClick={() => go(-1)}
  className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out hover:opacity-80 active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] [@media(hover:hover)and(pointer:fine)]:hover:opacity-80"
>
  ‹
</button>
```

Note: Tailwind's plain `hover:` variant already only *applies on mouse hover* for the CSS `:hover` pseudo-class — but per `AUDIT.md` §6, the concern is specifically that touch devices fire `:hover` (and then get stuck in it) on tap, which the CSS media-query gate (`@media (hover: hover) and (pointer: fine)`) genuinely prevents and the bare pseudo-class does not. See Steps for exactly how to express this given Tailwind's variant syntax.

## Repo conventions to follow

- Every other interactive element in this file (the CTA link at `:46-52`) uses plain `transition-opacity hover:opacity-90` with no reduced-motion or touch gating — that's an existing, unaddressed gap in this codebase, but it is **out of scope for this plan** (this plan only touches the two arrow buttons named in Problem/Target). Do not "fix" the CTA link's hover as a drive-by change.
- `duration-[160ms]` and `ease-out` (Tailwind's built-in, not a custom token) match this file's existing arbitrary-value style (see `ease-[cubic-bezier(0.25,0.1,0.25,1)]` at `:38` pre-plan-001, or `[transition:opacity_400ms_var(--ease-out),...]` post-plan-001) — arbitrary-value bracket syntax is the established pattern here for one-off values not backed by a named token.
- Tailwind (as of v3.4+) supports arbitrary variants for compound media queries via `[@media(hover:hover)and(pointer:fine)]:` — verify this compiles by checking the built CSS output after Step 2 (see Verification). If the installed Tailwind version is older and this arbitrary variant doesn't generate a class, fall back to a plain `<style jsx>` block or a small `.arrow-hover` class defined once in `globals.css`:
  ```css
  @media (hover: hover) and (pointer: fine) {
    .arrow-hover:hover { opacity: 0.8; }
  }
  ```

## Steps

1. Open `app/src/blocks/components/HeroCarousel.tsx`.
2. Replace the previous-slide `<button>` (lines 68-74) with:
   ```tsx
   <button
     aria-label="Previous slide"
     onClick={() => go(-1)}
     className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] [@media(hover:hover)and(pointer:fine)]:hover:opacity-80"
   >
     ‹
   </button>
   ```
3. Replace the next-slide `<button>` (lines 75-81) identically except `aria-label`, `onClick`, and `left-4`→`right-4`:
   ```tsx
   <button
     aria-label="Next slide"
     onClick={() => go(1)}
     className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl transition-transform duration-[160ms] ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)] [@media(hover:hover)and(pointer:fine)]:hover:opacity-80"
   >
     ›
   </button>
   ```
4. Build the project (`npm run build` from `app/`) and inspect the generated CSS for the homepage route, or open the built page in DevTools → Elements → check the button's matched CSS rules, to confirm the `[@media(hover:hover)and(pointer:fine)]:hover:opacity-80` arbitrary variant actually generated a real `@media (hover: hover) and (pointer: fine) { ...:hover { opacity: 0.8 } }` rule and not a dropped/no-op class. If it did not generate correctly, apply the CSS-file fallback described in "Repo conventions to follow" instead: add the `.arrow-hover` rule to `globals.css` and use `className="... arrow-hover"` on both buttons in place of the arbitrary hover variant.

## Boundaries

- Do NOT touch the CTA link (`:46-52`) or its existing `hover:opacity-90` — out of scope.
- Do NOT touch the crossfade/entrance (plan 001), the autoplay timer (plan 002), or reduced-motion gating (plan 003) — this plan is isolated to the two `<button>` elements only.
- Do NOT change the buttons' `aria-label`, `onClick`, positioning classes (`absolute left-4/right-4 top-1/2 -translate-y-1/2`), or the `‹`/`›` glyphs.
- Do NOT add a `prefers-reduced-motion` gate on this specific `scale(0.97)` press feedback — `AUDIT.md` §6 treats *movement-as-feedback* (position/size change confirming an action) as the kind of transition reduced motion keeps, not removes; only decorative/positional animation gets dropped. If in doubt, leave it ungated — this is a 160ms, 3%-scale press acknowledgment, not a layout-shifting animation.
- If Tailwind's compiled output shows the arbitrary hover-media-variant class did not generate correctly (see Step 4) and you apply the CSS-file fallback, do NOT leave both the broken arbitrary-variant class and the new `.arrow-hover` class on the element — remove the non-functional one.

## Verification

- **Mechanical**: from `app/`, run `npx tsc --noEmit -p tsconfig.json` (expect: no errors) and `npm run build` (expect: clean build). Per Step 4, inspect generated CSS to confirm the hover media-query rule is real, not a silently-dropped class.
- **Feel check**: on a desktop browser with a mouse, hover over each arrow and confirm a subtle opacity dim (0.8) appears and reverses cleanly on mouse-out. Press and hold the mouse button down on an arrow (don't release) and confirm it visibly shrinks to ~97% size; release and confirm it springs back within ~160ms. Using Chrome DevTools' device toolbar in a touch-emulated mobile viewport, tap an arrow and confirm no hover/dim state gets "stuck" after the tap (the touch-emulated tap should show press feedback only, no lingering hover opacity).
- **Done when**: both arrow buttons show `scale(0.97)` on press (mouse or touch) that releases smoothly, hover-dim only ever appears for real mouse/trackpad input (never stuck after a touch tap), and no other element in the file was modified.

## Post-deploy correction

The executor's Step 4 build-time grep reported the arbitrary variant compiled correctly, but that was a false positive — live production inspection (`document.styleSheets`) showed the rule was actually wrapped in `@media not all { ... }`, a permanent no-op Tailwind's JIT emits when it can't parse a compound arbitrary variant, rather than erroring. The `scale(0.97)` press feedback (plain arbitrary *value*, not a compound arbitrary *variant*) compiled and worked correctly the whole time — only the hover-dim was affected.

Applied the plan's own prescribed fallback: added `.arrow-hover:hover { opacity: 0.8 }` inside `@media (hover: hover) and (pointer: fine) { ... }` to `globals.css`, and swapped `[@media(hover:hover)and(pointer:fine)]:hover:opacity-80` for a plain `arrow-hover` class on both buttons in `HeroCarousel.tsx`. Reverified via direct `document.styleSheets` inspection on the actual built CSS (not a grep on a string that merely looks right) that the real rule now compiles — confirmed live post-deploy.
