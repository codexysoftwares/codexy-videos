// Splits public/narracao/<video>/original/completo.wav into the per-scene files listed in roteiro.json,
// cutting at the longest pauses (one cut between each pair of paragraphs).
// Usage: npm run narracao -- <video>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const video = process.argv[2];
if (!video) {
  console.error("Uso: npm run narracao -- <video>");
  process.exit(1);
}
const dir = join("public/narracao", video);
const names = JSON.parse(readFileSync(join(dir, "roteiro.json"), "utf8")).falas.map((f) => f.arquivo);
const b = readFileSync(join(dir, "original/completo.wav"));

const ch = b.readUInt16LE(22);
const sr = b.readUInt32LE(24);
const bits = b.readUInt16LE(34);
let d = 12;
while (b.toString("ascii", d, d + 4) !== "data") d += 8 + b.readUInt32LE(d + 4);
const st = d + 8;
const bps = (bits / 8) * ch;
const n = Math.floor((b.length - st) / bps);
const sample = (i) => b.readInt16LE(st + i * bps);

const STEP = 0.02;
const win = Math.floor(sr * STEP);
const loud = [];
for (let s = 0; s + win <= n; s += win) {
  let a = 0;
  for (let i = s; i < s + win; i++) a += (sample(i) / 32768) ** 2;
  loud.push(10 * Math.log10(a / win + 1e-12) > -40);
}
const first = loud.indexOf(true);
const last = loud.lastIndexOf(true) + 1;

const gaps = [];
for (let i = first, g = -1; i <= last; i++) {
  if (!loud[i]) {
    if (g < 0) g = i;
  } else if (g >= 0) {
    gaps.push({ s: g, e: i });
    g = -1;
  }
}
const cuts = gaps
  .sort((x, y) => y.e - y.s - (x.e - x.s))
  .slice(0, names.length - 1)
  .sort((x, y) => x.s - y.s);

if (cuts.length < names.length - 1) {
  console.error(`Encontrei só ${cuts.length + 1} trechos, mas o roteiro tem ${names.length} falas.`);
  process.exit(1);
}

const LEAD = 0.15;
const TAIL = 0.25;
const FADE = Math.floor(sr * 0.01);
const bounds = [first, ...cuts.flatMap((c) => [c.s, c.e]), last];

names.forEach((name, k) => {
  const a = Math.max(0, Math.round((bounds[2 * k] * STEP - LEAD) * sr));
  const z = Math.min(n, Math.round((bounds[2 * k + 1] * STEP + TAIL) * sr));
  const len = z - a;
  const out = Buffer.alloc(44 + len * 2);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + len * 2, 4);
  out.write("WAVEfmt ", 8);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sr, 24);
  out.writeUInt32LE(sr * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(len * 2, 40);
  for (let i = 0; i < len; i++) {
    const g = Math.min(1, i / FADE, (len - 1 - i) / FADE);
    out.writeInt16LE(Math.round(sample(a + i) * g), 44 + i * 2);
  }
  writeFileSync(join(dir, name), out);
  console.log(`${name}: ${(a / sr).toFixed(2)}s → ${(z / sr).toFixed(2)}s (${(len / sr).toFixed(2)}s)`);
});
