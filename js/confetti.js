// confetti.js - spectrum confetti burst, same HSV family as the theme.
// transform + opacity only; reduced-motion safe.
export const confetti = {
  burst(container, count = 40) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 3;
    const colors = ['#F55E53', '#F59F53', '#F5DA53', '#53F56E', '#53E5F5', '#5389F5', '#A453F5', '#F553A4', '#FFF9D9', '#FFD9EC'];
    const els = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const s = 4 + Math.random() * 6;
      el.style.width = s + 'px';
      el.style.height = s + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      const roll = Math.random();
      if (roll < 0.35) {
        el.style.borderRadius = '50%';                 // dot
      } else if (roll < 0.6) {
        el.style.borderRadius = '30%';                 // squircle
      } else if (roll < 0.8) {
        el.style.clipPath = 'polygon(50% 0, 0 100%, 100% 100%)'; // triangle
      }
      el.style.left = cx + 'px';
      el.style.top = cy + 'px';
      const angle = Math.random() * Math.PI * 2;
      const force = 120 + Math.random() * 220;
      const tx = Math.cos(angle) * force;
      const ty = Math.sin(angle) * force - 60;
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      el.style.animation = 'confettiFly 1.1s ease-out forwards';
      el.style.animationDelay = (Math.random() * 0.3) + 's';
      container.appendChild(el);
      els.push(el);
    }
    setTimeout(() => els.forEach((e) => e.remove()), 1500);
  },
};
