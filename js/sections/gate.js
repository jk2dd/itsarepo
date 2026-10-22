// gate.js - two-step gate: (1) welcome — cat, flowers, yes/no;
// (2) the secret word (password from config, with hint). Then the hub.
export async function init(el, ctx) {
  el.innerHTML = `
    <div class="gate">
      <div class="gate-confetti" id="gate-confetti" aria-hidden="true"></div>

      <div class="gate-card">
        <div class="gate-ribbon" id="gate-ribbon"></div>

        <div class="gate-welcome" id="gate-step1">
          <div class="gate-stickers" aria-hidden="true">
            <picture class="gate-sticker">
              <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/gif-on-home-page/home-hello-kitty-pink-still.png">
              <img src="assets/gifs/gif-on-home-page/home-hello-kitty-pink.gif" width="400" height="400" alt="" decoding="async">
            </picture>
            <picture class="gate-sticker gate-sticker--coffee">
              <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/gif-on-home-page/home-hello-kitty-coffee-still.png">
              <img src="assets/gifs/gif-on-home-page/home-hello-kitty-coffee.gif" width="443" height="448" alt="" decoding="async">
            </picture>
            <picture class="gate-sticker gate-sticker--cat">
              <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/gif-on-home-page/home-happy-cat-still.png">
              <img src="assets/gifs/gif-on-home-page/home-happy-cat.gif" width="90" height="90" alt="" decoding="async">
            </picture>
          </div>
          <h1 class="gate-greeting">Hello there<span class="gate-bang">!</span></h1>
          <p class="gate-text" id="gate-text"></p>
          <div class="gate-name" id="gate-name" hidden>For ${ctx.CONFIG.gateName}</div>
          <div class="gate-actions">
            <button class="btn-welcome btn-yes" id="gate-accept" type="button">Yes please</button>
            <button class="btn-welcome btn-no" id="gate-decline" type="button">No thanks</button>
          </div>
          <p class="gate-msg" id="gate-msg" role="alert"></p>
        </div>

        <div class="gate-secret-step" id="gate-step2" hidden>
          <div class="secret-card">
            <h2 class="secret-title" id="secret-title"></h2>
            <p class="secret-sub">One secret word first, and it opens.</p>
            <div class="secret-keypad">
              <input type="password" id="gate-input" placeholder="&#128149;" aria-label="Password" maxlength="60" autocomplete="off">
            </div>
            <img class="gate-hint-gif" id="gate-hint-gif" alt="Hint">
            <div class="gate-actions gate-secret">
              <button class="btn btn-hint" id="gate-hint" type="button">Hint</button>
              <button class="btn btn-accept" id="gate-open" type="button">Open the gift</button>
            </div>
            <p class="gate-msg gate-msg-secret" id="secret-msg" role="alert"></p>
            <button class="secret-back" id="gate-back" type="button">&#8592; Back</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const step1 = el.querySelector('#gate-step1');
  const step2 = el.querySelector('#gate-step2');
  const text = el.querySelector('#gate-text');
  const input = el.querySelector('#gate-input');
  const hintBtn = el.querySelector('#gate-hint');
  const decline = el.querySelector('#gate-decline');
  const yesBtn = el.querySelector('#gate-accept');
  const openBtn = el.querySelector('#gate-open');
  const backBtn = el.querySelector('#gate-back');
  const msg = el.querySelector('#gate-msg');
  const secretMsg = el.querySelector('#secret-msg');
  const gateEl = el.querySelector('.gate');
  const ribbon = el.querySelector('#gate-ribbon');
  const confettiLayer = el.querySelector('#gate-confetti');
  const gateCard = el.querySelector('.gate-card');
  const nameSticker = el.querySelector('#gate-name');
  const stickerRow = el.querySelector('.gate-stickers');

  function burstGateConfetti() {
    confettiLayer.innerHTML = '';
    const count = 20;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement('div');
      bit.className = 'bit';
      const angle = Math.random() * Math.PI * 2;
      const force = 40 + Math.random() * 120;
      bit.style.setProperty('--tx', (Math.cos(angle) * force) + 'px');
      bit.style.setProperty('--ty', (Math.sin(angle) * force - 30) + 'px');
      bit.style.left = '50%';
      bit.style.top = '50%';
      bit.style.background = ['#F553A4', '#F55E53', '#F59F53', '#F5DA53'][i % 4];
      bit.style.animationDelay = (Math.random() * 0.5) + 's';
      confettiLayer.appendChild(bit);
    }
  }

  function showStep(step) {
    step1.hidden = step !== 1;
    step2.hidden = step !== 2;
    if (step === 2) input.focus();
  }

  // Welcome copy: config text without a leading "Hello there" (the title says it).
  const rawText = (ctx.CONFIG.gateText || '').trim().replace(/^hello there\b[;,.!]*\s*/i, '');
  text.textContent = rawText || 'do you want to see your gift?';
  if (ctx.CONFIG.gateName) {
    nameSticker.hidden = false;
    nameSticker.textContent = 'For ' + ctx.CONFIG.gateName;
  }

  // Secret step heading: the config title belongs to the riddle now.
  el.querySelector('#secret-title').textContent =
    ctx.CONFIG.gateTitle && ctx.CONFIG.gateTitle !== 'Hello there' ? ctx.CONFIG.gateTitle : 'The secret word';

  const correct = (ctx.CONFIG.password || '').trim().toLowerCase();

  const cuteReplies = [
    'Nope! Try again, little teddy bear.',
    'Almost! Not quite right.',
    'Try once more, Elianty.',
    'Wrong password, sweetie.',
    'Nice try! Hint is always here.',
  ];
  let replyIndex = 0;

  function showWelcomeMsg(msgText, kind) {
    msg.textContent = msgText;
    msg.className = 'gate-msg ' + (kind || '');
  }
  function showSecretMsg(msgText, kind) {
    secretMsg.textContent = msgText;
    secretMsg.className = 'gate-msg gate-msg-secret ' + (kind || '');
  }

  function shake() {
    input.classList.add('shake');
    input.focus();
    setTimeout(() => input.classList.remove('shake'), 450);
  }

  function attempt(password) {
    const p = (password || '').trim().toLowerCase();
    if (!p) { showSecretMsg('Enter the secret word first.', ''); shake(); return false; }
    if (p === correct) { return true; }
    showSecretMsg(cuteReplies[replyIndex % cuteReplies.length]);
    replyIndex += 1;
    shake();
    return false;
  }

  yesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showStep(2);
  });
  backBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showStep(1);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (attempt(input.value)) {
        gateCard.classList.add('open');
        ribbon.classList.add('untied');
        burstGateConfetti();
        ctx.set('gatePassed', true);
        ctx.saveAll();
        setTimeout(() => ctx.navigate('#/hub'), 700);
      }
    }
  });

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (attempt(input.value)) {
      gateCard.classList.add('open');
      ribbon.classList.add('untied');
      burstGateConfetti();
      ctx.set('gatePassed', true);
      ctx.saveAll();
      setTimeout(() => ctx.navigate('#/hub'), 700);
    }
  });

  const hintGif = el.querySelector('#gate-hint-gif');
  hintBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const hint = ctx.CONFIG.passwordHint;
    showSecretMsg(hint && hint !== 'TODO_USER' ? hint : 'Think about us.', 'hint');
    const gif = ctx.CONFIG.passwordHintGif || '';
    if (gif && gif !== 'TODO_USER') {
      hintGif.src = gif;
      hintGif.style.display = 'block';
    }
  });

  // ---------- "No thanks" runs away ----------
  let attempts = 0;
  const maxWarnings = 5;
  const giveUpAt = 12;
  let gaveUp = false;

  function viewport() {
    return {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  }

  function moveDecline() {
    if (gaveUp) return;
    gateEl.classList.add('is-running');
    attempts += 1;
    if (attempts === maxWarnings) {
      showWelcomeMsg('It really does not want to be tapped.', 'hint');
    }
    if (attempts >= giveUpAt) {
      gaveUp = true;
      decline.textContent = 'OK, fine, Accept';
      decline.classList.add('gave-up');
      decline.removeEventListener('pointerenter', moveDecline);
      decline.removeEventListener('pointerdown', moveDecline);
      decline.removeEventListener('focusin', moveDecline);
      decline.addEventListener('click', giveUpClick);
      return;
    }
    const v = viewport();
    const dW = decline.offsetWidth || 120;
    const dH = decline.offsetHeight || 44;
    const margin = 22;
    const protectedNodes = [text, yesBtn, msg, nameSticker, stickerRow].filter(Boolean);
    const protectedRects = protectedNodes.map((node) => node.getBoundingClientRect());
    let x = margin, y = margin;
    for (let i = 0; i < 60; i++) {
      x = margin + Math.random() * (v.w - dW - margin * 2);
      y = margin + Math.random() * (v.h - dH - margin * 2);
      const overlap = protectedRects.some((r) => !(x + dW < r.left - 14 || x > r.right + 14 ||
                        y + dH < r.top - 14 || y > r.bottom + 14));
      if (!overlap) break;
    }
    decline.style.left = x + 'px';
    decline.style.top = y + 'px';
  }

  function giveUpClick(e) {
    e.stopPropagation();
    showStep(2);
  }

  decline.addEventListener('pointerenter', moveDecline);
  decline.addEventListener('pointerdown', moveDecline);
  decline.addEventListener('click', moveDecline);

  window.addEventListener('resize', moveDecline);

  return {
    destroy() {
      window.removeEventListener('resize', moveDecline);
    },
  };
}
