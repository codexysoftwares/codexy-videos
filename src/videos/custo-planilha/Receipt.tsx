import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, EASE, MONO, clamp } from "../../shared/theme";
import { CUE, PHASE, f } from "./timeline";

const INK = "#1B1D24";
const PAPER = "#F5F2EA";

const brl = (v: number) =>
  `R$ ${Math.round(v).toLocaleString("pt-BR")},00`;

const ITEMS = [
  { at: CUE.linhaTempo, name: "Retrabalho (22h × R$ 25)", value: "R$ 550,00", color: INK },
  { at: CUE.linhaPessoa, name: "Dependência de 1 pessoa", value: "RISCO", color: C.red },
  { at: CUE.linhaPedido, name: "Pedidos perdidos (4 × R$ 80)", value: "R$ 320,00", color: INK },
  { at: CUE.linhaLucro, name: "Lucro descoberto", value: "DIA 30", color: "#C77700" },
];

const ROW_H = 62;

const Row: React.FC<{ readonly at: number; readonly children: React.ReactNode; readonly h?: number }> = ({
  at,
  children,
  h = ROW_H,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [f(at), f(at) + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ height: h * p, overflow: "hidden" }}>
      <div style={{ height: h, display: "flex", alignItems: "center" }}>{children}</div>
    </div>
  );
};

const Dashed = () => (
  <div style={{ borderTop: `3px dashed ${INK}55`, margin: "10px 0" }} />
);

// Thermal receipt that prints one cost per beat and turns into the big total.
export const Receipt: React.FC = () => {
  const frame = useCurrentFrame();
  const subtotal =
    interpolate(frame, [f(CUE.linhaTempo), f(CUE.linhaTempo) + 14], [0, 550], clamp) +
    interpolate(frame, [f(CUE.linhaPedido), f(CUE.linhaPedido) + 14], [0, 320], clamp);

  const toTotal = interpolate(frame, [f(PHASE.total.from), f(PHASE.total.from) + 18], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const exit = interpolate(frame, [f(PHASE.total.to) - 14, f(PHASE.total.to)], [0, 1], clamp);
  const monthly = interpolate(frame, [f(CUE.mes), f(CUE.mes) + 30], [0, 870], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const yearHit = f(CUE.ano);
  const year = interpolate(frame, [yearHit, yearHit + 22], [0, 10440], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        width: 780,
        top: interpolate(toTotal, [0, 1], [1050, 330]),
        scale: interpolate(toTotal, [0, 1], [1, 1.08]),
        transformOrigin: "top center",
        opacity:
          interpolate(frame, [f(CUE.tear), f(CUE.tear) + 6], [0, 1], clamp) * (1 - exit),
        filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))",
      }}
    >
      <div
        style={{
          backgroundColor: PAPER,
          color: INK,
          fontFamily: MONO,
          padding: "26px 36px 18px",
          borderRadius: "10px 10px 0 0",
        }}
      >
        <Row at={CUE.tear} h={96}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: 4 }}>CONTA DA PLANILHA</div>
            <div style={{ fontSize: 22, letterSpacing: 6, opacity: 0.6, marginTop: 6 }}>*** EXEMPLO ***</div>
          </div>
        </Row>
        <Dashed />
        {ITEMS.map((it) => (
          <Row key={it.name} at={it.at}>
            <div style={{ display: "flex", width: "100%", alignItems: "baseline", gap: 10, fontSize: 27 }}>
              <span style={{ whiteSpace: "nowrap" }}>{it.name}</span>
              <span style={{ flex: 1, borderBottom: `3px dotted ${INK}44`, transform: "translateY(-6px)" }} />
              <span style={{ fontWeight: 600, color: it.color, whiteSpace: "nowrap" }}>{it.value}</span>
            </div>
          </Row>
        ))}
        <Dashed />
        <Row at={CUE.linhaTempo}>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", fontSize: 30, fontWeight: 600 }}>
            <span>SUBTOTAL / MÊS</span>
            <span>{brl(subtotal)}</span>
          </div>
        </Row>

        <div style={{ height: interpolate(toTotal, [0, 1], [0, 330]), overflow: "hidden" }}>
          <div style={{ borderTop: `4px solid ${INK}`, marginTop: 12, paddingTop: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 40,
                fontWeight: 600,
                opacity: interpolate(frame, [f(CUE.mes), f(CUE.mes) + 6], [0, 1], clamp),
              }}
            >
              <span>TOTAL / MÊS</span>
              <span>≈ {brl(monthly)}</span>
            </div>
            <div
              style={{
                marginTop: 30,
                padding: "22px 0",
                textAlign: "center",
                borderRadius: 14,
                backgroundColor: INK,
                color: PAPER,
                opacity: interpolate(frame, [yearHit, yearHit + 3], [0, 1], clamp),
                scale: interpolate(frame, [yearHit, yearHit + 10], [1.25, 1], {
                  ...clamp,
                  easing: EASE,
                  output: "perceptual-scale",
                }),
              }}
            >
              <div style={{ fontSize: 26, letterSpacing: 6, opacity: 0.7 }}>POR ANO</div>
              <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: -2, color: "#FF5C7A" }}>
                {brl(year)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg width={780} height={22} viewBox="0 0 780 22" style={{ display: "block" }}>
        <path
          d={`M0 0 ${Array.from({ length: 27 }, (_, i) => `L${i * 30 + 15} 20 L${(i + 1) * 30} 0`).join(" ")} Z`}
          fill={PAPER}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: -34,
          right: -18,
          padding: "6px 14px",
          backgroundColor: "rgba(245,242,234,0.92)",
          border: `4px solid ${C.red}`,
          borderRadius: 10,
          color: C.red,
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: 3,
          rotate: "12deg",
          opacity: interpolate(frame, [f(CUE.exemplo), f(CUE.exemplo) + 4], [0, 0.9], clamp),
          scale: interpolate(frame, [f(CUE.exemplo), f(CUE.exemplo) + 8], [1.6, 1], { ...clamp, easing: EASE }),
        }}
      >
        EXEMPLO
      </div>
    </div>
  );
};
