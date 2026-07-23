# Brand Interview — BeDee (Payload CMS Rebuild)

Reference site: https://www.bedee.com
Date: 2026-07-23
Note: Self-answered from Site DNA (plans/01-site-dna.md) + user's task brief, since
this is a literal same-brand migration (clone BeDee itself into Payload CMS),
not an adaptation to a new/different brand. User should override any answer below.

---

## 1. PRODUCT IDENTITY
BeDee is a telehealth platform (teleconsultation, telepharmacy, health-product
shop) operated under BDMS, Thailand's largest private hospital network. Industry:
digital health / telemedicine, Thailand market, Thai-language.

## 2. AUDIENCE PERSONA
Thai consumers 25–55, broad technical sophistication (mass-market mobile app +
web, not tech-early-adopters), psychographic trait: "health-conscious but
time-poor" — wants hospital-grade trust without an in-person visit.

## 3. BRAND FEELING
Warm, trustworthy, clinical-but-approachable.

## 4. COLOR PALETTE
Existing brand colors (extracted, see Site DNA 1.2 for full table):
  Primary Navy #081F7C · Primary Blue #317DF5 · Accent Orange #FF4C14
  (logo pill split blue/orange) · Panel tints #F4F8FF / #F4F7FC · Footer #F0F0F0

## 5. PAGE SECTIONS
Home: Hero carousel → Service icon grid → Secondary interest grid → BDMS
network logo strip → Doctor/Pharmacist expert tabs → Health-mall promo →
Article grid → Footer.
Site-wide (via nav): Teleconsultation, Telepharmacy, Health Mall, Promotions,
Articles (+ 8 categories), News & Activities, Corporate (B2B), Contact.

## 6. PRIMARY HEADLINE
Headline: "แพ็กเกจตรวจสุขภาพ" (Health Checkup Packages) — hero slide 1 of a
rotating carousel; headline changes per slide/campaign.
Subheadline: "รู้ก่อนรักษาได้ รวมดีลแพ็กเกจตรวจสุขภาพและความงามจากโรงพยาบาล
ในเครือ BDMS พร้อมส่วนลดพิเศษตลอดทั้งปี"

## 7. PRIMARY CTA
Action: Book/consult a doctor online, or shop a health package.
Button label: "ดูทั้งหมด" ("See All") on content modules; app-store badges
("ดาวน์โหลด" + App Store/Google Play) are the true primary conversion CTA,
persistent in the sticky top bar.

## 8. KEY DIFFERENTIATOR
Backed by BDMS — Thailand's largest hospital network — so every service
carries hospital-grade trust (named affiliated doctors, named partner
hospitals) rather than an anonymous telehealth app.

## 9. ANIMATION INTENSITY
Level: 1–2 (Almost none / Subtle). Confirmed from Site DNA 1.4/1.9 — no GSAP,
no scroll-triggered reveals, only stock carousel/tab-swap behavior. Preserve
this restraint; do not add cinematic motion the source brand doesn't use.

## 10. TECH STACK
Payload CMS (Node/TypeScript) as headless backend · Next.js (App Router)
frontend consuming Payload's REST/GraphQL/Local API · Tailwind CSS for
styling · Postgres via Supabase as Payload's database · deploy: Payload +
Next.js app on Vercel, database on Supabase. No animation library needed
beyond CSS transitions (matches source's near-zero motion budget).

## 11. CONTENT ASSETS
Logo: yes — capsule/pill mark (blue #2B7FFF top-left half, orange #FF4C14
bottom-right half) + "BeDee" wordmark + "Powered by BDMS" tagline (see Site
DNA 1.2). Photography: yes — real family/patient/doctor photography, warm
lighting, circular-crop treatment on hero; migrate actual WordPress media
library rather than substituting placeholders.

## 12. SECTION MODIFICATIONS
- Hero carousel: KEEP AS-IS — Slider collection in Payload, same layout.
- Service icon grid: KEEP AS-IS — simple repeater field, not a full collection.
- Secondary interest grid: KEEP AS-IS — repeater field.
- BDMS network logo strip: KEEP AS-IS — Partners/Hospitals collection.
- Doctor/Pharmacist expert tabs: KEEP AS-IS — Doctors collection with a
  `role` field (doctor/pharmacist) driving the tab filter.
- Health-mall promo: KEEP AS-IS — Products collection (or link-out block if
  shop.bedee.com stays a separate storefront, per Site DNA tech-stack note).
- Article grid: KEEP AS-IS — Posts collection with Category taxonomy.
- Footer: KEEP AS-IS — Globals (footer nav, social links).

ADDED sections (not found in source, but requested in your task brief):
- Testimonials collection: Site DNA Phase 1 found NO testimonial/review
  module anywhere on bedee.com (trust is carried by hospital-logo + named-
  doctor cards instead). Adding a Testimonials collection anyway per your
  brief's explicit ask — flagging that it has no 1:1 source-page mapping, so
  it will need a new template/placement (e.g. on service pages) rather than
  a like-for-like migration.
