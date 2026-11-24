// Sonidos suaves sintetizados (sin archivos). Solo suenan si el usuario activa el sonido.
let ctx: AudioContext | null = null;
let enabled = false;

export function setSfxEnabled(v: boolean) {
  enabled = v;
}

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, delay = 0, dur = 1.2, gain = 0.05, type: OscillatorType = "sine") {
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function rustle(dur = 0.5, gain = 0.04) {
  const c = ac();
  if (!c) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 2400;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(c.destination);
  src.start();
}

export const sfx = {
  chime() {
    if (!enabled) return;
    tone(1046.5, 0, 1.4, 0.035);
    tone(1568, 0.08, 1.6, 0.025);
  },
  discover() {
    if (!enabled) return;
    [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 1.3, 0.028));
  },
  paper() {
    if (!enabled) return;
    rustle(0.45, 0.05);
  },
  seal() {
    if (!enabled) return;
    rustle(0.15, 0.08);
    tone(392, 0.05, 0.6, 0.04, "triangle");
    [523, 659, 784].forEach((f, i) => tone(f, 0.4 + i * 0.12, 1.6, 0.025));
  },
  tap() {
    if (!enabled) return;
    tone(1318, 0, 0.35, 0.02, "triangle");
  },
};
