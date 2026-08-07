# 001 — Rebuild the hero carousel's dead crossfade with @starting-style

- **Status**: DONE
- **Commit**: 940b2c3
- **Severity**: HIGH
- **Category**: Physicality & origin
- **Estimated scope**: 1 file (`app/src/blocks/components/HeroCarousel.tsx`), plus 2 new tokens in `app/tailwind.config.ts` (shared with plan 005 — apply 005 first if doing both, or add the token yourself here per Steps if 005 hasn't run)

## Problem

`app/src/blocks/components/HeroCarousel.tsx:31-65` (current):

```tsx
return (
  <section
    className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white"
    style={{ minHeight: 720 }}
  >
    <div className="mx-auto flex min-h-[720px] max-w-6xl flex-col items-center justify-center gap-4 px-12 py-14 md:flex-row md:gap-12 md:px-20">
      <div
        className="flex-1 transition-opacity duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        key={index}
      >
        <h1 className="whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px]">
          {slide.headline}
        </h1>
        {slide.body && <p className="mt-4 text-lg font-medium leading-relaxed">{slide.body}</p>}
        {slide.ctaLabel && slide.ctaUrl && (
          <a
            href={slide.ctaUrl}
            className="mt-6 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
          >
            {slide.ctaLabel}
          </a>
        )}
      </div>
      <div className="relative flex-1">
        {slide.image?.url && (
          <Image
            src={slide.image.url}
            alt={slide.image.alt || ''}
            width={640}
            height={654}
            className="max-h-[580px] w-full object-contain"
          />
        )}
      </div>
    </div>
    {/* ...arrows... */}
  </section>
)
```

Why this is broken: `key={index}` on the text column forces React to fully **unmount and remount** that `<div>` every time the slide changes. `transition-opacity duration-500` only fires when the *same* DOM node's `opacity` value changes after paint — a freshly mounted node has no "before" state to transition from, so the class is inert. The node simply appears at `opacity: 1` (the implicit default; no `opacity-*` utility is even applied). The image column (`:54`, `<div className="relative flex-1">`) doesn't have a `key` or a transition class at all — its `<Image src>` just swaps in place with zero animation.

Net effect: despite the code comment at `:14-15` claiming "500ms translateX crossfade, cubic-bezier(0.25,0.1,0.25,1)," every slide change — autoplay or manual arrow click — is an instant, jarring hard-cut on both the text and the image.

## Target

Use `@starting-style` (a standard CSS at-rule, no library needed) so the remount-per-slide pattern gets a real entrance: when a new element is inserted, the browser transitions from the styles declared inside `@starting-style` to the element's normal styles, using the element's own `transition` property.

Move `key={index}` up to wrap **both** the text and image columns in one fragment/wrapper, so they enter together, and give that wrapper the transition:

```tsx
/* target shape — see Steps for the exact JSX */
<div
  key={index}
  className="flex flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-center md:gap-12 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
>
  {/* text column */}
  {/* image column */}
</div>
```

Exact values (from `AUDIT.md` §2 — do not approximate):
- Duration: **400ms** (marketing hero, so above the 300ms UI ceiling is acceptable, but keep it snappy — this is a slide transition, not a page transition).
- Easing: entrance → `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (the strong ease-out from `AUDIT.md` §2). This replaces the old, now-provably-decorative `cubic-bezier(0.25,0.1,0.25,1)` — that value was documented as "Swiper.js library default," which is irrelevant now that there is no Swiper and no real translateX slide; use the ease-out token instead.
- Starting state: `opacity: 0` + `transform: translateY(6px)` (a small rise-in, not a bare fade — see `AUDIT.md` §3: pure-fade-with-no-initial-transform is a named anti-pattern; a 6px rise is subtle enough not to read as a "slide" while still giving the entrance some physicality).
- Do **not** use `scale()` for this entrance — a rise + fade reads correctly for a hero; scale would compete with the image's own size.

## Repo conventions to follow

- Tailwind utility classes are used everywhere in this codebase (`app/src/blocks/components/*.tsx`) — no CSS Modules, no styled-components. Arbitrary-value bracket syntax (`transition-opacity duration-500 ease-[cubic-bezier(...)]`) is the existing pattern for one-off motion values (see the file you're editing, `:38`), but bare Tailwind utilities can't express `@starting-style` — you'll need one small arbitrary-variant/arbitrary-property construction (Tailwind v3 supports `[@starting-style]:` as an arbitrary variant and `[transition:...]` as an arbitrary property; confirm the installed Tailwind version supports this — check `app/package.json` for `"tailwindcss"` version; if it's below 3.4, `@starting-style` arbitrary-variant syntax may not be recognized by the JIT compiler, and you should fall back to a plain `<style>` block scoped to this component instead, e.g. a CSS Module or a `<style jsx>` if Next's styled-jsx is available — check `app/package.json` for `styled-jsx` before choosing this fallback, and if neither works, write a tiny co-located `HeroCarousel.module.css` with the `@starting-style` rule and import it, which needs no extra dependency).
- `--ease-out` should be added as a **CSS custom property**, not a Tailwind token, because `@starting-style`/arbitrary-property transitions need a `var()`-resolvable value, and Tailwind's `theme.extend.transitionTimingFunction` only generates `ease-*` utility classes, not a reusable `var()`. Define it once in `app/src/app/(frontend)/globals.css` (the file already sets global styles — see the existing `body { font-family: ...; color: ...; }` block) as:
  ```css
  :root {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  }
  ```
  This is the same token plan 005 introduces via Tailwind's `theme.extend.transitionTimingFunction` for *utility-class* use (e.g. `duration-200 ease-out-strong`); this plan additionally needs the raw CSS variable form for the arbitrary-property transition. If plan 005 has already run and added `--ease-out` to `:root` in `globals.css`, reuse it — do not define it twice. If it hasn't run yet, add the `:root` block yourself as shown above (both plans converge on the same variable name and value; no conflict either order).

## Steps

1. Open `app/src/app/(frontend)/globals.css`. If `--ease-out` is not already defined in a `:root` block, add one right after the `@tailwind` directives (before the `body { ... }` rule):
   ```css
   :root {
     --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   }
   ```

2. Open `app/src/blocks/components/HeroCarousel.tsx`. Replace the two separate columns (currently two sibling `<div>`s, one with `key={index}`, one without) with a single wrapper carrying `key={index}` and the entrance transition. The full replacement for lines 36-65:

   ```tsx
   <div className="mx-auto flex min-h-[720px] max-w-6xl flex-col items-center justify-center gap-4 px-12 py-14 md:flex-row md:gap-12 md:px-20">
     <div
       key={index}
       className="flex flex-1 flex-col items-center gap-4 [transition:opacity_400ms_var(--ease-out),transform_400ms_var(--ease-out)] md:flex-row md:gap-12 [@starting-style]:opacity-0 [@starting-style]:[transform:translateY(6px)]"
     >
       <div className="flex-1 text-center md:text-left">
         <h1 className="whitespace-pre-line text-5xl font-semibold leading-[1.1] md:text-[72px]">
           {slide.headline}
         </h1>
         {slide.body && <p className="mt-4 text-lg font-medium leading-relaxed">{slide.body}</p>}
         {slide.ctaLabel && slide.ctaUrl && (
           <a
             href={slide.ctaUrl}
             className="mt-6 inline-block rounded-pill bg-primary px-6 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_rgba(49,125,245,0.4)]"
           >
             {slide.ctaLabel}
           </a>
         )}
       </div>
       <div className="relative flex-1">
         {slide.image?.url && (
           <Image
             src={slide.image.url}
             alt={slide.image.alt || ''}
             width={640}
             height={654}
             className="max-h-[580px] w-full object-contain"
           />
         )}
       </div>
     </div>
   </div>
   ```

   Note what changed: the outer `flex flex-col md:flex-row` layout that used to live on the line-36 container now lives on the new `key={index}` wrapper (so the whole two-column group is what enters), and the line-36 container becomes a plain centering shell with no `flex-col`/`flex-row` of its own — just `mx-auto ... px-12 py-14 md:px-20` (drop `flex-col items-center justify-center gap-4 md:flex-row md:gap-12` from it since that's now on the inner wrapper). Text alignment (`text-center md:text-left`) moves onto the text column's own div since it's no longer inheriting alignment from a flex-col parent in the same way — verify visually in Step 4 that headline/body/CTA alignment matches the current site exactly (centered on mobile, left-aligned image-right on desktop) and adjust the `text-center md:text-left` placement if the diff looks wrong.

3. **If** `app/package.json`'s `"tailwindcss"` version is below `3.4.0`, the `[@starting-style]:` arbitrary variant will not compile (JIT will silently drop the classes with no error). In that case, stop the class-based approach and instead:
   - Create `app/src/blocks/components/HeroCarousel.module.css`:
     ```css
     .slide {
       transition: opacity 400ms var(--ease-out), transform 400ms var(--ease-out);
     }
     @starting-style {
       .slide {
         opacity: 0;
         transform: translateY(6px);
       }
     }
     ```
   - Import it in `HeroCarousel.tsx`: `import styles from './HeroCarousel.module.css'`
   - Apply `className={styles.slide}` on the `key={index}` wrapper alongside the existing Tailwind layout classes (e.g. `className={\`flex flex-1 flex-col items-center gap-4 md:flex-row md:gap-12 ${styles.slide}\`}`).

4. Run the dev server (`npm run dev` from `app/`) and load the homepage. Manually click the next-arrow several times and let autoplay run at least one full cycle. Confirm the text+image group now visibly fades and rises in on every slide change — no more instant hard-cut.

## Boundaries

- Do NOT touch the autoplay `setInterval` logic (lines 18-24) or the `go()` function (line 29) — that's plan 002's scope.
- Do NOT add `prefers-reduced-motion` handling here — that's plan 003's scope (but do not break its future insertion point; keep the transition on one clearly-identifiable wrapper element so plan 003 can gate it).
- Do NOT touch the prev/next arrow buttons (lines 68-81) — that's plan 004's scope.
- Do NOT add a carousel library (Swiper, Embla, etc.) or any new npm dependency. `@starting-style` (or the CSS Modules fallback) requires zero new packages.
- Do NOT change the 5-second autoplay interval duration.
- If the JSX structure you find in `HeroCarousel.tsx` differs meaningfully from the "current" excerpt above (e.g. someone already refactored it), STOP and report the discrepancy instead of improvising a merge.

## Verification

- **Mechanical**: from `app/`, run `npx tsc --noEmit -p tsconfig.json` (expect: no errors) and `npm run build` (expect: clean build, no new warnings). If you added `HeroCarousel.module.css`, confirm Next.js picked it up with no CSS Modules config changes needed (it's zero-config in Next.js).
- **Feel check**: open the homepage, open DevTools → Elements → find the hero `<section>`, and in the Styles/Computed panel confirm the wrapper's computed `transition` property includes `opacity` and `transform` at `400ms`.
  - Click the next arrow: the outgoing slide's text+image should visibly fade/rise out is NOT expected (that's a limitation of the remount approach — only the *entering* slide animates, the old one simply disappears; this is acceptable and matches the "Target" section, which only specifies an entrance). Confirm the *entering* slide fades in from ~0 opacity with a slight upward rise, not an instant pop.
  - In DevTools → More tools → Animations (Chrome) or the Rendering panel, throttle CPU 4x or use the Animations panel's playback-speed slider at 10% and confirm the fade+rise plays smoothly across the full 400ms — no snap partway through.
  - Let autoplay run one full unattended cycle (5s × number of slides) and confirm every automatic transition also gets the fade+rise, not just manual clicks.
  - Resize to a mobile width (375px) and confirm the entrance still applies and text/image alignment (centered) still matches the pre-change layout.
- **Done when**: every slide change (autoplay or manual) shows a visible ~400ms fade+rise entrance on both text and image together, TypeScript and build are clean, and no new dependency was added.
