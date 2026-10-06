import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url);
mkdirSync(OUT, { recursive: true });

let seed = 7;
const noise = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return (seed / 0x7fffffff) * 2 - 1;
};

const wav = (name, samples) => {
  const peak = Math.max(...samples.map(Math.abs)) || 1;
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) =>
    buf.writeInt16LE(Math.round((s / peak) * 0.9 * 32767), 44 + i * 2),
  );
  writeFileSync(new URL(name, OUT), buf);
};

const gen = (seconds, fn) =>
  Array.from({ length: Math.floor(seconds * SR) }, (_, i) => fn(i / SR));

// Soft bubble: short sine with a downward pitch glide.
{
  let phase = 0;
  wav(
    "soft-bubble.wav",
    gen(0.16, (t) => {
      const f = 620 + 380 * Math.exp(-t * 40);
      phase += (2 * Math.PI * f) / SR;
      const env = Math.min(1, t / 0.004) * Math.exp(-t * 32);
      return (Math.sin(phase) + 0.15 * Math.sin(phase * 2)) * env;
    }),
  );
}

// Clock tick: tiny filtered click.
{
  let lp = 0;
  wav(
    "soft-tick.wav",
    gen(0.05, (t) => {
      lp += 0.35 * (noise() - lp);
      return (lp * 0.6 + Math.sin(2 * Math.PI * 2400 * t) * 0.5) * Math.exp(-t * 220);
    }),
  );
}

// Riser: noise through a lowpass whose cutoff sweeps up, swelling in volume.
{
  let lp = 0;
  const dur = 1.1;
  wav(
    "soft-riser.wav",
    gen(dur, (t) => {
      const p = t / dur;
      const cutoff = 150 + 7000 * p * p;
      const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
      lp += a * (noise() - lp);
      const env = Math.pow(p, 2.2) * (p > 0.96 ? (1 - p) / 0.04 : 1);
      return lp * env;
    }),
  );
}

// Soft whoosh: bandpassed noise with a bell envelope.
{
  let lp1 = 0;
  let lp2 = 0;
  const dur = 0.7;
  wav(
    "soft-whoosh.wav",
    gen(dur, (t) => {
      const p = t / dur;
      const cutoff = 400 + 2600 * Math.sin(Math.PI * p);
      const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
      lp1 += a * (noise() - lp1);
      lp2 += 0.02 * (lp1 - lp2);
      return (lp1 - lp2) * Math.pow(Math.sin(Math.PI * p), 2);
    }),
  );
}

// Low impact: sub sine drop plus a soft noise transient.
{
  let phase = 0;
  let lp = 0;
  wav(
    "soft-impact.wav",
    gen(1.6, (t) => {
      const f = 38 + 32 * Math.exp(-t * 6);
      phase += (2 * Math.PI * f) / SR;
      lp += 0.08 * (noise() - lp);
      const body = Math.sin(phase) * Math.min(1, t / 0.006) * Math.exp(-t * 2.6);
      const air = lp * Math.exp(-t * 9) * 0.8;
      return body + air;
    }),
  );
}

console.log("SFX generated in public/sfx/");
