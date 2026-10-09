import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export const WARM = "#FFC86B";
export const TEAL = "#2EC4B6";
export const BLUE = "#4D8BFF";

type Building = { x: number; z: number; w: number; d: number; h: number; color: string };

// The clinic is built separately (see Clinic) because its ground floor is an open, glass-fronted room.
const BUILDINGS: Building[] = [
  { x: -9.5, z: -2.6, w: 2.2, d: 2, h: 3.4, color: "#2E3A63" },
  { x: -7.0, z: -2.6, w: 2.4, d: 2, h: 4.6, color: "#33406B" },
  { x: -4.4, z: -2.6, w: 2.2, d: 2, h: 2.8, color: "#3A4675" },
  { x: 1.3, z: -2.6, w: 2.2, d: 2, h: 4.2, color: "#2E3A63" },
  { x: 6.4, z: -2.6, w: 2.4, d: 2, h: 3.0, color: "#3A4675" },
  { x: 9.0, z: -2.6, w: 2.2, d: 2, h: 5.0, color: "#33406B" },
  { x: -8.4, z: 2.9, w: 2.4, d: 1.8, h: 1.8, color: "#33406B" },
  { x: -5.2, z: 2.9, w: 2.2, d: 1.8, h: 2.3, color: "#2E3A63" },
  { x: -2.0, z: 2.9, w: 2.4, d: 1.8, h: 1.6, color: "#3A4675" },
  { x: 1.4, z: 2.9, w: 2.2, d: 1.8, h: 2.1, color: "#33406B" },
  { x: 4.6, z: 2.9, w: 2.4, d: 1.8, h: 1.7, color: "#2E3A63" },
];

export const CLINIC = { x: -1.6, z: -2.6, w: 2.6, d: 2, ground: 1.55, upper: 1.8 };
export const HOUSE = { x: 8.6, z: 3.4 };
export const TOWER = { x: 3.85, z: -2.6, h: 7.2 };

// Points the confirmation orbs fly to (windows of other buildings and houses).
export const ORB_TARGETS: [number, number, number][] = [
  [-7.0, 2.6, -1.58],
  [-4.4, 1.7, -1.58],
  [1.3, 3.5, -1.58],
  [6.4, 1.7, -1.58],
  [-5.2, 1.6, 3.82],
  [1.4, 1.5, 3.82],
  [-8.4, 1.2, 3.82],
  [4.6, 1.2, 3.82],
];

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const Glow: React.FC<{ readonly position: [number, number, number]; readonly size: [number, number]; readonly color: string; readonly strength: number }> = ({
  position,
  size,
  color,
  strength,
}) =>
  strength > 0 ? (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={0.28 * strength} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  ) : null;

const WindowGrid: React.FC<{
  readonly x: number;
  readonly w: number;
  readonly faceZ: number;
  readonly y0: number;
  readonly h: number;
  readonly seed: number;
  readonly lit: number;
  readonly forceOn?: number;
  readonly flip?: boolean;
}> = ({ x, w, faceZ, y0, h, seed, lit, forceOn, flip }) => {
  const rows = Math.max(1, Math.floor((h - 0.5) / 0.85));
  const cols = Math.max(1, Math.floor(w / 0.7));
  const dz = flip ? -0.012 : 0.012;
  const items = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = x - w / 2 + (c + 0.5) * (w / cols);
      const wy = y0 + 0.55 + r * 0.85;
      const on = forceOn !== undefined ? forceOn : lit > hash(seed, r * 10 + c) ? 1 : 0;
      items.push(
        <group key={`${r}-${c}`}>
          <mesh position={[wx, wy, faceZ + dz]}>
            <planeGeometry args={[0.4, 0.46]} />
            <meshStandardMaterial color={on > 0 ? WARM : "#141A30"} emissive={WARM} emissiveIntensity={on * 1.4} />
          </mesh>
          <Glow position={[wx, wy, faceZ + dz * 2]} size={[1.0, 1.0]} color={WARM} strength={on} />
        </group>,
      );
    }
  }
  return <>{items}</>;
};

const Tree: React.FC<{ readonly x: number; readonly z: number }> = ({ x, z }) => (
  <group position={[x, 0.12, z]}>
    <mesh position={[0, 0.25, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.07, 0.5, 8]} />
      <meshStandardMaterial color="#4A3628" />
    </mesh>
    <mesh position={[0, 0.75, 0]} castShadow>
      <coneGeometry args={[0.32, 0.8, 10]} />
      <meshStandardMaterial color="#25534A" roughness={0.9} />
    </mesh>
  </group>
);

const Car: React.FC<{ readonly x: number; readonly z: number; readonly color: string }> = ({ x, z, color }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.22, 0]} castShadow>
      <boxGeometry args={[1.0, 0.28, 0.48]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
    <mesh position={[-0.05, 0.43, 0]} castShadow>
      <boxGeometry args={[0.55, 0.2, 0.44]} />
      <meshStandardMaterial color="#1A2038" roughness={0.3} />
    </mesh>
    {[-0.32, 0.32].map((wx) => (
      <mesh key={wx} position={[wx, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 14]} />
        <meshStandardMaterial color="#0C0F1C" />
      </mesh>
    ))}
  </group>
);

const Clock: React.FC<{ readonly hours: number }> = ({ hours }) => (
  <group position={[TOWER.x, TOWER.h - 1.0, TOWER.z + 0.62]}>
    <mesh>
      <circleGeometry args={[0.48, 40]} />
      <meshStandardMaterial color="#F4EBD8" emissive="#F4EBD8" emissiveIntensity={0.9} />
    </mesh>
    <Glow position={[0, 0, 0.01]} size={[1.6, 1.6]} color="#F4EBD8" strength={0.6} />
    <mesh position={[0, 0, 0.02]} rotation={[0, 0, -((hours % 12) / 12) * Math.PI * 2]}>
      <planeGeometry args={[0.06, 0.28]} />
      <meshBasicMaterial color="#1B1D24" />
    </mesh>
    <mesh position={[0, 0, 0.03]} rotation={[0, 0, -(hours % 1) * Math.PI * 2]}>
      <planeGeometry args={[0.04, 0.4]} />
      <meshBasicMaterial color="#1B1D24" />
    </mesh>
  </group>
);

export type ClinicState = {
  // 0..1: interior light (the "last light").
  readonly light: number;
  // Upper floors height multiplier ("a clínica cresceu").
  readonly grow: number;
  // Paper pile height (0..1) and how far the papers have flown away (0..1).
  readonly papers: number;
  readonly papersFly: number;
  // Monitor: 0 spreadsheet (green), 1 Codexy calendar (blue), 2 cash closed (check).
  readonly screen: 0 | 1 | 2;
  readonly calendar: number;
  readonly phoneBuzz: number;
  readonly wallHours: number;
  readonly slump: number;
  // Blue sweep across the facade when the system arrives (0..1, -1 = off).
  readonly sweep: number;
};

export type CityState = {
  readonly lit: number;
  readonly houseLit: number;
  readonly lampsOn: number;
  readonly hours: number;
  readonly day: number;
  readonly dusk: number;
  readonly clinic: ClinicState;
  readonly orbs: number;
};

const Lucia: React.FC<{ readonly slump: number }> = ({ slump }) => (
  <group position={[CLINIC.x - 0.15, 0, CLINIC.z - 0.3]} rotation={[slump * 0.3, 0, 0]}>
    <mesh position={[0, 0.42, 0]} castShadow>
      <capsuleGeometry args={[0.1, 0.2, 6, 16]} />
      <meshStandardMaterial color="#F3F5F8" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.55, 0.06]}>
      <boxGeometry args={[0.1, 0.05, 0.04]} />
      <meshStandardMaterial color={TEAL} />
    </mesh>
    <group position={[0, 0.7, 0]} rotation={[slump * 0.5, 0, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color="#E2AE8C" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, -0.01]}>
        <sphereGeometry args={[0.09, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.9]} />
        <meshStandardMaterial color="#3B2418" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.03, -0.09]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#3B2418" roughness={0.8} />
      </mesh>
    </group>
  </group>
);

const Clinic: React.FC<{ readonly c: ClinicState }> = ({ c }) => {
  const { x, z, w, d, ground, upper } = CLINIC;
  const front = z + d / 2;
  const wall = "#3F4B7A";
  const roomLight = c.light;
  const screenOff = c.light < 0.05;
  const screenColor = screenOff ? "#0A0D18" : c.screen === 0 ? "#1D6F42" : c.screen === 1 ? "#1B3F9A" : "#21B26B";
  return (
    <group>
      {/* Ground floor: open room behind a glass storefront. */}
      <mesh position={[x, 0.01, z]} receiveShadow>
        <boxGeometry args={[w - 0.1, 0.02, d - 0.1]} />
        <meshStandardMaterial color="#8C6B52" roughness={0.9} />
      </mesh>
      <mesh position={[x, ground / 2, z - d / 2 + 0.05]}>
        <boxGeometry args={[w, ground, 0.1]} />
        <meshStandardMaterial color="#E9DFCC" emissive={WARM} emissiveIntensity={0.12 * c.light} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[x + s * (w / 2 - 0.05), ground / 2, z]}>
          <boxGeometry args={[0.1, ground, d]} />
          <meshStandardMaterial color={wall} />
        </mesh>
      ))}
      <mesh position={[x, ground + 0.06, z]}>
        <boxGeometry args={[w + 0.08, 0.12, d + 0.08]} />
        <meshStandardMaterial color="#56628F" />
      </mesh>
      <mesh position={[x, ground / 2 + 0.05, front]}>
        <planeGeometry args={[w - 0.2, ground - 0.2]} />
        <meshStandardMaterial color="#BFD9FF" transparent opacity={0.12} roughness={0.1} metalness={0.3} depthWrite={false} />
      </mesh>
      <Glow position={[x, ground / 2, front + 0.03]} size={[w + 1.2, ground + 1.0]} color={WARM} strength={c.light} />
      <pointLight position={[x, ground - 0.3, z + 0.2]} intensity={4.5 * roomLight} distance={4} color={WARM} castShadow />
      <pointLight position={[x, 0.8, front + 0.9]} intensity={3 * c.light} distance={4} color={WARM} />

      {/* Reception: desk, monitor, papers, phone, wall clock, Lúcia. */}
      <mesh position={[x, 0.36, z + 0.1]} castShadow>
        <boxGeometry args={[1.25, 0.06, 0.5]} />
        <meshStandardMaterial color="#C9A27E" />
      </mesh>
      <mesh position={[x, 0.18, z + 0.33]}>
        <boxGeometry args={[1.22, 0.36, 0.04]} />
        <meshStandardMaterial color="#B48E6B" />
      </mesh>
      <group position={[x + 0.32, 0.39, z]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.46, 0.28, 0.03]} />
          <meshStandardMaterial color="#1B1D24" />
        </mesh>
        <mesh position={[0, 0.2, 0.017]}>
          <planeGeometry args={[0.42, 0.24]} />
          <meshBasicMaterial color={screenColor} />
        </mesh>
        {c.screen === 1
          ? Array.from({ length: 12 }).map((_, k) => (
              <mesh key={k} position={[-0.15 + (k % 4) * 0.1, 0.27 - Math.floor(k / 4) * 0.07, 0.02]}>
                <planeGeometry args={[0.08, 0.05]} />
                <meshBasicMaterial color={k < c.calendar * 12 ? "#9CC2FF" : "#2C55B8"} />
              </mesh>
            ))
          : null}
        {c.screen === 2 && !screenOff ? (
          <group position={[0, 0.2, 0.022]}>
            <mesh position={[-0.03, -0.015, 0]} rotation={[0, 0, Math.PI / 4]}>
              <planeGeometry args={[0.025, 0.08]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0.03, 0.015, 0]} rotation={[0, 0, -Math.PI / 5]}>
              <planeGeometry args={[0.025, 0.15]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
          </group>
        ) : null}
        <pointLight position={[0, 0.2, 0.3]} intensity={screenOff ? 0 : 1.2} distance={1.4} color={screenColor} />
      </group>
      {Array.from({ length: Math.round(4 + c.papers * 14) }).map((_, i) => {
        const fl = Math.max(0, Math.min(1, c.papersFly * 1.5 - (i % 5) * 0.1));
        if (fl >= 1) return null;
        return (
          <mesh
            key={i}
            position={[x - 0.4 + fl * (0.3 + (i % 3) * 0.3), 0.4 + i * 0.012 + fl * (1.2 + (i % 4) * 0.4), z + 0.12 + fl * 1.4]}
            rotation={[fl * 2, Math.sin(i) * 0.2 + fl * 3, fl]}
          >
            <boxGeometry args={[0.22, 0.008, 0.3]} />
            <meshStandardMaterial color="#FBFBF7" transparent opacity={1 - fl} />
          </mesh>
        );
      })}
      <group position={[x + 0.05 + c.phoneBuzz * Math.sin(c.wallHours * 900) * 0.015, 0.395, z + 0.22]}>
        <mesh>
          <boxGeometry args={[0.08, 0.012, 0.15]} />
          <meshStandardMaterial color="#1B1D24" />
        </mesh>
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 0.13]} />
          <meshBasicMaterial color={c.phoneBuzz > 0 ? "#25D366" : "#1E3A5A"} />
        </mesh>
      </group>
      <group position={[x - 0.6, 1.1, z - d / 2 + 0.11]}>
        <mesh>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.005]} rotation={[0, 0, -((c.wallHours % 12) / 12) * Math.PI * 2]}>
          <planeGeometry args={[0.02, 0.08]} />
          <meshBasicMaterial color="#1B1D24" />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, -(c.wallHours % 1) * Math.PI * 2]}>
          <planeGeometry args={[0.012, 0.12]} />
          <meshBasicMaterial color="#C0392B" />
        </mesh>
      </group>
      <Lucia slump={c.slump} />

      {/* Upper floors (they grow when "a clínica cresceu"). */}
      <group position={[x, ground + 0.12, z]} scale={[1, c.grow, 1]}>
        <mesh position={[0, upper / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w, upper, d]} />
          <meshStandardMaterial color="#3A4675" roughness={0.85} />
        </mesh>
        <mesh position={[0, upper + 0.05, 0]}>
          <boxGeometry args={[w + 0.12, 0.1, d + 0.12]} />
          <meshStandardMaterial color="#56628F" />
        </mesh>
        <WindowGrid x={0} w={w} faceZ={d / 2} y0={0} h={upper} seed={99} lit={0} forceOn={c.light} />
      </group>
      <group position={[x, ground + 0.12 + upper * c.grow - 0.4, front + 0.02]}>
        <mesh>
          <planeGeometry args={[0.12, 0.38]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.4} />
        </mesh>
        <mesh>
          <planeGeometry args={[0.38, 0.12]} />
          <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={1.4} />
        </mesh>
        <Glow position={[0, 0, 0.01]} size={[1.0, 1.0]} color={TEAL} strength={0.8} />
      </group>
      {c.sweep >= 0 && c.sweep <= 1 ? (
        <mesh position={[x - w / 2 - 0.4 + c.sweep * (w + 0.8), (ground + upper * c.grow) / 2, front + 0.06]}>
          <planeGeometry args={[0.5, ground + upper * c.grow + 0.6]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.85 * Math.sin(Math.PI * c.sweep)} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
};

export const CityCamera: React.FC<{ readonly pos: THREE.Vector3; readonly target: THREE.Vector3 }> = ({ pos, target }) => {
  const { camera } = useThree();
  camera.position.copy(pos);
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return null;
};

export const City: React.FC<{ readonly s: CityState }> = ({ s }) => {
  const sun = s.day;
  const fogColor = useMemo(() => new THREE.Color(), []);
  fogColor.set("#0B1430").lerp(new THREE.Color("#7FA9E8"), sun).lerp(new THREE.Color("#B8607A"), s.dusk * 0.7);
  const orbFrom = new THREE.Vector3(CLINIC.x, 1.2, CLINIC.z + CLINIC.d / 2 + 0.2);

  return (
    <>
      <fog attach="fog" args={[fogColor, 16, 46]} />
      <hemisphereLight args={[sun > 0.5 ? "#FFFFFF" : "#8EA6FF", "#1A1430", 0.55 + sun * 0.9 + s.dusk * 0.3]} />
      <directionalLight position={[-8, 12, 10]} intensity={0.45 + sun * 1.4} color={sun > 0.5 ? "#FFF2DD" : s.dusk > 0.3 ? "#FFB38A" : "#A9BCFF"} castShadow />
      <directionalLight position={[6, 6, -10]} intensity={0.5} color="#6F86FF" />
      <pointLight position={[HOUSE.x + 0.35, 0.9, HOUSE.z + 1.3]} intensity={4 * s.houseLit} distance={4} color={WARM} />

      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[24, 0.5, 13]} />
        <meshStandardMaterial color="#1A2240" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 2.6]} />
        <meshStandardMaterial color="#141A30" roughness={0.9} />
      </mesh>
      {[-1.45, 1.45].map((zz) => (
        <mesh key={zz} position={[0, 0.06, zz]} receiveShadow>
          <boxGeometry args={[24, 0.12, 0.3]} />
          <meshStandardMaterial color="#2A3458" roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={i} position={[-11 + i * 2.2, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.07]} />
          <meshBasicMaterial color="#56628F" />
        </mesh>
      ))}

      {BUILDINGS.map((b, bi) => {
        const north = b.z < 0;
        const faceZ = north ? b.z + b.d / 2 : b.z + b.d / 2;
        return (
          <group key={bi}>
            <mesh position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial color={b.color} roughness={0.85} />
            </mesh>
            <mesh position={[b.x, b.h + 0.05, b.z]}>
              <boxGeometry args={[b.w + 0.12, 0.1, b.d + 0.12]} />
              <meshStandardMaterial color="#56628F" />
            </mesh>
            <mesh position={[b.x + b.w * 0.25, 0.32, faceZ + 0.011]}>
              <planeGeometry args={[0.36, 0.62]} />
              <meshStandardMaterial color="#1A1F33" />
            </mesh>
            <WindowGrid x={b.x} w={b.w} faceZ={faceZ} y0={0.3} h={b.h - 0.3} seed={bi} lit={s.lit} />
          </group>
        );
      })}

      <Clinic c={s.clinic} />

      <mesh position={[TOWER.x, TOWER.h / 2, TOWER.z]} castShadow>
        <boxGeometry args={[1.2, TOWER.h, 1.2]} />
        <meshStandardMaterial color="#3A4675" roughness={0.8} />
      </mesh>
      <mesh position={[TOWER.x, TOWER.h + 0.45, TOWER.z]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.0, 0.9, 4]} />
        <meshStandardMaterial color="#56628F" roughness={0.8} />
      </mesh>
      <Clock hours={s.hours} />

      <group position={[HOUSE.x, 0, HOUSE.z]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.9, 1.5, 1.6]} />
          <meshStandardMaterial color="#4A4166" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.45, 0.9, 4]} />
          <meshStandardMaterial color="#8A4652" roughness={0.8} />
        </mesh>
        <mesh position={[0.35, 0.85, 0.811]}>
          <planeGeometry args={[0.6, 0.5]} />
          <meshStandardMaterial color={s.houseLit > 0 ? WARM : "#141A30"} emissive={WARM} emissiveIntensity={s.houseLit * 1.4} />
        </mesh>
        <Glow position={[0.35, 0.85, 0.83]} size={[1.1, 0.95]} color={WARM} strength={s.houseLit} />
        {[0.2, 0.52].map((hx) => (
          <mesh key={hx} position={[hx, 0.78, 0.815]}>
            <planeGeometry args={[0.13, 0.28]} />
            <meshBasicMaterial color="#3A2416" transparent opacity={s.houseLit} />
          </mesh>
        ))}
        <mesh position={[-0.45, 0.45, 0.811]}>
          <planeGeometry args={[0.38, 0.9]} />
          <meshStandardMaterial color="#6A4434" />
        </mesh>
      </group>

      {[-9, -6.2, -3.4, 3.0, 5.6, 10.0].map((tx) => (
        <Tree key={tx} x={tx} z={1.75} />
      ))}
      <Car x={-6.8} z={0.75} color="#C0392B" />
      <Car x={2.6} z={-0.75} color="#E8E8EE" />
      <Car x={6.9} z={0.75} color="#2F6BFF" />

      {[-7.6, -2.6, 2.2, 7.4].map((lx) => (
        <group key={lx} position={[lx, 0, 1.45]}>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 1.5, 8]} />
            <meshStandardMaterial color="#56628F" />
          </mesh>
          <mesh position={[0, 1.52, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={WARM} emissive={WARM} emissiveIntensity={1.8 * s.lampsOn} />
          </mesh>
          <Glow position={[0, 1.52, 0.02]} size={[0.9, 0.9]} color={WARM} strength={s.lampsOn} />
          <pointLight position={[0, 1.45, 0]} intensity={1.8 * s.lampsOn} distance={3.4} color={WARM} />
        </group>
      ))}

      {s.orbs > 0
        ? ORB_TARGETS.map((t, k) => {
            const p = Math.max(0, Math.min(1, s.orbs * 1.6 - k * 0.09));
            if (p <= 0) return null;
            const to = new THREE.Vector3(...t);
            const pos = orbFrom.clone().lerp(to, p);
            pos.y += Math.sin(Math.PI * p) * 2.2;
            const arrived = p >= 1;
            return (
              <group key={k}>
                {!arrived ? (
                  <mesh position={pos}>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={2.2} />
                  </mesh>
                ) : null}
                <Glow position={[pos.x, pos.y, pos.z + 0.05]} size={arrived ? [0.8, 0.8] : [0.6, 0.6]} color={BLUE} strength={arrived ? 0.9 : 1} />
              </group>
            );
          })
        : null}
    </>
  );
};
