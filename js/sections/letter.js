// letter.js - M5: Arabic letter. Locked until the puzzle is solved.
export async function init(el, ctx) {
  const solved = ctx.state.puzzleSolved;
  el.innerHTML = `
    <div class="letter-wrap" lang="ar" dir="rtl">
      <div class="letter-locked" id="letter-locked" style="display:${solved ? 'none' : 'flex'}">
        <div class="lock">&#128274;</div>
        <p class="lock-text">Solve the puzzle first.</p>
      </div>
      <div class="letter-paper" id="letter-paper" style="display:${solved ? 'block' : 'none'}">
        <div class="letter-photo" id="letter-photo"></div>
        <div class="letter-text" id="letter-text"></div>
      </div>
      <div class="letter-actions" id="letter-actions" style="display:${solved ? 'flex' : 'none'}">
        <button class="btn btn-close" id="letter-close">Close</button>
        <button class="btn btn-again" id="letter-again">Read again</button>
      </div>
    </div>
  `;

  if (!solved) return { destroy() {} };

  const paper = el.querySelector('#letter-paper');
  const textEl = el.querySelector('#letter-text');
  const photoEl = el.querySelector('#letter-photo');
  const text = ctx.CONFIG.letterText && ctx.CONFIG.letterText !== 'TODO_USER'
    ? ctx.CONFIG.letterText
    : 'Your handwritten note will go here.';
  const reduced = ctx.reduced;

  // Optional photo
  if (ctx.CONFIG.letterPhoto) {
    const img = document.createElement('img');
    img.src = ctx.CONFIG.letterPhoto;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'letter-photo-img';
    img.onerror = () => img.style.display = 'none';
    photoEl.appendChild(img);
    photoEl.style.display = 'block';
  }

  let raf = null;
  let start = null;
  let skipping = false;

  function type(t) {
    if (!start) start = t;
    if (skipping) { textEl.textContent = text; return; }
    const elapsed = t - start;
    const chars = Math.min(text.length, Math.floor(elapsed / 45));
    textEl.textContent = text.slice(0, chars);
    if (chars < text.length) raf = requestAnimationFrame(type);
  }

  function startType() {
    textEl.textContent = '';
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    start = null;
    skipping = false;
    if (reduced) {
      textEl.textContent = text;
    } else {
      raf = requestAnimationFrame(type);
    }
  }

  function skip() {
    skipping = true;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    textEl.textContent = text;
  }

  textEl.addEventListener('click', skip);
  textEl.addEventListener('click', (e) => e.stopPropagation());

  el.querySelector('#letter-again').addEventListener('click', (e) => {
    e.stopPropagation();
    startType();
  });
  el.querySelector('#letter-close').addEventListener('click', (e) => {
    e.stopPropagation();
    ctx.navigate('#/hub');
  });

  if (!reduced) startType();

  return {
    destroy() {
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
