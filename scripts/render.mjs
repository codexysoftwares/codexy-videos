// Renders a composition into out/<video>/<id>.mp4, where <video> is the src/videos folder the id belongs to.
// Usage: npm run render -- <composition-id>
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const id = process.argv[2];
if (!id) {
  console.error("Uso: npm run render -- <id>   (ex.: como-trabalhamos-narrado)");
  process.exit(1);
}
const video = readdirSync("src/videos")
  .filter((v) => id === v || id.startsWith(`${v}-`))
  .sort((a, b) => b.length - a.length)[0];
if (!video) {
  console.error(`Nenhuma pasta em src/videos corresponde a "${id}".`);
  process.exit(1);
}
const outDir = join("out", video);
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const r = spawnSync("npx", ["remotion", "render", id, join(outDir, `${id}.mp4`)], {
  stdio: "inherit",
  shell: true,
});
process.exit(r.status ?? 1);
