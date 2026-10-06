// Generates the whole narration of a video in ONE ElevenLabs request (consistent intonation)
// and saves it as public/narracao/<video>/original/completo.wav. Needs ELEVENLABS_API_KEY in .env.
// Usage: npm run tts -- <video>
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const video = process.argv[2];
if (!video) {
  console.error("Uso: npm run tts -- <video>");
  process.exit(1);
}
const key = readFileSync(".env", "utf8").match(/ELEVENLABS_API_KEY=(\S+)/)?.[1];
if (!key) {
  console.error("ELEVENLABS_API_KEY não encontrada no .env");
  process.exit(1);
}

const dir = join("public/narracao", video);
const r = JSON.parse(readFileSync(join(dir, "roteiro.json"), "utf8"));
const cfg = r.elevenlabs;
const pause = cfg.pausa_entre_falas ?? 1.2;
const text = r.falas.map((f) => f.texto).join(` <break time="${pause}s" /> `);

const SR = 24000;
const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}?output_format=pcm_${SR}`,
  {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: cfg.model_id, voice_settings: cfg.voice_settings }),
  },
);
if (!res.ok) {
  console.error(res.status, await res.text());
  process.exit(1);
}
const pcm = Buffer.from(await res.arrayBuffer());

const wav = Buffer.alloc(44);
wav.write("RIFF", 0);
wav.writeUInt32LE(36 + pcm.length, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(pcm.length, 40);

const out = join(dir, "original/completo.wav");
mkdirSync(join(dir, "original"), { recursive: true });
if (existsSync(out)) {
  const backup = join(dir, "_versoes", new Date().toISOString().replace(/[:.]/g, "-"));
  mkdirSync(backup, { recursive: true });
  renameSync(out, join(backup, "completo.wav"));
  console.log(`Versão anterior movida para ${backup}`);
}
writeFileSync(out, Buffer.concat([wav, pcm]));
console.log(`Narração salva em ${out} (${(pcm.length / 2 / SR).toFixed(2)}s)`);
