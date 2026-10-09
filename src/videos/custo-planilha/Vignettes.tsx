import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";
import { CUE, PHASE, f } from "./timeline";

const AREA = { top: 170, height: 690 };
const BEAT = 18;

const visible = (frame: number, from: number, to: number) =>
  interpolate(frame, [f(from), f(from) + 8, f(to) - 8, f(to)], [0, 1, 1, 0], clamp);

const Grid: React.FC<{
  readonly cols?: number;
  readonly rows?: number;
  readonly cellColor: (i: number) => string;
  readonly width?: number;
}> = ({ cols = 6, rows = 7, cellColor, width = 560 }) => (
  <div
    style={{
      width,
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor: "#0E1A33",
      border: "2px solid rgba(255,255,255,0.12)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
    }}
  >
    <div style={{ height: 46, backgroundColor: "#1D6F42", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "rgba(255,255,255,0.55)" }} />
      ))}
      <div style={{ fontFamily: MONO, fontSize: 20, color: "rgba(255,255,255,0.9)", marginLeft: 10 }}>
        planilha_FINAL_v7.xlsx
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3, padding: 3 }}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ height: 50, backgroundColor: cellColor(i) }} />
      ))}
    </div>
  </div>
);

const BigLabel: React.FC<{ readonly at: number; readonly children: React.ReactNode; readonly top: number; readonly color?: string }> = ({
  at,
  children,
  top,
  color = C.white,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top,
        right: 70,
        padding: "16px 26px",
        borderRadius: 20,
        backgroundColor: "rgba(4,14,40,0.9)",
        border: `2px solid ${C.glow}66`,
        fontFamily: SANS,
        fontSize: 54,
        fontWeight: 800,
        color,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        opacity: interpolate(frame, [f(at), f(at) + 5], [0, 1], clamp),
        scale: interpolate(frame, [f(at), f(at) + 10], [1.3, 1], { ...clamp, easing: EASE, output: "perceptual-scale" }),
      }}
    >
      {children}
    </div>
  );
};

const PriceTag: React.FC<{ readonly tearAt: number }> = ({ tearAt }) => {
  const frame = useCurrentFrame();
  const torn = interpolate(frame, [f(tearAt), f(tearAt) + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const swing = Math.sin(frame / 9) * 6 * (1 - torn);
  const half = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: side < 0 ? "polygon(0 0, 52% 0, 46% 100%, 0 100%)" : "polygon(52% 0, 100% 0, 100% 100%, 46% 100%)",
        translate: `${side * torn * 80}px ${torn * 500}px`,
        rotate: `${side * torn * 25}deg`,
        opacity: 1 - torn * 0.6,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "18px 70px 70px 18px",
          backgroundColor: "#FFD54A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontSize: 78,
          fontWeight: 800,
          color: C.deep,
        }}
      >
        R$ 0,00
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 600, top: 330, width: 360, height: 150, rotate: `${-8 + swing}deg`, transformOrigin: "100% 50%" }}>
      {half(-1)}
      {half(1)}
    </div>
  );
};

export const Vignettes: React.FC = () => {
  const frame = useCurrentFrame();
  const end = f(PHASE.vinhetas.to);
  const cursorCell = Math.floor((frame - f(4.3)) / BEAT) % 42;

  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [end - 10, end], [1, 0], clamp) }}>
      <div style={{ position: "absolute", top: AREA.top, left: 0, right: 0, height: AREA.height }}>
        {/* 1 · The "free" spreadsheet with a price tag that tears on "Vamos fazer as contas". */}
        <AbsoluteFill style={{ opacity: visible(frame, 0, 4.4) }}>
          <div style={{ position: "absolute", left: 90, top: 120 }}>
            <Grid width={520} rows={6} cellColor={() => "rgba(255,255,255,0.06)"} />
          </div>
          <PriceTag tearAt={CUE.tear} />
        </AbsoluteFill>

        {/* 2 · Time: a cursor fixes cells on the beat while the hours add up. */}
        <AbsoluteFill style={{ opacity: visible(frame, 4.3, 16.0) }}>
          <div style={{ position: "absolute", left: 70, top: 40 }}>
            <Grid
              cellColor={(i) =>
                i === cursorCell
                  ? C.green
                  : i === (cursorCell + 7) % 42 || i === (cursorCell + 19) % 42
                    ? "rgba(255,59,92,0.55)"
                    : "rgba(255,255,255,0.06)"
              }
            />
          </div>
          <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: "absolute", right: 90, top: 10 }}>
            <circle cx={50} cy={50} r={44} fill="rgba(4,14,40,0.9)" stroke={C.glow} strokeWidth={5} />
            <line x1={50} y1={50} x2={50} y2={18} stroke={C.white} strokeWidth={5} strokeLinecap="round" style={{ transformOrigin: "50px 50px", rotate: `${frame * 12}deg` }} />
            <line x1={50} y1={50} x2={70} y2={50} stroke={C.glow} strokeWidth={5} strokeLinecap="round" style={{ transformOrigin: "50px 50px", rotate: `${frame}deg` }} />
          </svg>
          <BigLabel at={CUE.umaHora} top={200}>1h / dia</BigLabel>
          <BigLabel at={CUE.vinteDuas} top={320}>22h / mês</BigLabel>
          <BigLabel at={CUE.vinteCinco} top={440} color={C.ice}>× R$ 25/h</BigLabel>
          <BigLabel at={CUE.linhaTempo} top={560} color="#FFD54A">= R$ 550</BigLabel>
        </AbsoluteFill>

        {/* 3 · One person is the system: everything depends on her, she leaves, it locks up. */}
        <AbsoluteFill style={{ opacity: visible(frame, 16.0, 24.4) }}>
          <div style={{ position: "absolute", left: 70, top: 40 }}>
            <Grid
              cellColor={(i) =>
                interpolateColors(
                  interpolate(frame, [f(CUE.trava) + (i % 42) * 0.6, f(CUE.trava) + (i % 42) * 0.6 + 4], [0, 1], clamp),
                  [0, 1],
                  ["rgba(255,255,255,0.06)", "rgba(255,59,92,0.7)"],
                )
              }
            />
          </div>
          <svg width={1080} height={690} style={{ position: "absolute", inset: 0 }}>
            {[0, 1, 2, 3, 4, 5].map((k) => {
              const d = interpolate(frame, [f(CUE.sistema) + k * 2, f(CUE.sistema) + k * 2 + 10], [0, 1], clamp);
              const leave = interpolate(frame, [f(CUE.ferias), f(CUE.ferias) + 12], [1, 0], clamp);
              return (
                <line
                  key={k}
                  x1={130 + k * 95}
                  y1={140 + (k % 3) * 120}
                  x2={130 + k * 95 + (840 - 130 - k * 95) * d}
                  y2={140 + (k % 3) * 120 + (360 - 140 - (k % 3) * 120) * d}
                  stroke={C.glow}
                  strokeWidth={4}
                  opacity={0.8 * leave}
                />
              );
            })}
          </svg>
          <div
            style={{
              position: "absolute",
              left: 760,
              top: 280,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              translate: `${interpolate(frame, [f(CUE.ferias), f(CUE.ferias) + 18], [0, 400], { ...clamp, easing: Easing.in(Easing.cubic) })}px 0px`,
              opacity: interpolate(frame, [f(CUE.pessoa), f(CUE.pessoa) + 8], [0, 1], clamp),
            }}
          >
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                background: `linear-gradient(135deg, #F5A524, #E86A2C)`,
                border: `6px solid ${C.white}`,
                boxShadow: "0 0 50px rgba(245,165,36,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontSize: 80,
                fontWeight: 800,
                color: C.white,
                scale: interpolate(frame, [f(CUE.sistema), f(CUE.sistema) + 10], [1, 1.2], { ...clamp, easing: EASE }),
              }}
            >
              A
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                letterSpacing: 2,
                padding: "8px 14px",
                borderRadius: 999,
                backgroundColor: frame >= f(CUE.ferias) ? "#F5A524" : "rgba(4,14,40,0.9)",
                color: frame >= f(CUE.ferias) ? C.deep : C.ice,
              }}
            >
              {frame >= f(CUE.ferias) ? "DE FÉRIAS" : "SÓ ELA SABE"}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 250,
              padding: "14px 34px",
              border: `6px solid ${C.red}`,
              borderRadius: 16,
              fontFamily: SANS,
              fontSize: 72,
              fontWeight: 800,
              color: C.red,
              rotate: "-8deg",
              backgroundColor: "rgba(12,6,18,0.7)",
              opacity: interpolate(frame, [f(CUE.trava) + 10, f(CUE.trava) + 14], [0, 1], clamp),
              scale: interpolate(frame, [f(CUE.trava) + 10, f(CUE.trava) + 20], [1.6, 1], { ...clamp, easing: EASE }),
            }}
          >
            TRAVOU
          </div>
        </AbsoluteFill>

        {/* 4 · A paper order flies away; the ticket and the monthly loss appear. */}
        <AbsoluteFill style={{ opacity: visible(frame, 24.4, 32.6) }}>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 120,
              width: 380,
              padding: "34px 30px",
              backgroundColor: "#FFF3A6",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              fontFamily: "'Comic Sans MS', 'Segoe Print', cursive",
              fontSize: 40,
              color: "#3A3A3A",
              lineHeight: 1.4,
              rotate: `${-4 + interpolate(frame, [f(CUE.papelVoa), f(CUE.papelVoa) + 30], [0, -70], clamp)}deg`,
              translate: `${interpolate(frame, [f(CUE.papelVoa), f(CUE.papelVoa) + 30], [0, -700], { ...clamp, easing: Easing.in(Easing.quad) })}px ${interpolate(frame, [f(CUE.papelVoa), f(CUE.papelVoa) + 30], [0, -260], clamp) + Math.sin(frame / 4) * 6}px`,
            }}
          >
            Pedido #27
            <br />
            2x porção
            <br />
            mesa 4
          </div>
          <BigLabel at={CUE.papelVoa + 0.4} top={140} color={C.ice}>1× por semana</BigLabel>
          <BigLabel at={CUE.ticket} top={290}>ticket R$ 80</BigLabel>
          <BigLabel at={CUE.linhaPedido} top={440} color="#FFD54A">= R$ 320/mês</BigLabel>
        </AbsoluteFill>

        {/* 5 · Profit in the dark: the month runs by, and the light only comes on at day 30. */}
        <AbsoluteFill style={{ opacity: visible(frame, 32.6, 38.4) }}>
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 60,
              width: 900,
              height: 520,
              borderRadius: 30,
              backgroundColor: "#0B1530",
              border: "2px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: 24, padding: 50 }}>
              {[0.4, 0.55, 0.35, 0.7, 0.5, 0.8, 0.3].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 12, backgroundColor: i === 6 ? C.red : C.glow }} />
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#03060E",
                opacity: interpolate(frame, [f(CUE.luz), f(CUE.luz) + 6], [0.94, 0], clamp),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontSize: 220,
                fontWeight: 800,
                color: "rgba(255,255,255,0.12)",
              }}
            >
              ?
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: 70,
              top: 0,
              width: 200,
              borderRadius: 22,
              overflow: "hidden",
              backgroundColor: C.white,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              textAlign: "center",
              fontFamily: SANS,
            }}
          >
            <div style={{ backgroundColor: C.red, color: C.white, fontSize: 26, fontWeight: 800, padding: "10px 0" }}>DIA</div>
            <div style={{ fontSize: 96, fontWeight: 800, color: C.deep, padding: "6px 0 14px" }}>
              {Math.round(interpolate(frame, [f(CUE.calendario), f(CUE.luz)], [1, 30], { ...clamp, easing: Easing.in(Easing.quad) }))}
            </div>
          </div>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
