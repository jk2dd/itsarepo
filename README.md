# Birthday site (static, "Confetti Garden" theme)

A warm, handmade birthday-gift site for my girlfriend. Birthday: Friday 23 October 2026, 00:00 Beirut time.

The visual language is **Confetti Garden**: a warm ivory base, huge softly drifting
rainbow color blobs, and one consistent HSV color system (S≈0.66, V≈0.96) so every
accent hue — red, orange, yellow, green, cyan, blue, violet, pink — is equally vivid.
Full design spec: `DESIGN-BRIEF.md`.

## How to run locally

ES modules do not work from `file://`, so serve the folder with a simple static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` on your phone or computer.

## Project structure

```
index.html          shell (hash routing), robots meta
robots.txt          disallows everything (private by design)
README.md
DESIGN-BRIEF.md     the full "Confetti Garden" design specification
css/                base.css, petals.css, gate.css, hub.css, play.css,
                    us.css, books.css, favorites.css, letter.css, celebrate.css
js/
  main.js           starts the app, shell-owned countdown pill + mute + petals
  router.js         hash routes, dynamic import() per section
  config.js         ALL personal content and settings (TODO_USER placeholders)
  time.js           all date logic (Beirut time via Intl)
  audio.js          mute state + birthday song
  petals.js         background multicolor confetti petals
  confetti.js       spectrum confetti burst
  sections/         gate.js hub.js play.js us.js books.js favorites.js letter.js celebrate.js
assets/
  books/            apology.pdf, partner-in-the-novel.pdf
  img/start-gallery/ five personal photos shown on the welcome screen
  img/book-covers/  cover previews for the two PDFs
  img/favorites/    photos for the Favorites garden (Wikimedia Commons, licensed;
                    fetched by the owner at build time, served locally)
  her-pic/          "Her Moments" personal photos (owner-supplied; UI bars
                    trimmed before display)
  fonts/            WOFF2 subsetted fonts (owner supplies)
  img/              photos, puzzle-original.png
  gifs/             animated stickers: us-flower-*.gif (Us section) and
                    gif-on-home-page/ (the three funny GIFs on the home page);
                    each has a -still.png twin for prefers-reduced-motion
  audio/            favorites-theme.mp3 + around-the-world.mp3 (Favorites player /
                    Celebration "Play song"; owner-picked, downloaded via yt-dlp)
```

Routes: `#/gate`, `#/hub`, `#/play`, `#/us`, `#/books`, `#/favorites`, `#/letter`, `#/celebrate`.

## Personal content (owner supplies)

Edit `js/config.js`. Every `TODO_USER` must be replaced before the site goes live:
1. Name/nickname for the gate (Elianty, Lily or Ellie).
2. Password, hint, gate text.
3. YouTube IDs for *Sway* and *L-O-V-E* + one sentence per song (`My Flower Girl` ID is already set).
4. Anne's Corner note.
5. The five supplied photos appear in the welcome-screen carousel.
6. `assets/img/puzzle-original.png` (the selected photo for the sliding puzzle).
7. Arabic letter text + optional photo.
8. Birthday song file `assets/audio/birthday-song.mp3` (3 MB max).
9. Final surprise text.

Fonts: Patrick Hand and Lemonada are bundled as subsetted WOFF2 files in `assets/fonts/`, with their SIL Open Font License files beside them. They are served locally; the site does not make runtime font requests.

## Testing

- `DEV_MODE` must be `false` before deployment.
- To test the birthday flip, set `DEV_MODE: true` and `DEV_NOW: '2026-10-22T23:59:50'` in `config.js`, or open `?now=2026-10-22T23:59:50` (only works when `DEV_MODE` is true). The countdown should flip to "Happy Birthday!" and Celebrate unlocks without a reload.
- Test screen sizes: 360×640, 390×844, 768×1024, 1280×800.
- `prefers-reduced-motion`: no petals, no typewriter, instant reveals.

## Privacy / constraints

- Static only: HTML, CSS, vanilla JS (ES modules). No backend, no framework, no build step.
- No analytics, no trackers.
- `index.html` has `<meta name="robots" content="noindex, nofollow">`; `robots.txt` disallows everything.
- Relative paths only.
- No personal dates on the site except her birthday and 2025-11-14.
- The password is checked in the browser and is only for fun — not security.
- Strip EXIF / location metadata from every photo before adding it.
- Total size under 20 MB (30 MB absolute max). The only external requests allowed are YouTube embeds.
