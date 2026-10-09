import { Easing } from "remotion";
import { MONO, SANS } from "../../shared/theme";
import { T } from "./timeline";
import { AppDot, Bubble, IconBag, IconBox, IconChat, IconUser, IconX, K, Notif, Panel, Stamp, at, life, lin, shake } from "./Ui";

// The first Friday: everything happens at once and nothing connects.
// Pure function of story time `t` (seconds), so the rewind can play it backwards.

const NOTIFS = [
  { app: "WhatsApp", color: K.whats, icon: <IconChat />, title: "Carla", text: "Oi! Tem mesa pra 8 nessa sexta?", time: "21:47" },
  { app: "Delivery", color: K.delivery, icon: <IconBag />, title: "Novo pedido #4821", text: "Tábua mista + 2 chopes 1L", time: "21:47" },
  { app: "WhatsApp", color: K.whats, icon: <IconChat />, title: "Rafael", text: "cadê meu pedido??", time: "21:48" },
  { app: "Garçom", color: "#6B5B4E", icon: <IconUser />, title: "Mesa 12", text: "pediu a conta faz 15 min", time: "21:48" },
  { app: "Delivery", color: K.delivery, icon: <IconBag />, title: "Novo pedido #4822", text: "2 porções de tilápia", time: "21:49" },
  { app: "WhatsApp", color: K.whats, icon: <IconChat />, title: "Júlia", text: "vocês abrem amanhã cedo?", time: "21:49" },
  { app: "Estoque", color: "#B7791F", icon: <IconBox />, title: "Chope pilsen", text: "acabou o barril e ninguém avisou", time: "21:50" },
];
export const NOTIF_TIMES = NOTIFS.map((_, i) => 0.02 + i * 0.32);

const CARD_H = 172;

const Hook = ({ t }: { t: number }) => {
  const out = at(t, [T.hookEnd - 0.15, T.hookEnd + 0.2], [1, 0], Easing.in(Easing.cubic));
  if (out <= 0) return null;
  const arrived = NOTIF_TIMES.filter((s) => t >= s).length;
  return (
    <div style={{ position: "absolute", left: 80, top: 360, width: 920, height: 900, opacity: out, scale: `${1 + (1 - out) * 0.15}`, filter: `blur(${(1 - out) * 14}px)` }}>
      {NOTIFS.map((n, i) => {
        const s = NOTIF_TIMES[i];
        if (t < s) return null;
        const p = at(t, [s, s + 0.22], [0, 1], Easing.out(Easing.back(1.4)));
        const depth = arrived - 1 - i; // 0 = newest, on top
        const y = depth * (CARD_H * 0.62) + (1 - p) * -260;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: y,
              zIndex: 100 - depth,
              opacity: p * (1 - depth * 0.12),
              scale: `${1 - depth * 0.035}`,
              filter: depth > 0 ? `brightness(${1 - depth * 0.1})` : "none",
            }}
          >
            <Notif {...n} />
          </div>
        );
      })}
    </div>
  );
};

const SemResposta = ({ t }: { t: number }) => {
  const o = life(t, T.caosReserva, T.caosPedido);
  if (o <= 0) return null;
  const msgs = [
    { at: T.caosReserva, text: "Oi! Tem mesa pra 8 nessa sexta?", time: "21:47" },
    { at: T.caosReserva + 0.55, text: "??", time: "22:05" },
    { at: T.caosReserva + 1.1, text: "Deixa, vamos em outro lugar.", time: "22:31" },
  ];
  return (
    <Panel tone="night" style={{ top: 380, height: 760, opacity: o, translate: `0px ${(1 - o) * 60}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "30px 34px", borderBottom: `2px solid ${K.nightLine}` }}>
        <AppDot color={K.whats} size={72}>
          <IconChat size={38} />
        </AppDot>
        <div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>Carla</div>
          <div style={{ fontSize: 28, opacity: 0.55 }}>Reserva · 8 pessoas</div>
        </div>
      </div>
      <div style={{ padding: 34, display: "grid", gap: 22 }}>
        {msgs.map((m) => {
          const p = at(t, [m.at, m.at + 0.2], [0, 1]);
          return p > 0 ? (
            <div key={m.time} style={{ opacity: p, translate: `0px ${(1 - p) * 30}px` }}>
              <Bubble side="in" tone="night" time={m.time}>
                {m.text}
              </Bubble>
            </div>
          ) : null;
        })}
      </div>
      <div style={{ position: "absolute", bottom: 46, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Stamp text="SEM RESPOSTA" color={K.red} t={t} from={T.caosReserva + 1.35} />
      </div>
    </Panel>
  );
};

const PDV_TEXT = "TABUA MSITA + 2 CHPOE";

const Redigitado = ({ t }: { t: number }) => {
  const o = life(t, T.caosPedido, T.caosPreco);
  if (o <= 0) return null;
  const typed = Math.floor(lin(t, [T.caosPedido + 0.7, T.caosPedido + 2.2], [0, PDV_TEXT.length]));
  const cursor = Math.floor(t * 4) % 2 === 0;
  return (
    <div style={{ opacity: o, translate: `0px ${(1 - o) * 60}px` }}>
      <Panel tone="night" style={{ top: 380, padding: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <AppDot color={K.delivery} size={72}>
            <IconBag size={38} />
          </AppDot>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, opacity: 0.55, letterSpacing: 1 }}>TABLET DO DELIVERY</div>
            <div style={{ fontSize: 42, fontWeight: 800 }}>Novo pedido #4821</div>
          </div>
        </div>
        <div style={{ fontSize: 38, marginTop: 22, lineHeight: 1.4, opacity: 0.9 }}>
          1× Tábua mista
          <br />
          2× Chope 1L
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 540 - 18, top: 742, color: K.amber, fontSize: 56, fontFamily: MONO, opacity: at(t, [T.caosPedido + 0.4, T.caosPedido + 0.6], [0, 1]) }}>↓</div>
      <Panel tone="night" style={{ top: 830, padding: 34, background: "#121A14", border: "2px solid #2B3A2F" }}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: "#7FA88A", letterSpacing: 2 }}>CAIXA · DIGITANDO NA MÃO</div>
        <div style={{ fontFamily: MONO, fontSize: 50, color: "#C8F0D2", marginTop: 18, minHeight: 64 }}>
          {PDV_TEXT.slice(0, typed)}
          <span style={{ opacity: cursor ? 1 : 0 }}>▌</span>
        </div>
        <div style={{ marginTop: 22, height: 70, display: "flex", alignItems: "center" }}>
          <Stamp text="REDIGITADO" color={K.red} t={t} from={T.caosPedido + 2.3} rotate={-4} />
        </div>
      </Panel>
    </div>
  );
};

const PRECOS = [
  { onde: "Caixa", valor: "159,00" },
  { onde: "App de delivery", valor: "179,00" },
  { onde: "Instagram", valor: "170,00" },
];

const TresPrecos = ({ t }: { t: number }) => {
  const o = life(t, T.caosPreco, T.caosCaixa);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 380, width: 920, opacity: o, fontFamily: SANS, color: "#F4ECDD" }}>
      <div style={{ fontSize: 34, opacity: 0.6, letterSpacing: 1, textAlign: "center" }}>PORÇÃO DE TILÁPIA</div>
      <div style={{ display: "grid", gap: 26, marginTop: 30 }}>
        {PRECOS.map((p, i) => {
          const s = T.caosPreco + 0.1 + i * 0.28;
          const q = at(t, [s, s + 0.22], [0, 1], Easing.out(Easing.back(1.6)));
          const flick = Math.sin((t - s) * 40) > 0.6 && t - s < 0.5 ? 0.6 : 1;
          return (
            <div
              key={p.onde}
              style={{
                opacity: q * flick,
                scale: `${0.85 + q * 0.15}`,
                rotate: `${[-2, 1.5, -1][i]}deg`,
                padding: "30px 36px",
                borderRadius: 32,
                background: K.nightCard,
                border: `2px solid ${K.nightLine}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 40, fontWeight: 700 }}>{p.onde}</span>
              <span style={{ fontFamily: MONO, fontSize: 56, color: K.red }}>R$ {p.valor}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40, gap: 40, opacity: at(t, [T.caosPreco + 1.0, T.caosPreco + 1.2], [0, 1]) }}>
        {[0, 1].map((i) => (
          <span key={i} style={{ fontFamily: MONO, fontSize: 90, color: K.red, fontWeight: 600 }}>
            ≠
          </span>
        ))}
      </div>
    </div>
  );
};

export const Fechamento = ({ t, from, to, ok }: { t: number; from: number; to: number; ok: boolean }) => {
  const o = life(t, from, to);
  if (o <= 0) return null;
  const tone = ok ? "day" : "night";
  const gaveta = ok ? "8.420,00" : "7.960,00";
  const diff = ok ? "R$ 0,00" : "− R$ 460,00";
  const showDiff = at(t, [from + 0.9, from + 1.1], [0, 1]);
  const color = ok ? K.green : K.red;
  return (
    <Panel tone={tone} style={{ top: 420, padding: 44, opacity: o, translate: `0px ${(1 - o) * 60}px` }}>
      <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 3, opacity: 0.6 }}>FECHAMENTO DO CAIXA · SEXTA</div>
      {[
        { l: "Sistema", v: "R$ 8.420,00", at: from + 0.2 },
        { l: "Na gaveta", v: `R$ ${gaveta}`, at: from + 0.5 },
      ].map((r) => (
        <div
          key={r.l}
          style={{ display: "flex", justifyContent: "space-between", marginTop: 34, fontSize: 46, opacity: at(t, [r.at, r.at + 0.2], [0, 1]), borderBottom: `2px solid ${ok ? K.line : K.nightLine}`, paddingBottom: 26 }}
        >
          <span style={{ fontWeight: 600 }}>{r.l}</span>
          <span style={{ fontFamily: MONO }}>{r.v}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 34, opacity: showDiff }}>
        <span style={{ fontSize: 46, fontWeight: 800 }}>Diferença</span>
        <span style={{ fontFamily: MONO, fontSize: 64, fontWeight: 600, color, opacity: ok ? 1 : 0.65 + 0.35 * Math.abs(Math.sin(t * 9)) }}>{diff}</span>
      </div>
      <div style={{ marginTop: 50, height: 90, display: "flex", justifyContent: "center" }}>
        {ok ? (
          <Stamp text="CAIXA FECHADO" color={K.green} t={t} from={T.batendo} rotate={-4} />
        ) : (
          <Stamp text="NÃO BATE" color={K.red} t={t} from={T.caosNaoBate} rotate={-6} />
        )}
      </div>
    </Panel>
  );
};

export const CHAOS_HITS = [...NOTIF_TIMES, T.caosReserva + 1.35, T.caosPedido + 2.3, T.caosPreco + 0.1, T.caosPreco + 0.38, T.caosPreco + 0.66, T.caosNaoBate];

export const ChaosScene = ({ t }: { t: number }) => {
  const s = shake(t, CHAOS_HITS, 12);
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${s.x}px ${s.y}px` }}>
      <Hook t={t} />
      <SemResposta t={t} />
      <Redigitado t={t} />
      <TresPrecos t={t} />
      <Fechamento t={t} from={T.caosCaixa} to={T.rewind + 2} ok={false} />
      {/* tiny red "x" counter of problems in the corner */}
      <div style={{ position: "absolute", right: 80, top: 300, display: "flex", gap: 10, opacity: at(t, [T.caosReserva, T.caosReserva + 0.2], [0, 1]) }}>
        {[T.caosReserva + 1.35, T.caosPedido + 2.3, T.caosPreco + 1.0, T.caosNaoBate].map((h, i) =>
          t >= h ? (
            <div key={i} style={{ width: 46, height: 46, borderRadius: 12, background: K.red, display: "grid", placeItems: "center", scale: `${at(t, [h, h + 0.2], [1.6, 1])}` }}>
              <IconX size={28} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};
