// Prints the style prompt and full narration text of a video, ready to paste into the TTS tool.
// Usage: npm run roteiro -- <video>
import { readFileSync } from "node:fs";
import { join } from "node:path";

const video = process.argv[2];
if (!video) {
  console.error("Uso: npm run roteiro -- <video>");
  process.exit(1);
}
const r = JSON.parse(readFileSync(join("public/narracao", video, "roteiro.json"), "utf8"));
console.log(`Voz: ${r.voz}\n\n--- ESTILO ---\n${r.estilo}\n\n--- TEXTO ---\n${r.falas.map((f) => f.texto).join("\n\n")}\n`);
console.log(`Salve o áudio em: public/narracao/${video}/original/completo.wav`);
