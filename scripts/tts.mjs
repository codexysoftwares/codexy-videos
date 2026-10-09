// Generates the whole narration of a video in ONE ElevenLabs request (consistent intonation)
// and saves public/narracao/<video>/original/completo.wav plus original/alinhamento.json, which has
// the start/end time of every fala and every word (used by `npm run narracao` to cut precisely).
// Needs ELEVENLABS_API_KEY in .env.
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
const SEP = "\n\n";
const text = r.falas.map((f) => f.texto).join(SEP);

const SR = 24000;
const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}/with-timestamps?output_format=pcm_${SR}`,
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
const body = await res.json();
const pcm = Buffer.from(body.audio_base64, "base64");
const al = body.alignment;

// Map each fala (and each word in it) to times using its character offsets in the joined text.
let offset = 0;
const falas = r.falas.map((fala) => {
  const start = text.indexOf(fala.texto, offset);
  const end = start + fala.texto.length - 1;
  offset = end + 1;
  const words = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(fala.texto))) {
    const a = start + m.index;
    const b = a + m[0].length - 1;
    words.push({ palavra: m[0], de: al.character_start_times_seconds[a], ate: al.character_end_times_seconds[b] });
  }
  return {
    arquivo: fala.arquivo,
    de: al.character_start_times_seconds[start],
    ate: al.character_end_times_seconds[end],
    palavras: words,
  };
});

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

const orig = join(dir, "original");
mkdirSync(orig, { recursive: true });
const out = join(orig, "completo.wav");
if (existsSync(out)) {
  const backup = join(dir, "_versoes", new Date().toISOString().replace(/[:.]/g, "-"));
  mkdirSync(backup, { recursive: true });
  renameSync(out, join(backup, "completo.wav"));
  if (existsSync(join(orig, "alinhamento.json"))) renameSync(join(orig, "alinhamento.json"), join(backup, "alinhamento.json"));
  console.log(`Versão anterior movida para ${backup}`);
}
writeFileSync(out, Buffer.concat([wav, pcm]));
writeFileSync(join(orig, "alinhamento.json"), JSON.stringify({ falas }, null, 2));
console.log(`Narração salva em ${out} (${(pcm.length / 2 / SR).toFixed(2)}s) com alinhamento por palavra`);
