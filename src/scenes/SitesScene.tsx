import { Audio } from "@remotion/media";
import {
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Panel, PillarLayout } from "../components/PillarLayout";
import { C, EASE, EASE_IN_OUT, MONO, SFX, clamp } from "../theme";

const URL = "suaempresa.com.br";
const CLICK = 62;

const Bar: React.FC<{ w: number | string; h: number; at: number; color?: string }> = ({
  w,
  h,
  at,
  color = "rgba(255,255,255,0.12)",
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        backgroundColor: color,
        transformOrigin: "left center",
        scale: `${interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: EASE })} 1`,
      }}
    />
  );
};

const Browser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typed = Math.floor(interpolate(frame, [14, 34], [0, URL.length], clamp));
  const press = interpolate(frame, [CLICK, CLICK + 3, CLICK + 8], [1, 0.92, 1], clamp);
  const toast = interpolate(frame, [CLICK + 6, CLICK + 18], [0, 1], { ...clamp, easing: EASE });

  return (
    <Panel style={{ display: "flex", flexDirection: "column" }}>
      <Sequence from={CLICK} durationInFrames={15} premountFor={fps}>
        <Audio src={staticFile(SFX.click)} volume={0.8} />
      </Sequence>
      <Sequence from={CLICK + 8} durationInFrames={30} premountFor={fps}>
        <Audio src={staticFile(SFX.ding)} volume={0.35} />
      </Sequence>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "26px 32px",
          backgroundColor: "rgba(255,255,255,0.04)",
          borderBottom: "2px solid rgba(255,255,255,0.06)",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c }} />
        ))}
        <div
          style={{
            marginLeft: 20,
            flex: 1,
            padding: "14px 26px",
            borderRadius: 999,
            backgroundColor: "rgba(0,0,0,0.35)",
            fontFamily: MONO,
            fontSize: 28,
            color: C.ice,
          }}
        >
          <span style={{ color: C.green }}>🔒︎ </span>
          {URL.slice(0, typed)}
          <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: C.glow }}>|</span>
        </div>
      </div>

      <div style={{ padding: "56px 56px", display: "flex", flexDirection: "column", gap: 30, flex: 1, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Bar w={160} h={30} at={20} color={C.glow} />
          <div style={{ display: "flex", gap: 20 }}>
            <Bar w={90} h={18} at={24} />
            <Bar w={90} h={18} at={26} />
            <Bar w={90} h={18} at={28} />
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            opacity: interpolate(frame, [26, 34], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [26, 40], [40, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          Seu negócio,
          <br />
          <span style={{ color: C.glow }}>online de verdade.</span>
        </div>
        <Bar w="90%" h={22} at={34} />
        <Bar w="70%" h={22} at={37} />

        <div
          style={{
            marginTop: 20,
            alignSelf: "flex-start",
            padding: "30px 48px",
            borderRadius: 24,
            background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
            boxShadow: "0 20px 60px rgba(0,85,255,0.55)",
            fontSize: 38,
            fontWeight: 800,
            opacity: interpolate(frame, [40, 48], [0, 1], clamp),
            scale: interpolate(frame, [40, 52], [0.8, 1], { ...clamp, easing: EASE }) * press,
          }}
        >
          Quero um orçamento →
        </div>

        <div style={{ display: "flex", gap: 22, marginTop: 30 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 170,
                borderRadius: 24,
                backgroundColor: "rgba(51,119,255,0.12)",
                border: "2px solid rgba(51,119,255,0.25)",
                opacity: interpolate(frame, [44 + i * 4, 52 + i * 4], [0, 1], clamp),
                translate: `0px ${interpolate(frame, [44 + i * 4, 58 + i * 4], [40, 0], { ...clamp, easing: EASE })}px`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "26px 30px",
            borderRadius: 26,
            backgroundColor: C.white,
            color: C.deep,
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            fontSize: 36,
            fontWeight: 800,
            opacity: toast,
            translate: `0px ${interpolate(toast, [0, 1], [60, 0])}px`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: C.green,
              color: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            ✓
          </div>
          Novo lead recebido!
        </div>

        <svg
          width={70}
          height={70}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))",
            translate: `${interpolate(frame, [42, CLICK - 2], [700, 300], { ...clamp, easing: EASE_IN_OUT })}px ${interpolate(frame, [42, CLICK - 2], [860, 470], { ...clamp, easing: EASE_IN_OUT })}px`,
            scale: press,
            opacity: interpolate(frame, [42, 48], [0, 1], clamp),
          }}
        >
          <path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 13.8 L19 13.8 Z" fill={C.white} stroke={C.deep} strokeWidth={1.2} strokeLinejoin="round" />
        </svg>
      </div>
    </Panel>
  );
};

export const SitesScene: React.FC = () => (
  <PillarLayout
    index="02"
    tag="SITES & LANDING PAGES"
    title={"Sites que trabalham\npor você."}
    subtitle="Rápidos, bonitos e feitos para converter visitas em clientes."
  >
    <Browser />
  </PillarLayout>
);
