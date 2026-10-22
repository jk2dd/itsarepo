// main.js - starts the app, restores saved state.
// Shell owns: countdown pill, mute button, petals.
// Hash routing delegates to router.js.

import { CONFIG } from './config.js?v=7';
import { time } from './time.js';
import { audio } from './audio.js?v=5';
import { petals } from './petals.js?v=2';
import { router } from './router.js?v=23';

const mount = document.getElementById('mount');
const pill = document.getElementById('countdown-pill');
const pillText = document.getElementById('pill-text');
const muteBtn = document.getElementById('mute-btn');
const homeBtn = document.getElementById('home-btn');
const petalsLayer = document.getElementById('petals-layer');
const titleEl = document.getElementById('page-title');

time.initDevOverride();

// Saved state (localStorage wrapped in try/catch inside helpers).
function lsGet(key, def) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? def : JSON.parse(raw);
  } catch (e) { return def; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

const state = {
  gatePassed: lsGet('bg_gatePassed', false),
  puzzleSolved: lsGet('bg_puzzleSolved', false),
  celebrateUnlocked: lsGet('bg_celebrateUnlocked', false),
  mute: lsGet('bg_mute', false),
};
function set(key, val) {
  state[key] = val;
  lsSet('bg_' + key, val);
}
function saveAll() {
  lsSet('bg_gatePassed', state.gatePassed);
  lsSet('bg_puzzleSolved', state.puzzleSolved);
  lsSet('bg_celebrateUnlocked', state.celebrateUnlocked);
  lsSet('bg_mute', state.mute);
}

audio.muted = state.mute;
audio.init();

// Document title from config (placeholder until owner supplies).
titleEl.textContent = CONFIG.gateTitle || 'Birthday surprise';

// Petals (shell-owned, persist across sections).
petals.init(petalsLayer, 12);

// Countdown pill.
let raf;
function tick() {
  const bday = time.birthdayMs();
  const diff = bday - nowMs();
  if (diff > 0) {
    const p = time.countdownParts(diff);
    pillText.textContent = p.days + 'd ' + p.hours + ':' + pad(p.minutes) + ':' + pad(p.seconds);
    pill.classList.remove('celebrating');
  } else {
    pillText.textContent = 'Happy Birthday!';
    pill.classList.add('celebrating');
    if (!state.celebrateUnlocked) set('celebrateUnlocked', true);
  }
  raf = requestAnimationFrame(tick);
}
function nowMs() { return time.now().getTime(); }
function pad(n) { return String(n).padStart(2, '0'); }

pill.addEventListener('click', () => pill.classList.toggle('expanded'));
homeBtn.addEventListener('click', () => { window.location.hash = '#/hub'; });

function updateHomeButton() {
  const route = window.location.hash.replace('#/', '') || 'gate';
  homeBtn.hidden = route === 'gate' || route === 'hub' || !state.gatePassed;
}

// Mute button.
function updateMuteBtn() {
  muteBtn.classList.toggle('muted', audio.muted);
  muteBtn.setAttribute('aria-pressed', audio.muted);
}
muteBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  audio.toggle();
  updateMuteBtn();
});
updateMuteBtn();

// When music should pause while another song plays (favorites), expose via ctx.
let blockMusic = false;
const music = {
  play() { if (!blockMusic && !state.mute) audio.play(); },
  pause() { audio.pause(); },
  setBlock(b) { blockMusic = b; },
};

tick();

// Wide screens: countdown pill always expanded.
function updatePillWidth() {
  if (window.matchMedia('(min-width: 768px)').matches) pill.classList.add('expanded');
  else pill.classList.remove('expanded');
}
updatePillWidth();
window.addEventListener('resize', updatePillWidth);

// Router context passed to every section.
const ctx = {
  state,
  set,
  saveAll,
  navigate(hash) {
    if (window.location.hash === hash) router.go(hash);
    else window.location.hash = hash;
  },
  time,
  music,
  CONFIG,
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

router.init(ctx);

// Start at current hash (default gate).
router.go(window.location.hash);
updateHomeButton();

window.addEventListener('hashchange', () => {
  updateHomeButton();
  router.go(window.location.hash);
});

// Pause petals + music when tab hidden, resume when visible.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { petals.pause(); audio.pause(); }
  else { petals.resume(); }
});
