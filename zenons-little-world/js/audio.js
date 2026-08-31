/** Cartoon SFX via Web Audio. BGM is `assets/audio/track.mp3`. */

let ctx;
let unlocked = false;
let bgmAudio = null;
let bgmOn = false;

const TRACK_URL = new URL("../assets/audio/track.mp3", import.meta.url).href;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export async function unlockAudio() {
  unlocked = true;
  startBgm();
  const c = ac();
  if (c.state === "suspended") {
    try { await c.resume(); } catch (_) {}
  }
}

function tone(freq, dur = 0.12, type = "square", gain = 0.08, slide = 0) {
  if (!unlocked) return;
  const c = ac();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

function noiseBurst(dur = 0.08, gain = 0.05) {
  if (!unlocked) return;
  const c = ac();
  const bufferSize = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  const g = c.createGain();
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1200;
  src.buffer = buffer;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  src.connect(f);
  f.connect(g);
  g.connect(c.destination);
  src.start();
}

export const sfx = {
  click() { tone(520, 0.05, "square", 0.04); },
  kiss() {
    tone(420, 0.08, "sine", 0.07, 180);
    setTimeout(() => tone(640, 0.1, "sine", 0.06, -80), 50);
  },
  slap() {
    noiseBurst(0.07, 0.09);
    tone(180, 0.06, "square", 0.06, -100);
  },
  chomp() {
    tone(140, 0.07, "sawtooth", 0.07);
    setTimeout(() => tone(100, 0.08, "sawtooth", 0.05), 60);
    noiseBurst(0.05, 0.04);
  },
  splash() {
    noiseBurst(0.15, 0.07);
    tone(300, 0.12, "triangle", 0.05, -200);
  },
  happy() {
    tone(523, 0.08, "square", 0.05);
    setTimeout(() => tone(659, 0.08, "square", 0.05), 70);
    setTimeout(() => tone(784, 0.12, "square", 0.05), 140);
  },
  annoyed() {
    tone(220, 0.15, "square", 0.05, -60);
  },
  reveal() {
    tone(392, 0.1, "triangle", 0.05);
    setTimeout(() => tone(523, 0.15, "triangle", 0.05), 90);
  },
};

/** Loop `assets/audio/track.mp3` after the first tap. */
export function startBgm() {
  if (bgmAudio) {
    if (bgmAudio.paused) bgmAudio.play().catch(() => {});
    return;
  }
  const audio = new Audio(TRACK_URL);
  audio.loop = true;
  audio.volume = 0.45;
  audio.preload = "auto";
  bgmAudio = audio;
  const tryPlay = () => {
    audio.play()
      .then(() => { bgmOn = true; })
      .catch(() => {});
  };
  tryPlay();
  audio.addEventListener("canplaythrough", tryPlay, { once: true });
}

export function stopBgm() {
  if (!bgmAudio) return;
  bgmAudio.pause();
  bgmAudio = null;
  bgmOn = false;
}
