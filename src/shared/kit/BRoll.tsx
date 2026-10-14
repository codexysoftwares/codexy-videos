import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { lin } from "./motion";

// Real stock footage (public/broll/<video>/...) filling the 1080×1920 frame, with a slow push-in (Ken Burns),
// a color grade and an optional tint. Landscape clips are framed on `focusX` (0 = left edge, 1 = right edge),
// so a subject that is off-center in a 16:9 shot can still be the center of the vertical frame.
export const BRoll = ({
  src,
  t,
  t0,
  t1,
  trimBefore = 0,
  zoom = [1.04, 1.16],
  origin = "50% 50%",
  grade = "brightness(0.85) contrast(1.08) saturate(0.9)",
  tint,
  fps,
  focusX = 0.5,
  srcAspect = 16 / 9,
}: {
  src: string;
  t: number;
  t0: number;
  t1: number;
  trimBefore?: number;
  zoom?: [number, number];
  origin?: string;
  grade?: string;
  tint?: string;
  fps: number;
  focusX?: number;
  srcAspect?: number;
}) => {
  const s = lin(t, [t0, t1], zoom);
  const w = 1920 * srcAspect; // rendered width when the clip's height fills the frame
  const left = Math.min(0, Math.max(1080 - w, 540 - focusX * w));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ scale: `${s}`, transformOrigin: origin, filter: grade }}>
        <div style={{ position: "absolute", top: 0, left, width: w, height: 1920 }}>
          <Video src={staticFile(src)} muted objectFit="cover" trimBefore={Math.round(trimBefore * fps)} style={{ width: "100%", height: "100%" }} />
        </div>
      </AbsoluteFill>
      {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
    </AbsoluteFill>
  );
};
