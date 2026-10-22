// favorites.js — "Her world": a sticker collage she can drag, themed cards,
// auto-playing music, Fairouz + Ariana, sewing/crochet, her moments, sweets.
import { confetti } from '../confetti.js?v=2';

const IMG = 'assets/img/favorites/';
const THEME_SONG = 'assets/audio/favorites-theme.mp3';
const TRACKS = [
  { src: THEME_SONG, name: 'Caramelldansen' },
  { src: 'assets/audio/around-the-world.mp3', name: 'Around the World (La La La)' },
];

// Collage board: photo stickers she can drag around (tap = little heart burst).
const STICKERS = [
  { img: 'rose-1.jpg',     tag: 'Roses',                 x: 2,  y: 4,  r: -7, w: 96 },
  { img: 'flower-1.jpg',   tag: 'Peonies',               x: 22, y: 3,  r: 5,  w: 104 },
  { img: 'crochet-2.jpg',  tag: 'Crochet mandala',       x: 45, y: 2,  r: -4, w: 128 },
  { img: 'dress-2.jpg',    tag: 'Dreamy gowns',          x: 74, y: 5,  r: 8,  w: 96 },
  { img: 'sewing-1.jpg',   tag: 'Old machines',          x: 3,  y: 36, r: 6,  w: 112 },
  { img: 'thread-1.jpg',   tag: 'Ribbon shelves',        x: 28, y: 33, r: -6, w: 104 },
  { img: 'doll-1.jpg',     tag: 'Unicorn love',          x: 54, y: 36, r: 5,  w: 116 },
  { img: 'doll-4.jpg',     tag: 'Octopus',               x: 80, y: 30, r: -8, w: 100 },
  { img: 'milktea-1.jpg',  tag: 'Milk tea',              x: 9,  y: 66, r: -4, w: 100 },
  { img: 'choco-1.jpg',    tag: 'Chocolate',             x: 33, y: 69, r: 7,  w: 104 },
  { img: 'ariana-2.jpg',   tag: 'Ariana',                x: 58, y: 66, r: -7, w: 108 },
  { img: 'fairuz-1.jpg',   tag: 'Fairouz',               x: 82, y: 64, r: 4,  w: 100 },
];

const CARDS = [
  {
    key: 'fairuz', accent: 'pink', kicker: 'The nightingale of Lebanon', title: 'Fairouz',
    caption: 'One of the most beloved voices of the Arab world.',
    imgs: ['fairuz-1.jpg', 'fairuz-2.jpg', 'fairuz-3.jpg'],
    yt: [
      { id: (C) => C.ytFairuzBridal, title: 'Eswaret El Aroos' },
      { id: (C) => C.ytFairuzNay, title: 'Aatini Al Nay' },
    ],
  },
  {
    key: 'ariana', accent: 'violet', kicker: 'The pop sparkle', title: 'Ariana Grande',
    caption: 'Ponytail, whistle notes, and a whole era of energy.',
    imgs: ['ariana-1.jpg', 'ariana-2.jpg'],
    yt: [{ id: (C) => C.ytAriana, title: 'thank u, next' }],
  },
  {
    key: 'sewing', accent: 'cyan', kicker: 'Where things are made', title: 'The Atelier',
    caption: 'Machines, ribbons and pearl pins — the craft corner.',
    imgs: ['sewing-1.jpg', 'thread-1.jpg', 'pin-1.jpg'],
  },
  {
    key: 'crochet', accent: 'green', kicker: 'Loop by loop', title: 'Yarn & Friends',
    caption: 'Bright mandalas, flowers and little handmade friends.',
    imgs: ['crochet-2.jpg', 'crochet-3.jpg', 'doll-1.jpg', 'doll-2.jpg', 'doll-3.jpg', 'doll-4.jpg'],
    imgChips: {
      'crochet-2.jpg': 'Mandala',
      'crochet-3.jpg': 'Flowers',
      'doll-1.jpg': 'Unicorn',
      'doll-2.jpg': 'Bear in a sweater',
      'doll-3.jpg': 'Mint teddy',
      'doll-4.jpg': 'Octopus & star',
    },
  },
  {
    key: 'wardrobe', accent: 'blue', kicker: 'Runway & ruffles', title: 'The Wardrobe',
    caption: 'Modern couture — blues, scarlets, magenta and lace.',
    imgs: ['dress-1.jpg', 'dress-2.jpg', 'dress-3.jpg', 'dress-4.jpg', 'dress-5.jpg'],
    imgChips: {
      'dress-1.jpg': 'Cobalt cape',
      'dress-2.jpg': 'High-low flames',
      'dress-3.jpg': 'Blue halter',
      'dress-4.jpg': 'Scarlet laces',
      'dress-5.jpg': 'Rose-hat couture',
    },
  },
  {
    key: 'sweets', accent: 'yellow', kicker: 'Row of two, please', title: 'Sweet Corner',
    caption: 'Milk tea with pearls and a box of chocolates.',
    imgs: ['milktea-1.jpg', 'choco-1.jpg', 'choco-2.jpg'],
  },
];

const ROSE_PETAL_COLORS = ['#F553A4', '#F55E53', '#FFD9EC', '#F58FB9', '#D9FFDF'];

// Her own moments (owner-supplied) — trimmed from her story screenshots.
const HER_PIC = 'assets/her-pic/';
const HER = [
  { src: 'her-cute.jpg',    cap: 'The cutester',   pos: '50% 32%', big: true },
  { src: 'her-journal.jpg', cap: 'Journal queen',  wide: true },
  { src: 'her-glam.jpg',    cap: 'November glow',  wide: true },
  { src: 'her-hearts.jpg',  cap: 'Doodle hearts',  pos: '50% 44%' },
  { src: 'her-mini.jpg',    cap: 'Mirror sparkle', wide: true },
  { src: 'her-nails.jpg',   cap: 'Nail day',       pos: '50% 55%' },
  { src: 'her-star.jpg',    cap: 'Her little star', pos: '50% 62%' },
  { src: 'her-dress.jpg',   cap: 'Her art',        pos: '50% 30%' },
  { src: 'her-white.jpg',   cap: 'Soft white',     pos: '50% 28%' },
  { src: 'her-green.jpg',   cap: 'That green dress', wide: true },
];

export async function init(el, ctx) {
  const CONFIG = ctx.CONFIG;

  el.innerHTML = `
    <div class="fav">
      <header class="fav-hero">
        <svg class="fav-garland" viewBox="0 0 340 46" aria-hidden="true">
          <path d="M4 30 Q60 6 110 26 Q160 44 210 20 Q260 0 336 26" fill="none" stroke="var(--i-green)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 6"/>
          <g transform="translate(28 20)"><g class="rose rose-1"><use href="#favrose"/></g></g>
          <g transform="translate(96 14)"><g class="rose rose-2"><use href="#favrose"/></g></g>
          <g transform="translate(168 22)"><g class="rose rose-3"><use href="#favrose"/></g></g>
          <g transform="translate(240 10)"><g class="rose rose-4"><use href="#favrose"/></g></g>
          <g transform="translate(306 18)"><g class="rose rose-5"><use href="#favrose"/></g></g>
        </svg>
        <h2 class="fav-heading">For you baby, I hope you love it</h2>

        <div class="fav-player">
          <div class="vinyl" id="fav-vinyl">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="#3A2A38"/>
              <circle cx="32" cy="32" r="30" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1"/>
              <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1"/>
              <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1"/>
              <circle cx="32" cy="32" r="13" fill="#F5DA53"/>
              <circle cx="32" cy="32" r="5" fill="#3A2A38"/>
              <path d="M32 27 v-10" stroke="#756A31" stroke-width="1.4"/>
              <text x="32" y="26" text-anchor="middle" font-size="5" fill="#756A31" font-family="sans-serif">FAVORITES</text>
            </svg>
          </div>
          <div class="fav-player-copy">
            <span class="fav-song-title">Now playing in the garden</span>
            <span class="fav-song-name" id="fav-song-name">…</span>
          </div>
          <button class="vinyl-btn vinyl-btn-track" id="fav-track-prev" type="button" aria-label="Previous song">&#8249;</button>
          <button class="vinyl-btn" id="fav-music-btn" type="button" aria-label="Play or pause the music">&#9835;</button>
          <button class="vinyl-btn vinyl-btn-track" id="fav-track-next" type="button" aria-label="Next song">&#8250;</button>
        </div>
        <button class="fav-tapstart" id="fav-tapstart" type="button" hidden>Tap to start the music &#127925;</button>
      </header>

      <section class="fav-collagen">
        <div class="fav-collage-sticker">Drag your favorite things around</div>
        <div class="fav-board" id="fav-board"></div>
      </section>

      <div class="fav-cards" id="fav-cards"></div>

      <section class="fav-her">
        <svg class="fav-her-string" viewBox="0 0 340 26" aria-hidden="true">
          <path d="M2 14 Q90 3 170 13 Q250 23 338 13" fill="none" stroke="var(--i-violet)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2.5 5"/>
          <g transform="translate(58 7)"><g class="pin pin-1"><use href="#favarit"/></g></g>
          <g transform="translate(170 15)"><g class="pin pin-2"><use href="#favarit"/></g></g>
          <g transform="translate(282 10)"><g class="pin pin-3"><use href="#favarit"/></g></g>
        </svg>
        <span class="fav-her-kicker">The chapter that is hers</span>
        <div class="her-wall" id="fav-her-wall"></div>
        <div class="fav-yt">
          <div class="fav-yt-video" data-ytid="${CONFIG.ytHerCry}" data-title="Her anthem">
            <div class="yt-facade" role="button" tabindex="0" aria-label="Play her anthem">
              <div class="yt-play">&#9658;</div>
            </div>
          </div>
          <span class="fav-yt-title">Her anthem — Cry · Cigarettes After Sex</span>
        </div>
      </section>

      <div class="anne">
        <h3 class="anne-title">Anne&#8217;s Corner</h3>
        <div class="anne-svg" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <path d="M20 90 Q60 20 100 90 L20 90 Z" fill="#D9FFDF" stroke="#31753D" stroke-width="4" stroke-linejoin="round"/>
            <rect x="48" y="70" width="24" height="14" fill="#31753D"/>
            <circle cx="34" cy="50" r="7" fill="#F5DA53" opacity="0.95"/>
            <circle cx="60" cy="44" r="7" fill="#F59F53" opacity="0.95"/>
            <circle cx="86" cy="50" r="7" fill="#F5DA53" opacity="0.95"/>
            <circle cx="46" cy="62" r="5" fill="#5389F5" opacity="0.95"/>
            <circle cx="74" cy="62" r="5" fill="#53E5F5" opacity="0.95"/>
          </svg>
        </div>
        <p class="anne-note">${escapeHtml(clean(CONFIG.anneNote))}</p>
      </div>
    </div>
  `;

  // Hidden defs: a reusable rose for the garland
  el.insertAdjacentHTML('beforebegin', `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <defs>
        <g id="favrose">
          <circle r="9" fill="var(--c-pink, #F553A4)"/>
          <circle r="9" fill="none" stroke="var(--i-pink, #753153)" stroke-width="1.6"/>
          <path d="M-4 -4 A5 5 0 0 1 4 2 A3 3 0 0 1 -1 3" fill="none" stroke="var(--i-pink, #753153)" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M-9 4 Q0 12 9 4" stroke="#31753D" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
        <g id="favarit">
          <path d="M0 -5 C 3.2 -9.2, 9 -5.6, 9 -1.4 C 9 2.6, 3.6 5.4, 0 8.4 C -3.6 5.4, -9 2.6, -9 -1.4 C -9 -5.6, -3.2 -9.2, 0 -5 Z" fill="var(--c-pink, #F553A4)"/>
          <circle cx="0" cy="-1" r="2" fill="rgba(255,255,255,.75)"/>
          <path d="M-2 10 L0 14 L2 10" stroke="#31753D" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        </g>
      </defs>
    </svg>
  `);

  const fav = el.querySelector('.fav');

  /* ---------- 1. Music player (2 tracks, autoplay attempt + tap-start fallback) ---------- */
  const player = new Audio(TRACKS[0].src);
  player.loop = true;
  player.volume = 0.6;
  player.preload = 'auto';
  let trackIndex = 0;
  let musicStarted = false;
  const vinyl = el.querySelector('#fav-vinyl');
  const musicBtn = el.querySelector('#fav-music-btn');
  const trackPrev = el.querySelector('#fav-track-prev');
  const trackNext = el.querySelector('#fav-track-next');
  const tapStart = el.querySelector('#fav-tapstart');
  const songName = el.querySelector('#fav-song-name');
  songName.textContent = TRACKS[0].name;

  function setPlayingUI(playing) {
    vinyl.classList.toggle('spinning', playing);
    musicBtn.innerHTML = playing ? '&#10073;&#10073;' : '&#9835;';
    fav.classList.toggle('music-on', playing);
  }
  function setTrack(i) {
    trackIndex = (i + TRACKS.length) % TRACKS.length;
    songName.textContent = TRACKS[trackIndex].name;
    player.src = TRACKS[trackIndex].src;
    if (musicStarted) {
      player.play().then(() => setPlayingUI(true)).catch(() => {
        musicStarted = false;
        tapStart.hidden = false;
      });
    }
  }
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    player.play().then(() => setPlayingUI(true)).catch(() => {
      musicStarted = false;
      tapStart.hidden = false;
    });
  }
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (player.paused) {
      musicStarted = true;
      player.play().then(() => setPlayingUI(true)).catch(() => {
        musicStarted = false;
        tapStart.hidden = false;
      });
    } else {
      player.pause();
      setPlayingUI(false);
      musicStarted = false;
    }
  });
  trackPrev.addEventListener('click', (e) => { e.stopPropagation(); setTrack(trackIndex - 1); });
  trackNext.addEventListener('click', (e) => { e.stopPropagation(); setTrack(trackIndex + 1); });
  tapStart.addEventListener('click', (e) => {
    e.stopPropagation();
    tapStart.hidden = true;
    startMusic();
  });

  /* ---------- 2. Local rose petals drifting in this section ---------- */
  const petalCount = ctx.reduced ? 0 : 8;
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('div');
    p.className = 'fav-petal';
    p.style.left = (Math.random() * 100) + '%';
    p.style.background = ROSE_PETAL_COLORS[i % ROSE_PETAL_COLORS.length];
    p.style.animationDuration = (9 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.setProperty('--w', (8 + Math.random() * 8) + 'px');
    p.style.setProperty('--r', (360 + Math.random() * 360) + 'deg');
    fav.appendChild(p);
  }

  /* ---------- 3. Draggable sticker collage ---------- */
  const board = el.querySelector('#fav-board');
  STICKERS.forEach((s, i) => {
    const st = document.createElement('div');
    st.className = 'fav-sticker' + (s.w > 110 ? ' big' : '');
    st.style.left = s.x + '%';
    st.style.top = s.y + '%';
    st.style.setProperty('--r', s.r + 'deg');
    st.style.zIndex = i % 3;
    st.innerHTML = `
      <span class="fav-sticker-frame">
        <img src="${IMG}${s.img}" alt="${s.tag}" loading="lazy" draggable="false">
        <span class="fav-sticker-tag">${s.tag}</span>
      </span>
    `;
    board.appendChild(st);
    wireSticker(st);
  });

  function wireSticker(st) {
    let active = false, moved = false, draggingZ = 10;
    let off = { x: 0, y: 0 };
    const down = (e) => {
      e.preventDefault(); e.stopPropagation();
      active = true; moved = false;
      st.classList.add('dragging');
      st.style.zIndex = 30;
      const fr = st.getBoundingClientRect();
      off.x = e.clientX - fr.left;
      off.y = e.clientY - fr.top;
      try { st.setPointerCapture(e.pointerId); } catch (err) {}
    };
    const move = (e) => {
      if (!active) return;
      moved = true;
      const br = board.getBoundingClientRect();
      let x = e.clientX - br.left - off.x;
      let y = e.clientY - br.top - off.y;
      x = Math.max(-20, Math.min(br.width - st.offsetWidth + 20, x));
      y = Math.max(-16, Math.min(br.height - st.offsetHeight + 16, y));
      st.style.left = x + 'px';
      st.style.top = y + 'px';
    };
    const up = (e) => {
      if (!active) return;
      active = false;
      st.classList.remove('dragging');
      draggingZ += 1;
      st.style.zIndex = draggingZ;
      if (!moved) tapSticker(st, e);
    };
    st.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  function tapSticker(st, e) {
    st.classList.remove('wiggle');
    void st.offsetWidth;
    st.classList.add('wiggle');
    const br = board.getBoundingClientRect();
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;pointer-events:none;z-index:40;';
    host.style.left = (e.clientX - br.left) + 'px';
    host.style.top = (e.clientY - br.top) + 'px';
    board.appendChild(host);
    confetti.burst(host, 14);
    setTimeout(() => host.remove(), 800);
  }

  /* ---------- 3.5 Her Moments wall ---------- */
  const herWall = el.querySelector('#fav-her-wall');
  HER.forEach((h, i) => {
    const item = document.createElement('figure');
    item.className = 'her-pola' + (h.wide ? ' wide' : '') + (h.big ? ' big' : '');
    item.style.setProperty('--r', (((i % 3) - 1) * 2.6 + (i % 2 ? 2 : -2.2)) + 'deg');
    item.innerHTML = `
      <span class="her-tape t1"></span><span class="her-tape t2"></span>
      <img src="${HER_PIC}${h.src}" alt="" loading="lazy" style="${h.pos ? 'object-position:' + h.pos : ''}">
      <span class="her-cap">♥ ${escapeHtml(h.cap)}</span>
    `;
    herWall.appendChild(item);
    item.addEventListener('click', (e) => {
      item.classList.remove('pop');
      void item.offsetWidth;
      item.classList.add('pop');
      const br = herWall.getBoundingClientRect();
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;pointer-events:none;z-index:40;';
      host.style.left = (e.clientX - br.left) + 'px';
      host.style.top = (e.clientY - br.top) + 'px';
      herWall.style.position = 'relative';
      herWall.appendChild(host);
      confetti.burst(host, 14);
      setTimeout(() => host.remove(), 800);
    });
  });

  /* ---------- 4. Themed cards ---------- */
  const cardsEl = el.querySelector('#fav-cards');
  CARDS.forEach((c) => {
    const card = document.createElement('article');
    card.className = 'fav-card fav-card-' + c.key;
    const figs = (c.imgs || []).map((src) => `
      <figure class="fav-pola">
        <img src="${IMG}${src}" alt="" loading="lazy" onerror="this.closest('figure').style.display='none'">
        <figcaption>${c.imgChips && c.imgChips[src] ? escapeHtml(c.imgChips[src]) : ''}</figcaption>
      </figure>
    `).join('');
    const ytBlocks = (c.yt || []).map((song) => {
      const id = song.id(CONFIG);
      if (!id || id === 'TODO_USER') return '';
      return `
        <div class="fav-yt">
          <div class="fav-yt-video" data-ytid="${id}" data-title="${escapeHtml(song.title)}">
            <div class="yt-facade" role="button" tabindex="0" aria-label="Play ${escapeHtml(song.title)}">
              <div class="yt-play">&#9658;</div>
            </div>
          </div>
          <span class="fav-yt-title">${escapeHtml(song.title)}</span>
        </div>
      `;
    }).join('');
    card.innerHTML = `
      <header class="fav-card-head">
        <span class="fav-card-kicker">${escapeHtml(c.kicker)}</span>
        <h3 class="fav-card-title">${escapeHtml(c.title)}</h3>
        <p class="fav-card-caption">${escapeHtml(c.caption)}</p>
      </header>
      <div class="fav-card-photos ${c.imgs && c.imgs.length > 2 ? 'many' : ''}">${figs}</div>
      ${ytBlocks ? `<div class="fav-yts">${ytBlocks}</div>` : ''}
    `;
    cardsEl.appendChild(card);
  });

  // YouTube click-to-load (one iframe at a time, pauses site music)
  let activeIframe = null;
  function loadVideo(container, facade, ctxLocal) {    const id = container.dataset.ytid;
    facade.style.display = 'none';
    if (activeIframe) activeIframe.remove();
    ctxLocal.music.pause();
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '200';
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&modestbranding=1';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.setAttribute('loading', 'lazy');
    container.appendChild(iframe);
    activeIframe = iframe;
    iframe.onerror = () => {
      iframe.remove();
      activeIframe = null;
      facade.style.display = 'flex';
    };
  }
  el.querySelectorAll('.yt-facade').forEach((facade) => {
    const container = facade.closest('.fav-yt-video');
    facade.addEventListener('click', (e) => { e.stopPropagation(); loadVideo(container, facade, ctx); });
    facade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadVideo(container, facade, ctx);
      }
    });
  });

  return {
    destroy() {
      try { player.pause(); } catch (err) {}
      try { player.currentTime = 0; } catch (err) {}
      if (activeIframe) activeIframe.remove();
      activeIframe = null;
    },
  };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
function clean(value) {
  return value && value !== 'TODO_USER' ? value : '';
}
