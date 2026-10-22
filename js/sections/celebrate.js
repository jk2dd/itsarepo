// celebrate.js - M6: birthday cake, candles, song, dancing characters, final surprise.
// Locked until the birthday instant. Song start = lights out + glowing candles.
import { confetti } from '../confetti.js?v=2';
import { audio, PARTY_TRACKS } from '../audio.js?v=5';

export async function init(el, ctx) {
  const birthday = ctx.time.isBirthday();
  const unlocked = ctx.state.celebrateUnlocked || birthday || ctx.CONFIG.DEV_MODE;
  const showCats = ctx.CONFIG.SHOW_CATS !== false;

  el.innerHTML = `
    <div class="celebrate">
      <header class="cel-party-header">
        <span class="cel-party-overline">the cake has cleared its schedule</span>
        <h1 class="cel-heading">Birthday Disco</h1>
      <p class="cel-party-deck">${showCats ? 'Four cats. Zero rehearsal. One very committed cake.' : 'One wish, several candles, and a cake with absolutely no chill.'}</p>
      </header>
      <div class="cel-locked" id="cel-locked" style="display:${unlocked ? 'none' : 'flex'}">
        <div class="lock">&#128274;</div>
        <p class="lock-text">Opens at midnight.</p>
        <div class="cel-countdown" id="cel-countdown"></div>
      </div>
      <div class="cel-main" id="cel-main" style="display:${unlocked ? 'flex' : 'none'}">
        <div class="cel-aurora" aria-hidden="true"></div>
        <p class="cel-kicker" id="cel-kicker" aria-hidden="true"></p>
        <div class="cel-cake-wrap" id="cel-cake-wrap"></div>
        <p class="cel-msg" id="cel-msg" role="alert"></p>
        <div class="cel-music">
          <button class="btn cel-btn" id="cel-play" type="button" aria-pressed="false">Cue the cat disco</button>
          <button class="btn cel-btn cel-mute" id="cel-mute" type="button" aria-label="Mute music" aria-pressed="false">&#127925;</button>
          <button class="btn cel-btn cel-relight" id="cel-relight" type="button" hidden>&#9728;&#65039; Bring back the sun</button>
          <label class="cel-track-picker-wrap" for="cel-track-picker">
            <span class="cel-track-picker-label">Choose a song</span>
            <select class="cel-track-picker" id="cel-track-picker" aria-label="Choose a party song">
              ${songPickerOptions()}
            </select>
          </label>
        </div>
        <p class="cel-log" id="cel-log" aria-live="polite"></p>
        <div class="cel-surprise" id="cel-surprise"></div>
      </div>
    </div>
  `;

  if (!unlocked) {
    // small countdown while locked
    const cd = el.querySelector('#cel-countdown');
    let raf;
    function tick() {
      const p = ctx.time.countdownParts(ctx.time.birthdayMs() - timeNow());
      cd.textContent = p.days + 'd ' + p.hours + ':' + pad(p.minutes) + ':' + pad(p.seconds);
      raf = requestAnimationFrame(tick);
    }
    function timeNow() { return ctx.time.now().getTime(); }
    function pad(n) { return String(n).padStart(2, '0'); }
    tick();
    return {
      destroy() { cancelAnimationFrame(raf); },
    };
  }

  // Keep the site's normal looping music everywhere else; this queue belongs
  // only to the celebration scene and is restored when the section is left.
  audio.setPlaylist(PARTY_TRACKS);

  const wrap = el.querySelector('#cel-cake-wrap');
  const msg = el.querySelector('#cel-msg');
  const log = el.querySelector('#cel-log');
  const kicker = el.querySelector('#cel-kicker');
  const relightBtn = el.querySelector('#cel-relight');
  const surprise = el.querySelector('#cel-surprise');
  let logTimer = 0;

  // ---------- funny chatter ----------
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function say(text) {
    log.textContent = text;
    log.classList.remove('pop');
    void log.offsetWidth; // restart the wiggle
    log.classList.add('pop');
  }
  const KICKERS = [
    'the cake has requested a tiny, respectful amount of chaos',
    'dress code: frosting, sparkle, and unreasonable confidence',
    'the candles have been briefed; they have several questions',
    'officially: 2% ceremony, 98% questionable dancing',
    'please keep all birthday wishes inside the cake’s hearing range',
  ];
  kicker.textContent = pick(KICKERS);
  say('Tap a candle to blow it out. The cake says it counts as cardio.');

  const DARK_LINES = [
    'Lights out. The cake is now the headliner.',
    'The candles whisper: make it a good wish. Keep it cake-related.',
    'Nobody move — the frosting is doing a dramatic reveal.',
    'The cats heard the chorus and interpreted it as a challenge.',
    'Mood lighting achieved. Volume: still suspicious.',
    'The cake has entered its candlelit era.',
  ];
  const LIT_LINES = [
    'Lights back on. The cats deny everything.',
    'Party paused. The candles are checking their calendars.',
    'Break over. The cake missed you and says so loudly.',
  ];
  const BLOW_LINES = [
    'Pfffft! Wish launched. Accuracy: cat.',
    'That candle left more dramatically than the birthday guest.',
    'Careful, the cake was using that flame for ambiance.',
    'The smoke detector would like to speak to the manager.',
    'One less star in the frosting galaxy.',
    'Chk. Somewhere, a tiny snuffer feels proud.',
    'The candle is out. The cake is pretending not to be impressed.',
  ];

  // ---------- cake + candles ----------
  const narrow = window.innerWidth <= 400;
  const SPECTRUM = ['#F55E53', '#F59F53', '#F5DA53', '#53F56E', '#53E5F5', '#5389F5', '#A453F5', '#F553A4'];

  // Tier geometry: x0/x1 edges, top/bottom of the body.
  const T_BOT = { x0: 38, x1: 282, top: 326, bot: 424, fill: '#FFD9EC', stroke: '#F553A4' };
  const T_MID = { x0: 78, x1: 242, top: 244, bot: 328, fill: '#D9E5FF', stroke: '#5389F5' };
  const T_TOP = { x0: 108, x1: 212, top: 170, bot: 246, fill: '#FFF9D9', stroke: '#F5DA53' };

  // Tier body: straight sides, rounded bottom corners.
  function tierBody(t, r) {
    return `M${t.x0} ${t.top} H${t.x1} V${t.bot - r} Q${t.x1} ${t.bot} ${t.x1 - r} ${t.bot} ` +
           `H${t.x0 + r} Q${t.x0} ${t.bot} ${t.x0} ${t.bot - r} Z`;
  }
  // Frosting cap: a solid band piled on the top edge with a scalloped drip bottom.
  function frosting(t, n, d1, d2, rise) {
    const ty = t.top - rise;
    const w = (t.x1 - t.x0) / n;
    const r = 10;
    let d = `M${t.x0 + r} ${ty} H${t.x1 - r} Q${t.x1} ${ty} ${t.x1} ${ty + r} V${ty + 6}`;
    for (let i = 0; i < n; i++) {
      const dd = i % 2 === 0 ? d1 : d2;
      d += ` q${(-w / 2).toFixed(2)} ${dd} ${(-w).toFixed(2)} 0`;
    }
    return d + ` V${ty + r} Q${t.x0} ${ty} ${t.x0 + r} ${ty} Z`;
  }
  // Row of rainbow icing dots across a tier.
  function icingDots(t, count, y, r, offset) {
    let out = '';
    for (let i = 0; i < count; i++) {
      const x = t.x0 + ((i + 0.5) * (t.x1 - t.x0)) / count;
      out += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${r}" fill="${SPECTRUM[(i + offset) % 8]}" opacity="0.9"/>`;
    }
    return out;
  }

  // A whole light package rising from one wick: soft cone, halo, hot core, drifting motes.
  function candleLight(x, wickY, idx) {
    const d = (idx * 0.37) % 2.2;
    return `
      <g class="cel-light">
        <path class="cel-cone" d="M${x - 3.2} ${wickY - 2} L${x - 11.5} ${wickY - 58} L${x + 11.5} ${wickY - 58} L${x + 3.2} ${wickY - 2} Z" fill="url(#cel-cone-g)"/>
        <circle class="cel-halo" cx="${x}" cy="${wickY - 11}" r="19" fill="url(#cel-halo-g)" filter="url(#cel-blur6)" style="animation-delay:${d}s"/>
        <circle class="cel-core" cx="${x}" cy="${wickY - 10}" r="4" fill="#FFF9D9" style="animation-delay:${d}s"/>
      </g>
      <g class="cel-motes" aria-hidden="true">
        <circle class="cel-mote" cx="${x - 4}" cy="${wickY - 16}" r="1.2" fill="#FFF7D6" style="animation-duration:3.1s; animation-delay:${d + 0.2}s"/>
        <circle class="cel-mote" cx="${x - 1}" cy="${wickY - 24}" r="1.6" fill="#FFF3C4" style="animation-duration:2.7s; animation-delay:${d + 1.0}s"/>
        <circle class="cel-mote" cx="${x + 4}" cy="${wickY - 20}" r="1.1" fill="#FFEDB8" style="animation-duration:3.6s; animation-delay:${d + 1.7}s"/>
      </g>`;
  }

  // A single teardrop flame with flicker handled by CSS.
  function flame(x, wickY, color, idx) {
    return `
      ${candleLight(x, wickY, idx)}
      <g class="cel-flame">
        <path d="M${x} ${wickY} C${x - 7} ${wickY - 8}, ${x - 6} ${wickY - 16}, ${x} ${wickY - 25} C${x + 6} ${wickY - 16}, ${x + 7} ${wickY - 8}, ${x} ${wickY} Z" fill="${color}"/>
        <path d="M${x} ${wickY - 1} C${x - 3.5} ${wickY - 7}, ${x - 3} ${wickY - 13}, ${x} ${wickY - 18} C${x + 3} ${wickY - 13}, ${x + 3.5} ${wickY - 7}, ${x} ${wickY - 1} Z" fill="#FFF6C9"/>
      </g>`;
  }
  // A slim striped candle.
  function regularCandle(x, body, idx) {
    const top = 142;
    return `
      <g>
        <rect x="${x - 5.5}" y="${top}" width="11" height="28" rx="4" fill="${body}" stroke="#3A2A38" stroke-opacity=".22" stroke-width="1"/>
        <rect x="${x - 5.5}" y="${top}" width="11" height="28" rx="4" fill="url(#cel-stripes)"/>
        <line x1="${x}" y1="${top}" x2="${x}" y2="${top - 5}" stroke="#3A2A38" stroke-width="1.4" stroke-linecap="round"/>
        ${flame(x, top - 5, '#F59F53', idx)}
      </g>`;
  }
  // A number candle — this is how the age is spelled out.
  function numeralCandle(x, digit, body, idx) {
    const top = 130;
    return `
      <g>
        <rect x="${x - 8.5}" y="${top}" width="17" height="40" rx="5" fill="${body}" stroke="#3A2A38" stroke-opacity=".22" stroke-width="1"/>
        <rect x="${x - 8.5}" y="${top}" width="17" height="40" rx="5" fill="url(#cel-stripes)"/>
        <text x="${x}" y="161" text-anchor="middle" font-family="var(--font-display)" font-size="25" font-weight="800" fill="#FFFDF6">${digit}</text>
        <line x1="${x}" y1="${top}" x2="${x}" y2="${top - 5}" stroke="#3A2A38" stroke-width="1.4" stroke-linecap="round"/>
        ${flame(x, top - 5, '#F59F53', idx)}
      </g>`;
  }

  // Fan of light shafts rising from the candle line (stronger in the dark).
  function lightRays() {
    const count = 13;
    let out = '';
    for (let k = 0; k < count; k++) {
      const a = -42 + k * (84 / (count - 1));
      const len = 96 + (k % 2 === 0 ? 26 : 0) + (k % 3 === 0 ? 10 : 0);
      const w = 3.2 + (k % 3) * 2.1;
      out += `<path d="M160 170 L${(160 - w).toFixed(1)} ${(170 - len).toFixed(1)} L${(160 + w).toFixed(1)} ${(170 - len).toFixed(1)} Z" fill="url(#cel-cone-g)" transform="rotate(${a.toFixed(1)} 160 170)"/>`;
    }
    return `<g class="cel-rays" aria-hidden="true">${out}</g>`;
  }
  // Twinkling dust around the cake (visible once the room is dark).
  function sparks() {
    const pts = [[52, 112], [274, 104], [302, 224], [42, 252], [96, 78], [240, 70], [312, 306], [18, 322]];
    let out = '';
    pts.forEach((pt, i) => {
      out += `<circle class="cel-spark" cx="${pt[0]}" cy="${pt[1]}" r="${1.3 + (i % 3) * 0.5}" fill="#FFF6C9" style="animation-delay:${(i * 0.53) % 3.2}s"/>`;
    });
    return `<g class="cel-sparks" aria-hidden="true">${out}</g>`;
  }

  // Bunting: a string of spectrum flags above the cake.
  const FLAGS = [
    { x: 51.2, y: 63.6, c: '#F55E53' }, { x: 78.4, y: 69.4, c: '#F59F53' },
    { x: 105.6, y: 73.6, c: '#F5DA53' }, { x: 132.8, y: 76.2, c: '#53F56E' },
    { x: 160.0, y: 77.0, c: '#53E5F5' }, { x: 187.2, y: 76.2, c: '#5389F5' },
    { x: 214.4, y: 73.6, c: '#A453F5' }, { x: 241.6, y: 69.4, c: '#F553A4' },
  ];

  // Candle line-up: number candles in the middle, slim candles flanking them.
  const CANDLE_SPECS = narrow
    ? [['r', 125.3, '#53F56E'], ['n', 160.0, '1', '#F55E53'], ['n', 194.7, '7', '#5389F5']]
    : [['r', 118.4, '#53F56E'], ['r', 139.2, '#F5DA53'], ['n', 160.0, '1', '#F55E53'],
       ['n', 180.8, '7', '#5389F5'], ['r', 201.6, '#F59F53']];

  wrap.innerHTML = `
    <svg class="cel-cake" viewBox="0 0 320 470" aria-hidden="true">
      <defs>
        <pattern id="cel-stripes" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="4" height="9" fill="#FFFFFF" opacity=".38"/>
        </pattern>
        <radialGradient id="cel-halo-g">
          <stop offset="0%" stop-color="#FFF7D6" stop-opacity=".95"/>
          <stop offset="45%" stop-color="#FFDE8F" stop-opacity=".42"/>
          <stop offset="100%" stop-color="#FFDE8F" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="cel-cone-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#FFEDB8" stop-opacity=".38"/>
          <stop offset="100%" stop-color="#FFEDB8" stop-opacity="0"/>
        </linearGradient>
        <filter id="cel-blur6" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="cel-blur12" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>

      <g class="cel-bunting">
        <path d="M24 50 Q160 92 296 50" fill="none" stroke="#3A2A38" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
        ${FLAGS.map((f) => `
          <g transform="translate(${f.x} ${f.y})">
            <path d="M-10 0 L10 0 L0 19 Z" fill="${f.c}"/>
            <path d="M-10 0 L10 0 L0 6.5 Z" fill="#FFFFFF" opacity=".3"/>
            <circle cx="0" cy="10" r="2.2" fill="#FFFFFF" opacity=".7"/>
          </g>`).join('')}
      </g>

      ${sparks()}
      ${lightRays()}

      <ellipse class="cel-amb" cx="160" cy="215" rx="145" ry="108" fill="url(#cel-halo-g)" filter="url(#cel-blur12)"/>

      <ellipse cx="160" cy="444" rx="118" ry="20" fill="#FFFFFF" stroke="#EFE3D4" stroke-width="2"/>
      <ellipse cx="160" cy="436" rx="104" ry="11" fill="#3A2A38" opacity=".07"/>

      <path d="${tierBody(T_BOT, 16)}" fill="${T_BOT.fill}" stroke="${T_BOT.stroke}" stroke-width="4" stroke-linejoin="round"/>
      <path d="${frosting(T_BOT, 9, 13, 24, 6)}" fill="${T_BOT.stroke}" stroke="${T_BOT.stroke}" stroke-width="3" stroke-linejoin="round"/>
      ${icingDots(T_BOT, 8, 388, 5.2, 0)}
      <g transform="translate(64,374) scale(1.1)"><path d="M0 6 C-9 -1, -5 -10, 0 -5.5 C5 -10, 9 -1, 0 6 Z" fill="#F553A4"/></g>
      <g transform="translate(256,374) scale(1.1)"><path d="M0 6 C-9 -1, -5 -10, 0 -5.5 C5 -10, 9 -1, 0 6 Z" fill="#F553A4"/></g>

      <path d="${tierBody(T_MID, 14)}" fill="${T_MID.fill}" stroke="${T_MID.stroke}" stroke-width="4" stroke-linejoin="round"/>
      <path d="${frosting(T_MID, 7, 11, 20, 6)}" fill="${T_MID.stroke}" stroke="${T_MID.stroke}" stroke-width="3" stroke-linejoin="round"/>
      ${icingDots(T_MID, 6, 290, 4.6, 2)}

      <path d="${tierBody(T_TOP, 12)}" fill="${T_TOP.fill}" stroke="${T_TOP.stroke}" stroke-width="4" stroke-linejoin="round"/>
      <path d="${frosting(T_TOP, 5, 9, 17, 6)}" fill="${T_TOP.stroke}" stroke="${T_TOP.stroke}" stroke-width="3" stroke-linejoin="round"/>
      ${icingDots(T_TOP, 4, 208, 3.8, 5)}

      <g id="candles"></g>
    </svg>
    <div class="cel-disco" aria-hidden="true">${discoSvg()}</div>
    ${romanceGifsMarkup()}
    ${catDancersMarkup(showCats)}
  `;
  const candlesG = wrap.querySelector('#candles');
  const candles = [];
  const blown = [];
  CANDLE_SPECS.forEach((spec, i) => {
    const [kind, x, a, b] = spec;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cel-candle');
    g.setAttribute('data-id', i);
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', 'Blow out candle ' + (i + 1));
    g.style.cursor = 'pointer';
    g.innerHTML = kind === 'r' ? regularCandle(x, a, i) : numeralCandle(x, a, b, i);
    candlesG.appendChild(g);
    candles.push({ el: g, wickY: kind === 'r' ? 137 : 125 });
    blown.push(false);
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      blowCandle(i);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        blowCandle(i);
      }
    });
  });

  function blowCandle(i) {
    if (blown[i]) return;
    blown[i] = true;
    candles[i].el.classList.add('blown');
    // little smoke puffs drifting up from the wick
    for (let p = 0; p < 2; p++) {
      const smoke = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      smoke.setAttribute('cx', String(Number(CANDLE_SPECS[i][1]) + p * 3));
      smoke.setAttribute('cy', String(candles[i].wickY - 4));
      smoke.setAttribute('r', String(4.5 + p * 2.5));
      smoke.setAttribute('fill', '#E6DCD0');
      smoke.setAttribute('opacity', '0');
      candlesG.appendChild(smoke);
      const animate = smoke.animate([
        { opacity: (p ? 0.4 : 0.55), transform: 'translate(0, 0) scale(0.5)' },
        { opacity: 0, transform: `translate(${p ? 8 : 4}px, ${p ? -34 : -22}px) scale(${p ? 2 : 1.6})` }
      ], { duration: 950 + p * 350, delay: p * 160, easing: 'ease-out' });
      animate.onfinish = () => smoke.remove();
    }

    const left = blown.filter((b) => !b).length;
    if (left > 0) {
      say(pick(BLOW_LINES) + ' ' + (left === 1 ? 'Last candle! The tension is unbearable.' : left + ' candles to go.'));
    } else {
      allCandlesOut();
    }
  }

  function allCandlesOut() {
    el.classList.add('candles-out');
    relightBtn.hidden = false;
    msg.textContent = 'Happy Birthday, ' + (ctx.CONFIG.gateName || 'love') + '!';
    say('Darkness achieved. The cake is officially edible.');
    confetti.burst(wrap, 90);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(() => confetti.burst(wrap, 110), 480);
    }
  }

  relightBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    el.classList.remove('candles-out');
    relightBtn.hidden = true;
    msg.textContent = '';
    blown.forEach((_, i) => {
      blown[i] = false;
      candles[i].el.classList.remove('blown');
    });
    say('The candles came back sniping: we are not done partying.');
    confetti.burst(wrap, 36);
  });

  // ---------- room lights (off while the song plays) ----------
  const dim = document.createElement('div');
  dim.className = 'cel-dim';
  dim.setAttribute('aria-hidden', 'true');
  el.appendChild(dim);

  let lightsOff = false;
  function setLights(off, mode = '') {
    if (off === lightsOff) return;
    lightsOff = off;
    el.classList.toggle('lights-off', off);
    if (off) {
      say(pick(DARK_LINES));
      logTimer = setInterval(() => say(pick(DARK_LINES)), 7000);
      if (mode === 'party' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti.burst(wrap, 28);
    } else {
      clearInterval(logTimer);
      say(pick(LIT_LINES));
    }
  }

  // ---------- music ----------
  const playBtn = el.querySelector('#cel-play');
  const muteBtn = el.querySelector('#cel-mute');
  const trackPicker = el.querySelector('#cel-track-picker');
  function setMusicVisuals(state) {
    const mode = state.playing && state.track ? state.track.group : '';
    el.classList.toggle('main-song-playing', mode === 'main');
    el.classList.toggle('sub-party-playing', mode === 'party');
    return mode;
  }
  function updateMusicBtns(state = { playing: audio.playing, muted: audio.muted }) {
    playBtn.textContent = state.playing ? 'Pause the cat disco' : 'Cue the cat disco';
    playBtn.setAttribute('aria-label', state.playing ? 'Pause the cat disco' : 'Start the birthday song');
    playBtn.setAttribute('aria-pressed', String(state.playing));
    muteBtn.innerHTML = state.muted ? '&#128263;' : '&#128266;';
    muteBtn.setAttribute('aria-label', state.muted ? 'Unmute music' : 'Mute music');
    muteBtn.setAttribute('aria-pressed', String(state.muted));
    if (Number.isInteger(state.trackIndex)) trackPicker.value = String(state.trackIndex);
  }
  const unsubscribeAudio = audio.subscribe((state) => {
    // The lights change on the real media playback event, not while audio is only loading.
    const mode = setMusicVisuals(state);
    setLights(state.playing, mode);
    updateMusicBtns(state);
  });
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.playing) audio.pause(); else audio.play();
  });
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.toggle();
  });
  trackPicker.addEventListener('change', () => {
    audio.selectTrack(Number(trackPicker.value), { autoplay: true });
  });

  // ---------- dancers ----------
  const dancerTypes = [];
  if (ctx.CONFIG.SHOW_CATS !== false) dancerTypes.push('cat');
  dancerTypes.push('bear', 'flower');
  const totalDancers = 8;
  for (let i = 0; i < totalDancers; i++) {
    const type = dancerTypes[i % dancerTypes.length];
    const d = document.createElement('div');
    d.className = 'cel-dancer cel-' + type;
    d.innerHTML = dancerSvg(type);
    const x = 10 + Math.random() * 80;
    const y = 60 + Math.random() * 40;
    d.style.left = x + 'vw';
    d.style.top = y + 'vh';
    d.style.animationDuration = (3 + Math.random() * 4) + 's';
    d.style.animationDelay = (Math.random() * 5) + 's';
    d.style.setProperty('--dx', (20 + Math.random() * 40) + 'px');
    d.style.setProperty('--dy', (-(15 + Math.random() * 25)) + 'px');
    el.appendChild(d);
  }
  function visHandler() {
    // also pause dancers in root
    Array.from(el.querySelectorAll('.cel-dancer')).forEach((dd) => {
      dd.style.animationPlayState = document.hidden ? 'paused' : 'running';
    });
  }
  document.addEventListener('visibilitychange', visHandler);

  // ---------- final surprise ----------
  const celebrateMessage = ctx.CONFIG.celebrateMessage && ctx.CONFIG.celebrateMessage !== 'TODO_USER'
    ? ctx.CONFIG.celebrateMessage : '';
  const celebratePhoto = ctx.CONFIG.celebratePhoto && ctx.CONFIG.celebratePhoto !== 'TODO_USER'
    ? ctx.CONFIG.celebratePhoto : '';
  if (celebrateMessage || celebratePhoto) {
    const rot = ((Date.now() % 7) - 3) + 'deg';
    surprise.innerHTML = `
      <div class="cel-surprise-card">
        ${celebrateMessage ? '<p class="cel-surprise-msg">' + escapeHtml(celebrateMessage) + '</p>' : ''}
        ${celebratePhoto ? '<figure class="cel-polaroid" style="--r:' + rot + '"><img class="cel-surprise-photo" src="' + escapeHtml(celebratePhoto) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></figure>' : ''}
      </div>
    `;
  }

  return {
    destroy() {
      unsubscribeAudio();
      audio.clearPlaylist();
      clearInterval(logTimer);
      document.removeEventListener('visibilitychange', visHandler);
      dim.remove();
    },
  };
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function songPickerOptions() {
  return [
    { group: 'main', label: 'Main songs' },
    { group: 'party', label: 'Sub-party' },
  ].map(({ group, label }) => {
    const options = PARTY_TRACKS.map((track, index) => ({ track, index }))
      .filter(({ track }) => track.group === group)
      .map(({ track, index }) => `<option value="${index}">${escapeHtml(track.title)}</option>`)
      .join('');
    return `<optgroup label="${label}">${options}</optgroup>`;
  }).join('');
}

function romanceGifsMarkup() {
  return `<div class="cel-romance-gifs" aria-hidden="true">
    <picture class="cel-romance-gif cel-romance-gif--petals">
      <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/celebration-romance/rose-petals-drift-still.png">
      <img src="assets/gifs/celebration-romance/rose-petals-drift.gif" width="256" height="256" alt="" loading="lazy" decoding="async">
    </picture>
    <picture class="cel-romance-gif cel-romance-gif--rose">
      <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/celebration-romance/pink-rose-hearts-still.png">
      <img src="assets/gifs/celebration-romance/pink-rose-hearts.gif" width="192" height="128" alt="" loading="lazy" decoding="async">
    </picture>
  </div>`;
}

function catDancersMarkup(enabled) {
  if (!enabled) return '';
  const cats = [
    { id: 'happy', gif: 'Happy%20Dance%20GIF.gif', still: 'happy-dance-cat-still.png', width: 320, height: 407 },
    { id: 'bichi', gif: 'Cute%20Cat%20GIF%20by%20Bichi%20Mao.gif', still: 'cute-cat-dance-still.png', width: 480, height: 480 },
    { id: 'ikas', gif: 'Kitty%20Dancing%20by%20ikas.gif', still: 'kitty-dancing-ikas-still.png', width: 120, height: 120 },
    { id: 'party', gif: 'Dance%20Party%20Cat.gif', still: 'dance-party-cat-still.png', width: 144, height: 81 },
  ];
  const root = 'assets/gifs/gifs-in-the-cilibration-section/';
  return `<div class="cel-cat-dancers" aria-hidden="true">${cats.map((cat) => `
    <picture class="cel-cat-dancer cel-cat-dancer--${cat.id}">
      <source media="(prefers-reduced-motion: reduce)" srcset="${root}${cat.still}">
      <img src="${root}${cat.gif}" width="${cat.width}" height="${cat.height}" alt="" decoding="async">
    </picture>`).join('')}
  </div>`;
}

function discoSvg() {
  // A little mirror ball that only matters in the dark.
  const ROWS = [{ y: 20, h: 6 }, { y: 26, h: 5 }, { y: 31, h: 6 }, { y: 37, h: 5 }, { y: 42, h: 6 }];
  const TILE = ['#F55E53', '#F5DA53', '#53E5F5', '#A453F5', '#53F56E'];
  let tiles = '';
  ROWS.forEach((row, i) => {
    for (let c = 0; c < 2; c++) {
      const x = 18 + c * 16 + (i % 2) * 6;
      tiles += `<rect x="${x}" y="${row.y}" width="12" height="${row.h}" fill="${TILE[i]}" opacity=".8"/>`;
    }
  });
  return `
    <svg viewBox="0 0 64 78">
      <line x1="32" y1="2" x2="32" y2="16" stroke="#8A6E7E" stroke-width="2.4" stroke-linecap="round"/>
      <g class="cel-disco-spin">
        <defs>
          <clipPath id="cel-disco-clip"><circle cx="32" cy="34" r="17"/></clipPath>
        </defs>
        <circle cx="32" cy="34" r="17" fill="#EDEBF7" stroke="#A453F5" stroke-width="2"/>
        <g clip-path="url(#cel-disco-clip)">
          ${tiles}
          <line x1="32" y1="17" x2="32" y2="51" stroke="#8A6E7E" stroke-width="1" opacity=".5"/>
          <line x1="15" y1="34" x2="49" y2="34" stroke="#8A6E7E" stroke-width="1" opacity=".5"/>
        </g>
      </g>
      <path class="cel-disco-spark" d="M8 22 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill="#FFF6C9"/>
      <path class="cel-disco-spark" d="M55 40 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4 Z" fill="#FFF6C9"/>
    </svg>`;
}

function dancerSvg(type) {
  if (type === 'cat') {
    return `<svg viewBox="0 0 34 34"><ellipse cx="17" cy="22" rx="9" ry="6" fill="#FFD9EC" stroke="#753153" stroke-width="1.5"/><circle cx="13" cy="15" r="4.5" fill="#FFD9EC" stroke="#753153" stroke-width="1.5"/><path d="M10 13 Q12 11 14 13" fill="none" stroke="#753153" stroke-width="1.2"/><path d="M16 13 Q14 11 12 13" fill="none" stroke="#753153" stroke-width="1.2"/><circle cx="12" cy="14" r="0.7" fill="#753153"/><circle cx="14" cy="14" r="0.7" fill="#753153"/><path d="M17 26 Q17 30 24 28" fill="none" stroke="#F553A4" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  }
  if (type === 'bear') {
    return `<svg viewBox="0 0 34 34"><ellipse cx="17" cy="23" rx="9" ry="7" fill="#FFEBD9" stroke="#755131" stroke-width="1.5"/><circle cx="13" cy="15.5" r="5" fill="#FFEBD9" stroke="#755131" stroke-width="1.5"/><circle cx="21" cy="15.5" r="5" fill="#FFEBD9" stroke="#755131" stroke-width="1.5"/><circle cx="13" cy="15" r="1.5" fill="#755131"/><circle cx="21" cy="15" r="1.5" fill="#755131"/><circle cx="17" cy="18" r="2" fill="#F5DA53"/><path d="M15 20 Q17 22 19 20" fill="none" stroke="#755131" stroke-width="1.2"/></svg>`;
  }
  // flower with face
  return `<svg viewBox="0 0 34 34"><path d="M17 4 Q10 10 17 16 Q24 10 17 4 Z" fill="#F553A4"/><circle cx="17" cy="17" r="3" fill="#753153"/><circle cx="15" cy="16" r="0.7" fill="#FFFBF3"/><circle cx="19" cy="16" r="0.7" fill="#FFFBF3"/><path d="M16 19 Q17 20 18 19" fill="none" stroke="#753153" stroke-width="1.2"/><path d="M17 16 Q17 22 17 28" fill="none" stroke="#31753D" stroke-width="2.5" stroke-linecap="round"/><path d="M13 22 Q17 26 21 22" fill="none" stroke="#31753D" stroke-width="2.5" stroke-linecap="round"/></svg>`;
}
