// Composes a track with Eleven Music from public/music/<name>.plan.json (sections with exact durations)
// and saves it as public/music/<name>.mp3. Needs ELEVENLABS_API_KEY in .env.
// Usage: npm run musica -- <name>
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Uso: npm run musica -- <nome>");
  process.exit(1);
}
const key = readFileSync(".env", "utf8").match(/ELEVENLABS_API_KEY=(\S+)/)?.[1];
if (!key) {
  console.error("ELEVENLABS_API_KEY não encontrada no .env");
  process.exit(1);
}
const plan = JSON.parse(readFileSync(join("public/music", `${name}.plan.json`), "utf8"));

const res = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192", {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({ composition_plan: plan, model_id: "music_v1" }),
});
if (!res.ok) {
  console.error(res.status, await res.text());
  process.exit(1);
}

const out = join("public/music", `${name}.mp3`);
if (existsSync(out)) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  renameSync(out, join("public/music", `${name}.${stamp}.mp3`));
}
writeFileSync(out, Buffer.from(await res.arrayBuffer()));
const total = plan.sections.reduce((s, x) => s + x.duration_ms, 0) / 1000;
console.log(`Música salva em ${out} (${total}s planejados)`);
