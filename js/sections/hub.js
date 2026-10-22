// hub.js - M2: section cards + locks.
import { confetti } from '../confetti.js?v=2';

const ICONS = {
  play: `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="#F59F53" stroke-width="2.5"/><polygon points="16,14 26,20 16,26" fill="#F55E53"/></svg>`,
  us: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 10 C20 6 15 5 12.5 7.5 C9 11 10 16 20 22 C30 16 31 11 27.5 7.5 C25 5 20 6 20 10 Z" fill="none" stroke="#F55E53" stroke-width="2.5" stroke-linejoin="round"/><circle cx="13" cy="26" r="2" fill="#F553A4"/><circle cx="27" cy="26" r="2" fill="#F59F53"/></svg>`,
  books: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 10h11a5 5 0 0 1 5 5v17a5 5 0 0 0-5-5H7zM33 10H22a5 5 0 0 0-5 5v17a5 5 0 0 1 5-5h11z" fill="none" stroke="#31753D" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 15h5M11 20h5M29 15h-3M29 20h-3" stroke="#756A31" stroke-width="2" stroke-linecap="round"/></svg>`,
  favorites: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M14 30 V9 L29 5 V26" fill="none" stroke="#316E75" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="30" r="4.5" fill="#53E5F5"/><circle cx="25" cy="26" r="4.5" fill="#53E5F5"/></svg>`,
  letter: `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="6" y="10" width="28" height="24" rx="4" fill="none" stroke="#314875" stroke-width="2.5"/><path d="M6 10 L20 22 L34 10" fill="none" stroke="#314875" stroke-width="2.5"/><circle cx="33" cy="8" r="2.5" fill="#A453F5"/></svg>`,
  celebrate: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 34 C12 34 8 28 8 21 C8 13 13 8 20 6 C27 8 32 13 32 21 C32 28 28 34 20 34 Z" fill="#A453F5"/><rect x="17" y="2" width="6" height="7" rx="1.5" fill="#F5DA53"/><circle cx="11" cy="14" r="2" fill="#53E5F5"/><circle cx="29" cy="15" r="2" fill="#F55E53"/><circle cx="12" cy="27" r="2" fill="#53F56E"/><circle cx="28" cy="28" r="2" fill="#F553A4"/></svg>`,
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
      ${card.locked ? '<span class="card-lock">&#128274;</span>' : ''}
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
