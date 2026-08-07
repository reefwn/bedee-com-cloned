# Animation plans — homepage hero/banner carousel

Scope: `app/src/blocks/components/HeroCarousel.tsx` only. Written by `/improve-animations` at commit `940b2c3`.

Named `animation-plans/` (not `plans/`) because `plans/` already holds the site-DNA/content-model migration docs for this project.

| # | Title | Severity | Category | Status |
|---|---|---|---|---|
| 001 | Rebuild the hero carousel's dead crossfade with `@starting-style` | HIGH | Physicality & origin | DONE |
| 002 | Reset autoplay timer on manual carousel navigation | MEDIUM | Interruptibility | DONE |
| 003 | Respect `prefers-reduced-motion` in the hero carousel | MEDIUM | Accessibility | DONE |
| 004 | Add press/hover feedback to hero carousel arrow buttons | LOW | Physicality / Missed opportunity | DONE |
| 005 | Add shared easing tokens to `tailwind.config.ts` | LOW | Cohesion & tokens | DONE |

## Recommended execution order

1. **005** first — pure addition to `tailwind.config.ts`, zero risk, no dependents block on it but 001 references its `--ease-out` naming convention.
2. **001** — the real fix; everything else in this set either depends on it or is independent of it.
3. **003** — hard dependency on 001 (gates the entrance transition 001 introduces). Do not attempt before 001 lands.
4. **002** — independent of 001/003, touches only the `useEffect` dependency array. Can run anytime, but 003's Step 5 code sample assumes 002's `index` dependency is already present (or adapts if not — see 003's Step 5 note).
5. **004** — fully independent, touches only the two arrow `<button>` elements. Can run in parallel with any of the above.

## Dependencies

- **003 → 001** (hard): 003 gates a transition that doesn't exist until 001 creates it.
- **003 ↔ 002** (soft): 003's code sample includes `index` in the effect's dependency array assuming 002 already added it; if 002 hasn't run, 003 still works correctly with a shorter dependency array — no blocking dependency, just a note either implementer should check.
- **002, 004, 005**: fully independent of everything else in this set.

## Status legend

- **TODO** — not started.
- **IN PROGRESS** — an executor has picked it up.
- **DONE** — implemented and verified; re-run `/improve-animations reconcile` to confirm before marking done in this table.
- **BLOCKED** — dependency unmet (see Dependencies above) or code drift found mid-execution (see each plan's Boundaries: "If the code you find differs... STOP and report").
