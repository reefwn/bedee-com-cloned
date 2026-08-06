# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Thai consumers aged 25–55, mass-market mobile/web sophistication (not tech-early-adopters). Psychographic: health-conscious but time-poor — want hospital-grade care without an in-person visit. Situation: need to consult a doctor or pharmacist, order health products, or book a health-check package without traveling to or queuing at a hospital.

Secondary: B2B/corporate buyers (existing "Corporate" nav item — employee health benefit packages), and existing BDMS hospital patients being referred into the app for follow-up/continuity of care.

## Product Purpose

BeDee is a digital healthcare platform providing teleconsultation (doctor video consult), telepharmacy (pharmacist consult + medication delivery), and a health-product marketplace (health-mall), plus health-checkup package bookings at BDMS-network hospitals. It exists to make BDMS-standard care reachable 24/7 without requiring a physical hospital visit.

## Positioning

Backed by BDMS — Thailand's largest private hospital network — so every consultation carries hospital-grade trust: named affiliated doctors and named partner hospitals, not an anonymous telehealth app. A generic telehealth competitor cannot truthfully claim this institutional backing.

## Operating Context

- Users typically arrive via the mobile app (primary conversion surface — app-store badges are the persistent top-bar CTA) or the marketing/content website (this codebase).
- Core workflows this site supports: browse teleconsultation/telepharmacy/health-mall service info and pricing, read health articles (by category), see BDMS-affiliated doctors/pharmacists, browse promotions, and be routed to the app to complete a consultation or purchase.
- Content is healthcare information (patient education articles across categories: gen-med, mental-health, women's health, skin/aesthetic, wellness, cancer, child, elderly, ENT, office-syndrome, optic, pharmacy, sexual-health) — accuracy and currency matter; this is medical-adjacent content, not generic blog content.
- Thai is the operating language today; the platform will also need to serve English-speaking users (see Capabilities and Constraints).

## Capabilities and Constraints

- **Full replacement, not a parallel site.** This Payload CMS + Next.js + Supabase rebuild is intended to fully replace the live WordPress site at bedee.com. The original will be decommissioned once migration is complete — this app must not assume bedee.com stays available as a dependency (already true: images are cloned into this app's own storage, not hotlinked).
- **Locale: Thai live now, English planned.** `th` is the current and only populated locale. Every localized field in the content model is already `localized: true` so English can be added without a schema migration — English content itself does not exist yet and should not be fabricated ahead of a real translation effort.
- **Content model** (`app/src/collections/`, documented in `plans/payload-content-model.md`): Posts (health articles), Pages (service/corporate pages, block-based), Services (teleconsultation/telepharmacy/health-mall — pricing + FAQ fields), Doctors, Partners (BDMS hospital network), Promotions, Products (health-mall — link-out to shop.bedee.com today, see open decision below), Categories, Testimonials, plus Header/Footer/SiteSettings globals.
- **Open decision, not yet made:** whether `health-mall`/Products becomes a real commerce collection in this app or stays a link-out to `shop.bedee.com`. Do not silently pick a side — `shop.bedee.com` is a separate storefront system outside this migration's current scope.
- **AI/agent discoverability is an active concern**, not incidental: `/llms.txt`, `/pricing.md`, FAQPage schema on service/article pages, and citable brand stats exist specifically so AI search/agents can find and cite this content without depending on bedee.com.
- **Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 3 on the frontend; Payload CMS 3 (Node/TypeScript) as headless backend; Postgres via Supabase (pooled connection, `postgres` role, RLS enabled with no policies since the app connects with a role that bypasses RLS); Vercel Blob for media storage; deployed on Vercel.

## Brand Commitments

- Name: BeDee, tagline "Powered by BDMS."
- Logo: capsule/pill mark (blue #2B7FFF top-left half, orange #FF4C14 bottom-right half) + wordmark.
- Brand colors: Primary Navy #081F7C, Primary Blue #317DF5, Accent Orange #FF4C14, panel tints #F4F8FF/#F4F7FC, footer #F0F0F0.
- Brand feeling: warm, trustworthy, clinical-but-approachable.
- Animation intensity: intentionally minimal (source site uses only stock carousel/tab-swap behavior, no cinematic motion) — this restraint is a deliberate brand trait to preserve, not an oversight.
- This is a literal same-brand migration (BeDee into BeDee), not a rebrand or adaptation to a new brand — the incumbent visual system is authoritative, not a starting sketch.

## Evidence on Hand

- `plans/01-site-dna.md` — forensic audit of the live bedee.com homepage/section structure, colors, layout measurements.
- `plans/02-brand-interview.md` — self-answered brand interview (explicitly flagged as inferred from Site DNA + task brief, not a live human interview; content here has since been confirmed by the human user in this init round).
- `plans/payload-content-model.md` — full content model + WordPress migration + deployment plan.
- `wordpress_bdwordpressbedee_20260724_091627.sql` (external, on the DevOps volume) — full WordPress database dump, used as ground truth for content migration (articles, FAQ copy, category taxonomy) in preference to live-scraping where both are available.
- Real photography and media exist and have been migrated into this app's own Media/Blob storage (256+ articles, service FAQs, etc. as of this session) — no placeholder imagery in migrated content.
- No testimonials/reviews exist on the source site (Site DNA confirms this — trust is carried by hospital logos and named doctors instead). A Testimonials collection exists in this app per an earlier explicit task brief, but has no source content and no 1:1 page mapping yet — do not fabricate testimonial content to fill it.

## Product Principles

1. **Institutional trust over generic telehealth conventions.** Every design and content decision should reinforce "this is BDMS," not "this is a telehealth app that happens to mention BDMS."
2. **Migrate truth, don't invent it.** When source content exists (WordPress dump or live site), use it verbatim or lightly cleaned — never fabricate medical, pricing, or FAQ content to fill a gap. Flag gaps instead.
3. **Independence from the original site.** Nothing in this app should silently depend on bedee.com staying online — media, content, and links should point to this app's own resources.
4. **Preserve the source's restraint.** Minimal animation, clinical-but-warm tone, and hospital-grade sobriety are brand traits, not gaps to fill with generic "delight."
5. **Design for both human visitors and AI agents/search.** Structured, citable, machine-readable content (schema, llms.txt, pricing.md) is a first-class concern for this product, not an afterthought.

## Accessibility & Inclusion

No project-specific accessibility requirement has been confirmed beyond standard web accessibility practice. Given the healthcare domain and a mass-market (not tech-early-adopter) Thai audience — including likely older and less tech-fluent users seeking care — baseline WCAG-conscious defaults (readable contrast, legible Thai typography at mobile sizes, accessible form/booking flows) matter more here than in a typical marketing site, but no specific standard (e.g. WCAG AA certification) has been mandated by the user.
