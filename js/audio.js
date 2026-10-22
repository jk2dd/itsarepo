// Audio shared across the site. The celebration page temporarily installs its
// own ordered playlist; other sections keep the configured looping song.
import { CONFIG } from './config.js';

function lsGet(key, def) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? def : JSON.parse(raw);
  } catch (e) {
    return def;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// The two personal songs lead the party; the full sub-party set follows them.
export const PARTY_TRACKS = [
  { title: 'Eliana Song', group: 'main', src: 'assets/audio/main-songs/ElianaSong.mp3' },
  { title: 'إليانتي', group: 'main', src: 'assets/audio/main-songs/إليانتي.mp3' },
  { title: 'Boom Boom Boom Boom (Sped Up)', group: 'party', src: 'assets/audio/sub-party/Boom boom boom boom (Sped Up).mp3' },
  { title: 'Everytime We Touch (Nightcore)', group: 'party', src: 'assets/audio/sub-party/Everytime we touch - Nightcore - HD.mp3' },
  { title: "I Don't Know (Nightcore)", group: 'party', src: "assets/audio/sub-party/Nightcore - I Don't Know.mp3" },
  { title: "L'amour Toujours (Nightcore)", group: 'party', src: "assets/audio/sub-party/Nightcore - L' amour Toujours.mp3" },
  { title: 'My Heart Beats Like A Drum (Nightcore)', group: 'party', src: 'assets/audio/sub-party/Nightcore - My Heart Beats Like A Drum.mp3' },
  { title: 'Bailando', group: 'party', src: 'assets/audio/sub-party/Paradisio - Bailando.mp3' },
  { title: 'Solo Tu', group: 'party', src: 'assets/audio/sub-party/Trance- Solo Tu.mp3' },
  { title: 'Around The World', group: 'party', src: 'assets/audio/sub-party/around-the-world.mp3' },
  { title: 'Copines x Copines (Slower Version)', group: 'party', src: 'assets/audio/sub-party/copines x copines [ Slower Version ].mp3' },
  { title: 'Favorites Theme', group: 'party', src: 'assets/audio/sub-party/favorites-theme.mp3' },
  { title: 'Oh My Little Baby Boy (Slowed + Reverb)', group: 'party', src: 'assets/audio/sub-party/oh my little baby boy (slowed and reverbed).mp3' },
  { title: 'I Love You So (Slowed + Reverb)', group: 'party', src: 'assets/audio/sub-party/schnuffel - I LOVE YOU SO (Slowed + Reverb).mp3' },
];

export const audio = {
  muted: lsGet('bg_mute', false),
  el: null,
  src: CONFIG.birthdaySong,
  playing: false,
  playlist: null,
  trackIndex: 0,
  activeTrackIndex: null,
  listeners: new Set(),
  _ignorePause: false,

  init() {},

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this._state());
    return () => this.listeners.delete(listener);
  },

  _state() {
    return {
      playing: this.playing,
      muted: this.muted,
      trackIndex: this.trackIndex,
      track: this.playlist && this.activeTrackIndex !== null
        ? this.playlist[this.activeTrackIndex]
        : null,
    };
  },

  _emit() {
    const state = this._state();
    this.listeners.forEach((listener) => listener(state));
  },

  setMute(m) {
    this.muted = !!m;
    lsSet('bg_mute', this.muted);
    if (this.el) this.el.muted = this.muted;
    if (this.muted) this.pause();
    this._emit();
    return this.muted;
  },

  toggle() {
    return this.setMute(!this.muted);
  },

  setPlaylist(tracks) {
    this.pause();
    this._ignorePause = false;
    this.playlist = tracks.slice();
    this.trackIndex = 0;
    this.activeTrackIndex = null;
    const el = this._el();
    el.loop = false;
    if (this.playlist.length) el.src = this.playlist[0].src;
    this.playing = false;
    this._emit();
  },

  clearPlaylist() {
    this.pause();
    this._ignorePause = false;
    this.playlist = null;
    this.trackIndex = 0;
    this.activeTrackIndex = null;
    if (this.el) {
      this.el.loop = true;
      this.el.src = this.src;
    }
    this.playing = false;
    this._emit();
  },

  selectTrack(index, { autoplay = true } = {}) {
    if (!this.playlist || index < 0 || index >= this.playlist.length) return false;
    const el = this._el();
    const wasPlaying = this.playing && !this.muted;
    if (!el.paused) {
      this._ignorePause = true;
      el.pause();
    }
    this.trackIndex = index;
    el.loop = false;
    el.src = this.playlist[index].src;
    try { el.currentTime = 0; } catch (e) {}

    // Keep the room dark across a song change while the next track starts.
    this.playing = autoplay && wasPlaying;
    // The next category's GIFs wait for the browser's actual `playing` event.
    this.activeTrackIndex = null;
    this._emit();
    if (autoplay) return this.play();
    return false;
  },

  nextTrack() {
    if (!this.playlist || !this.playlist.length) return false;
    return this.selectTrack((this.trackIndex + 1) % this.playlist.length, { autoplay: true });
  },

  _el() {
    if (!this.el) {
      this.el = new Audio();
      this.el.src = this.src;
      this.el.muted = this.muted;
      this.el.loop = true;
      this.el.preload = 'none';
      this.el.onerror = () => {}; // missing song must fail silently
      this.el.addEventListener('playing', () => {
        this._ignorePause = false;
        this.playing = true;
        this.activeTrackIndex = this.playlist ? this.trackIndex : null;
        this._emit();
      });
      this.el.addEventListener('pause', () => {
        if (this._ignorePause) {
          this._ignorePause = false;
          return;
        }
        if (this.playing) {
          this.playing = false;
          this.activeTrackIndex = null;
          this._emit();
        }
      });
      this.el.addEventListener('ended', () => {
        if (this.playlist && this.playlist.length) {
          this._ignorePause = true;
          this.nextTrack();
        } else {
          this.playing = false;
          this.activeTrackIndex = null;
          this._emit();
        }
      });
      this.el.addEventListener('error', () => {
        this._ignorePause = false;
        this.playing = false;
        this.activeTrackIndex = null;
        this._emit();
      });
    }
    return this.el;
  },

  play() {
    if (this.muted) return false;
    const el = this._el();
    el.loop = !this.playlist;
    let p;
    try {
      p = el.play();
    } catch (e) {
      this._ignorePause = false;
      this.playing = false;
      this.activeTrackIndex = null;
      this._emit();
      return false;
    }
    if (p && typeof p.then === 'function') {
      p.then(() => {
        this.playing = !el.paused;
        this.activeTrackIndex = this.playing && this.playlist ? this.trackIndex : null;
        this._emit();
      }).catch(() => {
        this._ignorePause = false;
        this.playing = false;
        this.activeTrackIndex = null;
        this._emit();
      });
    } else {
      this.playing = !el.paused;
      this.activeTrackIndex = this.playing && this.playlist ? this.trackIndex : null;
      this._emit();
    }
    return p;
  },

  pause() {
    const wasPlaying = this.playing;
    this.playing = false;
    this.activeTrackIndex = null;
    if (this.el && !this.el.paused) this.el.pause();
    if (wasPlaying) this._emit();
  },
};
