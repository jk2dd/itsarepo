// time.js
// ALL date logic.
// Birthday instant: 2026-10-23 00:00 Asia/Beirut (computed with Intl, no hard-coded offset).
// Relationship start: 2025-11-14 Asia/Beirut.

import { CONFIG } from './config.js';

const TZ = 'Asia/Beirut';

// Read the wall-clock components (in Beirut) for a given timestamp.
function beirutComponents(ms) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const p = f.formatToParts(new Date(ms));
  const g = (t) => Number(p.find((x) => x.type === t).value) || 0;
  return { y: g('year'), mo: g('month'), d: g('day'), h: g('hour'), mi: g('minute'), s: g('second') };
}

// Days in a month (Gregorian).
function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getDate();
}

// Convert a Beirut wall-clock date/time to a UTC timestamp.
// Iterates because Intl tells us what Beirut shows for a guess; we adjust until it matches.
export function beirutInstant(y, mo, d, h = 0, mi = 0, s = 0) {
  let ms = Date.UTC(y, mo - 1, d, h, mi, s);
  for (let i = 0; i < 6; i++) {
    const c = beirutComponents(ms);
    const dayDiff =
      Date.UTC(c.y, c.mo - 1, c.d) - Date.UTC(y, mo - 1, d);
    const wallNow = ((c.h * 60 + c.mi) * 60 + c.s) * 1000;
    const wallWant = ((h * 60 + mi) * 60 + s) * 1000;
    const errMs = (dayDiff / 86400000) * 86400000 + (wallNow - wallWant);
    if (Math.abs(errMs) < 1000) break;
    ms -= errMs;
  }
  return ms;
}

// Resolve config dates to timestamps (Beirut time).
export const birthdayMs = () => {
  const [d, t] = CONFIG.birthday.split('T');
  const [y, mo, da] = d.split('-').map(Number);
  const [h, mi, s] = (t || '00:00:00').split(':').map(Number);
  return beirutInstant(y, mo, da, h, mi, s);
};

export const relationshipStartMs = () => {
  const [y, mo, da] = CONFIG.relationshipStart.split('-').map(Number);
  return beirutInstant(y, mo, da, 0, 0, 0);
};

export const nextAnniversaryMs = () => {
  const [y, mo, da] = CONFIG.nextAnniversary.split('-').map(Number);
  return beirutInstant(y, mo, da, 0, 0, 0);
};

// Current time, honoring DEV_NOW and ?now= only when DEV_MODE is true.
let devOverride = null;
export function now() {
  if (CONFIG.DEV_MODE && devOverride) return new Date(devOverride);
  return new Date();
}

export function applyDevOverride(isoOrNull) {
  devOverride = isoOrNull || null;
}

// Parse ?now= URL parameter (only when DEV_MODE).
export function initDevOverride() {
  if (!CONFIG.DEV_MODE) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('now');
    if (v) devOverride = v;
  } catch (e) {}
}

// Countdown to the birthday instant: days, hours, minutes, seconds.
export function countdownParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const seconds = total % 60;
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600) % 24;
  const days = Math.floor(total / 86400);
  return { days, hours, minutes, seconds };
}

// Elapsed time since relationship start: calendar-aware years/months/days + h/m/s.
// Recalculated from now on every call so it never drifts.
export function elapsedParts() {
  const startMs = relationshipStartMs();
  const n = beirutComponents(now().getTime());
  const s = beirutComponents(startMs);
  if (now().getTime() < startMs) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  let years = n.y - s.y;
  let months = n.mo - s.mo;
  let days = n.d - s.d;
  let hours = n.h - s.h;
  let minutes = n.mi - s.mi;
  let seconds = n.s - s.s;
  if (seconds < 0) { minutes -= 1; seconds += 60; }
  if (minutes < 0) { hours -= 1; minutes += 60; }
  if (hours < 0) { days -= 1; hours += 24; }
  if (days < 0) {
    months -= 1;
    const prev = n.mo === 1 ? 12 : n.mo - 1;
    const prevYear = n.mo === 1 ? n.y - 1 : n.y;
    days += daysInMonth(prevYear, prev);
  }
  if (months < 0) { years -= 1; months += 12; }
  if (years < 0) { years = 0; months = 0; days = 0; hours = 0; minutes = 0; seconds = 0; }
  return { years, months, days, hours, minutes, seconds };
}

// Days remaining until next anniversary (0 on the day).
export function daysUntilAnniversary() {
  const ann = nextAnniversaryMs();
  const n = now().getTime();
  if (n >= ann) return 0;
  return Math.ceil((ann - n) / 86400000);
}

export function isBirthday() {
  return now().getTime() >= birthdayMs();
}

export function isBeforeStart() {
  return now().getTime() < relationshipStartMs();
}

// Namespace object used by main.js (import { time }) and sections via ctx.time.
export const time = {
  birthdayMs,
  relationshipStartMs,
  nextAnniversaryMs,
  now,
  applyDevOverride,
  initDevOverride,
  countdownParts,
  elapsedParts,
  daysUntilAnniversary,
  isBirthday,
  isBeforeStart,
};

