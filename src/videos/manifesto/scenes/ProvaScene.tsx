import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, MONO, SANS, clamp } from "../../../shared/theme";
import { RESTAURANT_SCREENS } from "../RestaurantScreens";
import { BEAT, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.prova.from);
const CUTS = BEAT.proofCuts.map(L);

// Real system screenshots (e.g. public/projetos/taquinho/...). While empty, the stylized
// restaurant screens built with the client's real dish photos are shown.
export const PROOF_IMAGES: string[] = [];

// Fast montage cut on the music beats: one screen per beat.
export const ProvaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = Math.max(0, CUTS.filter((c) => frame >= c).length - 1);
  const shotStart = CUTS[shot];
  const local = frame - shotStart;
  const real = PROOF_IMAGES.length > 0;
  const Screen = RESTAURANT_SCREENS[shot % RESTAURANT_SCREENS.length];

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
        {real ? "PROJETO REAL · RESTAURANTE" : "SISTEMA PARA RESTAURANTE"}
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
          <Screen t={local} />
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
