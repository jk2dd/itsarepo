// router.js - hash routes. Each section is its own JS module + CSS file.
const SECTIONS = {
  gate: () => import('./sections/gate.js?v=14'),
  hub: () => import('./sections/hub.js?v=9'),
  play: () => import('./sections/play.js?v=9'),
  us: () => import('./sections/us.js?v=9'),
  books: () => import('./sections/books.js?v=3'),
  favorites: () => import('./sections/favorites.js?v=15'),
  letter: () => import('./sections/letter.js?v=8'),
  celebrate: () => import('./sections/celebrate.js?v=16'),
};

// Unknown hash: match by prefix (tolerates typos like #/celebrat), else gate.
function sectionName(hash) {
  const name = hash.replace('#/', '').trim() || 'gate';
  if (name in SECTIONS) return name;
  return Object.keys(SECTIONS).find((k) => k.startsWith(name) || name.startsWith(k)) || 'gate';
}

let cssLinks = [];

export const router = {
  ctx: null,
  current: null,
  init(ctx) { this.ctx = ctx; },
  async go(hash) {
    const name = sectionName(hash);
    this.ctx.music.pause();
    if (this.current && this.current.destroy) this.current.destroy();
    this._unloadCSS();
    const mount = document.getElementById('mount');
    mount.innerHTML = '';
    try {
      const mod = await SECTIONS[name]();
      const el = document.createElement('div');
      el.className = 'section section-' + name;
      mount.appendChild(el);
      this.current = await mod.init(el, this.ctx);
      this._loadCSS(name);
    } catch (e) {
      mount.innerHTML = '<div class="error" style="padding:2rem;text-align:center;color:var(--text)">Section failed to load.</div>';
      console.error(e);
      this.current = null;
    }
    mount.scrollTop = 0;
    window.scrollTo(0, 0);
  },
  _loadCSS(name) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/' + name + '.css?v=28';
    link.dataset.section = name;
    document.head.appendChild(link);
    cssLinks.push(link);
  },
  _unloadCSS() {
    cssLinks.forEach((l) => l.remove());
    cssLinks = [];
  },
};
