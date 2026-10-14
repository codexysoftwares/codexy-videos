// Builds the ready-to-post folder from calendario.json:
//   postagens/2026-10-13_ter/reels_pelos-olhos-do-paciente/{video.mp4, legenda.txt}
//   postagens/2026-10-14_qua/carrossel_5-sinais/{01.png … 07.png, legenda.txt}
//   postagens/_guardados/…
// Re-run any time: files are copied again (overwritten). Usage: npm run organizar
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const cal = JSON.parse((await import("node:fs")).readFileSync("calendario.json", "utf8"));
const root = resolve(cal.destino);
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

const copyAll = (src, dest) => {
  let n = 0;
  if (!existsSync(src)) return -1;
  if (statSync(src).isDirectory()) {
    const files = readdirSync(src).filter((f) => f.endsWith(".png")).sort();
    files.forEach((f, i) => {
      copyFileSync(join(src, f), join(dest, files.length > 1 ? `${String(i + 1).padStart(2, "0")}.png` : f.replace(/^.*-/, "post-")));
      n++;
    });
  } else {
    copyFileSync(src, join(dest, basename(src)));
    n++;
  }
  return n;
};

const pend = [];
let resumo = "# Postagens Codexy\n\nGerado por `npm run organizar` a partir de codexy-promo/calendario.json.\n\n| Data | Tipo | Post | Pilar | Status |\n|---|---|---|---|---|\n";
for (const p of cal.posts) {
  const d = new Date(`${p.data}T12:00:00`);
  const dia = join(root, `${p.data}_${DIAS[d.getDay()]}`);
  const dir = join(dia, `${p.tipo}_${p.nome}`);
  mkdirSync(dir, { recursive: true });
  let ok = p.arquivos.length > 0;
  for (const a of p.arquivos) if (copyAll(a, dir) < 0) ok = false;
  let txt = p.legenda + "\n";
  if (p.anuncio) txt += `\n----- ANÚNCIO -----\n${p.anuncio}\n`;
  if (p.observacao) txt += `\n----- OBSERVAÇÃO -----\n${p.observacao}\n`;
  writeFileSync(join(dir, "legenda.txt"), txt);
  if (!ok) pend.push(`${p.data} ${p.nome}`);
  resumo += `| ${p.data} ${DIAS[d.getDay()]} | ${p.tipo} | ${p.nome} | ${p.pilar} | ${ok ? "pronto" : "**pendente**"} |\n`;
}
for (const g of cal.guardados ?? []) {
  const dir = join(root, "_guardados", g.nome);
  mkdirSync(dir, { recursive: true });
  for (const a of g.arquivos) copyAll(a, dir);
  writeFileSync(join(dir, "uso.txt"), g.uso + "\n");
}
writeFileSync(join(root, "LEIA-ME.md"), resumo + "\nCarrossel: suba as imagens na ordem 01, 02, 03…\n");
console.log(`Pastas em ${root}`);
if (pend.length) console.log("Pendentes:", pend.join(" · "));
