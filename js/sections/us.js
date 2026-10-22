// us.js - M3: time together since 2025-11-14 (calendar-aware), plus next anniversary.
export async function init(el, ctx) {
  el.innerHTML = `
    <div class="us">
      <span class="us-kicker">Our scrapbook</span>
      <h2 class="us-heading">Us</h2>
      <div class="us-paper">
        <section class="us-capsule" aria-labelledby="us-capsule-title">
          <div class="us-capsule-heading">
            <div class="us-clock" aria-hidden="true">
              <span class="us-clock-face"><i class="us-clock-hour"></i><i class="us-clock-minute"></i><i class="us-clock-pin"></i></span>
            </div>
            <div class="us-capsule-titles">
              <span class="us-capsule-overline">a little record of forever</span>
              <h3 id="us-capsule-title">Our Time Capsule</h3>
            </div>
            <button class="us-note-trigger" type="button" aria-label="Open a little note" aria-expanded="false" aria-controls="us-whisper">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.1 4.7 13A4.5 4.5 0 0 1 11 6.6l1 1 1-1a4.5 4.5 0 0 1 6.3 6.4L12 20.1Z"/></svg>
            </button>
          </div>
          <p class="us-whisper" id="us-whisper" aria-hidden="true">Every second finds its way into our story.</p>
          <p class="us-capsule-caption">Every little moment, kept close</p>
          <ol class="us-timeline" id="us-timeline" aria-label="Time spent together"></ol>
          <div class="us-anniversary" aria-live="off">
            <span class="us-anniversary-label">the next page in our story</span>
            <div class="us-anniversary-row">
              <picture class="us-flower-sticker us-flower-sticker--red" aria-hidden="true">
                <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/us-flower-red-still.png">
                <img src="assets/gifs/us-flower-red.gif" width="112" height="112" alt="" decoding="async">
              </picture>
              <p><strong id="us-anniversary-count">—</strong><span id="us-anniversary-copy"> until our next anniversary</span></p>
              <picture class="us-flower-sticker us-flower-sticker--pink" aria-hidden="true">
                <source media="(prefers-reduced-motion: reduce)" srcset="assets/gifs/us-flower-pink-still.png">
                <img src="assets/gifs/us-flower-pink.gif" width="112" height="112" alt="" decoding="async">
              </picture>
            </div>
          </div>
          <span class="us-capsule-serial" aria-hidden="true">kept in our little archive · no. 01</span>
        </section>
        <div class="us-divider"><span class="us-dot" aria-hidden="true"></span></div>
        <div class="us-gallery" id="us-gallery"></div>
      </div>
    </div>
  `;

  const timelineEl = el.querySelector('#us-timeline');
  const annivCount = el.querySelector('#us-anniversary-count');
  const annivCopy = el.querySelector('#us-anniversary-copy');
  const gallery = el.querySelector('#us-gallery');
  const noteTrigger = el.querySelector('.us-note-trigger');
  const whisper = el.querySelector('#us-whisper');

  // A quiet paper palette: the hues vary, while their tint and ink stay even.
  const units = [
    { k: 'years',   label: 'year',   paper: 'var(--capsule-rose)' },
    { k: 'months',  label: 'month',  paper: 'var(--capsule-peach)' },
    { k: 'days',    label: 'day',    paper: 'var(--capsule-butter)' },
    { k: 'hours',   label: 'hour',   paper: 'var(--capsule-sage)' },
    { k: 'minutes', label: 'minute', paper: 'var(--capsule-blue)' },
    { k: 'seconds', label: 'second', paper: 'var(--capsule-lilac)' },
  ];
  const valueEls = {};
  units.forEach((u) => {
    const item = document.createElement('li');
    item.className = 'us-unit';
    item.style.setProperty('--unit-paper', u.paper);
    item.setAttribute('aria-label', u.label + 's: 0');
    item.innerHTML = '<span class="us-medallion"><span class="us-value">0</span><span class="us-unit-mark" aria-hidden="true"></span></span><span class="us-unit-label">' + u.label + 's</span>';
    timelineEl.appendChild(item);
    valueEls[u.k] = item;
  });

  // Update only when a value changes. The tabular, fixed-width digit slot flips in place.
  function setValue(item, v, label) {
    const s = String(v);
    const value = item.querySelector('.us-value');
    if (value.textContent === s) return;
    value.textContent = s;
    const unitLabel = Number(s) === 1 ? label : label + 's';
    item.querySelector('.us-unit-label').textContent = unitLabel;
    item.setAttribute('aria-label', unitLabel + ': ' + s);
    value.classList.remove('us-turn');
    void value.offsetWidth; // restart the paper-turn animation
    value.classList.add('us-turn');
  }

  let timer;
  let previousDays;
  function tick() {
    const before = ctx.time.isBeforeStart();
    const p = ctx.time.elapsedParts();
    units.forEach((u) => {
      setValue(valueEls[u.k], before ? '0' : p[u.k], u.label);
    });
    const days = ctx.time.daysUntilAnniversary();
    if (days !== previousDays) {
      annivCount.textContent = days === 0 ? 'Today' : days + (days === 1 ? ' day' : ' days');
      annivCopy.textContent = days === 0 ? ' our next anniversary begins a new page' : ' until our next anniversary';
      previousDays = days;
    }
    // Keep the second hand in step with the wall clock without a perpetual RAF loop.
    timer = setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();

  function toggleWhisper() {
    const open = noteTrigger.getAttribute('aria-expanded') !== 'true';
    noteTrigger.setAttribute('aria-expanded', String(open));
    noteTrigger.setAttribute('aria-label', open ? 'Close the little note' : 'Open a little note');
    whisper.setAttribute('aria-hidden', String(!open));
    el.querySelector('.us-capsule').classList.toggle('is-note-open', open);
  }
  noteTrigger.addEventListener('click', toggleWhisper);

  // Five gallery photos as polaroid frames (existing assets, not invented content).
  const PHOTOS = [
    { src: 'assets/img/start-gallery/first-chat.jpg', cap: 'First chat' },
    { src: 'assets/img/start-gallery/yellow-plush.jpg', cap: 'Yellow plush' },
    { src: 'assets/img/start-gallery/clay-figure.jpg', cap: 'Clay figure' },
    { src: 'assets/img/start-gallery/elephant-drawing.jpg', cap: 'Elephant drawing' },
    { src: 'assets/img/start-gallery/selfie.jpg', cap: 'Selfie' },
  ];
  PHOTOS.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'us-photo';
    fig.style.setProperty('--r', ((i % 3) - 1) * 2.6 + (i % 2 ? 2 : -2.2) + 'deg');
    fig.innerHTML = `
      <img src="${p.src}" alt="" loading="lazy" onerror="this.style.display='none'">
      <figcaption>${p.cap}</figcaption>
    `;
    gallery.appendChild(fig);
  });

  return {
    destroy() {
      if (timer) clearTimeout(timer);
      noteTrigger.removeEventListener('click', toggleWhisper);
    },
  };
}
