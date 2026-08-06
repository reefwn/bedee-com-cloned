---
name: BeDee
description: Powered by BDMS — Thailand's largest hospital network, digitized
colors:
  primary: "#081F7C"
  secondary: "#317DF5"
  tertiary: "#455FA5"
  accent: "#FF4C14"
  ink: "#222222"
  muted: "#666666"
  base-white: "#FFFFFF"
  panel-1: "#F4F8FF"
  panel-2: "#F4F7FC"
  footer-bg: "#F0F0F0"
  overlay-scrim: "rgba(0,36,88,0.8)"
typography:
  display:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "72px"
    fontWeight: 600
    lineHeight: 1.1
  slide-heading:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "55px"
    fontWeight: 600
    lineHeight: 1.2
  headline:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.36
  body:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  button:
    fontFamily: '"Noto Sans Thai", sans-serif'
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0px"
  pill: "50px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "48px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.base-white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.secondary}"
  card-article:
    backgroundColor: "{colors.base-white}"
    rounded: "{rounded.none}"
  icon-badge:
    backgroundColor: "{colors.panel-1}"
    rounded: "{rounded.circle}"
---

# Design System: BeDee

## Overview

**Creative North Star: "Clinical Warmth / Hospital-Trust Digital Health"**

BeDee is the digital front door of BDMS, Thailand's largest private hospital network — not a startup-cool health app. Every surface should read as credentialed, warm, and unhurried, never "disruptive" or "cutting-edge." The system carries hierarchy through scale and color blocking rather than typographic contrast: one Thai humanist sans typeface, flat color throughout, real human photography instead of illustration or stock abstraction, and motion that is functional (state changes, carousel advance) rather than expressive (no scroll reveals, no easing flourishes, no cinematic transitions).

This is a same-brand migration — the palette, type scale, and component behavior below are transplanted directly from the live bedee.com and confirmed as the reference, not proposed as a redesign. Confirmed rejections: no second display typeface, no serif, no italics, no drop shadows on cards or buttons, no GSAP/scroll-triggered animation library, no custom cursor, no pseudo-element hover tricks.

**Key Characteristics:**
- Single typeface (Noto Sans Thai), hierarchy carried entirely by size and weight (two weights only: 500, 600).
- Flat color blocking — no shadows, no gradients except the hero's navy→blue background.
- Real photography, circular-crop treatment, warm lighting — never stock-abstract.
- Pill-shaped buttons and circular badges are the system's signature geometry; content cards stay deliberately square.
- Motion is a state-change signal (tab swap, carousel advance, scroll-triggered app bar), never a spectacle.

## Colors

Flat, low-saturation blues carry brand and hierarchy; one warm coral accent is spent sparingly on urgency/promo moments only.

### Primary
- **Deep Blue** (`#081F7C`): H1/display headings, primary CTA button backgrounds, brand-serious copy. The color of institutional weight.

### Secondary
- **BeDee Blue** (`#317DF5`): Links, icon accents, active tab state, nav-link hover color.

### Tertiary
- **Slate Blue** (`#455FA5`): H2 subheadings (notably the BDMS network-trust section heading).

### Accent
- **Alert Coral** (`#FF4C14`): Logo pill's bottom-right half, promo badges, urgency accents. Used sparingly — this is the one warm note in an otherwise cool, clinical palette.

### Neutral
- **Body Black** (`#222222`): Default body copy, nav links at rest.
- **Meta Gray** (`#666666`): Secondary/meta text — dates, view counts, captions.
- **Base White** (`#FFFFFF`): Card backgrounds, text-on-color.
- **Panel Blue** (`#F4F8FF`): Network-logo-strip section background.
- **Panel Blue 2** (`#F4F7FC`): Health-mall promo section background.
- **Footer Gray** (`#F0F0F0`): Footer background.
- **Navy Scrim** (`rgba(0,36,88,0.8)`): Gradient overlay on photography where text sits on top of an image.

### Named Rules
**The One Typeface Rule.** There is no display/body typeface pairing. The entire visual hierarchy is carried by scale within a single Thai humanist sans — never introduce a second family, a serif, or italics to "add" hierarchy.

**The Sparing Coral Rule.** Alert Coral is a signal color, not a decoration. It appears on the logo mark, promo badges, and urgency accents only — never as a section background, a body-text color, or a decorative fill.

## Typography

**Display/Body Font:** "Noto Sans Thai", sans-serif (self-hosted or Google Fonts, weights 500 + 600 only, Thai + Latin subsets, `font-display: swap`)

**Character:** Utilitarian and restrained. Weight barely moves (500→600); the entire dramatic range is scale.

### Hierarchy
- **Display** (600, 72px, 1.1 line-height): Hero slide headlines only. Never reused for in-page section headings.
- **Slide Heading** (600, 55px, 1.2): Carousel slide sub-headline, when a slide needs a secondary line under the display headline.
- **Headline** (600, 28px, 1.36): Section H2s across the page (service grid, network-trust strip, expert-tabs heading, article-grid heading).
- **Body** (500, 18px, 1.5): Supporting paragraph copy, hero body text.
- **Label** (500, 16px, 1.5): Nav links, form labels.
- **Button** (500, 15px, 1.0): All CTA pill button text.

### Named Rules
**The Drama Ratio Rule.** Hero display (72px/600) vs. body (18px/500) is a 4× size jump carried by only one weight step. Do not compress this ratio by shrinking display type or inflating body type — the size jump *is* the brand's sense of authority, and softening it reads as generic SaaS rather than hospital-grade.

## Layout

Centered container, `max-w-5xl`/`max-w-6xl` depending on section, `px-6` gutter at mobile widening to `px-8`–`px-20` at desktop. Section rhythm runs in large fixed vertical bands (274px–810px per section on the source homepage) rather than fluid content-driven height — sections are designed as discrete "rooms," not a continuously flowing scroll.

Grid sections (service icon grid, secondary interest grid, network-trust logos) use flexbox rows with generous gaps (`gap-8`, ~32px) that wrap to 2-column on mobile before collapsing further. Header is fixed-height (80px), non-sticky, and never changes on scroll — no shrink-on-scroll or color-morph header pattern.

### Named Rules
**The Static Sentinel Rule.** The primary header never changes on scroll — no size, color, or shadow morph. If a scroll-driven UI element is needed (e.g. an app-download bar), it appears as a *separate* bar above the header, not as a transformation of the header itself.

## Elevation & Depth

Flat by design — `box-shadow: none` on every card and button. This is a deliberate clinical/utilitarian choice, not an oversight: depth is conveyed by color-block contrast (white cards on tinted panel backgrounds) rather than shadow. The only exceptions are the floating chat bubble and scroll-to-top button, which carry a standard (not custom) drop shadow because they're persistent overlays that need to visually separate from arbitrary page content beneath them.

### Named Rules
**The Flat-By-Default Rule.** Shadows are reserved for persistent floating overlays only (chat bubble, scroll-to-top). Cards, buttons, panels, and nav dropdowns stay flat or use a hairline border/background-tint instead of a shadow.

## Shapes

Three deliberate radius values, each tied to a specific role — this is not an arbitrary scale:

- **`50px` (pill):** All buttons, the search-icon circle. The system's primary "interactive" signifier.
- **`50%` (circle):** Icon badges, avatar/doctor photos, the logo's own pill-of-two-halves mark, floating overlay widgets.
- **`0px` (square):** Content and article cards — deliberately square-cornered, a conscious contrast against the pill/circle language used everywhere else.

### Named Rules
**The Two-Shape Rule.** Round (pill or circle) means "interactive or human" — buttons, badges, avatars. Square means "content" — cards, article thumbnails. Don't blur the two: rounding a content card or squaring a button both break the system's implicit affordance language.

## Components

### Buttons
- **Shape:** Pill (`border-radius: 50px`).
- **Primary:** Background Deep Blue (`#081F7C`), white text, `padding: 12px 24px`, button-scale type (15px/500).
- **Hover:** Background drops to ~90% opacity (a standard darken-on-hover, not a custom color swap) — `transition: opacity 200ms ease`.
- **Focus:** Visible focus ring, `box-shadow: 0 0 0 3px rgba(49,125,245,0.4)` — the source has no focus state; this ring is a required accessibility addition, not an aesthetic option.

### Cards (Article / Content)
- **Corner Style:** Square (`0px` radius) — see the Two-Shape Rule.
- **Background:** White on a white or tinted-panel section.
- **Shadow Strategy:** None (see Elevation & Depth).
- **Border:** None; separation comes from image + whitespace, not a stroke.

### Icon Badges
- **Style:** Circular icon container, ~64px diameter, sits above a label in a centered card.
- **Background:** Transparent or a soft panel tint depending on section.

### Navigation
- **Style:** Solid white, 80px height, non-sticky, never morphs on scroll (see The Static Sentinel Rule).
- **Default:** Transparent background, Body Black (`#222222`) text.
- **Hover:** Color shifts to BeDee Blue (`#317DF5`) only — no underline, no background change. `transition: color 150ms ease`.
- **Dropdown (children):** White panel, soft shadow, appears on hover/focus of the parent item — this is the one place a shadow is acceptable outside the persistent-overlay exception, since it's a transient overlay panel rather than a resting surface.

### Doctor/Pharmacist Expert Cards
- **Style:** Circular avatar (~120px), name + specialty label beneath, arranged in a horizontally-scrollable row with carousel arrows.
- **Tab switch:** Instant dataset swap on click — no crossfade. This mirrors the source exactly; do not add a transition here.

## Do's and Don'ts

### Do:
- **Do** carry all hierarchy through type scale and color, never through a second typeface or italics (The One Typeface Rule).
- **Do** keep cards and buttons flat (`box-shadow: none`); reserve shadow for persistent floating overlays and transient dropdown panels only (The Flat-By-Default Rule).
- **Do** use pill/circle shapes for anything interactive or human (buttons, avatars, badges) and square corners for content cards (The Two-Shape Rule).
- **Do** spend Alert Coral (`#FF4C14`) sparingly — logo, promo badges, urgency accents only (The Sparing Coral Rule).
- **Do** use real migrated photography (circular-crop treatment, warm lighting) — never stock-abstract or illustrated imagery.
- **Do** keep the header static on scroll; introduce scroll-driven elements as separate bars, not header transformations (The Static Sentinel Rule).
- **Do** give every interactive element a visible focus ring even where the source site lacks one — this is a required accessibility floor, not optional polish.

### Don't:
- **Don't** introduce a second display typeface, a serif, or italic accents — it misrepresents this brand's clinical restraint (The Drama Ratio Rule).
- **Don't** add scroll-triggered reveals, GSAP/Framer-Motion timelines, custom cursors, or pseudo-element hover slide/reveal tricks — the source brand's motion budget is functional-only (state changes, carousel advance), never expressive.
- **Don't** crossfade the doctor/pharmacist tab switch or the section-6→7 wave divider transition — the source uses instant swaps and static SVG dividers; adding motion here misrepresents the brand's restraint.
- **Don't** round the corners of article/content cards, or square off a button — both break the round-means-interactive / square-means-content language.
- **Don't** substitute Unsplash or stock imagery for real BeDee/BDMS photography, even as a placeholder — this is a same-brand migration with real assets available.
