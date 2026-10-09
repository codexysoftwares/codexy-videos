// Regenerates only some falas of a video (e.g. a line that came out badly), keeping the others.
// Each fala is generated with the neighbouring texts as previous_text/next_text so the intonation
// matches the rest of the take. Overwrites public/narracao/<video>/<arquivo> (old file goes to _versoes/)
// and updates that fala's word times in palavras.json. Needs ELEVENLABS_API_KEY in .env.
// Usage: npm run tts:fala -- <video> <arquivo> [<arquivo> ...]   (texts come from roteiro.json)
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [video, ...arquivos] = process.argv.slice(2);
if (!video || !arquivos.length) {
  console.error("Uso: npm run tts:fala -- <video> <arquivo> [<arquivo> ...]");
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
const palavrasPath = join(dir, "palavras.json");
const palavras = existsSync(palavrasPath) ? JSON.parse(readFileSync(palavrasPath, "utf8")) : {};
const SR = 24000;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");

for (const arquivo of arquivos) {
  const i = r.falas.findIndex((f) => f.arquivo === arquivo);
  if (i < 0) {
    console.error(`Fala ${arquivo} não está no roteiro.json`);
    process.exit(1);
  }
  const fala = r.falas[i];
  const settings = { ...cfg.voice_settings, ...(fala.voice_settings ?? {}) };
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice_id}/with-timestamps?output_format=pcm_${SR}`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: fala.texto,
      model_id: cfg.model_id,
      voice_settings: settings,
      previous_text: r.falas[i - 1]?.texto,
      next_text: r.falas[i + 1]?.texto,
    }),
  });
  if (!res.ok) {
    console.error(res.status, await res.text());
    process.exit(1);
  }
  const body = await res.json();
  const pcm = Buffer.from(body.audio_base64, "base64");
  const al = body.alignment;

  const words = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(fala.texto))) {
    words.push({ palavra: m[0], de: al.character_start_times_seconds[m.index], ate: al.character_end_times_seconds[m.index + m[0].length - 1] });
  }

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

  const out = join(dir, arquivo);
  if (existsSync(out)) {
    const backup = join(dir, "_versoes", stamp);
    mkdirSync(backup, { recursive: true });
    copyFileSync(out, join(backup, arquivo));
  }
  writeFileSync(out, Buffer.concat([wav, pcm]));
  palavras[arquivo] = words;
  console.log(`${arquivo}: ${(pcm.length / 2 / SR).toFixed(2)}s · ${words.map((w) => `${w.palavra}@${w.de.toFixed(2)}`).join(" ")}`);
}
writeFileSync(palavrasPath, JSON.stringify(palavras, null, 2));
