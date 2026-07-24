# Site DNA — BeDee (https://www.bedee.com)

AUDIT_MODE: standard

**Scope note:** Standard Mode was revalidated against the live desktop homepage on
2026-07-24. The current page still exposes eight top-level Elementor containers
(including one desktop-hidden section) in the same order documented below.
The existing structured artifacts are retained because they are more precise than
the Standard Mode minimum. Where an effect is a stock Elementor/Swiper behavior
with no bespoke easing curve exposed in computed styles, that is stated explicitly
rather than fabricating false precision.

---

## 1.1 — PAGE ARCHITECTURE

Total top-level sections on homepage: **8** (plus sticky header, sticky post-scroll app-download bar, footer, floating chat + scroll-to-top widgets)
Section-identification strategy used: top-level `.e-con` (Elementor flexbox container) children of `.elementor-3567` — site does not use `<section>` tags; Elementor 3.3x renders flex containers (`e-con`/`e-con-full`/`e-con-boxed`) instead of legacy `.elementor-section`.

```
╔════════════════════════════════════════════════════════════════════════╗
║  STICKY HEADER (fixed, z-top)          HEIGHT: 80px                    ║
║  BG: #FFFFFF   LOGO left / nav center-right / search icon right        ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 1: Hero Swiper Carousel        HEIGHT: 810px                  ║
║  BG: blue gradient (navy→mid-blue) + dot-wave texture image, full-bleed║
║  LAYOUT: 2-col (text-left 45% / circular photo-collage-right 55%)      ║
║  Prev/Next arrows both edges — Swiper/Slick carousel, 1 of N slides    ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 2: "บริการจาก BeDee" service icon grid   HEIGHT: 276px        ║
║  BG: linear-gradient(240deg, #F9F9F9 0%, #E5EDFF 100%), boxed container║
║  LAYOUT: 4-up icon-card row (circle icon + label), equal columns       ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 3: "สิ่งน่าสนใจอื่นๆ" secondary icon grid  HEIGHT: 234px       ║
║  BG: transparent/white, boxed container                                ║
║  LAYOUT: 3-up icon-card row (Ask-Doctor / Articles / Promotions)        ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 4: BDMS network hospital logo strip       HEIGHT: 286px       ║
║  BG: solid #F4F8FF, boxed container                                    ║
║  LAYOUT: heading (2-line) + 8-up flex logo row (BDMS,Bangkok Hospital,  ║
║  Samitivej,BNH,Phyathai,Paolo,Royal Bangkok,BDMS Wellness)             ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 5: Doctors/Pharmacists expert tabs        HEIGHT: 425px       ║
║  BG: solid #FFFFFF, id="next" anchor target                            ║
║  LAYOUT: heading+BDMS logo inline / 2-way TAB TOGGLE (แพทย์ในเครือ ↔    ║
║  เภสัชกรในเครือ) / expert card carousel / "ดูทั้งหมด" CTA pill button   ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 6: Health products cross-sell   HEIGHT: 0px (elementor-hidden ║
║  on this viewport — conditionally hidden / likely mobile-only or A/B)  ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 7: "สินค้าสุขภาพ" health-mall promo       HEIGHT: 274px       ║
║  BG: solid #F4F7FC                                                      ║
║  LAYOUT: centered emoji-icon heading + free-shipping badge + CTA pill  ║
╠════════════════════════════════════════════════════════════════════════╣
║  SECTION 8: "บทความน่าสนใจจาก BeDee" article grid  HEIGHT: 545px       ║
║  BG: transparent, curved/wave SVG divider bleeding from section above  ║
║  LAYOUT: heading + 3-up article card grid + "ดูทั้งหมด" CTA pill        ║
╠════════════════════════════════════════════════════════════════════════╣
║  FOOTER                                  HEIGHT: auto                  ║
║  BG: #F0F0F0                                                            ║
║  LAYOUT: logo+tagline col (25%) / 4× link columns (บริการของเรา /      ║
║  บทความ / เกี่ยวกับเรา / กฎหมาย) / copyright bar + social icons        ║
╚════════════════════════════════════════════════════════════════════════╝

PERSISTENT OVERLAYS (not in scroll flow):
  - Post-scroll sticky top bar: solid #1E3A8A-range blue, BeDee app icon +
    "ดาวน์โหลด" + App Store / Google Play badges. Appears once hero scrolls
    past viewport, pins above main header.
  - Floating chat bubble: bottom-right, circular, blue (#2B7FFF-range), fixed.
  - Floating scroll-to-top button: bottom-right, circular white w/ up-arrow,
    fixed, stacked above chat bubble.
```

OVERLAPPING sections: The article-grid section (8) has a curved/wave SVG shape bleeding upward into the health-mall promo section (7) — a decorative divider, not a content overlap. Section 6 collapses to 0px height (`elementor-hidden` class) at desktop 1440px viewport — confirmed via computed style, likely a responsive-visibility toggle rather than true content.

---

## 1.2 — DESIGN TOKENS

```
PALETTE (sampled via getComputedStyle color/backgroundColor/borderColor sweep, ranked by usage frequency):
  Primary Navy      "Deep Blue":     #081F7C   → H1 headings, primary CTA buttons, brand-serious copy
  Primary Blue      "BeDee Blue":    #317DF5   → links, icon accents, active tab state
  Secondary Blue     "Slate Blue":    #455FA5   → H2 subheadings
  Ink                "Body Black":    #222222 / #000000 → nav links, body copy default
  Muted Gray         "Meta Gray":     #666666   → secondary/meta text (dates, view counts)
  Slate               "Cool Gray":    #323A43   / #55616E → card meta, captions
  White               "Base":         #FFFFFF   → text-on-color, card backgrounds
  Accent Orange       "Alert Coral":  #FF4C14   → promo badges, urgency accents (used sparingly — logo's orange pill half)
  Surface Blue-Tint 1 "Panel Blue":   #F4F8FF   → section 4 background
  Surface Blue-Tint 2 "Panel Blue 2": #F4F7FC   → section 7 background
  Footer Gray         "Footer BG":    #F0F0F0   → footer background
  Overlay Navy         (translucent): rgba(0,36,88,0.8) → image overlays / gradient scrims on hero photos

  LOGO COLORS: capsule/pill icon is split — top-left half #2B7FFF (bright blue),
  bottom-right half #FF4C14 (orange) — a literal pill/capsule shape, doubling as
  the brand mark. Wordmark "BeDee" in Deep Blue #081F7C, tagline "Powered by BDMS"
  in smaller gray/blue beneath.

TYPOGRAPHY SCALE (single typeface for the entire site — no serif/display pairing):
  Role       | Font Family                    | Weight | Size  | Tracking | Line-Height | Style
  ─────────────────────────────────────────────────────────────────────────────────────────────
  H1 (Hero)  | "Noto Sans Thai", sans-serif   | 600    | 72px  | normal   | 79.2px (1.1)| normal
  H2 (Section)| "Noto Sans Thai", sans-serif  | 600    | 28px  | normal   | 38px (1.36) | normal
  H3 (Slide) | "Noto Sans Thai", sans-serif   | 600    | 55px  | normal   | 66px (1.2)  | normal
  Body/Lede  | "Noto Sans Thai", sans-serif   | 500    | 18px  | normal   | 27px (1.5)  | normal
  Nav/Label  | "Noto Sans Thai", sans-serif   | 500    | 16px  | normal   | 24px (1.5)  | normal
  Button     | "Noto Sans Thai", sans-serif   | 500    | 15px  | normal   | 15px (1.0)  | normal
  ⚑ DRAMA NOTES: There is no display/body font contrast — the entire drama comes
  from WEIGHT + SIZE jumps within one Thai humanist sans (Noto Sans Thai), not
  typeface pairing. The hero H1 at 72px/600 vs. body at 18px/500 is a 4x size
  ratio with only a single weight step (500→600) — the visual hierarchy is
  carried almost entirely by SCALE, not by weight or style contrast. Preserve
  this "one font, big scale jumps" restraint — do not introduce a second display
  typeface or italic/serif accents; that would misrepresent the brand's clinical,
  utilitarian tone.

SPACING GRID: Base unit ≈ 8px. Observed scale: 8, 12, 16, 24, 32, 48, 64, 80, 96px
BORDER RADIUS: Pill/50px — used on ALL buttons (CTA pills, nav search icon circle)
               Circle/50% — used on icon badges, avatar photos, floating widgets
               0px — used on article/content cards (square-cornered, no radius)
SHADOW SYSTEM: Cards and buttons in this pass show `box-shadow: none` — the site
               relies on flat color blocking + generous whitespace rather than
               elevation shadows. Floating chat/scroll-top widgets are the
               exception (soft drop shadow, standard Elementor widget default).
TEXTURE: Hero section background uses a raster dot/wave pattern image (not a CSS
         gradient mesh) layered under a navy→blue gradient — confirmed no
         background-image resolved on the queried container; the pattern renders
         via an `<img>`/pseudo layer inside the Swiper slide markup, not on the
         section shell itself.
```

---

## 1.3 — SECTION BLUEPRINTS

### SECTION 1: Hero Swiper Carousel

Height: 810px | BG: navy-to-blue gradient + dot-wave texture image | Padding: ~64px top, ~80px sides
Content max-width: full-bleed background, ~1280px content column

**INTERNAL ASCII WIREFRAME:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ◄                                                                  ► │
│   ┌─────────────────────┐        ┌──────────────────────────────┐   │
│   │  H3 (2-line, white) │        │  Overlapping circle photo     │   │
│   │  Body copy (white)  │        │  collage: 1 large + 3 small   │   │
│   │  [~45% width]       │        │  circles, 2 app-icon badges    │   │
│   └─────────────────────┘        │  floating at edges [~55% w]   │   │
│                                   └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
Layout system: Flexbox row (Elementor e-con-full, e-flex), space-between
Gap: ~48px. Carousel: Swiper.js, arrows both edges, no visible dot pagination.
```

**TYPOGRAPHY + CONTENT MAP:**

```
  H3 → "แพ็กเกจตรวจสุขภาพ" (line1) / "รู้ก่อนรักษาได้..." wraps | Style: H3 | Color: white
  Body → "รู้ก่อนรักษาได้ รวมดีลแพ็กเกจตรวจสุขภาพและความงามจากโรงพยาบาลในเครือ BDMS พร้อมส่วนลดพิเศษตลอดทั้งปี" | Style: Body | Color: white
  Composition → 11 <img> nodes in this slide (see 1.3b Composition Map)
```

---

### SECTION 4: BDMS Network Hospital Logo Strip

Height: 286px | BG: solid #F4F8FF | Padding: 64px vertical
Content max-width: ~1280px centered

**TYPOGRAPHY + CONTENT MAP:**

```
  H2 line1 → "BeDee ให้บริการโดย BDMS" | Style: H2 | Color: #455FA5
  H2 line2 → "เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย" | Style: H2 | Color: #455FA5
  Logo row (8 items, flex, gap ~32px, grayscale-safe SVG/PNG marks):
    BDMS | Bangkok Hospital | Samitivej | BNH Hospital | Phyathai |
    เปาโล (Paolo) | Royal Bangkok Hospital | BDMS Wellness Clinic
```

---

### SECTION 5: Doctor/Pharmacist Expert Tabs (STATE MACHINE — see 1.6)

Height: 425px | BG: #FFFFFF | id anchor: `#next`
Content max-width: ~1280px centered

**TYPOGRAPHY + CONTENT MAP:**

```
  H2 → "ผู้เชี่ยวชาญจากโรงพยาบาลในเครือ [BDMS logo inline]" | Style: H2 | Color: #081F7C/navy
  Tab 1 (active default) → "แพทย์ในเครือ" (Affiliated Doctors) | Color: #317DF5 when active
  Tab 2 → "เภสัชกรในเครือ" (Affiliated Pharmacists)
  Card carousel (4 imgs seen in DOM at default breakpoint): circular avatar +
  name + hospital/specialty caption per card (JetElements carousel, arrows)
  CTA pill → "ดูทั้งหมด ›" | Style: Button | BG: dark navy (~#0C2A6B sampled from
  screenshot; getComputedStyle on this element returned a resolved value that
  conflicts with the visually rendered swatch — treat #0C2A6B–#081F7C as the
  correct range, confirm exact hex via live inspector before pixel-matching)
```

---

### SECTION 8: "บทความน่าสนใจจาก BeDee" Article Grid

Height: 545px | BG: transparent, curved SVG divider bleeding from section above
Content max-width: ~1280px centered

**INTERNAL ASCII WIREFRAME:**

```
┌─────────────────────────────────────────────────────────────┐
│              H2: "บทความน่าสนใจจาก BeDee"                    │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐            │
│  │ img 16:9   │   │ img 16:9   │   │ img 16:9   │            │
│  │ [cat badge]│   │ [cat badge]│   │ [cat badge]│            │
│  │ logo watermark bottom-left on each image      │            │
│  │ Title (2-line, navy, bold)                    │            │
│  └────────────┘   └────────────┘   └────────────┘            │
│                    CTA pill "ดูทั้งหมด ›"                     │
└─────────────────────────────────────────────────────────────┘
Layout system: CSS Grid/Flexbox 3-col, equal width, gap ~32px
```

**TYPOGRAPHY + CONTENT MAP:**

```
  Card image → 16:9, corner category badge (e.g. "7 วิธีรักตัวเอง" pill,
    blue bg, white text, top-right of image) + small BeDee logo watermark
    bottom-left of image
  Card title → 2-line clamp, navy #081F7C, bold, Body-Large size
  CTA → "ดูทั้งหมด ›" pill button, dark navy bg, white text
```

---

## 1.3b — COMPOSITION MAP: Hero Circular Photo Collage (Section 1)

Element count: **11 distinct visual objects** (11 `<img>` nodes confirmed via DOM query on the hero slide)

```
CENTER:    Large photo circle — mother/grandmother multi-generation family
           group, warmly lit, ~320px diameter, front-most z-index

BEHIND:    3 smaller overlapping photo circles fanned around the center:
           (1) doctor examining child patient, top-left, ~180px, slight
               overlap with center circle
           (2) young couple/family portrait, top-right, ~160px
           (3) elderly man + caregiver, bottom, partially behind center
           Count: 3. Arrangement: radial/fanned around the large center circle,
           each with a thin white circular border (ring) separating it from
           the blue gradient backdrop.

FLANKING:  Solid navy circle badge (bottom-left of the collage) containing a
           white stethoscope icon — a service/trust icon, not a photo.

ABOVE:     Small square-rounded badge (top-right of collage, overlapping the
           couple photo) containing a colorful health-app screenshot icon
           (chart/graph glyph on white rounded-square, ~48px) — represents
           the BeDee mobile app.

AMBIENT:   Background: linear gradient navy (#081F7C-range) → mid-blue
           (#317DF5-range), diagonal, overlaid with a light dot/wave raster
           texture at low opacity (visible as a faint dotted swirl pattern
           behind the photo collage, right two-thirds of the hero only).
```

**Anti-flattening check:** an illustrator handed only this block can recreate the composition — 1 large hero photo circle, 3 fanned supporting photo circles with white rings, 1 solid-navy icon badge, 1 app-screenshot badge, on a navy→blue dot-textured gradient. Confirmed.

---

## 1.4 — ANIMATION TIMELINES

**Honest disclosure:** This site does not use GSAP, Framer Motion, or a scroll library (confirmed absent via `typeof gsap`, `data-framer-component-type`, Lenis/Locomotive checks — all `false`). Motion is limited to two mechanisms, both stock library defaults with no custom easing exposed in computed styles:

```
ANIMATION: Hero Slide Transition
Section: 1 (Hero)
Trigger: auto-interval (Swiper default, unconfirmed exact ms — no custom
         data-attribute for delay found; treat as Swiper default ~5000ms) +
         manual arrow click
Library: Swiper.js
TIMELINE: slide-to-slide is a translateX crossfade/slide — standard Swiper
          "slide" effect, not a custom keyframe animation. No t=Xms stagger
          detected on child elements (text and image move together as one
          slide unit).
PROPERTIES ANIMATED: transform: translate3d(x)
LOOP: yes, infinite (Swiper loop mode)
RESET: n/a — carousel, not scroll-triggered

ANIMATION: Doctor/Pharmacist Tab Carousel
Section: 5
Trigger: click (tab) / arrow click (card carousel)
Library: JetElements carousel (built on Slick/TweenJS, per script bundle)
TIMELINE: Tab switch swaps the visible card set; card carousel arrows page
          through items via translateX. No fade/scale entrance animation
          detected on tab switch — content swap is instantaneous (display
          toggle), not eased.
PROPERTIES ANIMATED: transform: translateX (carousel only)
LOOP: no
RESET: n/a
```

No scroll-triggered entrance animations (fade-up, clip-reveal, etc.) were detected on this page at the DOM/CSS level — sections render statically once loaded; this is a content/conversion site prioritizing load speed (confirmed by `perfmatters` + `wp-rocket` lazyload + instant-page prefetch plugins in the script bundle) over motion design.

---

## 1.5 — MICRO-INTERACTIONS

```
INTERACTION: Primary CTA Pill Button (e.g. "ดูทั้งหมด")
Selector hint: a.elementor-button
STATE         | background        | color      | transform  | box-shadow | other
──────────────────────────────────────────────────────────────────────────────────
DEFAULT       | dark navy         | #FFFFFF    | scale(1)   | none       | border-radius:50px
HOVER         | (Elementor default opacity/darken shift — not independently
                confirmed via pseudo-state inspection in this pass)
MECHANISM: Standard Elementor button widget (CSS-only, no JS-driven hover trick)
⚑ SPECIAL BEHAVIOR: none detected — this is a stock component, not a custom one.

INTERACTION: Top Nav Dropdown (บริการของเรา / บทความ)
Selector hint: header nav li.menu-item-has-children
MECHANISM: Elementor Pro nav-menu widget, hover/click reveals submenu list.
Standard show/hide, no custom transition curve exposed.

INTERACTION: Floating Chat Bubble
Selector hint: fixed bottom-right circular button
MECHANISM: vc-chat-button plugin — opens external chat widget on click.

INTERACTION: Post-scroll Sticky App-Download Bar
Selector hint: top bar with #app-store/#google-play badges
MECHANISM: Appears once hero scrolls out of view (scroll-position CSS class
toggle via theme's main.js), pins above the site header. Persists through
rest of scroll.
```

---

## 1.6 — STATE MACHINES

```
STATE MACHINE: Doctor/Pharmacist Expert Tabs
Location: Section 5
Type: Toggle (2-way tab switch) + nested Carousel
STATES:
  State A "แพทย์ในเครือ" (Doctors): shows doctor card set, tab A styled active
    (blue text/underline)
  State B "เภสัชกรในเครือ" (Pharmacists): shows pharmacist card set, tab B active
INITIAL STATE: A (Doctors)
TRANSITION A→B:
  Trigger: click on tab B label
  Element 1: card carousel content swaps to pharmacist dataset — instant
    display toggle, no crossfade detected
  Element 2: tab underline/color moves from A to B, CSS class swap
  Data logic: JetEngine/JetTabs widget — swaps visible `.elementor-tab-content`
    block by data-tab attribute; not a JS array rotation
TRANSITION B→A: mirror of above
LOOP: user-controlled only (no auto-advance between tabs)
INTERNAL LAYOUT:
  Container: fixed-height card row, overflow visible (carousel arrows control
    horizontal scroll within active tab's dataset)
  Each card: circular avatar (~120px) + name + hospital/specialty label below
```

---

## 1.7 — SCROLL CHOREOGRAPHY MAP

```
Scroll %  │ Viewport Position         │ Event / Animation Trigger
──────────────────────────────────────────────────────────────────────────
0%        │ Page load                 │ Hero Swiper auto-plays, header transparent-over-hero is NOT used — header stays solid white from load
~15%      │ Hero fully scrolled past  │ Sticky app-download bar appears, pins above main header
~15–100%  │ Rest of page               │ No parallax multipliers detected on any element (all backgrounds are `background-attachment: scroll`, no fixed/parallax layers found)
100%      │ Footer in view             │ No footer-specific trigger; scroll-to-top button visibility is purely a fixed-position element (not scroll-position toggled in a way distinguishable from "always visible after N px")
──────────────────────────────────────────────────────────────────────────
SCROLL BEHAVIORS:
  Parallax elements: none detected
  Sticky elements: (1) main header — NOT sticky, scrolls away normally;
    (2) app-download bar — sticky/fixed, appears only after hero scroll-past;
    (3) chat bubble + scroll-top button — always-fixed, not scroll-triggered
  Nav state change: none — header does not change color/size on scroll
```

---

## 1.8 — TECHNICAL STACK

```
  Framework: None (server-rendered PHP/WordPress templates) — confidence: high
             (no React/Vue/Nuxt root markers, no __NEXT_DATA__, no data-v-app)
  CMS:       WordPress, generator meta confirms Elementor 3.31.5
  Page Builder: Elementor + Elementor Pro (webpack runtime + pro frontend.js),
             JetElements + JetEngine-style widgets (jet-carousel, jet-tabs),
             child theme "bedee" on parent theme "fluffy-dev"
  Animation: CSS-only transitions; TweenJS bundled (via jet-elements) but no
             evidence of active custom tween usage on this page's visible
             components
  Carousel:  Swiper.js (hero) + Slick (jet-elements dependency)
  Scroll:    Native browser scroll — no Lenis/Locomotive/GSAP ScrollTrigger
  UI Lib:    Utility-ish class names present (Tailwind-shaped selectors
             detected) but this is Elementor's own atomic class system, not
             actual Tailwind — no tailwind.config or JIT signature found
  Perf/Other: WP Rocket (cache + lazyload), Perfmatters + instant.page
             (prefetch), Link Whisper (internal linking plugin), Simple Tags,
             Honeypot (anti-spam), WP Armour (security), Designil PDPA
             (Thai cookie-consent banner), Seed Social (share buttons)
  Backend integrations (visible from nav): shop.bedee.com is a SEPARATE
             subdomain/system for e-commerce (health packages) — likely its
             own storefront (Shopify-shaped URL pattern `/th?utm_source=...`),
             NOT part of the WordPress install. Treat as an external
             integration/link-out, not a page to clone into Payload.
```

---

## 1.9 — MOTION PHILOSOPHY + COPY VOICE

```
MOTION PHILOSOPHY:
There is, deliberately, almost no motion design here. What exists is
functional and library-default: a carousel that slides, a tab that swaps,
a sticky bar that appears once. Nothing eases, staggers, or parallaxes. This
reads as a healthcare/conversion site optimized for load speed and clarity
over delight — the "physics" is simply "instant, correct, and out of the
way." If all animation were stripped entirely, almost nothing would be lost
functionally; the brand's warmth is carried by photography (real families,
real doctors) and color, not by movement.

COPY VOICE PATTERN:
  Tone: warm, reassuring, direct — a clinical-but-approachable Thai health
        brand voice. Short benefit-led headlines, plain-language body copy.
  Sentence form: short declarative fragments as headlines ("แพ็กเกจตรวจสุขภาพ"
        = "Health Checkup Packages"), fuller single sentences as supporting
        body copy explaining the benefit + trust signal (network hospital,
        discount).
  Key device: trust-by-affiliation — nearly every section reinforces "BDMS"
        (the hospital network) as the credibility anchor behind BeDee's
        digital services. Pattern repeats: "[Service] ... โดย BDMS
        เครือข่ายโรงพยาบาลที่ใหญ่ที่สุดในประเทศไทย" ("...by BDMS, Thailand's
        largest hospital network").
  Example pattern: "รู้ก่อนรักษาได้ รวมดีลแพ็กเกจตรวจสุขภาพและความงามจาก
        โรงพยาบาลในเครือ BDMS พร้อมส่วนลดพิเศษตลอดทั้งปี" — lead with the
        benefit ("know before you need treatment"), then the trust anchor
        (BDMS network), then the incentive (year-round discounts).
```

---

## SITE MAP / INFORMATION ARCHITECTURE (for Payload content modeling)

```
/ (Home)
/teleconsultation           — Service: doctor video consult
/telepharmacy                — Service: pharmacist consult
/health-mall                 — Service: health product shop (on-site)
shop.bedee.com/th            — EXTERNAL storefront (health packages) — out of WP scope
/promotions                  — Promotions/campaigns listing
/article                     — Article listing (health articles)
  /articles/{category}/{slug} — Article detail. Categories seen: mental-health,
                                 cancer, wellness, gen-med, skin-aesthetic,
                                 pharmacy, women-health, sexual-health
/news-and-activities          — News & Activities listing (distinct post type
                                 from health articles — company/PR news)
/corporate                   — B2B/"For Organizations" landing page
/contact-us                  — Contact page
Article detail fields observed: H1 title, author (doctor byline, e.g. "พญ.
  อธิชา วัฒนาอุดมชัย"), publish date, view count, table-of-contents, 9 share
  icons, featured image, category, related-articles module
Service page pattern (teleconsultation) sections: What-is-BeDee intro, Why-
  choose-us, How-it-steps, Benefits, BDMS network proof, Staff doctors module,
  "Which symptoms fit this service" list, related promotions, related articles
Expert/Doctor data: name, photo, hospital affiliation, specialty — surfaced as
  a repeater/carousel component (Section 5), NOT a standalone public detail
  page (no /doctor directory found — 404 on direct guess)
No dedicated Testimonials/Reviews module was found on the homepage or the
  teleconsultation service page in this pass — trust signals here are
  hospital-network logos and "affiliated doctor" cards, not customer quotes.
  Flag this to the user in brand interview: do they want a Testimonials
  collection anyway (common ask in the task brief) even though the source
  site doesn't use one?
```
