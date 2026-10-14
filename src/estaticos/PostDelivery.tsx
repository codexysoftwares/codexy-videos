import { MONO } from "../shared/theme";
import { BLUE, Check, INK, MINT, RED, SOFT, Slide, Title } from "./Slide";

// Single post (restaurant): where the money of a delivery-app order goes. Values are an illustrative SIMULATION.
const LINHAS = [
  { l: "Pedido do cliente", v: "R$ 80,00", tone: INK },
  { l: "Comissão do app (ex.: 23%)", v: "− R$ 18,40", tone: RED },
  { l: "Taxa de pagamento (ex.: 3,2%)", v: "− R$ 2,56", tone: RED },
];

export const PostDelivery = () => (
  <Slide tone="light" index={1} total={1}>
    <Title text={"R$ 80 de pedido.\n*Quanto fica com você?*"} size={84} top={80} accent={BLUE} />
    <div style={{ position: "absolute", left: 120, right: 120, top: 360, padding: "44px 44px 36px", background: "#FFFFFF", borderRadius: 16, boxShadow: "0 30px 70px rgba(14,27,51,0.14)", color: INK, fontFamily: MONO }}>
      {/* receipt */}
      <div style={{ textAlign: "center", fontSize: 26, letterSpacing: 4, color: SOFT }}>PEDIDO #4821 · DELIVERY</div>
      <div style={{ borderTop: "3px dashed #DCE5F0", margin: "24px 0" }} />
      {LINHAS.map((r) => (
        <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, fontSize: 28, padding: "12px 0" }}>
          <span style={{ color: SOFT }}>{r.l}</span>
          <span style={{ color: r.tone, fontWeight: 600, whiteSpace: "nowrap" }}>{r.v}</span>
        </div>
      ))}
      <div style={{ borderTop: "3px dashed #DCE5F0", margin: "20px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 34, fontWeight: 600 }}>
        <span>Fica com você</span>
        <span style={{ fontSize: 52 }}>R$ 59,04</span>
      </div>
      <div style={{ position: "absolute", right: 40, top: -22, padding: "6px 14px", borderRadius: 8, background: "#EEF2F8", fontSize: 20, letterSpacing: 2, color: SOFT }}>SIMULAÇÃO</div>
    </div>
    <div style={{ position: "absolute", left: 64, right: 64, top: 930, display: "flex", gap: 22, alignItems: "center", padding: "30px 34px", borderRadius: 30, background: "rgba(20,199,154,0.12)", border: `3px solid ${MINT}`, color: INK }}>
      <span style={{ width: 64, height: 64, borderRadius: 32, background: MINT, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Check size={38} />
      </span>
      <div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Site de pedidos próprio</div>
        <div style={{ fontSize: 30, color: SOFT, marginTop: 4 }}>O pedido vem direto pra você, sem comissão por pedido.</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 64, right: 64, top: 1150, fontFamily: MONO, fontSize: 24, color: SOFT }}>valores ilustrativos · diagnóstico gratuito no WhatsApp</div>
  </Slide>
);
