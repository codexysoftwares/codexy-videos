import { interpolate, interpolateColors } from "remotion";
import { C, MONO, clamp } from "../../shared/theme";

// The "company": an organic network of nodes. The same shape is forced into a grid (molde),
// mapped (scan + labels) and finally shown lit, so it reads as one continuous story.
export const NODES = [
  { x: 540, y: 600, grid: [540, 740], label: "PEDIDOS" },
  { x: 290, y: 740, grid: [330, 740], label: "ATENDIMENTO" },
  { x: 800, y: 700, grid: [750, 740], label: "ESTOQUE" },
  { x: 430, y: 920, grid: [330, 950], label: "EQUIPE" },
  { x: 690, y: 960, grid: [540, 950], label: "FINANCEIRO" },
  { x: 220, y: 1070, grid: [330, 1160], label: "CLIENTES" },
  { x: 870, y: 1050, grid: [750, 950], label: "ENTREGAS" },
  { x: 520, y: 1170, grid: [540, 1160], label: "RELATÓRIOS" },
  { x: 770, y: 1240, grid: [750, 1160], label: "FORNECEDORES" },
] as const;

export const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 5], [3, 5],
  [4, 6], [2, 6], [3, 7], [4, 7], [7, 8], [6, 8],
] as const;

type Props = {
  readonly frame: number;
  // 0..1: lines and nodes drawing in.
  readonly draw: number;
  // 0..1: nodes forced into the rigid grid.
  readonly molde?: number;
  // 0..1: a scan line passes and lights each node with its label.
  readonly scan?: number;
  // 0..1: final lit state.
  readonly lit?: number;
  readonly opacity?: number;
};

export const Network: React.FC<Props> = ({
  frame,
  draw,
  molde = 0,
  scan = -1,
  lit = 0,
  opacity = 1,
}) => {
  const jitter = molde > 0.85 ? Math.sin(frame * 1.9) * 3 : 0;
  const pos = NODES.map((n, i) => ({
    x: interpolate(molde, [0, 1], [n.x, n.grid[0]]) + jitter * (i % 2 ? 1 : -1) + Math.sin(frame / 40 + i) * 6 * (1 - molde),
    y: interpolate(molde, [0, 1], [n.y, n.grid[1]]) + Math.cos(frame / 45 + i) * 6 * (1 - molde),
  }));
  const scanY = interpolate(scan, [0, 1], [520, 1320]);
  const baseColor = interpolateColors(molde, [0, 1], [C.glow, "#5A6378"]);

  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <defs>
        <filter id="netGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {molde > 0 ? (
        <rect
          x={250}
          y={660}
          width={580}
          height={580}
          rx={8}
          fill="none"
          stroke={C.red}
          strokeWidth={3}
          strokeDasharray="14 10"
          opacity={interpolate(molde, [0.3, 0.8], [0, 0.8], clamp)}
        />
      ) : null}

      {EDGES.map(([a, b], i) => {
        const d = interpolate(draw, [i / EDGES.length / 1.4, i / EDGES.length / 1.4 + 0.35], [0, 1], clamp);
        const len = Math.hypot(pos[b].x - pos[a].x, pos[b].y - pos[a].y);
        const edgeLit = Math.max(lit, scan >= 0 && scanY > Math.max(pos[a].y, pos[b].y) ? 1 : 0);
        return (
          <line
            key={i}
            x1={pos[a].x}
            y1={pos[a].y}
            x2={pos[b].x}
            y2={pos[b].y}
            stroke={interpolateColors(edgeLit, [0, 1], [baseColor, C.glow])}
            strokeWidth={interpolate(edgeLit, [0, 1], [2.5, 4])}
            strokeOpacity={interpolate(edgeLit, [0, 1], [0.55, 0.95])}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - d)}
            filter={edgeLit > 0.5 ? "url(#netGlow)" : undefined}
          />
        );
      })}

      {pos.map((p, i) => {
        const appear = interpolate(draw, [i / NODES.length * 0.7, i / NODES.length * 0.7 + 0.25], [0, 1], clamp);
        const scanned = scan >= 0 ? interpolate(scanY - p.y, [0, 40], [0, 1], clamp) : 0;
        const on = Math.max(lit, scanned);
        const r = interpolate(on, [0, 1], [11, 16]);
        return (
          <g key={NODES[i].label} opacity={appear}>
            <circle cx={p.x} cy={p.y} r={r + 14} fill={C.glow} opacity={0.18 * on} />
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={on > 0.5 ? C.glow : C.deep}
              stroke={interpolateColors(on, [0, 1], [baseColor, C.white])}
              strokeWidth={3}
              filter={on > 0.5 ? "url(#netGlow)" : undefined}
            />
            {scan >= 0 ? (
              <text
                x={p.x}
                y={p.y - 30}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={22}
                letterSpacing={2}
                fill={C.ice}
                opacity={scanned}
              >
                {NODES[i].label}
              </text>
            ) : null}
          </g>
        );
      })}

      {scan >= 0 && scan < 1 ? (
        <g opacity={interpolate(scan, [0, 0.05, 0.9, 1], [0, 1, 1, 0])}>
          <rect x={0} y={scanY - 60} width={1080} height={60} fill="url(#scanGrad)" />
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.glow} stopOpacity={0} />
              <stop offset="100%" stopColor={C.glow} stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <line x1={60} x2={1020} y1={scanY} y2={scanY} stroke={C.glow} strokeWidth={2} opacity={0.9} />
        </g>
      ) : null}
    </svg>
  );
};
