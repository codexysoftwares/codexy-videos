// Renders a static post / carousel composition (1 frame = 1 slide) to PNGs in out/estaticos/<id>/<id>-NN.png.
// Usage: npm run estatico -- <compositionId> [<compositionId> ...]  (one bundle for all; the temp bundle is deleted at the end)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("Uso: npm run estatico -- <id> [<id> ...]");
  process.exit(1);
}
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
try {
  for (const id of ids) {
    const composition = await selectComposition({ serveUrl, id });
    const dir = path.join("out", "estaticos", id);
    mkdirSync(dir, { recursive: true });
    for (let frame = 0; frame < composition.durationInFrames; frame++) {
      const name = composition.durationInFrames > 1 ? `${id}-${String(frame + 1).padStart(2, "0")}.png` : `${id}.png`;
      await renderStill({ serveUrl, composition, frame, output: path.join(dir, name), imageFormat: "png" });
      console.log(`${dir}/${name}`);
    }
  }
} finally {
  rmSync(serveUrl, { recursive: true, force: true });
}
