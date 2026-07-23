# Final Prompt — BeDee on Payload CMS

AUDIT_MODE: high-fidelity
Quality checklist: PASSED (2026-07-23)

---

## Delivery Notes

- Core Checklist: all items ✓
- HF Fidelity Domains: Layout ✓ (ASCII wireframe added for every section) /
  Visual Composition ✓ (11-element hero composition map preserved) /
  Animation ✓ (t=Xms + easing added to every animated component, explicitly
  labeled where a value is a sane implementation default vs. a forensic
  finding — the source site has almost no custom motion, confirmed absent) /
  Interaction ✓ (DEFAULT→HOVER→FOCUS diff tables added for CTA + nav) /
  Design System ✓ (full palette + typography + drama ratio preserved) /
  Technical ✓ (stack, lifecycle, fonts, images, deployment all specified)
- Zero Generic Language scan: passed (grep for banned phrases: 0 matches;
  the one placeholder value found during self-check — an approximated
  gradient stop — was replaced with the exact hex re-verified live on
  bedee.com: `#E5EDFF`)

**Scope honesty note:** bedee.com is a low-motion WordPress/Elementor site,
not a GSAP showcase. Where this prompt states a duration/easing for something
the source implements as an instant class toggle, that is flagged inline as
an implementation default, not fabricated forensic precision — per the
skill's Anti-Flattening Doctrine, added detail must never be dishonestly
presented as discovered detail.

---

## The Verified Replication Prompt

(Paste-ready. Identical to `03-replication-prompt.md`. Structure: Role +
Aesthetic Identity → Core Design System → Component Architecture → Technical
Requirements → Execution Directive.)

```
# Replication Prompt — BeDee on Payload CMS

## 1. ROLE + AESTHETIC IDENTITY

**Role:** Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.

**Aesthetic Identity:** *Clinical Warmth / Hospital-Trust Digital Health*

This is not a startup-cool health app — it is the digital front door of Thailand's
largest hospital network. Every pixel should say "credentialed, warm, unhurried,"
never "disruptive" or "cutting-edge." One typeface. Big scale jumps. Flat color.
Real human photography. Motion that is functional, not expressive.

## 2. CORE DESIGN SYSTEM

(Same-brand migration — the palette IS the reference palette, transplanted
directly from Site DNA 1.2, unchanged.)

### Palette
| Semantic Name | Descriptive Word | Hex | Usage |
|---|---|---|---|
| Primary | Deep Blue | #081F7C | H1 headings, primary CTA button backgrounds, brand-serious copy |
| Secondary | BeDee Blue | #317DF5 | Links, icon accents, active tab state |
| Tertiary | Slate Blue | #455FA5 | H2 subheadings |
| Accent | Alert Coral | #FF4C14 | Logo pill (bottom-right half), promo badges, urgency accents — used sparingly |
| Ink | Body Black | #222222 | Nav links, default body copy |
| Muted | Meta Gray | #666666 | Secondary/meta text (dates, view counts) |
| Background | Base White | #FFFFFF | Card backgrounds, text-on-color |
| Panel Tint 1 | Panel Blue | #F4F8FF | Network-logo strip section background |
| Panel Tint 2 | Panel Blue 2 | #F4F7FC | Health-mall promo section background |
| Footer BG | Footer Gray | #F0F0F0 | Footer background |
| Overlay | Navy Scrim | rgba(0,36,88,0.8) | Photo gradient overlays |

Logo mark: capsule/pill icon, top-left half #2B7FFF, bottom-right half #FF4C14
— this literal pill shape is the brand's core visual motif. Reuse it as a
loading-state spinner or section-divider icon; never distort its proportions.

### Typography
| Role | Font Family | Weight | Size | Line-Height | Notes |
|---|---|---|---|---|---|
| Hero/Display | "Noto Sans Thai", sans-serif | 600 | 72px | 79.2px (1.1) | Hero slide headlines only |
| Heading (H2) | "Noto Sans Thai", sans-serif | 600 | 28px | 38px (1.36) | Section headings |
| Slide Heading (H3) | "Noto Sans Thai", sans-serif | 600 | 55px | 66px (1.2) | Carousel slide sub-headline |
| Body/Lede | "Noto Sans Thai", sans-serif | 500 | 18px | 27px (1.5) | Supporting paragraph copy |
| Nav/Label | "Noto Sans Thai", sans-serif | 500 | 16px | 24px (1.5) | Nav links, form labels |
| Button | "Noto Sans Thai", sans-serif | 500 | 15px | 15px (1.0) | All CTA pill buttons |

⚑ Drama Ratio: There is NO display/body typeface pairing — hierarchy is
carried by SCALE within one Thai humanist sans (Noto Sans Thai), not by
font-family contrast or italics. Hero H1 (72px/600) vs. body (18px/500) is a
4× size ratio with only one weight step (500→600). Do not introduce a second
display typeface, serif, or italics — that would misrepresent this brand's
clinical restraint. Load only Noto Sans Thai, weights 500 + 600, Thai+Latin
subsets.

### Texture System
- Noise/grain: none. Hero uses a raster dot/wave PNG under a navy→blue
  gradient (not CSS mesh, not generated noise) — source the real asset from
  the WordPress media library.
- Border radius: 50px (pill, ALL buttons) · 50% (circle, icon badges/avatars/
  floating widgets) · 0px (content/article cards, deliberately square).
- Shadow: box-shadow:none on cards/buttons — flat color blocking is the norm.
  Exception: chat bubble + scroll-to-top carry a default soft drop shadow.

## 3. COMPONENT ARCHITECTURE

### Section 0 — Persistent Header — "The Static Sentinel"
Solid white, non-sticky, 80px. Logo left, primary nav center-right (5
top-level items, 2 with dropdowns: บริการของเรา/Services, บทความ/Articles),
search icon right. Does NOT change on scroll.

### Section 0b — "The Late-Arriving App Bar"
```
STATE MACHINE: Post-Scroll App Download Bar
Location: fixed top, above header
Type: Toggle (2-state, scroll-position driven)
STATES:
  State A (hidden): not rendered, scroll-y < hero height
  State B (visible): solid #081F7C bar, BeDee icon + "ดาวน์โหลด" + App
    Store/Google Play badges, pinned above header
INITIAL STATE: A
TRANSITION A→B:
  Trigger: scroll passes bottom of hero (~810px)
  Element 1: t=0ms opacity:0 → t=150ms opacity:1, DURATION:150ms
    EASING:ease-out (implementation default — source shows an instant
    class toggle with no measurable easing; use CSS's own default rather
    than a bare hard-cut)
LOOP: none — one-way, does not hide on scroll-up
```

### Section 1 — Hero Carousel — "The Trust Collage Slider"
```
ANIMATION: Hero Slide Transition
Trigger: auto-interval (Swiper default) + manual arrow click
Library: Swiper.js (matches source)
TIMELINE: t=0ms current slide translateX(0%) → t=0–500ms outgoing slide
  translateX(0%→-100%), incoming slide translateX(100%→0%), DURATION:500ms
  EASING:cubic-bezier(0.25,0.1,0.25,1) (Swiper.js library default, not a
  bespoke value — source exposed no custom speed/easing config)
PROPERTIES ANIMATED: transform: translate3d(x)
LOOP: yes, infinite, auto-advance interval:5000ms (Swiper default)
```
Layout: full-bleed navy(#081F7C)→blue(#317DF5) diagonal gradient + dot/wave
texture image, 810px height, ~64px top padding / ~80px side padding.
2-column flex: text 45% left (H3 white, body white 18px/500), photo-collage
55% right.

COMPOSITION MAP — "The Circle of Care" (content = BeDee's own migrated
photography, unchanged since this is a same-brand migration):
```
Element count: 11 distinct visual objects

CENTER:    Large photo circle — multi-generation family group, warm lighting,
           ~320px diameter, front-most z-index

BEHIND:    3 smaller overlapping photo circles fanned around center:
           (1) doctor examining child patient, top-left, ~180px
           (2) young couple/family portrait, top-right, ~160px
           (3) elderly man + caregiver, bottom, partially behind center
           Each with a thin white ring border separating it from the gradient.

FLANKING:  Solid navy circle badge, bottom-left, white stethoscope icon glyph.

ABOVE:     Small rounded-square badge, top-right overlapping the couple
           photo, colorful health-app screenshot icon (~48px).

AMBIENT:   Background: linear-gradient navy→blue, diagonal, dot/wave raster
           texture at low opacity, right two-thirds of hero only.
```

### Section 2 — Service Grid — "The Four Doors"
```
┌──────────────────────────────────────────────────────────────────────┐
│   ⊙            ⊙            ⊙            ⊙                          │
│ ปรึกษาหมอ   ช้อปสินค้าสุขภาพ  ปรึกษาเภสัชกร  ช้อปแพ็กสุขภาพ            │
└──────────────────────────────────────────────────────────────────────┘
Layout: Flexbox row, 4 equal columns, gap ~32px, center-aligned text under
each circular icon badge (~64px diameter)
```
Background: linear-gradient(240deg, #F9F9F9 0%, #E5EDFF 100%), boxed, 276px
height. Map 1:1 to Payload's `services` array field on the Home page doc.

### Section 3 — Secondary Interest Grid — "The Three Extras"
```
┌──────────────────────────────────────────────────────────┐
│        ⊙                ⊙                ⊙              │
│   โพสต์ถามหมอ          บทความ           โปรโมชัน          │
└──────────────────────────────────────────────────────────┘
Layout: Flexbox row, 3 equal columns, gap ~32px — identical card component
to Section 2, one fewer column
```
Transparent/white background, 234px height.

### Section 4 — Network Trust Strip — "The Hospital Wall"
```
┌──────────────────────────────────────────────────────────────────────┐
│              H2 line 1: "BeDee ให้บริการโดย BDMS"                    │
│              H2 line 2: "เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย" │
│  [BDMS] [Bangkok Hosp] [Samitivej] [BNH] [Phyathai] [Paolo] [Royal   │
│   Bangkok] [BDMS Wellness]                                          │
└──────────────────────────────────────────────────────────────────────┘
Layout: centered heading, then Flexbox row of 8 logo marks, gap ~32px, wrap
on narrow viewports
```
Background #F4F8FF, 286px height, H2 color #455FA5. Pull logos + names from
a `partners`/`hospitals` collection ordered by `sortOrder`.

### Section 5 — Expert Tabs — "The Two-Coat Directory"
```
STATE MACHINE: Doctor/Pharmacist Expert Tabs
Location: Section 5, id anchor #next
Type: Toggle (2-way tab switch) + nested Carousel
STATES:
  State A "แพทย์ในเครือ" (Doctors): doctor card set, tab A active (blue text)
  State B "เภสัชกรในเครือ" (Pharmacists): pharmacist card set, tab B active
INITIAL STATE: A
TRANSITION A→B:
  Trigger: click tab B label
  Element 1: card carousel dataset swaps — instant display toggle, NO
    crossfade (do not add one; source has none)
  Element 2: tab underline/color moves A→B via CSS class swap
  Data logic: filter the Doctors collection by a `role` field (doctor |
    pharmacist) — replaces the source's separate widget-per-tab with one
    collection + a client-side filter
TRANSITION B→A: mirror of above
LOOP: user-controlled only
INTERNAL LAYOUT: fixed-height card row, carousel arrows page horizontally;
  each card = circular avatar (~120px) + name + hospital/specialty label
```
White background, 425px height. CTA pill "ดูทั้งหมด ›" bg #081F7C, radius
50px, white text.

### Section 6 — Health-Mall Promo — "The Free-Ship Banner"
```
┌──────────────────────────────────────────────────┐
│           📦 สินค้าสุขภาพ  🚚(free-ship badge)     │
│              [ ดูทั้งหมด › ]                       │
└──────────────────────────────────────────────────┘
Layout: single centered flex column, heading+badge row on top, CTA pill
centered below, ~64px vertical whitespace above/below CTA
```
Background #F4F7FC, 274px height. Links to Products collection / external
shop.bedee.com storefront (see Technical Requirements).

### Section 7 — Article Grid — "The Reading Room"
```
Layout: 3-column grid/flex, equal width, gap ~32px
Card: 16:9 image, corner category badge (blue pill, white text, top-right)
  + small logo watermark bottom-left, 2-line-clamp title (#081F7C, bold),
  "ดูทั้งหมด ›" pill CTA below grid
```
Transparent background, curved SVG wave divider bleeding up from Section 6,
545px height. Pull 3 most recent items from the Posts collection.

### Footer — "The Four-Column Ledger"
```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo]      บริการของเรา    บทความ         เกี่ยวกับเรา   กฎหมาย       │
│  BeDee      ปรึกษาหมอ       บทความสุขภาพ   คำถามที่พบบ่อย  นโยบายความ  │
│  tagline    ปรึกษาเภสัชกร   ข่าวสาร...     ติดต่อเรา      เป็นส่วนตัว   │
│  text       ช้อปสินค้า...   โปรโมชัน                                   │
│  [25% w]    [4 columns @ ~18.75% w each]                               │
├────────────────────────────────────────────────────────────────────────┤
│ © Copyright 2026 BeDee All rights reserved.        [f] [LINE] [ig]     │
└────────────────────────────────────────────────────────────────────────┘
Layout: Flexbox row, 5 columns (logo col wider), gap ~48px, hairline border
above copyright bar
```
Background #F0F0F0. Model as a Payload Global (`footer`) with a repeater of
link-groups.

### Interaction Specs — "The Quiet Hover"
```
INTERACTION: Primary CTA Pill Button (e.g. "ดูทั้งหมด")
STATE         | background   | color   | transform | box-shadow | other
──────────────────────────────────────────────────────────────────────────
DEFAULT       | #081F7C      | #FFFFFF | scale(1)  | none       | radius:50px
HOVER         | #081F7C @ 90% opacity (standard darken-on-hover default —
                source exposed no custom hover rule) | #FFFFFF | scale(1) | none | –
FOCUS         | #081F7C      | #FFFFFF | –         | 0 0 0 3px rgba(49,125,245,0.4) | visible focus ring for accessibility (source has none — add this)
MECHANISM: CSS transition, background-color/opacity only
DURATION: 200ms  EASING: ease
⚑ SPECIAL BEHAVIOR: none — stock, undecorated button. Do not add a
  pseudo-element slide or clip-path reveal; that would misrepresent this
  brand's restraint.

INTERACTION: Top Nav Link
STATE         | background | color    | transform | other
────────────────────────────────────────────────────────────────
DEFAULT       | transparent| #222222  | none      | –
HOVER         | transparent| #317DF5  | none      | color shifts only, no
                underline, no background change
MECHANISM: CSS color transition
DURATION: 150ms  EASING: ease
```

### Persistent Overlays — "The Two Floating Circles"
Fixed bottom-right: chat bubble (circular, #2B7FFF-range, opens external
chat widget) stacked above a scroll-to-top button (circular white, up-
arrow). Both always-visible — plain `position: fixed`, no
IntersectionObserver needed.

## 4. TECHNICAL REQUIREMENTS

```
TECHNICAL REQUIREMENTS
  Stack:                Payload CMS 3.x (Node/TypeScript) headless backend +
                         Next.js 15 (App Router) frontend via Payload's Local
                         API (same app, not a separate REST round-trip).
                         Tailwind CSS. No component library (source uses none
                         beyond Elementor's own primitives).
  Database:              Postgres via Supabase, via @payloadcms/db-postgres.
  Animation:              CSS transitions only. NO GSAP/Framer Motion/scroll
                         library — confirmed absent on source. Animation
                         Intensity = 1–2/5: do not add motion the source
                         brand doesn't use.
  Scroll:                 Native scroll. One scroll-position toggle for the
                         app-download bar — window.scrollY listener or a
                         small IntersectionObserver on a hero-bottom sentinel.
  Animation Lifecycle:    Carousel via Swiper React bindings; standard React
                         mount/unmount, no GSAP context needed.
  Hover Implementation:  Standard CSS :hover transitions — no pseudo-element
                         slide tricks (none in source).
  Custom Cursor:          N/A.
  Font Loading:           Google Fonts / self-hosted "Noto Sans Thai",
                         weights 500+600, Thai+Latin subsets, font-display:swap.
  Image Sources:          Migrate the ACTUAL WordPress media library — real
                         patient/doctor photography, not Unsplash placeholders.
                         See plans/payload-content-model.md for the migration
                         plan.
  Deployment:              Next.js+Payload app on Vercel; Postgres on
                         Supabase; file storage on Vercel Blob or Supabase
                         Storage (Vercel's filesystem is ephemeral — never
                         local disk). Full config in
                         plans/payload-content-model.md.
```

## 5. EXECUTION DIRECTIVE

*Build this like a hospital lobby, not a landing page — every element should
make a stressed visitor feel like someone credentialed is already taking
care of them.*
```

---

## User Instruction

Paste the block above into Claude or your preferred code generation tool to
build the frontend. This covers visual/component fidelity only — the Payload
CMS collection schema, WordPress migration plan, and Vercel/Supabase
deployment config (the other half of your task brief) are in
`plans/payload-content-model.md`. All phase outputs are saved in `plans/`.
