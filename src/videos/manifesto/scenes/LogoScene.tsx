import { ThreeCanvas } from "@remotion/three";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { C, EASE, MONO, SANS, clamp } from "../../../shared/theme";
import { Caption } from "../Caption";
import { BEAT, N, SCENE, f } from "../timeline";

const L = (t: number) => f(t - SCENE.logo.from);
const LAND = L(BEAT.logo);

// One thick ">" chevron; mirrored, two of them form the X of the Codexy logo.
const useChevronGeometry = () =>
  useMemo(() => {
    const pts: [number, number][] = [
      [-0.55, 1], [-0.08, 1], [0.62, 0], [-0.08, -1], [-0.55, -1], [0.15, 0],
    ];
    const shape = new THREE.Shape();
    shape.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 5,
    });
    g.center();
    return g;
  }, []);

const Emblem: React.FC = () => {
  const frame = useCurrentFrame();
  const geometry = useChevronGeometry();
  const t = interpolate(frame, [0, LAND], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const idle = frame > LAND ? Math.sin((frame - LAND) / 28) * 0.18 : 0;
  const rise = interpolate(frame, [L(22.35), L(23.0)], [0, 1], { ...clamp, easing: EASE });

  return (
    <group
      position={[0, interpolate(rise, [0, 1], [0, 1.05]), interpolate(t, [0, 1], [-14, 0])]}
      rotation={[interpolate(t, [0, 1], [0.6, 0]), interpolate(t, [0, 1], [Math.PI * 5, 0]) + idle, 0]}
      scale={interpolate(rise, [0, 1], [0.95, 0.62])}
    >
      <mesh geometry={geometry} position={[-0.36, 0, 0]}>
        <meshStandardMaterial color="#F2F5FF" metalness={0.25} roughness={0.3} emissive="#AFC4FF" emissiveIntensity={0.25} />
      </mesh>
      <mesh geometry={geometry} position={[0.36, 0, 0.05]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#2F6BFF" metalness={0.35} roughness={0.25} emissive="#0A2A8F" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
};

// The X emblem flies in spinning and lands on "Codexy", then the wordmark, tagline and contacts appear.
export const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const flash = interpolate(frame, [LAND, LAND + 2, LAND + 12], [0, 0.35, 0], clamp);
  const glow = interpolate(frame, [LAND - 4, LAND, LAND + 30], [0, 1, 0.45], clamp);

  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS,
        color: C.white,
        opacity:
          interpolate(frame, [0, 6], [0, 1], clamp) *
          interpolate(frame, [L(27.8), L(28.5)], [1, 0], clamp),
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(0,85,255,${0.5 * glow}) 0%, rgba(0,20,61,${0.6 * glow}) 35%, transparent 70%)`,
        }}
      />
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 7], fov: 35 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 5]} intensity={2.6} />
        <directionalLight position={[-4, 1, 4]} intensity={1.2} color="#CFE0FF" />
        <pointLight position={[-3, -2, 3]} intensity={40} color="#3377FF" />
        <pointLight position={[3, 2, -3]} intensity={30} color="#FFFFFF" />
        <Emblem />
      </ThreeCanvas>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1010 }}>
        <Img
          src={staticFile("brand/codexy-logo-light.png")}
          style={{
            width: 760,
            opacity: interpolate(frame, [L(22.45), L(22.9)], [0, 1], clamp),
            filter: `blur(${interpolate(frame, [L(22.45), L(23.0)], [16, 0], clamp)}px) drop-shadow(0 0 30px rgba(51,119,255,0.5))`,
            translate: `0px ${interpolate(frame, [L(22.45), L(23.1)], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        />
      </AbsoluteFill>

      <Caption
        text="Software sob *medida.*"
        at={L(N.assinatura + 0.92)}
        speechFrames={f(1.0)}
        size={70}
        top={1220}
        center
      />

      <div
        style={{
          position: "absolute",
          top: 1380,
          left: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          fontFamily: MONO,
          fontSize: 34,
          letterSpacing: 2,
          color: C.ice,
          opacity: interpolate(frame, [L(BEAT.final), L(BEAT.final) + 10], [0, 1], clamp),
        }}
      >
        <div
          style={{
            height: 3,
            width: interpolate(frame, [L(BEAT.final), L(BEAT.final) + 16], [0, 80], { ...clamp, easing: EASE }),
            backgroundColor: C.glow,
          }}
        />
        codexy.com.br · @codexy.ai
      </div>

      <AbsoluteFill style={{ backgroundColor: "#9DB8FF", opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
