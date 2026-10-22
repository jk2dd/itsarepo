// hub.js - M2: section cards + locks.
import { confetti } from '../confetti.js?v=2';

// Minimal line-art illustrations: one consistent 48px grid, stroked with currentColor.
const ICONS = {
  play: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15.5 18.5h17a8.2 8.2 0 0 1 8 10l-1.3 5a4.3 4.3 0 0 1-7.5 1.8L28.4 31h-8.8l-3.3 4.3a4.3 4.3 0 0 1-7.5-1.8l-1.3-5a8.2 8.2 0 0 1 8-10Z"/>
    <path d="M17 24v6M14 27h6"/>
    <circle cx="31" cy="25.5" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="34.5" cy="29" r="1.2" fill="currentColor" stroke="none"/>
  </svg>`,
  us: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M24 38S11 30.2 11 21a7.5 7.5 0 0 1 13-4.8A7.5 7.5 0 0 1 37 21c0 9.2-13 17-13 17Z"/>
    <path d="M36.5 8.5v4M34.5 10.5h4" opacity=".55"/>
  </svg>`,
  books: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M24 17.8c-2.7-2.5-6.5-3.8-11.5-3.8-1.1 0-2 .9-2 2v16.3c0 1.1.9 2 2 2 5 0 8.8 1.3 11.5 3.8 2.7-2.5 6.5-3.8 11.5-3.8 1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2-5 0-8.8 1.3-11.5 3.8Z"/>
    <path d="M24 17.8V38"/>
    <path d="M16 22h4M16 26.5h4M28 22h4M28 26.5h4"/>
  </svg>`,
  favorites: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 35.5V12.6l16-3.1v22.9"/>
    <ellipse cx="16.5" cy="35.5" rx="4.5" ry="3.8" transform="rotate(-12 16.5 35.5)"/>
    <ellipse cx="32.5" cy="32.4" rx="4.5" ry="3.8" transform="rotate(-12 32.5 32.4)"/>
    <path d="m21 17.4 16-3.1"/>
  </svg>`,
  letter: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="8" y="13" width="32" height="23" rx="3"/>
    <path d="m9.5 15 14.5 11.2L38.5 15"/>
    <path d="m10 33.5 8.5-8M38 33.5l-8.5-8"/>
  </svg>`,
  celebrate: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M9.5 39h29"/>
    <path d="M13 39V29.5h22V39"/>
    <path d="M13 34c1.8 0 1.8 1.4 3.6 1.4s1.8-1.4 3.6-1.4 1.8 1.4 3.6 1.4 1.8-1.4 3.6-1.4 1.8 1.4 3.6 1.4 1.8-1.4 3.6-1.4 1.8 1.4 3.6 1.4"/>
    <path d="M18.5 29.5v-5M24 29.5v-7M29.5 29.5v-5"/>
    <circle cx="18.5" cy="22.8" r="1.4"/>
    <circle cx="24" cy="20.8" r="1.4"/>
    <circle cx="29.5" cy="22.8" r="1.4"/>
  </svg>`,
};

export async function init(el, ctx) {
  const birthday = ctx.time.isBirthday();
  const celebrateLocked = !ctx.state.celebrateUnlocked && !birthday;
  const letterLocked = !ctx.state.puzzleSolved;

  const cards = [
    { key: 'play', title: 'Play', teaser: 'Puzzle, bouquet, memory match', icon: ICONS.play, locked: false },
    { key: 'us', title: 'Us', teaser: 'Time we have shared', icon: ICONS.us, locked: false },
    { key: 'books', title: 'My books to you', teaser: 'Two stories written for you', icon: ICONS.books, locked: false },
    { key: 'favorites', title: 'For You', teaser: 'Songs and Anne', icon: ICONS.favorites, locked: false },
    { key: 'letter', title: 'Letter', teaser: letterLocked ? 'Solve the puzzle first' : 'For you', locked: letterLocked, icon: ICONS.letter },
    { key: 'celebrate', title: 'Celebrate', teaser: celebrateLocked ? 'Opens at midnight' : "It's here!", locked: celebrateLocked, icon: ICONS.celebrate },
  ];

  el.innerHTML = `
    <div class="hub">
      <header class="hub-intro">
        <span class="hub-kicker">For ${escapeHtml(ctx.CONFIG.gateName || 'you')}</span>
        <h1 class="hub-heading">A little birthday garden</h1>
        <p class="hub-subtitle">Choose a surprise to open.</p>
      </header>
      <div class="cards" id="cards"></div>
      <p class="hub-msg" id="hub-msg" role="alert"></p>
    </div>
  `;
  const cardsEl = el.querySelector('#cards');
  const msg = el.querySelector('#hub-msg');

  cards.forEach((card) => {
    const c = document.createElement('div');
    c.className = 'card ' + (card.locked ? 'locked' : '') + ' card-' + card.key;
    if (!card.locked) {
      c.setAttribute('role', 'link');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', `${card.title}: ${card.teaser}`);
    }
    c.innerHTML = `
      <div class="card-icon">${card.icon}</div>
      <h3 class="card-title">${card.title}</h3>
      <p class="card-teaser">${card.teaser}</p>
      ${card.locked ? `<span class="card-lock" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/></svg></span>` : ''}
    `;
    if (card.locked) {
      c.addEventListener('click', (ev) => {
        ev.stopPropagation();
        c.classList.add('wiggle');
        setTimeout(() => c.classList.remove('wiggle'), 500);
        msg.textContent = card.teaser;
      });
    } else {
      const openCard = () => ctx.navigate('#/' + card.key);
      c.addEventListener('click', openCard);
      c.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCard();
        }
      });
    }
    cardsEl.appendChild(c);
  });

  // Birthday reached while on hub: confetti + unlock celebrate.
  if (birthday && !ctx.state.celebrateUnlocked) {
    ctx.set('celebrateUnlocked', true);
    ctx.saveAll();
    setTimeout(() => confetti.burst(el, 60), 300);
  }

  return {
    destroy() {},
  };
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
