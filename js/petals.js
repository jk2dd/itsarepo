// petals.js
// Multicolor confetti petals drifting through the whole hue spectrum.
// At most ~12 on phones. Paused when the tab is hidden.
// Disabled entirely under prefers-reduced-motion.

const SPECTRUM = ['#F55E53', '#F59F53', '#F5DA53', '#53F56E', '#53E5F5', '#5389F5', '#A453F5', '#F553A4'];
const SHAPES = [
  '60% 40% 55% 50% / 50% 60% 45% 55%', // petal
  '50%',                               // dot
  '32%',                               // squircle
  '50% 50% 50% 0',                     // teardrop-ish
];

export const petals = {
  layer: null,
  count: 0,
  raf: null,
  hidden: false,
  reduced: false,

  init(layer, count = 12) {
    this.layer = layer;
    this.count = count;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) return;
    this._create();
    this._tick();
    document.addEventListener('visibilitychange', () => {
      this.hidden = document.hidden;
    });
  },

  _create() {
    for (let i = 0; i < this.count; i++) {
      const el = document.createElement('div');
      el.className = 'petal';
      const size = 5 + Math.random() * 9;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = -10 - Math.random() * 20 + 'px';
      el.style.opacity = (0.35 + Math.random() * 0.3).toFixed(2);
      el.style.animationDuration = (12 + Math.random() * 16) + 's';
      el.style.animationDelay = Math.random() * 24 + 's';
      el.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      el.style.background = SPECTRUM[i % SPECTRUM.length];
      el.style.borderRadius = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.layer.appendChild(el);
    }
  },

  _tick() {
    if (this.hidden) {
      this.layer.classList.add('paused');
    } else {
      this.layer.classList.remove('paused');
    }
    this.raf = requestAnimationFrame(() => this._tick());
  },

  pause() {
    if (this.layer) this.layer.classList.add('paused');
  },

  resume() {
    if (this.layer) this.layer.classList.remove('paused');
  },

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.layer) this.layer.innerHTML = '';
  },
};
