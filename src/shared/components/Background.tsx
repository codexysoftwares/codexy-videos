import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

type Props = {
  readonly tone?: "dark" | "danger" | "brand";
};

export const Background: React.FC<Props> = ({ tone = "dark" }) => {
  const frame = useCurrentFrame();
  const glow =
    tone === "danger" ? "rgba(255,59,92,0.30)" : "rgba(0,85,255,0.42)";
  const base =
    tone === "danger" ? "#0C0612" : tone === "brand" ? C.navy : C.deep;

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${frame * 0.8}px`,
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 45%, black 25%, transparent 75%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -420,
          top: -380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}, transparent 65%)`,
          translate: `${Math.sin(frame / 45) * 60}px ${Math.cos(frame / 50) * 50}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -480,
          bottom: -360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}, transparent 65%)`,
          opacity: 0.7,
          translate: `${Math.cos(frame / 40) * 50}px ${Math.sin(frame / 55) * 60}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6))",
        }}
      />
    </AbsoluteFill>
  );
};
