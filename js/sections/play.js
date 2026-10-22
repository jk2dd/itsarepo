// play.js - M4: Play page with three games (Puzzle of Us, Memory Match, Bouquet).
import { confetti } from '../confetti.js?v=2';

export async function init(el, ctx) {
  el.innerHTML = `
    <div class="play">
      <header class="play-intro">
        <picture class="play-flower play-flower--pink" aria-hidden="true">
          <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/us-flower-pink-still.png">
          <img src="assets/gifs/us-flower-pink.gif" width="112" height="112" alt="" decoding="async">
        </picture>
        <div class="play-intro-copy">
          <span class="play-kicker">A LITTLE JOY, PRESSED BETWEEN PAGES</span>
          <h1 class="play-heading">Our little playdate</h1>
          <p>Put a memory back together, find the matching little things, then make a bouquet.</p>
        </div>
        <picture class="play-flower play-flower--red" aria-hidden="true">
          <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/us-flower-red-still.png">
          <img src="assets/gifs/us-flower-red.gif" width="112" height="112" alt="" decoding="async">
        </picture>
        <span class="play-stamp" aria-hidden="true"><span>made of</span><strong>little joys</strong><i>♡</i></span>
      </header>
      <div class="play-grid" id="play-grid" aria-label="Little games in our scrapbook"></div>
      <p class="play-colophon" aria-hidden="true">three little ways to keep a moment</p>
    </div>
  `;
  const grid = el.querySelector('#play-grid');

  renderPuzzle(grid, ctx);
  renderMemoryMatch(grid);
  renderBouquet(grid);

  return { destroy() {} };
}

// =====================================================================
// Shared helpers
// =====================================================================
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function floatHearts(container) {
  const br = container.getBoundingClientRect();
  const parent = container.parentElement;
  if (!parent) return;
  const pr = parent.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = '❤';
    h.style.left = (br.left - pr.left + Math.random() * br.width) + 'px';
    h.style.top = (br.top - pr.top + br.height / 2) + 'px';
    h.style.fontSize = (16 + Math.random() * 14) + 'px';
    parent.appendChild(h);
    const dy = -(120 + Math.random() * 80);
    const dx = (Math.random() - 0.5) * 60;
    h.style.setProperty('--dy', dy + 'px');
    h.style.setProperty('--dx', dx + 'px');
    h.style.animation = 'floatHeart 1.6s ease-out forwards';
    setTimeout(() => h.remove(), 1700);
  }
}

// =====================================================================
// 1. Puzzle of Us (18 pieces, one image, CSS background-position)
// =====================================================================
function renderPuzzle(grid, ctx) {
  const card = document.createElement('section');
  card.className = 'play-card play-card--puzzle';
  card.setAttribute('aria-labelledby', 'puzzle-title');
  card.innerHTML = `
    <div class="play-card-heading">
      <span class="play-card-index" aria-hidden="true">01</span>
      <div><span class="play-overline">a photo, piece by piece</span><h2 class="card-title" id="puzzle-title">Puzzle of Us</h2></div>
    </div>
    <p class="play-card-note">Slide each little piece home to bring the memory back together.</p>
    <p class="play-msg" id="puzzle-msg" role="alert"></p>
    <div class="puzzle" id="puzzle" aria-labelledby="puzzle-title">
      <div class="board" id="board"></div>
      <div class="puzzle-progress" id="puzzle-progress">0 / 18</div>
      <div class="puzzle-controls">
        <button class="btn btn-help" id="puzzle-help" style="display:none">Need help?</button>
        <button class="btn btn-open" id="puzzle-open" style="display:none">Open the letter</button>
      </div>
    </div>
  `;
  grid.appendChild(card);

  const board = card.querySelector('#board');
  const progress = card.querySelector('#puzzle-progress');
  const helpBtn = card.querySelector('#puzzle-help');
  const openBtn = card.querySelector('#puzzle-open');
  const msgEl = card.querySelector('#puzzle-msg');

  const COLS = 3, ROWS = 6, TOTAL = COLS * ROWS;
  const imgSrc = ctx.CONFIG.puzzleImage || 'assets/img/puzzle-original.jpg';

  let pieces = [];
  let slots = [];
  let dragging = null;
  let solved = false;
  let missingPhoto = false;
  let helpTimer = null;
  let dragOffset = { x: 0, y: 0 };

  function show(t, kind) {
    msgEl.textContent = t;
    msgEl.className = 'play-msg ' + (kind || '');
  }

  let layoutTries = 0;

  function layout() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const boardW = Math.min(Math.floor(vw * 0.92), 420);
    board.style.width = boardW + 'px';
    board.style.height = (boardW * (missingPhoto ? 1.05 : 2)) + 'px';
    requestAnimationFrame(() => {
      const applied = parseFloat(getComputedStyle(board).borderLeftWidth) > 0;
      if (!applied && layoutTries < 40) { layoutTries += 1; layout(); return; }
      const cells = board.querySelectorAll('.slot');
      const cs = getComputedStyle(board);
      // Pieces are absolutely positioned against the board's padding box, but
      // slot rects are measured against the border box - account for the frame.
      const offX = parseFloat(cs.borderLeftWidth) || 0;
      const offY = parseFloat(cs.borderTopWidth) || 0;
      const br = board.getBoundingClientRect();
      slots = Array.from(cells).map((c) => {
        const r = c.getBoundingClientRect();
        return { left: r.left - br.left - offX, top: r.top - br.top - offY, w: r.width, h: r.height };
      });
      placeAll();
    });
  }

  function buildBoard() {
    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(3, 1fr)';
    board.style.gridTemplateRows = 'repeat(6, 1fr)';
    board.style.gap = '0';
    for (let i = 0; i < TOTAL; i++) {
      const s = document.createElement('div');
      s.className = 'slot';
      s.dataset.index = i;
      board.appendChild(s);
    }
  }

  function createPiece(home) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.dataset.home = home;
    // Inline these so a piece crops its slice even if play.css has not arrived yet.
    el.style.position = 'absolute';
    el.style.overflow = 'hidden';
    const image = document.createElement('img');
    image.src = imgSrc;
    image.alt = '';
    image.draggable = false;
    image.setAttribute('aria-hidden', 'true');
    image.style.position = 'absolute';
    el.appendChild(image);
    el.style.touchAction = 'none';
    el.draggable = false;
    return el;
  }

  function applyBg(piece) {
    const { home } = piece;
    const c = home % COLS, r = Math.floor(home / COLS);
    const w = slots[0] ? slots[0].w : board.clientWidth / 3;
    const h = slots[0] ? slots[0].h : board.clientHeight / 6;
    piece.el.style.width = w + 'px';
    piece.el.style.height = h + 'px';
    const image = piece.el.querySelector('img');
    image.style.width = (w * COLS) + 'px';
    image.style.height = (h * ROWS) + 'px';
    image.style.left = (-c * w) + 'px';
    image.style.top = (-r * h) + 'px';
  }

  function place(piece) {
    const s = slots[piece.current];
    if (!s) return;
    const w = parseFloat(piece.el.style.width) || (slots[0] && slots[0].w) || 1;
    const h = parseFloat(piece.el.style.height) || (slots[0] && slots[0].h) || 1;
    piece.el.style.left = (s.left + (s.w - w) / 2) + 'px';
    piece.el.style.top = (s.top + (s.h - h) / 2) + 'px';
  }

  function placeAll() {
    pieces.forEach((p) => { applyBg(p); place(p); });
    updateProgress();
  }

  const photoCheck = new Image();
  let photoRetries = 0;
  photoCheck.onload = () => board.classList.remove('missing-photo');
  photoCheck.onerror = () => {
    if (photoRetries < 2) {
      photoRetries += 1;
      // One failed fetch is not proof the photo is gone - try once more.
      setTimeout(() => { photoCheck.src = imgSrc + '?r=' + photoRetries; }, 400);
      return;
    }
    if (missingPhoto) return;
    missingPhoto = true;
    board.classList.add('missing-photo');
    board.setAttribute('aria-label', 'Puzzle photo is not added yet');
    pieces.forEach((piece) => { piece.el.hidden = true; });
    const placeholder = document.createElement('div');
    placeholder.className = 'puzzle-placeholder';
    placeholder.innerHTML = '<span class="puzzle-placeholder-icon" aria-hidden="true">♡</span><strong>A photo of us will make this puzzle complete.</strong>';
    board.appendChild(placeholder);
    show('The photo puzzle is waiting for its picture.', 'hint');
    layout();
  };
  photoCheck.src = imgSrc;

  function updateProgress() {
    let done = 0;
    pieces.forEach((p) => { if (p.current === p.home) done += 1; });
    progress.textContent = done + ' / ' + TOTAL;
    return done;
  }

  function pieceAt(current) { return pieces.find((p) => p.current === current); }

  function swap(a, b) {
    const pa = pieceAt(a), pb = pieceAt(b);
    if (!pa || !pb) return;
    pa.current = b; pb.current = a;
    place(pa); place(pb);
    updateProgress();
  }

  function nearestSlot(x, y) {
    let best = 0, bestD = 1e9;
    slots.forEach((s, i) => {
      const cx = s.left + s.w / 2, cy = s.top + s.h / 2;
      const d = (x - cx) ** 2 + (y - cy) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function checkWin() {
    if (solved) return;
    if (pieces.every((p) => p.current === p.home)) {
      solved = true;
      if (helpTimer) clearTimeout(helpTimer);
      helpBtn.style.display = 'none';
      pieces.forEach((p) => p.el.classList.add('home'));
      setTimeout(() => {
        show('The two halves join. The letter is unlocked.', 'ok');
        floatHearts(card.querySelector('#puzzle'));
        ctx.set('puzzleSolved', true);
        ctx.saveAll();
        openBtn.style.display = 'block';
      }, 400);
    }
  }

  openBtn.addEventListener('click', (e) => { e.stopPropagation(); ctx.navigate('#/letter'); });

  function startDrag(piece, e) {
    if (solved || dragging) return;
    dragging = piece;
    piece.el.classList.add('dragging');
    piece.el.style.zIndex = 10;
    const br = board.getBoundingClientRect();
    dragOffset.x = e.clientX - br.left - parseFloat(piece.el.style.left || 0);
    dragOffset.y = e.clientY - br.top - parseFloat(piece.el.style.top || 0);
  }

  function dragMove(e) {
    if (!dragging) return;
    const br = board.getBoundingClientRect();
    let x = e.clientX - br.left - dragOffset.x;
    let y = e.clientY - br.top - dragOffset.y;
    const w = parseFloat(dragging.el.style.width);
    const h = parseFloat(dragging.el.style.height);
    x = Math.max(0, Math.min(board.clientWidth - w, x));
    y = Math.max(0, Math.min(board.clientHeight - h, y));
    dragging.el.style.left = x + 'px';
    dragging.el.style.top = y + 'px';
  }

  function drop() {
    if (!dragging) return;
    const br = board.getBoundingClientRect();
    const x = parseFloat(dragging.el.style.left) + parseFloat(dragging.el.style.width) / 2;
    const y = parseFloat(dragging.el.style.top) + parseFloat(dragging.el.style.height) / 2;
    dragging.el.classList.remove('dragging');
    dragging.el.style.zIndex = '';
    let target = nearestSlot(x, y);
    const h = slots[dragging.home];
    const hx = h.left + h.w / 2, hy = h.top + h.h / 2;
    const thresh = Math.min(h.w, h.h) * 0.45;
    if ((x - hx) ** 2 + (y - hy) ** 2 < thresh * thresh) target = dragging.home;
    swap(dragging.current, target);
    dragging = null;
    checkWin();
  }

  function wirePiece(piece) {
    piece.el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      try { piece.el.setPointerCapture(e.pointerId); } catch (ee) {}
      startDrag(piece, e);
    });
  }

  // Pointer capture retargets drag events to the piece; the board handles them
  // here so a drag can continue smoothly across neighboring puzzle pieces.
  board.addEventListener('pointermove', dragMove);
  board.addEventListener('pointerup', drop);
  board.addEventListener('pointercancel', drop);

  let selected = null;
  board.addEventListener('pointerdown', (e) => {
    if (solved || dragging) return;
    const slot = e.target.closest('.slot');
    if (slot) {
      e.preventDefault();
      const target = Number(slot.dataset.index);
      if (selected) {
        swap(selected.current, target);
        selected.el.classList.remove('selected'); selected = null;
        checkWin();
      } else {
        const p = pieceAt(target);
        if (p) { selected = p; p.el.classList.add('selected'); }
      }
    }
  });

  function autoSolve() {
    helpBtn.style.display = 'none';
    function next() {
      if (solved) return;
      let advanced = false;
      for (let s = 0; s < TOTAL; s++) {
        const here = pieceAt(s);
        if (here && here.home !== s) {
          const homePiece = pieces.find((p) => p.home === s);
          if (homePiece) { swap(homePiece.current, s); advanced = true; break; }
        }
      }
      if (!advanced || pieces.every((p) => p.current === p.home)) { checkWin(); return; }
      setTimeout(next, 500);
    }
    next();
  }

  helpBtn.addEventListener('click', (e) => { e.stopPropagation(); autoSolve(); });

  buildBoard();
  layout();

  const order = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.forEach((home, idx) => {
    const p = { el: createPiece(home), home, current: idx };
    pieces.push(p);
    board.appendChild(p.el);
    wirePiece(p);
  });
  placeAll(); // Layout recalculates positions after it measures the board.

  helpTimer = setTimeout(() => {
    if (!solved) { helpBtn.style.display = 'block'; show('Stuck? I can place the pieces for you.', 'hint'); }
  }, 180000);

  window.addEventListener('resize', layout);
}

// =====================================================================
// 2. Memory Match (4x4, 8 pairs, no animals, no photos)
// =====================================================================
function renderMemoryMatch(grid) {
  const card = document.createElement('section');
  card.className = 'play-card play-card--memory';
  card.setAttribute('aria-labelledby', 'memory-title');
  card.innerHTML = `
    <div class="play-card-heading">
      <span class="play-card-index" aria-hidden="true">02</span>
      <div><span class="play-overline">turn over a tiny favorite</span><h2 class="card-title" id="memory-title">Memory Match</h2></div>
    </div>
    <p class="play-card-note">Find the little things that belong together.</p>
    <div class="mem-board" id="mem-board"></div>
    <div class="mem-status"><span class="mem-moves">Moves: 0</span></div>
    <p class="mem-msg" id="mem-msg" role="alert"></p>
  `;
  grid.appendChild(card);

  const PAIRS = ['🍵', '🌸', '📖', '❤', '🍰', '🎵', '🍃', '🌞'];
  const board = card.querySelector('#mem-board');
  const movesEl = card.querySelector('.mem-moves');
  const msg = card.querySelector('#mem-msg');

  let cards = shuffle([...PAIRS, ...PAIRS]);
  let flipped = [], matched = 0, moves = 0, locked = false;

  board.style.display = 'grid';
  board.style.gridTemplateColumns = 'repeat(4, 1fr)';
  board.style.gap = '8px';

  cards.forEach((icon, i) => {
    const c = document.createElement('button');
    c.className = 'mem-card';
    c.dataset.icon = icon;
    c.setAttribute('aria-label', 'Reveal memory card ' + (i + 1));
    c.innerHTML = '<div class="mem-back"></div><div class="mem-front">' + icon + '</div>';
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      if (locked || flipped.length === 2 || c.classList.contains('flipped') || c.classList.contains('matched')) return;
      flip(c);
    });
    board.appendChild(c);
  });

  function flip(c) {
    c.classList.add('flipped');
    flipped.push(c);
    if (flipped.length === 2) {
      moves += 1;
      movesEl.textContent = 'Moves: ' + moves;
      locked = true;
      setTimeout(() => {
        if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
          flipped[0].classList.add('matched');
          flipped[1].classList.add('matched');
          matched += 2;
          flipped = []; locked = false;
          if (matched === cards.length) {
            msg.textContent = 'You matched them all!';
            confetti.burst(card, 40);
          }
        } else {
          flipped[0].classList.remove('flipped');
          flipped[1].classList.remove('flipped');
          flipped = []; locked = false;
        }
      }, 700);
    }
  }
}

// =====================================================================
// 3. Arrange Your Bouquet (SVG drawn in code)
// =====================================================================
function renderBouquet(grid) {
  const card = document.createElement('section');
  card.className = 'play-card play-card--bouquet';
  card.setAttribute('aria-labelledby', 'bouquet-title');
  card.innerHTML = `
    <div class="play-card-heading">
      <span class="play-card-index" aria-hidden="true">03</span>
      <div><span class="play-overline">one flower at a time</span><h2 class="card-title" id="bouquet-title">Arrange Your Bouquet</h2></div>
    </div>
    <p class="play-card-note">Tap a bloom to add it, then tuck the flowers into place.</p>
    <div class="bouquet-wrap" id="bouquet-wrap">
      <svg class="bouquet-vase" viewBox="0 0 140 160" aria-hidden="true">
        <path d="M30 140 L30 70 Q40 40 70 40 Q100 40 110 70 L110 140 Z" fill="#f7eee5" stroke="#c99e79" stroke-width="3"/>
        <path d="M40 140 L110 140 L100 155 L40 155 Z" fill="#88ab91"/>
      </svg>
      <div class="bouquet-stage" id="bouquet-stage"></div>
    </div>
    <div class="bouquet-palette" id="bouquet-palette"></div>
    <div class="bouquet-controls">
      <button class="btn btn-clear" id="bouquet-clear">Clear</button>
      <button class="btn btn-done" id="bouquet-done">Done</button>
    </div>
    <p class="bouquet-msg" id="bouquet-msg" role="alert"></p>
  `;
  grid.appendChild(card);

  const stage = card.querySelector('#bouquet-stage');
  const palette = card.querySelector('#bouquet-palette');
  const msg = card.querySelector('#bouquet-msg');

  const FLOWERS = [
    { label: 'a rose bloom', svg: flowerSvg('#e8a2ad', '#9d6872') },
    { label: 'a butter bloom', svg: flowerSvg('#e6cb84', '#897447') },
    { label: 'a lavender bloom', svg: flowerSvg('#c2aedd', '#796590') },
    { label: 'a powder-blue bloom', svg: flowerSvg('#a5c6dc', '#597b91') },
    { label: 'a peach bloom', svg: flowerSvg('#e8b397', '#9c705b') },
    { label: 'a sage leaf', svg: leafSvg() },
  ];

  FLOWERS.forEach((f) => {
    const b = document.createElement('button');
    b.className = 'palette-btn';
    b.setAttribute('aria-label', 'Add ' + f.label);
    b.innerHTML = f.svg;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      addFlower(f.svg);
    });
    palette.appendChild(b);
  });

  function addFlower(svgHtml) {
    const f = document.createElement('div');
    f.className = 'bloom';
    f.innerHTML = svgHtml;
    const rect = stage.getBoundingClientRect();
    const size = 44;
    const x = Math.max(0, Math.min(rect.width - size, 40 + Math.random() * (rect.width - 80 - size)));
    const y = Math.max(0, Math.min(rect.height - size, 30 + Math.random() * (rect.height - 60 - size)));
    f.style.left = x + 'px';
    f.style.top = y + 'px';
    stage.appendChild(f);
    wireBloom(f);
  }

  function wireBloom(f) {
    let active = false;
    let off = { x: 0, y: 0 };
    let started = false;
    const down = (e) => {
      e.preventDefault(); e.stopPropagation();
      active = true; started = false;
      f.classList.add('moving');
      try { f.setPointerCapture(e.pointerId); } catch (ee) {}
      const br = stage.getBoundingClientRect();
      const fr = f.getBoundingClientRect();
      off.x = e.clientX - br.left - fr.left;
      off.y = e.clientY - br.top - fr.top;
    };
    const move = (e) => {
      if (!active) return;
      started = true;
      const br = stage.getBoundingClientRect();
      let x = e.clientX - br.left - off.x;
      let y = e.clientY - br.top - off.y;
      x = Math.max(0, Math.min(stage.clientWidth - f.offsetWidth, x));
      y = Math.max(0, Math.min(stage.clientHeight - f.offsetHeight, y));
      f.style.left = x + 'px';
      f.style.top = y + 'px';
    };
    const up = (e) => {
      active = false;
      f.classList.remove('moving');
      // tap (no drag) removes the bloom
      if (!started) f.remove();
    };
    f.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  card.querySelector('#bouquet-clear').addEventListener('click', (e) => {
    e.stopPropagation();
    stage.innerHTML = '';
    msg.textContent = '';
  });
  card.querySelector('#bouquet-done').addEventListener('click', (e) => {
    e.stopPropagation();
    msg.textContent = 'Lovely bouquet!';
  });
}

function flowerSvg(fill, center) {
  return `<svg viewBox="0 0 36 36"><g fill="${fill}" stroke="${center}" stroke-opacity=".3" stroke-width=".65"><ellipse cx="18" cy="9" rx="4.3" ry="6.2"/><ellipse cx="18" cy="9" rx="4.3" ry="6.2" transform="rotate(72 18 18)"/><ellipse cx="18" cy="9" rx="4.3" ry="6.2" transform="rotate(144 18 18)"/><ellipse cx="18" cy="9" rx="4.3" ry="6.2" transform="rotate(216 18 18)"/><ellipse cx="18" cy="9" rx="4.3" ry="6.2" transform="rotate(288 18 18)"/></g><circle cx="18" cy="18" r="3.1" fill="${center}"/><circle cx="17.3" cy="16.9" r=".9" fill="#fffdf8" opacity=".75"/></svg>`;
}
function leafSvg() {
  return `<svg viewBox="0 0 36 36"><path d="M18 4 Q8 18 18 32 Q28 18 18 4" fill="none" stroke="#88ab91" stroke-width="3" stroke-linecap="round"/><path d="M18 29 Q18 18 24 12" fill="none" stroke="#6f9278" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}
