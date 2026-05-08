import { Howl, Howler } from 'howler';

let _ac = null;

function ac() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  if (_ac.state === 'suspended') _ac.resume();
  return _ac;
}

// ─── iOS audio unlock ─────────────────────────────────────────────────────────
// iOS Safari only unlocks AudioContext on 'click' or 'touchend', NOT on
// 'touchstart'. Call initAudio() from the Play button's click handler so both
// contexts are running well before the user's first tap on the canvas.
let _unlocked = false;
export function initAudio() {
  if (_unlocked) return;
  _unlocked = true;

  // Unlock our Web Audio synth context with a silent buffer
  const a = ac();
  const buf = a.createBuffer(1, 1, 22050);
  const src = a.createBufferSource();
  src.buffer = buf;
  src.connect(a.destination);
  src.start(0);
  src.onended = () => src.disconnect();

  // Unlock Howler's AudioContext too — it's a separate instance
  if (Howler.ctx && Howler.ctx.state !== 'running') {
    Howler.ctx.resume().catch(() => {});
  }
}

let _lastSoundAt = 0;
const SOUND_THROTTLE_MS = 80; // ~12 sounds/sec max

function throttled(fn) {
  const now = performance.now();
  if (now - _lastSoundAt < SOUND_THROTTLE_MS) return;
  _lastSoundAt = now;
  fn();
}

function autoClean(...nodes) {
  const last = nodes[nodes.length - 1];
  last.onended = () => nodes.forEach((n) => n.disconnect());
}

function playMeow(pitch = 1) {
  const a = ac();
  const osc = a.createOscillator();
  const filt = a.createBiquadFilter();
  const gain = a.createGain();

  osc.type = 'sawtooth';
  filt.type = 'lowpass';
  filt.frequency.value = 1800;
  osc.connect(filt); filt.connect(gain); gain.connect(a.destination);
  autoClean(osc, filt, gain);

  const f = 500 * pitch;
  osc.frequency.setValueAtTime(f * 1.7, a.currentTime);
  osc.frequency.exponentialRampToValueAtTime(f * 0.65, a.currentTime + 0.22);
  osc.frequency.exponentialRampToValueAtTime(f * 0.95, a.currentTime + 0.5);
  gain.gain.setValueAtTime(0.22, a.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.55);
  osc.start(a.currentTime);
  osc.stop(a.currentTime + 0.6);
}

function playBoing(pitch = 1) {
  const a = ac();
  const osc = a.createOscillator();
  const gain = a.createGain();

  osc.type = 'sine';
  osc.connect(gain); gain.connect(a.destination);
  autoClean(osc, gain);

  const f = 300 * pitch;
  osc.frequency.setValueAtTime(f * 3.2, a.currentTime);
  osc.frequency.exponentialRampToValueAtTime(f * 0.45, a.currentTime + 0.38);
  gain.gain.setValueAtTime(0.28, a.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.42);
  osc.start(a.currentTime);
  osc.stop(a.currentTime + 0.45);
}

function playPurr() {
  const a = ac();
  const lfo = a.createOscillator();
  const lfoGain = a.createGain();
  const osc = a.createOscillator();
  const gain = a.createGain();

  lfo.frequency.value = 28; lfoGain.gain.value = 170;
  osc.type = 'sawtooth'; osc.frequency.value = 130;
  lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
  osc.connect(gain); gain.connect(a.destination);
  autoClean(lfo, lfoGain, osc, gain);

  gain.gain.setValueAtTime(0.14, a.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.85);
  lfo.start(a.currentTime); osc.start(a.currentTime);
  lfo.stop(a.currentTime + 0.85); osc.stop(a.currentTime + 0.85);
}

let _cuckoo = null;
const CUCKOO_RATES = [0.5, 0.65, 0.8, 1.0, 1.2, 1.5, 1.8];

export function loadSounds() {
  if (_cuckoo) return;
  _cuckoo = new Howl({
    src: ['/sounds/cuckoo_clock.mp3'],
    volume: 0.55,
    preload: true,
  });
}

function playCuckoo() {
  if (!_cuckoo) return;
  const rate = CUCKOO_RATES[Math.floor(Math.random() * CUCKOO_RATES.length)];
  const id = _cuckoo.play();
  _cuckoo.rate(rate, id);
}

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '1234567890';

export function triggerSound(key) {
  throttled(() => {
    const k = key.toLowerCase();

    if (k === ' ' || k === 'enter') return playPurr();

    if (Math.random() < 0.25 && _cuckoo) return playCuckoo();

    if (DIGITS.includes(k)) return playBoing(0.75 + DIGITS.indexOf(k) * 0.12);
    if (ALPHA.includes(k)) return playMeow(0.7 + ALPHA.indexOf(k) * 0.019);

    playMeow(1 + (key.charCodeAt(0) % 8) * 0.06);
  });
}
