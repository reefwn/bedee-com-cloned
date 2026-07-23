# Replication Prompt — BeDee on Payload CMS

---

## 1. ROLE + AESTHETIC IDENTITY

**Role:** Act as a World-Class Senior Creative Technologist and Lead Frontend Engineer.

**Aesthetic Identity:** *Clinical Warmth / Hospital-Trust Digital Health*

This is not a startup-cool health app — it is the digital front door of Thailand's
largest hospital network. Every pixel should say "credentialed, warm, unhurried,"
never "disruptive" or "cutting-edge." One typeface. Big scale jumps. Flat color.
Real human photography. Motion that is functional, not expressive.

---

## 2. CORE DESIGN SYSTEM

*(This is a same-brand migration — the user's palette IS the reference palette.
No color reassignment; hex values below are transplanted directly from Site DNA
1.2, unchanged.)*

### Palette

| Semantic Name | Descriptive Word | Hex | Usage |
|---|---|---|---|
| Primary | Deep Blue | `#081F7C` | H1 headings, primary CTA button backgrounds, brand-serious copy |
| Secondary | BeDee Blue | `#317DF5` | Links, icon accents, active tab state |
| Tertiary | Slate Blue | `#455FA5` | H2 subheadings |
| Accent | Alert Coral | `#FF4C14` | Logo pill (bottom-right half), promo badges, urgency accents — used sparingly |
| Ink | Body Black | `#222222` | Nav links, default body copy |
| Muted | Meta Gray | `#666666` | Secondary/meta text (dates, view counts) |
| Background | Base White | `#FFFFFF` | Card backgrounds, text-on-color |
| Panel Tint 1 | Panel Blue | `#F4F8FF` | Network-logo strip section background |
| Panel Tint 2 | Panel Blue 2 | `#F4F7FC` | Health-mall promo section background |
| Footer BG | Footer Gray | `#F0F0F0` | Footer background |
| Overlay | Navy Scrim | `rgba(0,36,88,0.8)` | Photo gradient overlays |

**Logo mark:** capsule/pill icon, top-left half `#2B7FFF`, bottom-right half `#FF4C14` — this literal pill shape is the brand's core visual motif (health/medicine). Reuse it as a loading-state spinner or section-divider icon where appropriate, but never distort its proportions.

### Typography

| Role | Font Family | Weight | Size | Line-Height | Notes |
|---|---|---|---|---|---|
| Hero/Display | "Noto Sans Thai", sans-serif | 600 | 72px | 79.2px (1.1) | Use for hero slide headlines only |
| Heading (H2) | "Noto Sans Thai", sans-serif | 600 | 28px | 38px (1.36) | Section headings |
| Slide Heading (H3) | "Noto Sans Thai", sans-serif | 600 | 55px | 66px (1.2) | Carousel slide sub-headline |
| Body/Lede | "Noto Sans Thai", sans-serif | 500 | 18px | 27px (1.5) | Supporting paragraph copy |
| Nav/Label | "Noto Sans Thai", sans-serif | 500 | 16px | 24px (1.5) | Nav links, form labels |
| Button | "Noto Sans Thai", sans-serif | 500 | 15px | 15px (1.0) | All CTA pill buttons |

**⚑ Drama Ratio (preserved verbatim from Site DNA 1.2):** There is NO display/body
typeface pairing here — the entire visual hierarchy is carried by SCALE within a
single Thai humanist sans (Noto Sans Thai), not by font-family contrast or italics.
Hero H1 (72px/600) vs. body (18px/500) is a 4× size ratio with only one weight step
(500→600). **Do not introduce a second display typeface, serif, or italic accents.**
That would misrepresent this brand's clinical, utilitarian restraint. Load only Noto
Sans Thai, weights 500 and 600, Thai + Latin subsets.

### Texture System

- Noise/grain: none. Hero background uses a raster dot/wave PNG texture layered
  under a navy→blue gradient (not a CSS gradient mesh, not generated noise) —
  source the actual texture asset from the WordPress media library during migration.
- Border radius scale: `50px` (pill) — ALL buttons, search icon circle. `50%`
  (circle) — icon badges, avatar photos, floating widgets. `0px` — content/article
  cards (deliberately square-cornered).
- Shadow system: `box-shadow: none` on cards and buttons — flat color blocking is
  the norm. Exception: floating chat bubble + scroll-to-top button carry a soft
  default drop shadow (standard, not custom).

---

## 3. COMPONENT ARCHITECTURE

### Section 0 — Persistent Header — "The Static Sentinel"

Solid white, non-sticky, 80px. Logo left, primary nav center-right (5 top-level
items, 2 with dropdowns: บริการของเรา/Services, บทความ/Articles), search icon
right. Does NOT change on scroll — no color/size morph.

### Section 0b — "The Late-Arriving App Bar"

```
STATE MACHINE: Post-Scroll App Download Bar
Location: fixed top, above header, z-index above Section 0
Type: Toggle (2-state, scroll-position driven)
STATES:
  State A (hidden): not rendered / height 0, at scroll-y < hero height
  State B (visible): solid Primary Deep Blue #081F7C bar, BeDee icon + "ดาวน์โหลด"
    label + App Store badge + Google Play badge, pinned above header
INITIAL STATE: A
TRANSITION A→B:
  Trigger: scroll position passes bottom of hero section (~810px from top)
  Element 1: bar mounts/becomes visible — t=0ms opacity:0 → t=150ms opacity:1,
    DURATION:150ms EASING:ease-out (implementation default: source shows an
    instant class toggle with no measurable easing, so use CSS's own default
    transition timing rather than a bare hard-cut — do not read this 150ms as
    a forensic finding, it is a sane default for a discrete class toggle)
LOOP: none — one-way toggle, does not hide again on scroll-up in source
```

### Section 1 — Hero Carousel — "The Trust Collage Slider"

```
ANIMATION: Hero Slide Transition
Trigger: auto-interval (Swiper default) + manual arrow click
Library: any carousel lib (Swiper.js recommended, matches source)
TIMELINE: slide-to-slide is a translateX crossfade — no custom keyframe
  animation, no stagger on child elements. Text and image move as one unit.
  t=0ms: current slide at translateX(0%) → t=0–500ms: outgoing slide
  translateX(0%→-100%), incoming slide translateX(100%→0%), DURATION:500ms
  EASING:cubic-bezier(0.25,0.1,0.25,1) (Swiper.js library default — this is
  the framework's own default transition, not a bespoke value discovered on
  the source page; the source exposed no custom `speed`/`easing` config)
PROPERTIES ANIMATED: transform: translate3d(x)
LOOP: yes, infinite, auto-advance interval: 5000ms (Swiper default; no custom
  `autoplay.delay` attribute was found on the source markup)
```

Layout: full-bleed navy(`#081F7C`)→blue(`#317DF5`) diagonal gradient background
+ dot/wave texture image, 810px height, ~64px top padding / ~80px side padding.
2-column flex: text block 45% left (H3 headline, white; body copy, white, 18px/500),
photo-collage 55% right.

**COMPOSITION MAP — "The Circle of Care" (embed verbatim, content becomes
BeDee's own migrated photography, unchanged since same-brand):**

```
Element count: 11 distinct visual objects

CENTER:    Large photo circle — multi-generation family group, warm lighting,
           ~320px diameter, front-most z-index

BEHIND:    3 smaller overlapping photo circles fanned around center:
           (1) doctor examining child patient, top-left, ~180px
           (2) young couple/family portrait, top-right, ~160px
           (3) elderly man + caregiver, bottom, partially behind center
           Each with a thin white ring border separating it from the gradient.

FLANKING:  Solid navy circle badge, bottom-left of collage, white stethoscope
           icon glyph.

ABOVE:     Small rounded-square badge, top-right overlapping the couple photo,
           colorful health-app screenshot icon (~48px) representing the BeDee
           mobile app.

AMBIENT:   Background: linear-gradient navy→blue, diagonal, dot/wave raster
           texture at low opacity, right two-thirds of hero only.
```

### Section 2 — Service Grid — "The Four Doors"

```
┌──────────────────────────────────────────────────────────────────────┐
│   ⊙            ⊙            ⊙            ⊙                          │
│ ปรึกษาหมอ   ช้อปสินค้าสุขภาพ  ปรึกษาเภสัชกร  ช้อปแพ็กสุขภาพ            │
└──────────────────────────────────────────────────────────────────────┘
Layout system: Flexbox row, 4 equal columns, gap ~32px, center-aligned text
under each circular icon badge (~64px diameter)
```

4-up icon-card row, equal columns, background `linear-gradient(240deg, #F9F9F9 0%, #E5EDFF 100%)`, boxed container, 276px height. Cards: circular icon badge + label. Source items: ปรึกษาหมอ / ช้อปสินค้าสุขภาพ / ปรึกษาเภสัชกร / ช้อปแพ็กสุขภาพ (Consult Doctor / Shop Health Products / Consult Pharmacist / Shop Health Packages) — map 1:1 to Payload's `services` array field on the Home page document.

### Section 3 — Secondary Interest Grid — "The Three Extras"

```
┌──────────────────────────────────────────────────────────┐
│        ⊙                ⊙                ⊙              │
│   โพสต์ถามหมอ          บทความ           โปรโมชัน          │
└──────────────────────────────────────────────────────────┘
Layout system: Flexbox row, 3 equal columns, gap ~32px — identical card
component to Section 2, one fewer column
```

3-up icon-card row (Ask-a-Doctor community post / Articles / Promotions), transparent/white background, 234px height, same card component as Section 2 at 3-column instead of 4.

### Section 4 — Network Trust Strip — "The Hospital Wall"

```
┌──────────────────────────────────────────────────────────────────────┐
│              H2 line 1: "BeDee ให้บริการโดย BDMS"                    │
│              H2 line 2: "เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย" │
│  [BDMS] [Bangkok Hosp] [Samitivej] [BNH] [Phyathai] [Paolo] [Royal   │
│   Bangkok] [BDMS Wellness]                                          │
└──────────────────────────────────────────────────────────────────────┘
Layout system: centered heading block, then Flexbox row of 8 logo marks,
gap ~32px, wrap on narrow viewports, vertically centered
```

Solid `#F4F8FF` background, 286px height. 2-line H2 (`#455FA5`) + 8-item flex logo row, ~32px gap: BDMS, Bangkok Hospital, Samitivej, BNH Hospital, Phyathai, Paolo, Royal Bangkok Hospital, BDMS Wellness Clinic. Pull logo assets + names from a `partners`/`hospitals` collection, ordered by a `sortOrder` field.

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
  Element 1: card carousel content swaps dataset — instant display toggle,
    NO crossfade (do not add one; source has none)
  Element 2: tab underline/color moves A→B via CSS class swap
  Data logic: filter the Doctors collection by a `role` field (`doctor` |
    `pharmacist`) — this replaces the source's separate widget-per-tab with
    one Payload collection + a client-side filter
TRANSITION B→A: mirror of above
LOOP: user-controlled only
INTERNAL LAYOUT:
  Container: fixed-height card row, carousel arrows page horizontally
  Each card: circular avatar (~120px) + name + hospital/specialty label
```

Solid white background, 425px height. H2 + inline BDMS logo, "ดูทั้งหมด ›" pill CTA (bg Primary Deep Blue `#081F7C`, radius 50px, white text).

### Section 6 — Health-Mall Promo — "The Free-Ship Banner"

```
┌──────────────────────────────────────────────────┐
│           📦 สินค้าสุขภาพ  🚚(free-ship badge)     │
│                                                    │
│              [ ดูทั้งหมด › ]                       │
└──────────────────────────────────────────────────┘
Layout system: single centered flex column, heading+badge inline row on top,
CTA pill centered below, generous vertical whitespace (~64px above/below CTA)
```

Solid `#F4F7FC` background, 274px height. Centered emoji-style icon heading + free-shipping badge + single CTA pill. Links to the Products collection / external `shop.bedee.com` storefront per the tech-stack note below.

### Section 7 — Article Grid — "The Reading Room"

```
Layout system: 3-column grid/flex, equal width, gap ~32px
Card: 16:9 image, corner category badge (blue pill, white text, top-right of
  image) + small logo watermark bottom-left of image, 2-line-clamp title
  (Primary Deep Blue #081F7C, bold), "ดูทั้งหมด ›" pill CTA below grid
```

Transparent background with a curved SVG wave divider bleeding up from the section above (Section 6). 545px height. Pull the 3 most recent items from the Posts collection.

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
Layout system: Flexbox row, 5 columns (logo col wider), gap ~48px, border-top
hairline dividing link grid from copyright bar
```

Solid `#F0F0F0` background. Logo + tagline column (25% width) + 4 link columns (บริการของเรา/Services, บทความ/Articles, เกี่ยวกับเรา/About, กฎหมาย/Legal) + copyright bar + 3 social icons (Facebook, LINE, Instagram). Model as a Payload Global (`footer`) with a repeater of link-groups.

### Interaction Specs — "The Quiet Hover"

```
INTERACTION: Primary CTA Pill Button (e.g. "ดูทั้งหมด")
Selector hint: a.elementor-button equivalent
STATE         | background   | color   | transform | box-shadow | other
──────────────────────────────────────────────────────────────────────────
DEFAULT       | #081F7C      | #FFFFFF | scale(1)  | none       | radius:50px
HOVER         | #081F7C @ 90% opacity (standard browser/Elementor darken-on-
                hover default — source exposed no custom hover rule) | #FFFFFF | scale(1) | none | –
FOCUS         | #081F7C      | #FFFFFF | –         | 0 0 0 3px rgba(49,125,245,0.4) | visible focus ring for accessibility (source has none — add this; do not ship a button with no focus state)
MECHANISM: CSS transition, background-color/opacity only
DURATION: 200ms  EASING: ease
⚑ SPECIAL BEHAVIOR: none — this is a stock, undecorated button. Do not add a
  pseudo-element slide or clip-path reveal; that would misrepresent this
  brand's restraint (see Motion Philosophy, Site DNA 1.9).

INTERACTION: Top Nav Link
Selector hint: header nav a
STATE         | background | color    | transform | other
────────────────────────────────────────────────────────────────
DEFAULT       | transparent| #222222  | none      | –
HOVER         | transparent| #317DF5  | none      | color shifts to Secondary
                Blue only — no underline, no background change
MECHANISM: CSS color transition
DURATION: 150ms  EASING: ease
```

### Persistent Overlays — "The Two Floating Circles"

Fixed bottom-right: chat bubble (circular, `#2B7FFF`-range blue, opens external chat widget) stacked above a scroll-to-top button (circular white, up-arrow). Both always-visible, not scroll-triggered — implement as simple `position: fixed`, no IntersectionObserver needed.

---

## 4. TECHNICAL REQUIREMENTS

```
TECHNICAL REQUIREMENTS
  Stack:                Payload CMS 3.x (Node/TypeScript) as headless backend +
                         Next.js 15 (App Router) frontend, consuming Payload via
                         its Local API (same Next.js app, Payload's official
                         Next.js integration) — NOT a separate REST round-trip.
                         Tailwind CSS for styling. No component library needed
                         (source uses none beyond Elementor's own primitives).
  Database:              Postgres via Supabase, connected through Payload's
                         `@payloadcms/db-postgres` adapter.
  Animation:              CSS transitions only. NO GSAP, NO Framer Motion, NO
                         scroll library — confirmed absent on the source site
                         (Site DNA 1.4/1.8). Animation Intensity = 1–2/5: do not
                         add motion the source brand doesn't use.
  Scroll:                 Native browser scroll. One scroll-position class
                         toggle for the app-download bar (Section 0b) — plain
                         `window.scrollY` listener or a tiny IntersectionObserver
                         on a hero-bottom sentinel, nothing heavier.
  Animation Lifecycle:    Carousel(s) via Swiper React bindings; mount/unmount
                         cleanly with React's own lifecycle, no manual GSAP
                         context needed since there is no GSAP.
  Hover Implementation:  Standard CSS `:hover` transitions on buttons/nav —
                         no pseudo-element slide tricks detected in source.
  Custom Cursor:          N/A — none in source.
  Font Loading:           Self-host or Google Fonts "Noto Sans Thai", weights
                         500 + 600, Thai + Latin subsets, `font-display: swap`
                         (matches source's Elementor `font_display-swap` setting).
  Image Sources:          Migrate the ACTUAL WordPress media library (real
                         patient/doctor photography) — do not substitute Unsplash
                         placeholders; this is a same-brand migration, not a new
                         brand needing stock imagery. See plans/payload-content-model.md
                         for the media migration plan.
  Deployment:              Next.js + Payload app on Vercel; Postgres on Supabase;
                         Payload's file-storage adapter pointed at Vercel Blob or
                         Supabase Storage (not local disk — Vercel's filesystem
                         is ephemeral). See plans/payload-content-model.md for
                         full deployment config.
```

---

## 5. EXECUTION DIRECTIVE

*Build this like a hospital lobby, not a landing page — every element should make a stressed visitor feel like someone credentialed is already taking care of them.*
