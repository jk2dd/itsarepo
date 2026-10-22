// config.js
// ALL personal content and settings live here.
// Replace every TODO_USER with real text before the site goes live.
// Never invent personal content.

export const CONFIG = {
  // --- testing (honored only when DEV_MODE is true) ---
  DEV_MODE: true,          // set false before deployment
  DEV_NOW: '2026-10-23T00:01:00',   // e.g. '2026-10-22T23:59:50' or null
  SHOW_CATS: true,          // set false to hide dancing cats

  // --- gate ---
  gateName: 'Elianty',
  gateTitle: 'Do you accept a birthday surprise?',
  gateText: 'Hello there do you want to see your gift?',
  password: '67',           // case-insensitive, trimmed
  passwordHint: '67',       // shown when she taps Hint
  passwordHintGif: 'TODO_USER', // optional hint GIF you will supply

  // --- time ---
  birthday: '2026-10-23T00:00:00',   // Asia/Beirut midnight
  relationshipStart: '2025-11-14',   // Asia/Beirut (the only other date on the site)
  nextAnniversary: '2026-11-14',     // shown as "Coming up: one year together"

  // --- YouTube (only external requests allowed) ---
  ytMyFlowerGirl: 'qh3ccanI39c',
  ytSway: 'TODO_USER',
  ytLOVE: 'TODO_USER',
  ytAriana: 'gl1aHhXnN1k',      // Ariana Grande - thank u, next (official video)
  ytFairuzBridal: 'AWJ4W1MLU_g', // Fairuz - Eswaret El Aroos
  ytFairuzNay: 'r_8bIJhSfdE',    // Fairuz - Aatini Al Nay
  ytHerCry: '3XqqkrJENB4',       // Cigarettes After Sex - Cry (her story song)
  songNotes: {
    myFlowerGirl: 'TODO_USER', // one sentence from the owner
    sway: 'TODO_USER',
    love: 'TODO_USER',
  },

  // --- Anne's Corner ---
  anneNote: 'TODO_USER', // owner's short note about Anne of Green Gables

  // --- Letter (Arabic) ---
  letterText: 'إليانا يا قلبي انتي حبيبتي واجمل ما عندي ما تتخيلي شقد احب وجودك في حياتي اليوم يوم مميز كثير لانه صار عمرك ١٧ سنة وانا كثير مبسوط بهالشي, واتمنى لك العمر الطويل والحياة السعيدة وتحققي كل أحلامك ونلتقي أكيد, بحبك كثير وانا دائماً رح ضل حبك, شكراً لوجودك بحياتي يا أجمل إمرأة في عيني', // the Arabic letter, displayed exactly as given
  letterPhoto: 'TODO_USER', // optional photo next to the letter

  // --- Celebrate final surprise ---
  celebrateMessage: 'TODO_USER',
  celebratePhoto: 'TODO_USER',

  // --- assets ---
  puzzleImage: 'assets/img/puzzle-original.png',
  birthdaySong: 'assets/audio/around-the-world.mp3', // ATC - Around the World (La La La) — Celebration "Play song"
};
