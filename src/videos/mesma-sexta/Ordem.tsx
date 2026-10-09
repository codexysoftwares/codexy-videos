import { Easing } from "remotion";
import { MONO, SANS } from "../../shared/theme";
import { Fechamento } from "./Caos";
import { T } from "./timeline";
import { AppDot, Bubble, IconBag, IconChat, IconCheck, K, Panel, at, life, lin } from "./Ui";

// The same Friday, with one system: each event resolves itself.

const Reserva = ({ t }: { t: number }) => {
  const o = life(t, T.ordemReserva, T.ordemPedido);
  if (o <= 0) return null;
  const p1 = at(t, [T.ordemReserva + 0.1, T.ordemReserva + 0.3], [0, 1]);
  const typing = t > T.ordemReserva + 0.35 && t < T.botResponde;
  const p2 = at(t, [T.botResponde, T.botResponde + 0.22], [0, 1]);
  const mapa = at(t, [T.sozinha - 0.15, T.sozinha + 0.15], [0, 1]);
  return (
    <div style={{ opacity: o, translate: `0px ${(1 - o) * 60}px` }}>
      <Panel tone="day" style={{ top: 360, height: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "28px 34px", borderBottom: `2px solid ${K.line}` }}>
          <AppDot color={K.whats} size={72}>
            <IconChat size={38} />
          </AppDot>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 40, fontWeight: 800 }}>Carla</div>
            <div style={{ fontSize: 28, color: K.inkSoft }}>{typing ? "Atendimento automático digitando…" : "Reserva · 8 pessoas"}</div>
          </div>
        </div>
        <div style={{ padding: 34, display: "grid", gap: 22 }}>
          <div style={{ opacity: p1 }}>
            <Bubble side="in" tone="day" time="18:02">
              Oi! Tem mesa pra 8 nessa sexta?
            </Bubble>
          </div>
          <div style={{ opacity: p2, translate: `0px ${(1 - p2) * 30}px` }}>
            <Bubble side="out" tone="day" time="18:02" read>
              Tem sim! Reservei sexta, 20h, pra 8 pessoas. Te lembro no dia.
            </Bubble>
          </div>
        </div>
      </Panel>
      {/* table map: table 8 turns "reserved" */}
      <Panel tone="day" style={{ top: 950, padding: "26px 34px", opacity: mapa, translate: `0px ${(1 - mapa) * 40}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: K.inkSoft, width: 190 }}>MAPA DO SALÃO</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[5, 6, 7, 8, 9].map((n) => {
              const on = n === 8 && t > T.sozinha;
              return (
                <div
                  key={n}
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 18,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: MONO,
                    fontSize: 36,
                    fontWeight: 600,
                    background: on ? K.blue : "#EFE6D7",
                    color: on ? "#fff" : K.inkSoft,
                    scale: on ? `${at(t, [T.sozinha, T.sozinha + 0.25], [1.25, 1], Easing.out(Easing.back(2)))}` : "1",
                  }}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    </div>
  );
};

const Ticket = ({ origem, cor, titulo, itens, desde, t }: { origem: string; cor: string; titulo: string; itens: string; desde: number; t: number }) => {
  const secs = Math.max(0, Math.floor((t - desde) * 20));
  return (
    <div style={{ padding: "26px 30px", borderRadius: 28, background: "#1C1612", color: "#F4ECDD", border: "3px solid #21B26B", fontFamily: SANS }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 26, padding: "4px 12px", borderRadius: 8, background: cor, color: "#fff", letterSpacing: 2 }}>{origem}</span>
        <span style={{ fontFamily: MONO, fontSize: 40, color: "#21B26B" }}>
          {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
        </span>
      </div>
      <div style={{ fontSize: 42, fontWeight: 800, marginTop: 14 }}>{titulo}</div>
      <div style={{ fontSize: 32, opacity: 0.75, marginTop: 4 }}>{itens}</div>
    </div>
  );
};

const Pedido = ({ t }: { t: number }) => {
  const o = life(t, T.ordemPedido, T.ordemPreco);
  if (o <= 0) return null;
  const s1 = T.ordemPedido + 0.35;
  const s2 = T.cozinha - 0.2;
  const drop = (s: number) => at(t, [s, s + 0.35], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ opacity: o }}>
      <Panel tone="day" style={{ top: 360, padding: "26px 34px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <AppDot color={K.blue} size={72}>
            <IconBag size={38} />
          </AppDot>
          <div>
            <div style={{ fontSize: 28, color: K.inkSoft, letterSpacing: 1 }}>SITE DE PEDIDOS · SEM COMISSÃO</div>
            <div style={{ fontSize: 42, fontWeight: 800 }}>Pedido #4821 · pago no Pix</div>
          </div>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 80, top: 560, width: 920, fontFamily: MONO, fontSize: 28, letterSpacing: 3, color: K.inkSoft, textAlign: "center", opacity: at(t, [s1 - 0.1, s1 + 0.1], [0, 1]) }}>
        ↓ DIRETO NA TELA DA COZINHA
      </div>
      <div style={{ position: "absolute", left: 80, top: 630, width: 920, display: "grid", gap: 22 }}>
        <div style={{ opacity: drop(s1), translate: `0px ${(1 - drop(s1)) * -120}px` }}>
          <Ticket origem="SITE" cor={K.blue} titulo="Tábua mista" itens="+ 2 chopes 1L" desde={s1} t={t} />
        </div>
        <div style={{ opacity: drop(s2), translate: `0px ${(1 - drop(s2)) * -120}px` }}>
          <Ticket origem="APP" cor={K.delivery} titulo="2× Porção de tilápia" itens="mesma fila, sem redigitar" desde={s2} t={t} />
        </div>
      </div>
    </div>
  );
};

const DESTINOS = ["Caixa", "Site de pedidos", "Cardápio"];

const Preco = ({ t }: { t: number }) => {
  const o = life(t, T.ordemPreco, T.ordemCaixa);
  if (o <= 0) return null;
  const pulse = lin(t, [T.umSo - 0.35, T.umSo + 0.1], [0, 1]);
  return (
    <div style={{ opacity: o, fontFamily: SANS, color: K.ink }}>
      <Panel tone="day" style={{ top: 360, padding: "30px 36px", border: `3px solid ${K.blue}` }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: K.blue }}>GESTÃO · PREÇO</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
          <span style={{ fontSize: 44, fontWeight: 800 }}>Porção de tilápia</span>
          <span style={{ fontFamily: MONO, fontSize: 56 }}>R$ 159,00</span>
        </div>
      </Panel>
      {/* connecting lines with a pulse travelling down */}
      <svg style={{ position: "absolute", left: 0, top: 540, width: 1080, height: 160 }}>
        {[230, 540, 850].map((x, i) => (
          <g key={i}>
            <line x1={540} y1={0} x2={x} y2={150} stroke={K.line} strokeWidth={6} />
            <circle cx={540 + (x - 540) * pulse} cy={150 * pulse} r={14} fill={K.blue} opacity={pulse > 0 && pulse < 1 ? 1 : 0} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 60, top: 700, width: 960, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {DESTINOS.map((d, i) => {
          const ok = t > T.umSo + i * 0.08;
          const q = at(t, [T.ordemPreco + 0.2 + i * 0.1, T.ordemPreco + 0.4 + i * 0.1], [0, 1]);
          return (
            <div
              key={d}
              style={{
                opacity: q,
                padding: "26px 18px",
                borderRadius: 28,
                background: K.paper,
                border: `3px solid ${ok ? K.green : K.line}`,
                textAlign: "center",
                scale: ok ? `${at(t, [T.umSo + i * 0.08, T.umSo + i * 0.08 + 0.25], [1.12, 1], Easing.out(Easing.back(2)))}` : "1",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: K.inkSoft }}>{d}</div>
              <div style={{ fontFamily: MONO, fontSize: 40, marginTop: 10, color: ok ? K.ink : "#B9AC9C" }}>{ok ? "159,00" : "···"}</div>
              <div style={{ height: 50, display: "grid", placeItems: "center", marginTop: 8 }}>{ok ? <IconCheck size={44} color={K.green} /> : null}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OrderScene = ({ t }: { t: number }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Reserva t={t} />
    <Pedido t={t} />
    <Preco t={t} />
    <Fechamento t={t} from={T.ordemCaixa} to={T.cta + 0.6} ok />
  </div>
);
