---
target: the homepage
total_score: 15
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-06T14-39-42Z
slug: app-src-app-frontend-page-tsx
---
Method: dual-agent (A: a2c1ebbb0eb9ace10 · B: ab39bc393ff0e4f60)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Autoplaying hero carousel has no progress dots/active-slide indicator and no pause control; ExpertTabs silently shows nothing when a tab has no data |
| 2 | Match System / Real World | 3 | Correct Thai domain terms throughout; docked for the hero CTA and "โพสต์ถามหมอ" both linking out to legacy bedee.com |
| 3 | User Control and Freedom | 1 | No way to pause the 5s autoplay carousel, no slide picker, no undo/back affordance anywhere on the page |
| 4 | Consistency and Standards | 2 | Tokens followed faithfully almost everywhere, but IconGrid's gradient background and a `background-clip:text` gradient both break DESIGN.md's own no-gradient rule |
| 5 | Error Prevention | 3 | Few destructive/error-prone interactions on a homepage to begin with |
| 6 | Recognition Rather Than Recall | 2 | Icon+label pairing aids recognition, but zero persistent nav means no way back to a scrolled-past section |
| 7 | Flexibility and Efficiency | n/a | Persuade-mode marketing homepage, not a task tool |
| 8 | Aesthetic and Minimalist Design | 3 | Flat, single-typeface, restrained system reads calm; docked for the stray gradients and near-identical H2 treatment across sections |
| 9 | Error Recovery | 0 | Zero empty-state messaging anywhere — empty doctor section and invisible promo image both fail silently |
| 10 | Help and Documentation | n/a | Persuade-mode marketing homepage, not a task tool |
| **Total** | | **15/32** | **Poor (47%)** |

## Design Specificity Verdict

**LLM assessment**: The page's content layer is genuinely BDMS-specific — real named hospital-network logos (Bangkok Hospital, Samitivej, BNH, Phyathai, Paolo, Royal Bangkok Hospital, BDMS Wellness Clinic), concrete Thai copy with real numbers, and actual circular-crop photography of a pharmacist/doctor rather than stock imagery. No generic telehealth competitor could swap in and reuse the trust-logo strip or hero collage unchanged. But the compositional/interaction layer — gradient hero with floating photo collage, 4-icon service grid, 3-icon secondary grid, tab-switch doctor carousel, promo banner, 3-card article grid — is a widely-used "health-startup homepage" shape that would work for almost any telehealth brand if the logos and copy were swapped. Per DESIGN.md this is an explicit same-brand migration (not a redesign), so shape-genericness is in-scope by design — but it means the page differentiates almost entirely through content truth, and several sections meant to carry that truth (doctors, header nav, footer, promo image) are currently rendering empty or broken on the live URL, which undercuts the one thing this brand actually has to differentiate with.

**Deterministic scan**: `detect.mjs --json` against the homepage's own file plus every block component and shared header/footer component (`app/src/app/(frontend)/page.tsx`, `app/src/blocks/**`, `app/src/components/**`) returned a clean exit code 0 with zero source-level findings. The browser-injected runtime scan against the live production page (both desktop and 390×844 mobile viewports) told a different story — **11-12 anti-patterns**, none of which the static source scan or the LLM review caught on their own:
- **`low-contrast` (×6)**: white text on `#317DF5` measures 3.9:1, below the 4.5:1 WCAG AA minimum — this is the article-card category badge the LLM review only flagged as a "likely" minor concern; the detector quantifies it as a confirmed failure.
- **`heading-rhythm` (×4-5)**: several h3 headings have 12px spacing above but 32-143px below, reading as visually bound to the wrong block — spacing tokens applied inconsistently around article/package headings.
- **`gradient-text` (×1)**: a `background-clip: text` gradient somewhere on the page, on top of IconGrid's already-flagged gradient background — a second, independent violation of DESIGN.md's "no gradients except the hero" rule.
- **`marquee` (×1)**: a literal `<marquee>` element is present on the live page. This is the single most surprising finding of this critique — a scrolling-text tag has no legitimate place in a system whose own DESIGN.md explicitly rejects "scroll-triggered reveals... expressive motion" of any kind, and it's a known accessibility/motion-sensitivity hazard. Source unconfirmed; likely legacy WordPress markup that bled through unsanitized in a migrated article's rich-text field, but this needs to be traced, not assumed.

**Visual overlays**: Browser-visible overlays were not confirmed reliably in this run — the prescribed `<script src="http://localhost:PORT/detect.js">` injection failed silently due to HTTPS→HTTP mixed-content blocking (the production page is HTTPS; the local detector server is plain HTTP). Assessment B worked around this with an equivalent `page.addScriptTag` injection of the same script content and confirmed the findings above via console output, but no user-visible on-page overlay was confirmed in a `[Human]`-labeled tab. Treat the findings list above as real (the same detector logic ran against the same live page), but there is no visible overlay artifact left in a browser tab for you to inspect directly.

## Overall Impression

The homepage's content foundation is real and specific — actual BDMS hospital logos, real photography, correct Thai — but the page as currently deployed reads as unfinished rather than merely imperfect: the two sections built to carry the most institutional trust (header/footer navigation, and the named-doctors section) are empty, a stray `<marquee>` element and two independent gradient violations contradict the system's own written motion/color rules, and no interactive element anywhere has a visible focus state despite DESIGN.md mandating one. The single biggest opportunity is closing the gap between what DESIGN.md/PRODUCT.md promise ("named affiliated doctors," "institutional trust over generic telehealth," "clinical restraint") and what the live page currently ships — this is much more a completeness/QA problem right now than a taste problem.

## What's Working

- **Hero photo collage** — circular-crop pharmacist/doctor/video-call photography over the navy→blue gradient, executed exactly per DESIGN.md's circular-crop treatment; immediately signals "real people," not generic stock.
- **BDMS trust-logo strip** (`app/src/blocks/components/LogoStrip.tsx`) — 8 real, named, recognizable Thai hospital-network logos on a soft panel tint. This single section does more for PRODUCT.md's "institutional trust over generic telehealth" principle than any copy could, and it's genuinely unreproducible by a competitor.
- **Token fidelity where it's applied** — buttons, article cards, and avatars verified in code match DESIGN.md's pill/square/circle Two-Shape Rule and color tokens almost exactly; a real sign the build respected the confirmed brand system rather than drifting from it (the gradient/contrast exceptions below are the exception, not the norm).

## Priority Issues

**[P0] Header navigation and footer link groups are both completely empty on the live homepage**
- **Why it matters**: This is the site's entire wayfinding system. With no global nav and no footer links, the only way to reach Teleconsultation, Telepharmacy, Corporate, or any article category is whatever body link happens to be on the homepage — there is no way back to a specific page once scrolled past. This directly contradicts PRODUCT.md's own content model (which cites an existing "Corporate" nav item) and is close to worst-case for the Recognition and Consistency heuristics.
- **Fix**: Populate the `header.navItems` and `footer.linkGroups` Payload globals with the real site IA. This is a CMS content gap, not a code bug, but as deployed it makes the production homepage a dead end.
- **Suggested command**: `/impeccable harden`

**[P0] A `<marquee>` element is present on the live page**
- **Why it matters**: The detector's runtime scan confirmed a literal scrolling-text `<marquee>` tag on the homepage. DESIGN.md explicitly rejects any expressive/decorative motion beyond functional state changes — a marquee is the single most direct possible violation of that rule, and it's independently a well-known accessibility and motion-sensitivity hazard (unpausable, screen-reader-hostile). Its source is unconfirmed; most likely a legacy WordPress fragment that survived unsanitized inside a migrated article's rich-text content.
- **Fix**: Locate the source (likely inside a `posts.content` rich-text field from the WordPress migration) and strip it. Audit other migrated articles for the same class of leftover markup.
- **Suggested command**: `/impeccable audit`

**[P1] The "meet our doctors" section renders zero cards in either tab, with no empty-state fallback**
- **Why it matters**: `ExpertTabs` ("แพทย์ในเครือ" / "เภสัชกรในเครือ") is precisely the section meant to carry PRODUCT.md's positioning claim — "named affiliated doctors... not an anonymous telehealth app." For an anxious visitor deciding whether to trust a teleconsultation, this is the worst possible place for the page to go silent, and there's no message distinguishing "broken" from "intentional."
- **Fix**: Populate `doctors` data for the homepage block, and add a fallback in `app/src/blocks/components/ExpertTabs.tsx` (currently `visible.map(...)` with no `if (!visible.length)` guard) so the section never renders content-free.
- **Suggested command**: `/impeccable onboard`

**[P1] The accessibility floor DESIGN.md itself mandates is not met**
- **Why it matters**: Two independent, confirmed failures. First, DESIGN.md requires a visible focus ring (`box-shadow: 0 0 0 3px rgba(49,125,245,0.4)`) as "a required accessibility addition, not an aesthetic option" — no `focus:`/`focus-visible:` class exists anywhere in `HeroCarousel.tsx`, `SiteHeader.tsx`, `ExpertTabs.tsx`, `ArticleGrid.tsx`, or `PromoBanner.tsx`, confirmed by direct code read. Second, the detector's runtime scan measured the white-on-`#317DF5` category badge text at 3.9:1 contrast against a 4.5:1 WCAG AA requirement, six times on the page. A keyboard-only user cannot see where focus currently is anywhere on this homepage, and a low-vision user cannot reliably read the article category badges.
- **Fix**: Add the focus-ring utility to every button/link on the page; darken the badge background or use a different text color to clear 4.5:1.
- **Suggested command**: `/impeccable harden`

**[P2] The system's own "no gradients except the hero" rule is already broken in two places**
- **Why it matters**: `IconGrid.tsx` (line 22) sets a `bg-gradient-to-tr` background on the very first section after the hero, and the detector separately found an unrelated `background-clip: text` gradient elsewhere on the page. DESIGN.md's Do/Don't list is explicit that flat tints (`panel-1`/`panel-2`) exist specifically to avoid this — two independent instances this early suggests the rule isn't being checked at review time, not just a one-off slip.
- **Fix**: Replace `IconGrid`'s gradient with `bg-panel-1` or `bg-panel-2`; locate and remove the gradient-text usage.
- **Suggested command**: `/impeccable polish`

## Persona Red Flags

**Jordan (Confused First-Timer)**: Lands wanting to know "should I trust this to see a doctor?" The hero CTA sends Jordan off to the legacy `bedee.com` domain; two icon grids with overlapping-sounding labels ("ปรึกษาหมอ" vs. "โพสต์ถามหมอ") don't clarify which is "the" consult flow; and the one section built to answer Jordan's trust question — real named doctors — shows nothing. With no persistent nav, Jordan has no way to backtrack to a specific service once past it. Likely outcome: bounce, unconvinced this is really hospital-backed.

**Sam (Accessibility-Dependent User)**: Tabbing from the logo lands on an empty `<nav>` landmark with nothing to jump into. Every subsequent tab stop — carousel CTA, tab buttons, every pill CTA — has no visible focus indicator anywhere in the code, so Sam cannot tell where keyboard focus currently is. The autoplaying carousel changes every 5 seconds with no pause control, an active WCAG 2.2.2-style violation for anyone relying on assistive tech to read content at their own pace. The confirmed 3.9:1 contrast badges compound this for low-vision users specifically.

**Casey (Distracted Mobile User)**: On a 390px viewport the hero carousel advances every 5s — likely before Casey finishes reading the first slide's body copy — and the prev/next arrows are bare glyphs with no background or padding, easy to mis-tap on a touchscreen. Scrolling further, Casey hits the same empty doctor section and an invisible promo image, so two of the page's biggest trust-moments show nothing, with no easy way to try a different entry point before abandoning.

## Minor Observations

- The health-mall promo image (`PromoBanner.tsx`) loads successfully (HTTP 200, correct alt text) but renders as blank whitespace — likely because its `flex-1` parent has no defined height for `object-contain` to size against.
- "โพสต์ถามหมอ" and the hero's "ดูเพิ่มเติม" CTA both link out to the legacy `bedee.com` domain, contradicting PRODUCT.md's stated principle that nothing should silently depend on that domain staying online.
- `ExpertTabs.tsx`'s "ดูทั้งหมด" CTA is a dead `href="#"` link.
- Every CTA on the page uses identical navy-pill styling — no secondary/tertiary variant exists to signal relative importance among ~10-12 competing calls to action.
- The nav dropdown (`SiteHeader.tsx`) opens on `group-hover` only, no `focus-within` equivalent — keyboard users can't open child menus even once populated, despite DESIGN.md's own component spec saying "appears on hover/focus of the parent item."
- `IconGrid` requests images at 64×64 but displays them at 96×96 (`h-24 w-24`) — a minor upscale/quality mismatch.
- Several `h3` headings (article/package titles) have inconsistent spacing above vs. below (12px vs. 32-143px), reading as visually attached to the wrong section.

## Questions to Consider

1. With the header nav and footer both empty right now, has anyone actually tried to complete a real end-to-end task on this production URL (e.g., reach the Corporate/B2B page PRODUCT.md references), or has review only ever looked at the homepage in isolation?
2. DESIGN.md invests heavily in named rules like the Two-Shape Rule and the Sparing Coral Rule — but the page's actual live defects (empty nav, empty doctor section, a stray marquee) are content/rendering gaps, not brand-token drift. Is token fidelity really what's standing between this page and launch, or is effort better spent closing the CMS content gap first?
3. Given the explicit "migrate truth, don't invent it" mandate, is a completely empty "meet our doctors" trust section actually a *regression* in institutional trust versus the WordPress site it's replacing?
