# DESIGN SPEC — Daybreak: Standup Zero for Switch

> **Team:** Attention is All You Need  
> **Hackathon:** WeMakeDevs × Switch "Flip the Switch"  
> **Reference layout:** amandaleepeers.com (structure and motion only — no copy, photos, logo, branding or code)

---

## 1. Reference Site Observations

Inspected via web research (direct browser DevTools not available in build environment):

| Property | Observed |
|---|---|
| Background | Very dark near-black; atmospheric, moody |
| Text | White/off-white bold geometric sans-serif headings |
| Nav | Sticky transparent top nav; streamlined anchor links |
| Headings | Oversized display, asymmetric; H1 hero overlaps imagery |
| Images | Slight geometric rotation (tilted), scroll-bound micro-interactions (Webflow IX2) |
| Scroll | Multi-layer parallax; elements move at different speeds |
| Spacing | Generous vertical padding; content breathes |
| Body column | Narrow centered reading column |
| Intro | Bold centered statement + short italic line beneath |
| Section open | Huge 2-line staggered heading (line 1 left, line 2 indented right) |
| Below heading | Bold label (year/tag), short paragraph, one underlined link |
| Footer | Minimal; social links or streaming icons |

> **Limitation:** Could not open the site in a live browser with DevTools during this build session. Exact pixel values, font family names, and CSS properties are inferred from documented Webflow case studies and web research rather than direct DOM inspection.

---

## 2. Colour Palette

```css
/* tokens */
--color-base:        #0e0e0e;   /* near-black page background */
--color-surface:     #161616;   /* slightly lifted surface (cards) */
--color-text:        #f4f1ea;   /* off-white body text */
--color-text-muted:  #9e9b93;   /* secondary text, timestamps */
--color-accent:      #f2a65a;   /* warm sunrise amber — links, active nav, highlights */
--color-label:       #8b7fc7;   /* muted dusk purple — small section labels */
--color-code-bg:     #1a1a1a;   /* code block background */
--color-border:      #2a2a2a;   /* subtle borders */
```

**WCAG AA compliance targets:**
- Body text `#f4f1ea` on `#0e0e0e` → contrast ratio ≈ 17.6:1 ✅ (AA + AAA)
- Accent `#f2a65a` on `#0e0e0e` → contrast ratio ≈ 7.3:1 ✅ (AA + AAA)
- Label `#8b7fc7` on `#0e0e0e` → contrast ratio ≈ 4.6:1 ✅ (AA)
- Muted text `#9e9b93` on `#0e0e0e` → contrast ratio ≈ 7.1:1 ✅ (AA)

**Usage rules:**
- Amber `#f2a65a`: links, active nav item, highlight strokes, sticky-note borders. Use sparingly.
- Purple `#8b7fc7`: small uppercase section labels only.
- Never use gradient blobs, glassmorphism, or particles.
- Sunrise panels (panel-01, panel-07) retain their warm tones against the dark base.

---

## 3. Typography

```css
/* Heading: bold geometric sans */
--font-heading: 'Montserrat', 'Arial Black', sans-serif;
--font-weight-heading: 800;

/* Body: readable geometric sans */
--font-body: 'Montserrat', 'Arial', sans-serif;
--font-weight-body: 400;
--font-weight-body-em: 500;

/* Code: monospace */
--font-code: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

/* Sticky notes ONLY */
--font-handwritten: 'Caveat', cursive;
```

**Sizing:**
```css
--text-hero:    clamp(4rem, 12vw, 10rem);   /* staggered section headings */
--text-h2:      clamp(2rem, 5vw, 3.5rem);   /* sub-headings */
--text-h3:      clamp(1.25rem, 3vw, 1.75rem);
--text-body:    1.125rem;                    /* 18px equivalent */
--text-small:   0.875rem;
--text-label:   0.75rem;                     /* uppercase labels */
--line-height-body: 1.7;
--line-height-heading: 1.1;
--letter-spacing-label: 0.12em;
```

**Rules:**
- Handwritten font (`Caveat`) used **only** on sticky-note components.
- `JetBrains Mono` for all code blocks, copy-code snippets, and inline code.
- No decorative fonts on headings — Montserrat 800 only.

---

## 4. Layout

```
Max page width: none (full viewport)
Body column:    max-width 680px, centered, px 24px side padding
Nav height:     56px fixed sticky
Section padding: 120px top, 80px bottom
```

**Staggered Heading Pattern:**
```
LINE ONE (left-aligned, font-size: var(--text-hero))
         LINE TWO (indented ~2.5rem right, same size)
```
Both lines shift slightly on scroll (parallax Y offset ±20px).

**Intro block:**
```
[centered, bold]  "The standup is already written."
[centered, light] "This is our story."
```

---

## 5. Components

### 5.1 Staggered Heading
```html
<div class="stagger-heading" data-parallax>
  <span class="stagger-line-1">BIG LINE</span>
  <span class="stagger-line-2">ONE.</span>
</div>
```
- Line 1: left-aligned
- Line 2: indented 2.5rem right, shifts 10–20px more than line 1 on scroll
- Reveal: fade + slide-up under 400ms, `prefers-reduced-motion` → fade only

### 5.2 Tilted Image Frame
```html
<figure class="tilt-frame" data-tilt="4" data-parallax-speed="0.3">
  <img src="…" alt="…" loading="lazy">
  <figcaption>Caption text</figcaption>
</figure>
```
- Rotation: `rotate(var(--tilt, 3deg))` — alternates ±3 to ±8 deg per panel
- Hover: lifts `translateY(-6px)`, slight de-tilt
- Parallax: `transform: translateY(var(--parallax-offset))` via IntersectionObserver + scroll
- Panels 5, 6, 7 (chat mockup, flow checklist, GitHub comment) show caption: **"Illustration of the intended flow"**

### 5.3 Sticky Note
```html
<div class="sticky-note" style="--note-hue: 45deg;">
  <span class="sticky-note__text">No link, no claim.</span>
</div>
```
- Font: Caveat only
- Background: warm amber-yellow `#f5e6a3`
- Box shadow: `4px 4px 12px rgba(0,0,0,0.4)`
- Slight rotation (1–3°), never parallax-moved

### 5.4 Agent Card
```html
<div class="agent-card" data-agent="scribe">
  <div class="agent-card__badge"><!-- SVG badge --></div>
  <h3 class="agent-card__name">Scribe</h3>
  <p class="agent-card__role">Drafts the daily brief from GitHub activity</p>
  <ul class="agent-card__traits">…</ul>
</div>
```
- Three cards: Scribe / Sentinel / Clerk
- Border: 1px `--color-border`; left accent stripe in `--color-accent`
- Badge: flat hand-drawn SVG icon (pencil, eye, checkmark motif)

### 5.5 Simulated Chat Panel
```html
<div class="chat-panel" aria-label="Mattermost conversation illustration">
  <div class="chat-panel__header">…</div>
  <div class="chat-panel__messages">…</div>
  <p class="chat-panel__caption">Illustration of the intended flow</p>
</div>
```
- Uses real message format from project design
- Dark surface `#161616`, monospace text, Mattermost-style layout
- Caption always visible; never presented as a real screenshot

### 5.6 Collapsible Detail Block
```html
<details class="detail-block">
  <summary class="detail-block__trigger">Architecture deep-dive</summary>
  <div class="detail-block__body">…</div>
</details>
```
- Animated open/close (max-height transition)
- Trigger shows amber `▶` indicator

### 5.7 Copy-Code Block
```html
<div class="code-block">
  <pre><code class="lang-bash">…</code></pre>
  <button class="code-block__copy" aria-label="Copy to clipboard">Copy</button>
</div>
```
- Background: `--color-code-bg`; JetBrains Mono
- Copy button shows "Copied!" checkmark for 2s

### 5.8 Verified / Unverified Checklist
```html
<ul class="feature-list">
  <li class="feature-list__item feature-list__item--verified">
    <span class="feature-list__icon">✓</span> Evidence-backed brief
  </li>
  <li class="feature-list__item feature-list__item--planned">
    <span class="feature-list__icon">◦</span> Scheduled trigger
  </li>
</ul>
```
- Verified: amber checkmark, full opacity
- Planned/unverified: muted circle, 60% opacity, label "(planned)"

### 5.9 Real-Asset Slot
```html
<div class="asset-slot" data-asset-key="brief">
  <!-- Shows illustration if real asset absent, real asset if present -->
  <img class="asset-slot__illustration" src="assets/panels/panel-05-chat-800.webp" alt="…">
  <img class="asset-slot__real" src="assets/real/brief.png" alt="…" hidden>
</div>
```
- `js/assets.config.js` lists which real files exist
- JS checks and swaps at page load; no server needed

---

## 6. Motion System

**Principle:** Subtle, editorial. Scroll reveals are cinematic but never distracting.

```js
// Scroll reveal
IntersectionObserver({ threshold: 0.15 })
// Element enters viewport → adds .is-visible
// CSS transition: opacity 0→1, translateY 24px→0, duration 350ms, ease-out

// Parallax images
// On scroll: element translateY = scrollY * speed (0.1–0.4)
// Applied via requestAnimationFrame, only when element is in viewport

// Staggered heading parallax
// Line 1: speed 0.08, Line 2: speed 0.14 (line 2 moves slightly faster)

// Hover lift on tilt-frame
// transform: rotate(calc(var(--tilt) * 0.5deg)) translateY(-6px)
// transition: 220ms ease-out
```

**`prefers-reduced-motion` fallback:**
```css
@media (prefers-reduced-motion: reduce) {
  .tilt-frame, .stagger-heading span, [data-parallax] {
    transform: none !important;
    transition: opacity 300ms ease !important;
  }
}
```
No particles. No gradient blobs. No glassmorphism.

---

## 7. SVG Assets (hand-drawn, flat style)

All extra decorative imagery is SVG-in-code, **not AI-generated photos**:

| Asset | File | Description |
|---|---|---|
| Sun over hills divider | `assets/svg/sun-divider.svg` | Minimal line-art sunrise, 1px stroke |
| Agent badge: Scribe | `assets/svg/badge-scribe.svg` | Pencil icon, circle outline |
| Agent badge: Sentinel | `assets/svg/badge-sentinel.svg` | Eye/radar icon |
| Agent badge: Clerk | `assets/svg/badge-clerk.svg` | Checkmark/stamp icon |
| Torn section divider | `assets/svg/torn-divider.svg` | Wavy torn-paper line |
| Arrow annotation | `assets/svg/arrow.svg` | Loose hand-drawn curved arrow |

**Style rules:** 1.5px stroke weight, `--color-accent` or `--color-text` only, no fill gradients, viewBox normalized to 100×100 or 200×40 as appropriate.

---

## 8. Real Asset Slots

```
assets/real/
  brief.png          ← real screenshot of daily brief with evidence links
  proposals.png      ← real screenshot of Sentinel proposals
  approval-github.png ← real screenshot of Clerk posting to GitHub after approval
  friday-rule.gif    ← GIF of Friday-rule change + next-run compliance
  cockpit.png        ← Daybreak Cockpit (read-only web dashboard) screenshot
  demo.mp4           ← Full demo video
```

Each slot is wired via `js/assets.config.js`. The page shows the illustration panel until the real file exists; swaps automatically on load.

---

## 9. Navigation

```
HOME | PROBLEM | HOW IT WORKS | WHY SWITCH | ENGINEERING | LEARNED | REPO
```

- Position: `position: sticky; top: 0; z-index: 100`
- Background: `transparent` → `rgba(14,14,14,0.9) + backdrop-filter: blur(12px)` after 60px scroll
- Active item: `--color-accent` colour
- Mobile: collapses to hamburger at 640px breakpoint
- Scroll-spy: `IntersectionObserver` updates active link as sections enter viewport

---

## 10. Sections (IDs)

| Nav Label | Section ID | Content (Phase 2) |
|---|---|---|
| HOME | `#home` | Hero: title, subtitle, intro statement |
| PROBLEM | `#problem` | Section 1: The coordination problem |
| HOW IT WORKS | `#how-it-works` | Section 2: Agents, evidence rule, approval model |
| WHY SWITCH | `#why-switch` | Section 3: Room memory, multi-agent, Friday-rule |
| ENGINEERING | `#engineering` | Section 4: Implementation decisions, guardrails |
| LEARNED | `#learned` | Section 5: Real lessons, limitations, roadmap |
| REPO | `#repo` | CTA: repo link, setup command, demo GIF |

---

## 11. Semantic & Accessibility

- One `<h1>` per page (site title in `<nav>` or hero)
- Section headings: `<h2>` for stagger headings, `<h3>` for sub-components
- All images have descriptive `alt` text
- Illustration panels have `aria-label="Illustration of the intended flow"`
- `lang="en"` on `<html>`
- Viewport meta tag, OG meta tags (title, description, image)
- Focus-visible styles for keyboard navigation
- `<details>/<summary>` for collapsibles (native accessible)

---

## 12. File Structure

```
Blog new/
├── index.html
├── css/
│   ├── tokens.css        ← CSS custom properties
│   ├── base.css          ← reset, body, typography, layout
│   └── components.css    ← all component styles
├── js/
│   ├── main.js           ← scroll reveal, parallax, nav, copy-code
│   └── assets.config.js  ← real-asset presence map + swap logic
├── assets/
│   ├── source/
│   │   └── collage.png   ← original source image
│   ├── panels/
│   │   ├── panel-01-title-1600.webp / -800.webp
│   │   ├── panel-02-standup-1600.webp / -800.webp
│   │   ├── panel-03-agents-1600.webp / -800.webp
│   │   ├── panel-04-flow-1600.webp / -800.webp
│   │   ├── panel-05-chat-1600.webp / -800.webp
│   │   ├── panel-06-github-1600.webp / -800.webp
│   │   ├── panel-07-learned-1600.webp / -800.webp
│   │   └── panel-08-roadmap-1600.webp / -800.webp
│   ├── real/
│   │   ├── brief.png (empty slot)
│   │   ├── proposals.png (empty slot)
│   │   ├── approval-github.png (empty slot)
│   │   ├── friday-rule.gif (empty slot)
│   │   ├── cockpit.png (empty slot)
│   │   └── demo.mp4 (empty slot)
│   └── svg/              ← hand-drawn flat SVGs (Phase 2)
└── docs/
    └── DESIGN_SPEC.md    ← this file
```

---

*Last updated: Nov 7 2026 — Phase 1 scaffold. Phase 2 will add full content, SVG assets and real screenshots.*
