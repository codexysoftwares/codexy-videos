// Free real footage from Mixkit (https://mixkit.co — Mixkit Stock Video Free License: free for commercial use,
// no attribution, no API key). Pexels stopped issuing new API keys in 2026, so this replaced it.
// Prefer shots without identifiable faces in ads.
//
//   npm run broll -- busca "<termo em inglês>"          → lists clip ids + descriptions
//   npm run broll -- baixar <video> <id> <nome>         → downloads the 1080p file to public/broll/<video>/<nome>.mp4
//   npm run broll -- restaurar                          → re-downloads every clip listed in public/broll/*/creditos.json
//                                                         (the .mp4 files are not in Git — run this after cloning)
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [mode, ...args] = process.argv.slice(2);
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" };

if (mode === "busca") {
  const termo = args.join(" ");
  if (!termo) {
    console.error('Uso: npm run broll -- busca "<termo>"');
    process.exit(1);
  }
  const slug = termo.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const res = await fetch(`https://mixkit.co/free-stock-video/${slug}/`, { headers: UA, redirect: "follow" });
  const html = await res.text();
  const re = /assets\.mixkit\.co\/videos\/(\d+)\/\1-360\.mp4[\s\S]{0,4000}?alt="([^"]{8,140})"/g;
  const seen = new Set();
  let m;
  while ((m = re.exec(html))) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    console.log(`${m[1].padStart(6)} | ${m[2]} | prévia: https://assets.mixkit.co/videos/${m[1]}/${m[1]}-360.mp4`);
  }
  if (!seen.size) console.log("Nada encontrado — tente outro termo.");
} else if (mode === "baixar") {
  const [video, id, nome] = args;
  if (!video || !id || !nome) {
    console.error("Uso: npm run broll -- baixar <video> <id> <nome>");
    process.exit(1);
  }
  const dir = join("public/broll", video);
  mkdirSync(dir, { recursive: true });
  let ok = false;
  for (const q of ["1080", "720"]) {
    const url = `https://assets.mixkit.co/videos/${id}/${id}-${q}.mp4`;
    const r = await fetch(url, { headers: UA });
    if (!r.ok) continue;
    writeFileSync(join(dir, `${nome}.mp4`), Buffer.from(await r.arrayBuffer()));
    const creditsPath = join(dir, "creditos.json");
    const credits = existsSync(creditsPath) ? JSON.parse(readFileSync(creditsPath, "utf8")) : {};
    credits[`${nome}.mp4`] = { fonte: "Mixkit", id, url, licenca: "Mixkit Stock Video Free License" };
    writeFileSync(creditsPath, JSON.stringify(credits, null, 2) + "\n");
    console.log(`Salvo public/broll/${video}/${nome}.mp4 (${q}p)`);
    ok = true;
    break;
  }
  if (!ok) {
    console.error("Não consegui baixar esse id.");
    process.exit(1);
  }
} else if (mode === "restaurar") {
  let n = 0;
  for (const video of existsSync("public/broll") ? readdirSync("public/broll") : []) {
    const creditsPath = join("public/broll", video, "creditos.json");
    if (!existsSync(creditsPath)) continue;
    for (const [nome, c] of Object.entries(JSON.parse(readFileSync(creditsPath, "utf8")))) {
      const out = join("public/broll", video, nome);
      if (existsSync(out)) continue;
      const r = await fetch(c.url, { headers: UA });
      if (!r.ok) {
        console.error(`Falhou: ${out} (${r.status})`);
        continue;
      }
      writeFileSync(out, Buffer.from(await r.arrayBuffer()));
      console.log(`Baixado ${out}`);
      n++;
    }
  }
  console.log(`${n} clipe(s) restaurado(s).`);
} else {
  console.error('Uso: npm run broll -- busca "<termo>"  |  npm run broll -- baixar <video> <id> <nome>');
  process.exit(1);
}
