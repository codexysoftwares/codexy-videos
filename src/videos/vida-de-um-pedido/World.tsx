import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { clamp } from "../../shared/theme";
import { CUE, HOPS, HOP_LEN, f } from "./timeline";

export const BLUE = "#0055FF";
const DESK_TOP = 0.72;

export const STATIONS = [
  { x: -4.2, z: 2.6, label: "WHATSAPP" },
  { x: -1.3, z: 3.3, label: "ATENDIMENTO" },
  { x: 1.9, z: 1.6, label: "PLANILHA" },
  { x: 3.7, z: -1.4, label: "NOTA FISCAL" },
  { x: 0.3, z: -3.4, label: "ENTREGA" },
] as const;

export const stationTop = (i: number): [number, number, number] => [STATIONS[i].x, DESK_TOP + 0.25, STATIONS[i].z];

// Camera rig shared by the 3D scene and the HTML overlays (labels follow 3D points).
export const cameraAt = (frame: number) => {
  const reveal = interpolate(frame, [f(CUE.reveal), f(CUE.reveal) + 60], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const spin = interpolate(frame, [f(CUE.comenta), f(CUE.logo)], [0, 0.55], clamp);
  const target = new THREE.Vector3(
    interpolate(reveal, [0, 1], [STATIONS[0].x, 0]),
    interpolate(reveal, [0, 1], [DESK_TOP, 0.2]),
    interpolate(reveal, [0, 1], [STATIONS[0].z, 0]),
  );
  const az = Math.PI / 4 + spin + Math.sin(frame / 160) * 0.04;
  const pos = new THREE.Vector3(target.x + Math.sin(az) * 14, target.y + 11, target.z + Math.cos(az) * 14);
  const zoom = interpolate(reveal, [0, 1], [320, 85]) * interpolate(spin, [0, 0.55], [1, 0.9]);
  return { pos, target, zoom };
};

export const project = (p: [number, number, number], frame: number, width: number, height: number) => {
  const { pos, target, zoom } = cameraAt(frame);
  const cam = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.1, 200);
  cam.position.copy(pos);
  cam.zoom = zoom;
  cam.lookAt(target);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(cam);
  return { x: (v.x + 1) / 2 * width, y: (1 - v.y) / 2 * height };
};

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();
  const { pos, target, zoom } = cameraAt(frame);
  camera.position.copy(pos);
  (camera as THREE.OrthographicCamera).zoom = zoom;
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return null;
};

const Box: React.FC<{
  readonly size: [number, number, number];
  readonly position: [number, number, number];
  readonly color: string;
  readonly emissive?: string;
  readonly emissiveIntensity?: number;
  readonly rotation?: [number, number, number];
}> = ({ size, position, color, emissive = "#000000", emissiveIntensity = 0, rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.55} emissive={emissive} emissiveIntensity={emissiveIntensity} />
  </mesh>
);

const Desk: React.FC<{ readonly i: number; readonly glow: number; readonly children?: React.ReactNode }> = ({
  i,
  glow,
  children,
}) => {
  const s = STATIONS[i];
  return (
    <group position={[s.x, 0, s.z]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.25 + glow * 0.25, 48]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.85 * glow} />
      </mesh>
      <Box size={[1.7, DESK_TOP, 1.1]} position={[0, DESK_TOP / 2, 0]} color="#FFFFFF" emissive={BLUE} emissiveIntensity={0.25 * glow} />
      {children}
    </group>
  );
};

const Props: React.FC = () => (
  <>
    <group position={[STATIONS[0].x, DESK_TOP, STATIONS[0].z]}>
      <Box size={[0.36, 0.05, 0.66]} position={[0, 0.03, 0]} color="#1B1D24" />
      <Box size={[0.3, 0.02, 0.56]} position={[0, 0.065, 0]} color="#25D366" emissive="#25D366" emissiveIntensity={0.4} />
    </group>
    <group position={[STATIONS[1].x, DESK_TOP, STATIONS[1].z]}>
      <Box size={[0.55, 0.06, 0.7]} position={[0.1, 0.03, 0]} color="#FFE27A" rotation={[0, 0.25, 0]} />
      <Box size={[0.05, 0.05, 0.5]} position={[-0.45, 0.03, 0.1]} color="#2F6BFF" rotation={[0, 0.6, 0]} />
    </group>
    {[2, 3].map((i) => (
      <group key={i} position={[STATIONS[i].x, DESK_TOP, STATIONS[i].z]}>
        <Box size={[0.12, 0.35, 0.12]} position={[0, 0.17, -0.25]} color="#B9C0CF" />
        <Box size={[1.0, 0.62, 0.07]} position={[0, 0.62, -0.25]} color="#1B1D24" />
        <Box
          size={[0.9, 0.52, 0.02]}
          position={[0, 0.62, -0.2]}
          color={i === 2 ? "#1D6F42" : "#3B4A6B"}
          emissive={i === 2 ? "#1D6F42" : "#3B4A6B"}
          emissiveIntensity={0.5}
        />
        {i === 3 ? <Box size={[0.42, 0.26, 0.36]} position={[0.55, 0.13, 0.2]} color="#D0D5E0" /> : null}
      </group>
    ))}
    <group position={[STATIONS[4].x + 0.1, 0, STATIONS[4].z]} rotation={[0, 0.5, 0]}>
      <Box size={[1.3, 0.45, 0.42]} position={[0, 0.75, 0]} color="#E5484D" />
      <Box size={[0.55, 0.12, 0.38]} position={[-0.2, 1.04, 0]} color="#1B1D24" />
      <Box size={[0.42, 0.42, 0.5]} position={[-0.55, 1.15, 0]} color="#F5A524" />
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.16, 24]} />
          <meshStandardMaterial color="#1B1D24" roughness={0.8} />
        </mesh>
      ))}
    </group>
  </>
);

const arc = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t + Math.sin(Math.PI * t) * 1.8,
  a[2] + (b[2] - a[2]) * t,
];

// Position of the "manual" order: born on the phone, then hops desk to desk.
const manualOrder = (frame: number): [number, number, number] => {
  let p = stationTop(0);
  for (let k = 1; k < HOPS.length; k++) {
    const t = interpolate(frame, [f(HOPS[k].at), f(HOPS[k].at + HOP_LEN)], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    });
    if (t > 0) p = arc(stationTop(HOPS[k - 1].to), stationTop(HOPS[k].to), t);
  }
  return p;
};

const Ball: React.FC<{
  readonly position: [number, number, number];
  readonly scale: number;
  readonly color?: string;
  readonly opacity?: number;
}> = ({ position, scale, color = BLUE, opacity = 1 }) => (
  <mesh position={position} scale={scale} castShadow>
    <sphereGeometry args={[0.24, 32, 32]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.3} transparent opacity={opacity} />
  </mesh>
);

const ROUTE = STATIONS.map((s) => new THREE.Vector3(s.x, 0.04, s.z));

const Tape: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f(CUE.fita), f(CUE.fitaFim)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const fade = interpolate(frame, [f(CUE.trilhos), f(CUE.trilhos) + 20], [1, 0], clamp);
  if (p <= 0 || fade <= 0) return null;
  const segs = ROUTE.slice(1).map((b, i) => ({ a: ROUTE[i], b, len: ROUTE[i].distanceTo(b) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  let remaining = total * p;
  return (
    <group>
      {segs.map((s, i) => {
        const l = Math.max(0, Math.min(s.len, remaining));
        remaining -= s.len;
        if (l <= 0) return null;
        const dir = s.b.clone().sub(s.a).normalize();
        const mid = s.a.clone().add(dir.clone().multiplyScalar(l / 2));
        const ang = Math.atan2(dir.x, dir.z);
        const ticks = Math.floor(l / 0.25);
        return (
          <group key={i} position={[mid.x, 0.03, mid.z]} rotation={[0, ang, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.32, 0.03, l]} />
              <meshStandardMaterial color="#FFC83D" roughness={0.5} transparent opacity={fade} />
            </mesh>
            {Array.from({ length: ticks }).map((_, k) => (
              <mesh key={k} position={[-0.09, 0.02, -l / 2 + k * 0.25]}>
                <boxGeometry args={[k % 4 === 0 ? 0.16 : 0.08, 0.01, 0.02]} />
                <meshBasicMaterial color="#1B1D24" transparent opacity={fade} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

// A generic "one size fits all" box that drops onto the company, doesn't fit, and falls away.
const GenericBox: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < f(CUE.caixaCai) || frame > f(CUE.caixaSome) + 30) return null;
  const fall = interpolate(frame, [f(CUE.caixaCai), f(CUE.caixaBate)], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = interpolate(frame, [f(CUE.caixaBate), f(CUE.caixaBate) + 6, f(CUE.caixaBate) + 12], [0, 0.6, 0], clamp);
  const away = interpolate(frame, [f(CUE.caixaSome), f(CUE.caixaSome) + 24], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <group
      position={[0.2 + away * 7, interpolate(fall, [0, 1], [10, 2.6]) + bounce - away * 6, -0.2]}
      rotation={[away * 0.9, 0.3, interpolate(frame, [f(CUE.caixaBate), f(CUE.caixaBate) + 10], [0, 0.22], clamp) + away * 1.2]}
    >
      <mesh castShadow>
        <boxGeometry args={[4.2, 3.2, 4.2]} />
        <meshStandardMaterial color="#9AA3B5" roughness={0.6} transparent opacity={0.92} />
      </mesh>
      <mesh>
        <boxGeometry args={[4.24, 3.24, 4.24]} />
        <meshBasicMaterial color="#E5484D" wireframe transparent opacity={interpolate(frame, [f(CUE.caixaBate), f(CUE.caixaBate) + 4], [0, 1], clamp)} />
      </mesh>
    </group>
  );
};

const curve = new THREE.CatmullRomCurve3(
  STATIONS.map((s) => new THREE.Vector3(s.x, DESK_TOP + 0.08, s.z)),
  false,
  "catmullrom",
  0.5,
);

const Rails: React.FC = () => {
  const frame = useCurrentFrame();
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 240, 0.07, 12, false), []);
  const p = interpolate(frame, [f(CUE.trilhos), f(CUE.trilhosFim)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  geometry.setDrawRange(0, Math.floor((geometry.index?.count ?? 0) * p));
  if (p <= 0) return null;
  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={0.7} roughness={0.25} />
    </mesh>
  );
};

// Station glow when the "new" order passes by (and when everything lights up "na hora").
export const stationGlow = (frame: number, i: number) => {
  const passAt = f(CUE.corre) + (i / (STATIONS.length - 1)) * (f(CUE.naHora) - f(CUE.corre));
  const pass = interpolate(frame, [passAt - 2, passAt + 2, passAt + 20], [0, 1, 0.55], clamp);
  const all = interpolate(frame, [f(CUE.naHora), f(CUE.naHora) + 4, f(CUE.naHora) + 26], [0, 1, 0.6], clamp);
  return frame >= f(CUE.corre) ? Math.max(pass, all) : 0;
};

export const World: React.FC = () => {
  const frame = useCurrentFrame();
  const manualVisible = frame < f(CUE.ninguem) + 20;
  const manualScale = interpolate(frame, [f(HOPS[0].at), f(HOPS[0].at) + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

  const lostT = interpolate(frame, [f(CUE.lost), f(CUE.lost) + 40], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const s3 = stationTop(3);

  const newT = interpolate(frame, [f(CUE.corre), f(CUE.naHora)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const newPos = curve.getPointAt(newT);
  const newScale = interpolate(frame, [f(CUE.umaVez), f(CUE.umaVez) + 10], [0, 1.15], { ...clamp, easing: Easing.out(Easing.back(2)) });

  const live = frame >= f(CUE.painel);

  return (
    <>
      <CameraRig />
      <hemisphereLight args={["#FFFFFF", "#DDE4F2", 1.4]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 12, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.5} color="#CFE0FF" />

      <mesh position={[0, -0.18, 0]} receiveShadow>
        <boxGeometry args={[12.5, 0.36, 10]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.5, 10]} />
        <meshStandardMaterial color="#F1F4FA" roughness={1} />
      </mesh>

      {STATIONS.map((_, i) => (i === 4 ? null : <Desk key={i} i={i} glow={stationGlow(frame, i)} />))}
      <group position={[STATIONS[4].x, 0, STATIONS[4].z]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.25 + stationGlow(frame, 4) * 0.25, 48]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.85 * stationGlow(frame, 4)} />
        </mesh>
      </group>
      <Props />

      {manualVisible && frame >= f(HOPS[0].at) ? <Ball position={manualOrder(frame)} scale={manualScale} /> : null}

      {frame >= f(CUE.lost) && lostT < 1 ? (
        <Ball
          position={[s3[0] + lostT * 1.6, s3[1] - lostT * s3[1] + 0.24 * lostT, s3[2] + lostT * 2.2]}
          scale={0.8}
          color="#8A93A6"
          opacity={1 - lostT * 0.8}
        />
      ) : null}

      <Tape />
      <GenericBox />
      <Rails />

      {frame >= f(CUE.umaVez) ? <Ball position={[newPos.x, newPos.y + 0.22, newPos.z]} scale={newScale} /> : null}
      {live
        ? [0.15, 0.45, 0.75].map((o) => {
            const t = ((frame - f(CUE.painel)) / 75 + o) % 1;
            const p = curve.getPointAt(t);
            return <Ball key={o} position={[p.x, p.y + 0.22, p.z]} scale={0.75} />;
          })
        : null}
    </>
  );
};
