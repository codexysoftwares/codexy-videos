// Generates a sound effect from a text description with ElevenLabs (text to sound effects) and saves it as
// public/sfx/<nome>.mp3. The prompt is recorded in public/sfx/ia-sfx.json so the sound can be regenerated.
// Cost: ~100 credits per sound (or 25/s when a duration is set). Needs ELEVENLABS_API_KEY in .env.
// Usage: npm run sfx:ia -- <nome> "<descrição em inglês>" [duração em segundos]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [nome, texto, dur] = process.argv.slice(2);
if (!nome || !texto) {
  console.error('Uso: npm run sfx:ia -- <nome> "<descrição>" [duração]');
  process.exit(1);
}
const key = readFileSync(".env", "utf8").match(/ELEVENLABS_API_KEY=(\S+)/)?.[1];
if (!key) {
  console.error("ELEVENLABS_API_KEY não encontrada no .env");
  process.exit(1);
}

const body = { text: texto, prompt_influence: 0.6 };
if (dur) body.duration_seconds = Number(dur);
const res = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_192", {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
if (!res.ok) {
  console.error(res.status, await res.text());
  process.exit(1);
}
const out = join("public/sfx", `${nome}.mp3`);
writeFileSync(out, Buffer.from(await res.arrayBuffer()));

const manifestPath = join("public/sfx", "ia-sfx.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
manifest[nome] = { texto, duracao: dur ? Number(dur) : null };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Som salvo em ${out}`);
