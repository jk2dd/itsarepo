# DESIGN BRIEF — Full Front-End Redesign of the Birthday Gift Website

> Paste this entire document as the prompt given to the AI performing the redesign.
> It is a complete, self-contained brief. Do not invent content, names, or dates beyond what is here.

---

## 1. Mission

Completely redesign the front end of a static, private birthday-gift website.
The goal: transform it from a simple pink/green page into a **joyful, magical,
romantic, celebratory digital space** built on a **consistent full-spectrum color
system** — a rainbow that always looks like it belongs to one family.

The redesign is **visual only**:

- ✅ Rewrite all CSS, rework section markup (HTML strings inside the JS section
  modules), redesign icons, layout composition, decorative elements, and
  transitions.
- ❌ Do NOT change routes (`#/gate`, `#/hub`, `#/play`, `#/us`, `#/books`,
  `#/favorites`, `#/letter`, `#/celebrate`), routing logic, countdown/date logic,
  audio logic, password logic, unlock logic, or any content in `js/config.js`.
- ❌ Do NOT introduce frameworks, build steps, CDNs, external fonts, external
  requests (the only allowed external requests are the existing YouTube embeds),
  analytics, or trackers.

---

## 2. The Design Concept — "Confetti Garden"

A warm ivory paper world on which a full rainbow party happens:

- The **base** is calm and warm: ivory/warm white with huge, soft, slowly
  drifting color blobs. It never shouts; it holds everything together.
- The **celebration** is everywhere: cards, buttons, chips, illustrations, and
  confetti use the *entire spectrum* — every screen carries the full rainbow in a
  balanced, rhythmic way. No screen is monochrome; no screen is chaotic.
- Everything feels **round, soft and tactile**: big radii, squishy chips,
  sticker-style icons, gentle shadows.
- Motion is **soft and dreamy**: slow drifts, gentle fades, floating elements.
  The color celebrates; the motion breathes.

Mood keywords: joyful, magical, romantic, celebratory, cozy, hand-made.

---

## 3. Color System (the core of this brief)

**Rule: one HSV system, many hues.** Every accent color in the palette has the
same saturation (S ≈ 66%) and the same value (V ≈ 96%) — only the hue changes.
Never mix these accents with washed-out pastels of different brightness or with
neon colors outside the system.

### 3.1 Accent spectrum (S 0.66 / V 0.96, pure hue rotation)

| Token      | Hue | Hex       | Role                                        |
|------------|-----|-----------|---------------------------------------------|
| `--c-red`    | 4°  | `#F55E53` | Love, heart, primary buttons, Us section    |
| `--c-orange` | 28° | `#F59F53` | Play/games, puzzle, energy accents          |
| `--c-yellow` | 50° | `#F5DA53` | Celebration, stars, highlights, unlock      |
| `--c-green`  | 130°| `#53F56E` | Growth, Books, success states               |
| `--c-cyan`   | 186°| `#53E5F5` | Freshness, Favorites/music, water/air       |
| `--c-blue`   | 220°| `#5389F5` | Calm, Letter, trust, night-after-sunset     |
| `--c-violet` | 270°| `#A453F5` | Magic, mystery, Celebrate finale            |
| `--c-pink`   | 330°| `#F553A4` | Romance, petals, the Gate (her first sight) |

### 3.2 Tint level (S 0.15 / V 1.0 — the same hues in "paper" form)

Used for icon chip backgrounds, soft card washes, tag backgrounds, form fields:

| Token       | Hex       |
|-------------|-----------|
| `--t-red`     | `#FFDBD9` |
| `--t-orange`  | `#FFEBD9` |
| `--t-yellow`  | `#FFF9D9` |
| `--t-green`   | `#D9FFDF` |
| `--t-cyan`    | `#D9FBFF` |
| `--t-blue`    | `#D9E5FF` |
| `--t-violet`  | `#ECD9FF` |
| `--t-pink`    | `#FFD9EC` |

### 3.3 Deep-ink level (S 0.58 / V 0.46 — the same hues, for emphasis text)

Used sparingly for colored text on light surfaces (kickers, links, prices,
locked-card hints). Never used for body text:

| Token      | Hex       |
|------------|-----------|
| `--i-red`    | `#753631` |
| `--i-orange` | `#755131` |
| `--i-yellow` | `#756A31` |
| `--i-green`  | `#31753D` |
| `--i-cyan`   | `#316E75` |
| `--i-blue`   | `#314875` |
| `--i-violet` | `#533175` |
| `--i-pink`   | `#753153` |

### 3.4 Neutrals (warm, derived from the ivory paper world)

| Token       | Value        | Role                                        |
|-------------|--------------|---------------------------------------------|
| `--paper`   | `#FFFBF3`    | Page base (warm ivory)                      |
| `--card`    | `#FFFFFF` at 94–97% opacity | Card surfaces                 |
| `--text`    | `#3A2A38`    | Body text (warm dark plum-brown — WCAG-compliant on paper and on all tints) |
| `--text-soft` | `#8A6E7E`  | Secondary text                              |
| `--line`    | `rgba(58,42,56,.10)` | Hairline borders                    |

### 3.5 Usage rules (read carefully — these keep harmony)

1. **Rotation rhythm:** when a screen shows multiple accent colors together
   (hub cards, confetti, chips), follow the spectrum order red → orange →
   yellow → green → cyan → blue → violet → pink. Never place anti-adjacent hues
   (e.g. red next to cyan) as direct neighbours in a row.
2. **No neon isolation:** an accent fill always sits inside a rounded white or
   tint container, or carries white/dark text per §3.6. Accents are never used
   as bare thin text on paper — colored text on paper must use the
   **deep-ink** level.
3. **Per-hue text rule (accessibility):**
   - On `yellow`, `green`, `cyan`, `orange` accent fills → use `--text`
     (dark plum) for labels. Measured contrast 6.3:1 – 9.6:1.
   - On `red`, `blue`, `violet`, `pink` accent fills → use white `#FFFFFF`
     text; if white falls below 4.5:1 (violet ≈ 4.0:1), switch the surface to
     its **tint** background with deep-ink text instead.
   - Body text never sits directly on accent fills.
4. **Gradients** only ever blend two *adjacent* hues of the system
   (e.g. pink→red, orange→yellow, cyan→blue, violet→pink) at equal S/V.
5. The old palette (`#FF4F81` pink + `#5C9A72` green on `#FFF4F6`) is fully
   retired. Pink and green still exist, but as two of eight equal voices —
   no color is "the" color anymore.
6. Focus rings: `outline: 3px solid var(--c-violet); outline-offset: 3px;`
   (violet is the one hue reserved for accessibility, so keyboard rings are
   identical everywhere).

---

## 4. Background System

- Base: `--paper` (warm ivory), full-viewport, fixed.
- Behind content: **4–6 huge soft color blobs** (`–r: 40–60vmax`, opacity
  0.10–0.18, blur/eased radial gradients) in a slowly rotating set of hues drawn
  from the accent spectrum. Blobs drift on 30–60 s loops (translate + scale).
- Each section may bias its blob hues toward its own theme color but must keep
  at least 3 hues present — the rainbow-journey effect (celebrating section) brings all 8.
- Blobs sit behind everything (`z-index: 0`), content above (`z-index: 1+`),
  and never reduce text contrast (all text remains on paper/card/tint surfaces).
- Replace the current single-pink falling petals with **multicolored drifting
  confetti petals**: small rounded shapes (circle, petal, squircle, mini-heart)
  colored by cycling through the 8 accents, opacity 0.35–0.6, drifting slowly
  downward with slight sway. Keep the existing `petals.js` API; only restyle.

---

## 5. Typography

Rounded & playful, minimal external weight:

- **Display (headings, card titles, buttons):** `var(--font-display)` —
  a rounded/chunky font from `assets/fonts/display.woff2` (owner supplies).
  Fallback stack: `'GiftDisplay', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif`.
  Good free options the owner can subset later: Baloo 2, Fredoka, Nunito Black.
- **Body:** `var(--font-body)` — `'GiftBody', 'Segoe UI', system-ui, sans-serif`
  (friendly humanist; Nunito, Quicksand or Varela Round are good candidates).
- **Arabic (Letter section):** keep `'Aref Ruqaa'` from
  `assets/fonts/arief-ruqaa.woff2`; the Letter section must render `dir="rtl"`.
- Type scale (fluid): display `clamp(28px, 6vw, 44px)`, h2
  `clamp(22px, 4.5vw, 30px)`, body 15–16px, small 13–14px. Headings get generous
  `line-height: 1.12` and a slight warm letter-spacing on uppercase kickers.
- No glow, no 3D text, no rainbow-gradient text on paragraphs. At most, the
  hero "Happy Birthday" moment may use an adjacent-hue gradient text.

---

## 6. Shape, Iconography & Decoration (balanced level)

- **Radius:** cards 20–24px, chips/buttons fully rounded (pill or squircle).
  Shadow: `0 14px 30px rgba(58,42,56,.08)`, soft, never harsh.
- **Icons:** sticker style — each icon sits in a squircle chip filled with the
  icon's tint color, with the icon glyph in the matching accent or deep-ink
  color. Hub cards each get a different hue (rotation order).
- **Signature motifs** (recurring, hand-made feel):
  1. **Confetti sprinkle** — tiny 3-5px squares/dots/hearts scattered around
     section headers (SVG/CSS only, ≤10 per screen).
  2. **Sticker labels** — small rotated (−6°…+6°) pill "stickers" for tags like
     "For you", "Locked", "New".
  3. **Washi tape strips** — semi-transparent tint-colored strips at the top
     edge of "letter/paper" cards. Used only in Us/Books/Letter sections.
- Use SVG inline (currentColor) for icons; no icon font, no external images for
  decoration (photos come only from `assets/img/`).
- Keep decoration ≤ ~15% of any screen's area — decoration crowns the content,
  never crowds it.

---

## 7. Motion Language — "Soft & dreamy"

- Entrances: slow soft rise (`translateY(14px) → 0`, opacity 0→1, 500–700ms,
  `cubic-bezier(.22,.8,.35,1)`, staggered 60–90ms among siblings).
- Interaction: gentle scale on press (`scale(0.97)`), hover lift
  (`translateY(-3px)` + soft shadow grow). NO bounce-bezier overshoot.
- Ambient: blob drift (§4), confetti petal fall, subtlefloating of decorative
  stickers (3-6s ease-in-out yoyo).
- Celebrate section only: slow confetti burst on unlock (reuse `confetti.js`,
  recolor to the full spectrum) + a gentle rainbow aurora gradient behind the
  final message. `beat` animation becomes a soft glow pulse, not a scale throb.
- **EVERY** new animation must be disabled under
  `@media (prefers-reduced-motion: reduce)` (instant states, no ambient loops) —
  this is a hard requirement; test it.

---

## 8. Section-by-Section Redesign Specs

Design each screen mobile-first (360px wide first), then scale up.
`height: 100%` scroll containers and the fixed shell header (countdown pill +
mute + home) stay conceptually the same but get restyled:

- **Shell header:** pill/buttons in white glass (blur 12px), 2px border in
  `--c-pink` / `--c-green` / `--c-violet`. Countdown pill when celebrating:
  yellow tint bg with deep-yellow ink text, soft glow pulse.
- **Gate (`#/gate`) — "the knock at the door."** Centered composition on ivory
  with pink/red-tinted blobs. Big rounded card panel looking like a gift box
  lid (ribbon made of pink→red gradient strip on top). Typewriter greeting,
  then password field styled like a little rounded keypad/door plate in
  `t-pink`. Wrong password: card does a gentle head-shake (2×), hint sticker
  appears. Correct: ribbon "unties" (rotate/fade), card splits open, soft pink
  confetti drift, route to hub.
- **Hub (`#/hub`) — "the rainbow table of gifts."** 2-col grid (3-col ≥768px).
  Each card gets a different accent hue following spectrum rotation (red,
  orange, yellow, green, cyan, blue, violet, pink for the 8 destinations),
  white card with tint-colored icon chip, sticker with teaser text. Locked
  cards: grayscale 0.6 + small padlock sticker in deep-ink gray. Cards are
  friendly rectangles with a big radius; hovering tilts the sticker, not the
  whole card.
- **Us (`#/us`) — "our scrapbook spread."** Ivory paper card with washi tape on
  corners, polaroid-style photo frames (white matte + subtle rotation −3°/+2°)
  for the five gallery photos, captions in body font, time counter as six
  spectrum-accent tiles (tint `--t-*` backgrounds, `--i-*` numbers, per unit)
  with a small pop when a value flips. Sections within the
  page separated by dotted confetti dividers.
- **Books (`#/books`) — "the little library."** Two book cards standing on a
  soft `t-green` shelf line. Cover previews from `assets/img/book-covers/`,
  each with a colored bookmark ribbon (orange for one, cyan for the other).
  "Read" buttons as pill buttons in the matching accent with white text.
- **Favorites (`#/favorites`) — "the jukebox corner."** 3 song cards, each a
  rounded "cassette/vinyl" card with its own accent (cyan / blue / violet).
  YouTube embeds inside rounded frames with an accent border. Song note text
  on the card under the player in soft text. My Flower Girl is pre-played.
- **Play (`#/play`) — "the sun workshop."** Sliding puzzle framed in a
  `t-yellow` squircle with a `--c-orange` border; a small win-state confetti
  drift; "peek at the picture" toggle shows `assets/img/puzzle-original.png`
  ghosted under the tiles.
- **Letter (`#/letter`) — "the sealed envelope."** A cream paper card, ruled
  lines faint (`--line`), Arabic text `dir="rtl"`, `font-arabic`, generous
  paragraphs, optional photo beside/above with a violet-tint washi tape. Opens
  with a soft unfold animation (max-height or clip-path reveal). Cta to
  Celebrate at the end (if still locked, show the countdown sticker instead).
- **Celebrate (`#/celebrate`) — "the whole rainbow, together."** The
  destination where every hue appears at once: a big hero card with a
  full-spectrum confetti ring, the final surprise message in display font,
  photo in a polaroid frame, and the recolored confetti burst. All 8 accents
  used in rotation, none dominant. This is the emotional climax — generous
  spacing, slow gentle ambient drift, and the celebrating countdown pill.

---

## 9. Technical & Accessibility Requirements

- Vanilla CSS in the existing `css/*.css` files (restyle each, keep file names),
  CSS custom properties in `base.css` for every token defined in §3. JS section
  files may only be modified in their HTML-template strings and class names —
  behavior must remain unchanged.
- Mobile-first; test 360×640, 390×844, 768×1024, 1280×800.
- All text readable: `--text` on paper/cards/tints always ≥ 7:1; white text on
  accent fills only when ≥ 4.5:1 (see per-hue rule §3.5.3). Verify with a
  contrast checker.
- Keyboard navigable in same DOM order as today; focus rings per §3.5.6.
- `prefers-reduced-motion: reduce` disables every ambient loop, confetti,
  petals, and typewriter (instant reveal) — non-negotiable.
- No external requests other than existing YouTube embeds. No layout shift from
  confetti/petals (`pointer-events: none`, `position: fixed/absolute`).
- Keep total asset weight under the current ceiling; no new binary assets.
- Respect the privacy constraints in `README.md` (noindex, no analytics,
  relative paths only).

---

## 10. Deliverables

1. Restyled/improved versions of every file in `css/` and the HTML template
   strings inside each file in `js/sections/`.
2. Updated `js/petals.js` styling (multicolor drift) and `js/confetti.js`
   (spectrum confetti) — API/behavior preserved.
3. No `js/config.js` changes. No route or logic changes.
4. A short summary of what changed visually per section, plus a note on how to
   test (serve with `python3 -m http.server 8000`, DEV_MODE for the midnight
   flip).

---

## 11. Out of Scope / Do Not Touch

- Do not invent personal content, names, dates, letters, or song notes.
- Do not replace `TODO_USER` placeholders with fabricated text.
- Do not add frameworks, npm, bundlers, CDNs, cookies, or storage beyond what
  already exists.
- Do not change passwords, dates, route names, or the PDF/audio/image assets.
