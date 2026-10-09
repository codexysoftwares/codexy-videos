import { Easing, interpolate } from "remotion";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";

// Each screen fills a 920×1080 panel; `t` is the frame count since the screen appeared.
type S = { readonly t: number };

const RED = "#E5484D";
const HAND = "'Segoe Print', 'Comic Sans MS', cursive";
const pop = (t: number, at: number, len = 10) =>
  interpolate(t, [at, at + len], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
const fade = (t: number, at: number, len = 8) => interpolate(t, [at, at + len], [0, 1], clamp);

const Card: React.FC<{ readonly children: React.ReactNode; readonly bg?: string; readonly style?: React.CSSProperties }> = ({
  children,
  bg = "#0E1A33",
  style,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 44,
      overflow: "hidden",
      backgroundColor: bg,
      boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
      fontFamily: SANS,
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

const Header: React.FC<{ readonly title: string; readonly color: string; readonly right?: React.ReactNode }> = ({ title, color, right }) => (
  <div style={{ height: 110, backgroundColor: color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
    <div style={{ fontSize: 42, fontWeight: 800, color: "#FFFFFF" }}>{title}</div>
    {right}
  </div>
);

// ── Agenda ───────────────────────────────────────────────────────────────
export const AgendaAntes: React.FC<S> = ({ t }) => (
  <Card bg="#F3EFE4">
    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 78px, #C9D8EE 78px 81px)", opacity: 0.8 }} />
    <div style={{ position: "absolute", left: 110, top: 0, bottom: 0, width: 3, backgroundColor: "#E8A0A0" }} />
    <div style={{ position: "absolute", left: 150, top: 60, right: 60, fontFamily: HAND, color: "#2B3A67", fontSize: 44, lineHeight: "81px" }}>
      {[
        { txt: "08h  ~~Sr. João~~ remarcou", strike: true },
        { txt: "09h  Ana (ou era 10h?)", strike: false },
        { txt: "10h  ~~Paula~~ ~~Marcos~~", strike: true },
        { txt: "11h  ???", strike: false },
        { txt: "14h  Célia — ligar antes!!", strike: false },
        { txt: "15h  ~~Rita~~ faltou", strike: true },
        { txt: "16h  encaixe?", strike: false },
      ].map((l, i) => (
        <div key={i} style={{ opacity: fade(t, i * 2), whiteSpace: "nowrap", textDecoration: l.strike ? "line-through" : "none", textDecorationColor: RED, textDecorationThickness: 4 }}>
          {l.txt.replace(/~~/g, "")}
        </div>
      ))}
    </div>
    {[
      { x: 520, y: 640, r: 8, txt: "ligar Dona Célia!!" },
      { x: 120, y: 760, r: -6, txt: "confirmar amanhã" },
    ].map((n, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: n.x,
          top: n.y,
          width: 300,
          padding: "30px 24px",
          backgroundColor: "#FFE27A",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
          fontFamily: HAND,
          fontSize: 34,
          color: "#3A3A3A",
          rotate: `${n.r + Math.sin(t / 7 + i) * 1.5}deg`,
          scale: pop(t, 8 + i * 5),
        }}
      >
        {n.txt}
      </div>
    ))}
    <svg width={920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <ellipse cx={330} cy={385} rx={150} ry={50} fill="none" stroke={RED} strokeWidth={6} strokeDasharray={1000} strokeDashoffset={interpolate(t, [12, 30], [1000, 0], clamp)} />
    </svg>
  </Card>
);

const SLOTS = [
  { day: 0, start: 0, len: 1, name: "Ana", color: "#2F6BFF" },
  { day: 0, start: 2, len: 2, name: "Célia", color: "#21B26B" },
  { day: 1, start: 1, len: 1, name: "João", color: "#F5A524" },
  { day: 1, start: 3, len: 1, name: "Rita", color: "#2F6BFF" },
  { day: 2, start: 0, len: 2, name: "Marcos", color: "#B26BFF" },
  { day: 2, start: 4, len: 1, name: "Paula", color: "#21B26B" },
  { day: 3, start: 1, len: 2, name: "Bia", color: "#2F6BFF" },
  { day: 3, start: 4, len: 1, name: "Léo", color: "#F5A524" },
];

export const AgendaDepois: React.FC<S> = ({ t }) => (
  <Card bg="#FFFFFF">
    <Header title="Agenda" color={C.blue} right={<div style={{ fontFamily: MONO, fontSize: 24, color: "#FFFFFF", letterSpacing: 2 }}>SEMANA 41</div>} />
    <div style={{ display: "flex", padding: "30px 30px 0 110px", gap: 14, fontFamily: MONO, fontSize: 24, color: "#5A6585" }}>
      {["SEG", "TER", "QUA", "QUI"].map((d) => (
        <div key={d} style={{ flex: 1, textAlign: "center" }}>{d}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 30, top: 200, fontFamily: MONO, fontSize: 22, color: "#8A93A6", lineHeight: "150px" }}>
      {["08h", "10h", "12h", "14h", "16h", "18h"].map((h) => (
        <div key={h}>{h}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 110, right: 30, top: 200, bottom: 40 }}>
      {SLOTS.map((s, i) => {
        const p = pop(t, 3 + i * 2);
        return (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: `calc(${s.day * 25}% + 7px)`,
              width: "calc(25% - 14px)",
              top: s.start * 150 + 8,
              height: s.len * 150 - 16,
              borderRadius: 18,
              backgroundColor: `${s.color}1F`,
              borderLeft: `8px solid ${s.color}`,
              padding: "14px 14px",
              fontSize: 30,
              fontWeight: 700,
              color: "#0E1A33",
              scale: p,
              opacity: p,
            }}
          >
            {s.name}
            <div style={{ fontSize: 20, fontWeight: 500, color: "#21B26B", marginTop: 6 }}>✓ confirmado</div>
          </div>
        );
      })}
    </div>
  </Card>
);

// ── Mensagens ────────────────────────────────────────────────────────────
const CHATS = [
  { name: "Cliente 1", msg: "Oi, tem horário hoje?", n: 47 },
  { name: "Cliente 2", msg: "Alguém pode responder?", n: 12 },
  { name: "Cliente 3", msg: "Qual o valor?", n: 8 },
  { name: "Cliente 4", msg: "Ainda tá aberto??", n: 6 },
  { name: "Cliente 5", msg: "Preciso remarcar", n: 5 },
  { name: "Cliente 6", msg: "???", n: 3 },
];

export const MensagensAntes: React.FC<S> = ({ t }) => (
  <Card bg="#FFFFFF">
    <Header title="Mensagens" color="#1F7A5C" right={<div style={{ backgroundColor: RED, color: "#FFFFFF", borderRadius: 999, padding: "6px 18px", fontSize: 30, fontWeight: 800, scale: 1 + Math.max(0, Math.sin(t / 3)) * 0.08 }}>81</div>} />
    {CHATS.map((c, i) => (
      <div
        key={c.name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "24px 36px",
          borderBottom: "2px solid #EEF1F5",
          opacity: fade(t, i * 2),
          translate: `0px ${interpolate(t, [i * 2, i * 2 + 10], [-40, 0], { ...clamp, easing: EASE })}px`,
        }}
      >
        <div style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: "#D7DEE8" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#0E1A33" }}>{c.name}</div>
          <div style={{ fontSize: 28, color: "#6B7280" }}>{c.msg}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, color: "#21B26B", fontWeight: 700 }}>visto há {3 + i}h</div>
          <div style={{ marginTop: 8, display: "inline-block", minWidth: 50, padding: "4px 12px", borderRadius: 999, backgroundColor: "#25D366", color: "#FFFFFF", fontSize: 26, fontWeight: 800, textAlign: "center" }}>
            {c.n + Math.floor(t / 12)}
          </div>
        </div>
      </div>
    ))}
  </Card>
);

export const MensagensDepois: React.FC<S> = ({ t }) => {
  const msgs = [
    { me: false, txt: "Oi, tem horário amanhã?", at: 0 },
    { me: true, txt: "Tenho às 9h e às 14h. Qual prefere?", at: 8 },
    { me: false, txt: "9h!", at: 22 },
    { me: true, txt: "Pronto, agendado ✓ Te lembro amanhã cedo.", at: 30 },
  ];
  return (
    <Card bg="#ECE5DD">
      <Header
        title="Atendimento"
        color="#1F7A5C"
        right={<div style={{ fontFamily: MONO, fontSize: 22, color: "#DFF7EC", letterSpacing: 1 }}>● responde em 2s</div>}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: 40 }}>
        {msgs.map((m) => (
          <div
            key={m.txt}
            style={{
              alignSelf: m.me ? "flex-end" : "flex-start",
              maxWidth: "78%",
              padding: "24px 30px",
              borderRadius: m.me ? "30px 30px 8px 30px" : "30px 30px 30px 8px",
              backgroundColor: m.me ? "#DCF8C6" : "#FFFFFF",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              fontSize: 36,
              fontWeight: 600,
              color: "#0E1A33",
              scale: pop(t, m.at, 8),
              transformOrigin: m.me ? "right bottom" : "left bottom",
            }}
          >
            {m.txt}
            {m.me ? <div style={{ fontSize: 20, color: "#2F6BFF", textAlign: "right", marginTop: 6 }}>✓✓ automático</div> : null}
          </div>
        ))}
      </div>
    </Card>
  );
};

// ── Planilha / painel ───────────────────────────────────────────────────
export const PlanilhaAntes: React.FC<S> = ({ t }) => (
  <Card bg="#FFFFFF">
    <div style={{ height: 90, backgroundColor: "#1D6F42", display: "flex", alignItems: "center", padding: "0 34px", fontFamily: MONO, fontSize: 28, color: "#FFFFFF" }}>
      vendas_FINAL_v7 (2).xlsx
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "70px repeat(4, 1fr)", fontFamily: MONO, fontSize: 26 }}>
      {Array.from({ length: 14 * 5 }).map((_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const bad = (row * 7 + col * 3) % 9 === 0 && col > 0;
        const err = (row * 5 + col) % 13 === 4 && col > 0;
        return (
          <div
            key={i}
            style={{
              height: 66,
              borderRight: "1px solid #D9DEE7",
              borderBottom: "1px solid #D9DEE7",
              backgroundColor: col === 0 ? "#F1F3F7" : bad ? `rgba(229,72,77,${0.25 + 0.2 * Math.sin(t / 4 + i)})` : "#FFFFFF",
              color: err ? RED : "#334",
              display: "flex",
              alignItems: "center",
              justifyContent: col === 0 ? "center" : "flex-end",
              padding: "0 12px",
              fontWeight: err ? 700 : 400,
            }}
          >
            {col === 0 ? row + 1 : err ? "#REF!" : bad ? "???" : (row * 137 + col * 59) % 900}
          </div>
        );
      })}
    </div>
  </Card>
);

const BARS = [0.4, 0.55, 0.48, 0.66, 0.6, 0.82, 1];

export const PlanilhaDepois: React.FC<S> = ({ t }) => (
  <Card bg="#0B1530">
    <div style={{ padding: "40px 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 46, fontWeight: 800, color: "#FFFFFF" }}>Vendas</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 24, color: C.green }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.green, opacity: 0.4 + Math.abs(Math.sin(t / 6)) * 0.6 }} />
        AO VIVO
      </div>
    </div>
    <div style={{ display: "flex", gap: 20, padding: "0 40px" }}>
      {[
        { l: "Hoje", v: Math.round(interpolate(t, [0, 30], [0, 48], clamp)), c: "#FFFFFF" },
        { l: "Meta", v: `${Math.round(interpolate(t, [0, 30], [0, 92], clamp))}%`, c: C.green },
        { l: "Ticket", v: "↑", c: C.glow },
      ].map((k) => (
        <div key={k.l} style={{ flex: 1, padding: 26, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 26, color: C.muted }}>{k.l}</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: k.c, fontVariantNumeric: "tabular-nums" }}>{k.v}</div>
        </div>
      ))}
    </div>
    <div style={{ margin: 40, height: 360, display: "flex", alignItems: "flex-end", gap: 22, padding: 30, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.04)" }}>
      {BARS.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h * 100}%`,
            borderRadius: "14px 14px 6px 6px",
            background: i === BARS.length - 1 ? `linear-gradient(180deg, ${C.glow}, ${C.blue})` : "rgba(51,119,255,0.4)",
            transformOrigin: "bottom",
            scale: `1 ${interpolate(t, [i * 2, i * 2 + 14], [0, 1], { ...clamp, easing: EASE })}`,
          }}
        />
      ))}
    </div>
    <svg width={840} height={180} viewBox="0 0 840 180" style={{ marginLeft: 40 }}>
      <path
        d="M0 150 C 90 140, 140 90, 230 100 S 380 40, 470 60 S 640 20, 840 10"
        fill="none"
        stroke={C.green}
        strokeWidth={6}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={interpolate(t, [4, 34], [1, 0], { ...clamp, easing: EASE })}
      />
    </svg>
  </Card>
);

// ── Caixa ────────────────────────────────────────────────────────────────
export const CaixaAntes: React.FC<S> = ({ t }) => (
  <Card bg="#2A2420">
    {[
      { x: 80, y: 120, r: -12, txt: "R$ 120,00 ?" },
      { x: 460, y: 90, r: 8, txt: "pix ???" },
      { x: 520, y: 520, r: -5, txt: "troco 35" },
      { x: 90, y: 700, r: 10, txt: "conferir!!" },
      { x: 500, y: 820, r: -9, txt: "R$ ???" },
    ].map((n, i) => (
      <div
        key={n.txt}
        style={{
          position: "absolute",
          left: n.x,
          top: n.y,
          width: 300,
          padding: "26px 22px",
          backgroundColor: "#FAF7EF",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          fontFamily: HAND,
          fontSize: 38,
          color: "#3A3A3A",
          rotate: `${n.r + Math.sin(t / 6 + i) * 2}deg`,
          scale: pop(t, i * 3),
        }}
      >
        {n.txt}
      </div>
    ))}
    <div
      style={{
        position: "absolute",
        left: 250,
        top: 300,
        width: 420,
        padding: 30,
        borderRadius: 36,
        backgroundColor: "#22252E",
        boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
        rotate: "-4deg",
      }}
    >
      <div style={{ height: 110, borderRadius: 16, backgroundColor: "#9FB59A", fontFamily: MONO, fontSize: 56, color: "#22252E", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 20px" }}>
        {Math.floor(t / 3) % 2 ? "E" : "88.0?"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 24 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ height: 64, borderRadius: 14, backgroundColor: i % 4 === 3 ? "#E86A2C" : "#3A3E4A" }} />
        ))}
      </div>
    </div>
  </Card>
);

export const CaixaDepois: React.FC<S> = ({ t }) => (
  <Card bg="#FFFFFF">
    <Header title="Caixa do dia" color="#0E1A33" right={<div style={{ fontFamily: MONO, fontSize: 24, color: "#9CC2FF" }}>18:00</div>} />
    <div style={{ padding: "36px 44px", display: "flex", flexDirection: "column", gap: 24 }}>
      {[
        { l: "Entradas", v: "conferidas", c: "#21B26B" },
        { l: "Saídas", v: "conferidas", c: "#21B26B" },
        { l: "Pix e cartões", v: "conciliados", c: "#21B26B" },
        { l: "Diferença", v: "R$ 0,00", c: "#0E1A33" },
      ].map((r, i) => (
        <div
          key={r.l}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "26px 30px",
            borderRadius: 22,
            backgroundColor: "#F3F6FB",
            fontSize: 36,
            fontWeight: 700,
            color: "#0E1A33",
            opacity: fade(t, i * 3),
            translate: `${interpolate(t, [i * 3, i * 3 + 12], [60, 0], { ...clamp, easing: EASE })}px 0px`,
          }}
        >
          <span>{r.l}</span>
          <span style={{ color: r.c }}>{r.v}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "26px 44px",
          borderRadius: 999,
          backgroundColor: "#21B26B",
          color: "#FFFFFF",
          fontSize: 44,
          fontWeight: 800,
          boxShadow: "0 20px 50px rgba(33,178,107,0.45)",
          scale: pop(t, 16, 12),
        }}
      >
        ✓ Caixa fechado
      </div>
    </div>
  </Card>
);
