import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, MONO, SANS, clamp } from "../../../shared/theme";
import { BEAT, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.prova.from);
const CUTS = BEAT.proofCuts.map(L);

// Real project screenshots (public/projetos/taquinho/...). While empty, stylized placeholders are shown.
export const PROOF_IMAGES: string[] = [];

const ACCENTS = [C.glow, "#F5A524", C.green, "#B26BFF", C.glow];

const Placeholder: React.FC<{ readonly i: number }> = ({ i }) => {
  const a = ACCENTS[i % ACCENTS.length];
  const cols = i % 2 === 0 ? 2 : 3;
  return (
    <div style={{ width: "100%", height: "100%", padding: 40, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: 220, height: 34, borderRadius: 17, backgroundColor: a }} />
        <div style={{ width: 120, height: 24, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 20, flex: 1 }}>
        {Array.from({ length: cols * 3 }).map((_, k) => (
          <div
            key={k}
            style={{
              borderRadius: 22,
              backgroundColor: k === 0 ? `${a}55` : "rgba(255,255,255,0.06)",
              border: "2px solid rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Fast montage cut on the music beats: one screen per beat.
export const ProvaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = Math.max(0, CUTS.filter((c) => frame >= c).length - 1);
  const shotStart = CUTS[shot];
  const local = frame - shotStart;
  const real = PROOF_IMAGES.length > 0;

  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS,
        color: C.white,
        opacity: interpolate(frame, [L(15.75), L(15.9)], [1, 0], clamp),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 80,
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: 6,
          color: C.glow,
        }}
      >
        {real ? "PROJETO REAL · RESTAURANTE" : "DO PROCESSO AO PRODUTO"}
      </div>
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 80,
          width: 920,
          height: 1180,
          borderRadius: 44,
          overflow: "hidden",
          backgroundColor: C.panel,
          border: "2px solid rgba(51,119,255,0.35)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 90px rgba(0,85,255,0.25)",
          scale: interpolate(local, [0, 3, 12], [1.06, 1, 1.02], clamp),
          filter: `blur(${interpolate(local, [0, 3], [8, 0], clamp)}px)`,
        }}
      >
        {real ? (
          <Img
            src={staticFile(PROOF_IMAGES[shot % PROOF_IMAGES.length])}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: 1 + local * 0.004,
            }}
          />
        ) : (
          <Placeholder i={shot} />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1580,
          left: 80,
          right: 80,
          display: "flex",
          gap: 12,
        }}
      >
        {CUTS.map((c, i) => (
          <div
            key={c}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              backgroundColor: i <= shot ? C.glow : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
