import { Easing } from "remotion";
import { at, lin, spr } from "../../shared/kit/motion";
import { MONO, SANS } from "../../shared/theme";

const SYS = "-apple-system, 'SF Pro Text', 'Helvetica Neue', 'Hanken Grotesk', Arial, sans-serif";
const INK = "#0E1B33";
const SOFT = "#6B7A93";
const LINE = "#DCE5F0";
const MINT = "#14C79A";

const Stars = ({ u, n }: { u: number; n: number }) => (
  <span style={{ color: "#F5A524", fontSize: 13 * u, letterSpacing: 1 * u }}>
    {"★★★★★".slice(0, Math.round(n))}
  </span>
);

/* -------- search on the phone: "dentista perto de mim" → two clinics -------- */
export const SearchScreen = ({ t, u, from, fps }: { t: number; u: number; from: number; fps: number }) => {
  const q = "dentista perto de mim";
  const typed = Math.floor(lin(t, [from + 0.1, from + 0.9], [0, q.length]));
  const res = (k: number) => spr(t, from + 1.05 + k * 0.18, fps, { damping: 16, stiffness: 170 });
  const rows = [
    { name: "Sua Clínica", meta: "Odontologia · 1,2 km", rate: 4.8, status: "Fechado · abre 8h", color: "#0EA5A5" },
    { name: "Clínica Sorriso", meta: "Odontologia · 1,5 km", rate: 4.7, status: "Responde no WhatsApp", color: "#7C3AED" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: SYS, color: INK }}>
      <div style={{ position: "absolute", top: 62 * u, left: 16 * u, right: 16 * u, height: 48 * u, borderRadius: 24 * u, background: "#F1F3F6", display: "flex", alignItems: "center", gap: 10 * u, padding: `0 ${16 * u}px`, fontSize: 17 * u }}>
        <svg width={18 * u} height={18 * u} viewBox="0 0 24 24" fill="none" stroke="#5F6B7A" strokeWidth={2.4} strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <span>
          {q.slice(0, typed)}
          <span style={{ display: "inline-block", width: 2 * u, height: 20 * u, marginLeft: u, verticalAlign: "middle", background: "#1A73E8", opacity: Math.floor(t * 3) % 2 ? 1 : 0 }} />
        </span>
      </div>
      {/* map strip */}
      <div style={{ position: "absolute", top: 124 * u, left: 0, right: 0, height: 210 * u, background: "linear-gradient(135deg, #E8F0E4, #DDE8F3)", overflow: "hidden", opacity: at(t, [from + 0.9, from + 1.1], [0, 1]) }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{ position: "absolute", left: -20 * u, right: -20 * u, top: (20 + i * 32) * u, height: 6 * u, background: "#FFFFFF", rotate: `${i % 2 ? -8 : 6}deg`, opacity: 0.8 }} />
        ))}
        {rows.map((r, k) => (
          <div key={r.name} style={{ position: "absolute", left: (120 + k * 140) * u, top: (60 + k * 40) * u, width: 30 * u, height: 30 * u, borderRadius: "50% 50% 50% 0", rotate: "-45deg", background: r.color, scale: `${res(k)}`, boxShadow: `0 ${4 * u}px ${8 * u}px rgba(0,0,0,0.2)` }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: 346 * u, left: 0, right: 0 }}>
        {rows.map((r, k) => {
          const p = res(k);
          return (
            <div key={r.name} style={{ display: "flex", gap: 12 * u, padding: `${14 * u}px ${16 * u}px`, borderBottom: `${u}px solid ${LINE}`, opacity: Math.min(1, p * 1.4), translate: `0px ${(1 - p) * 30 * u}px` }}>
              <div style={{ width: 56 * u, height: 56 * u, borderRadius: 12 * u, background: r.color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18 * u }}>{r.name.split(" ").map((x) => x[0]).join("")}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18 * u, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 13 * u, color: SOFT }}>
                  {r.rate.toLocaleString("pt-BR")} <Stars u={u} n={r.rate} /> · {r.meta}
                </div>
                <div style={{ fontSize: 13 * u, color: k === 0 ? "#D93025" : "#188038", fontWeight: 600, marginTop: 2 * u }}>{r.status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------- lock-screen notification over the morning footage -------- */
export const LockNotif = ({ t, from, fps }: { t: number; from: number; fps: number }) => {
  const p = spr(t, from, fps, { damping: 14, stiffness: 160 });
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 760, opacity: Math.min(1, p * 1.4), translate: `0px ${(1 - p) * -80}px`, scale: `${0.9 + 0.1 * p}` }}>
      <div style={{ padding: "26px 30px", borderRadius: 40, background: "rgba(245,245,247,0.82)", backdropFilter: "blur(30px)", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", display: "flex", gap: 22, alignItems: "center", fontFamily: SYS, color: "#111" }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: "#25D366", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <svg width={50} height={50} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#555", fontWeight: 600 }}>
            <span>WHATSAPP</span>
            <span>ontem, 21:52</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, marginTop: 2 }}>Ana</div>
          <div style={{ fontSize: 34, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Oi! Consegue me encaixar amanhã cedo?</div>
        </div>
      </div>
    </div>
  );
};

/* -------- the morning dashboard (browser window) -------- */
const KPIS = [
  { k: "recebidas", label: "Mensagens da noite", v: 37, hot: "tudo" },
  { k: "respondidas", label: "Respondidas na hora", v: 37, suffix: "", hot: "respondido" },
  { k: "marcados", label: "Horários marcados", v: 9, hot: "marcado" },
  { k: "equipe", label: "Para a equipe", v: 3, hot: "organizado" },
] as const;

const BARS = [3, 5, 8, 6, 4, 2, 1, 0, 0, 1, 2, 5, 9, 6];
const AGENDA = [
  { h: "08:00", who: "Ana · limpeza", novo: true },
  { h: "08:40", who: "Bruno · avaliação", novo: true },
  { h: "09:30", who: "Paula · retorno" },
  { h: "10:00", who: "Carla · clareamento", novo: true },
];
const FILA = ["Diego · convênio", "Elisa · orçamento de implante", "Fábio · remarcar"];

export const Dashboard = ({ t, from, fps, beats }: { t: number; from: number; fps: number; beats: Record<string, number> }) => {
  const inP = spr(t, from, fps, { damping: 16, stiffness: 110 });
  const hot = (key: string) => {
    const s = beats[key];
    return s === undefined ? 0 : at(t, [s - 0.05, s + 0.15], [0, 1]) * at(t, [s + 0.7, s + 1.0], [1, 0.35]);
  };
  const count = (v: number, s: number) => Math.round(at(t, [s, s + 0.9], [0, v], Easing.out(Easing.cubic)));
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 420,
        width: 980,
        borderRadius: 30,
        background: "#FFFFFF",
        boxShadow: "0 50px 120px rgba(14,27,51,0.25)",
        overflow: "hidden",
        fontFamily: SANS,
        color: INK,
        opacity: Math.min(1, inP * 1.5),
        transform: `perspective(2400px) rotateX(${(1 - inP) * 18}deg) translateY(${(1 - inP) * 220}px) scale(${0.88 + 0.12 * inP})`,
        transformOrigin: "50% 100%",
      }}
    >
      {/* browser bar */}
      <div style={{ height: 56, background: "#F1F4F9", display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: `2px solid ${LINE}` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
        ))}
        <div style={{ flex: 1, marginLeft: 16, height: 32, borderRadius: 10, background: "#FFFFFF", border: `2px solid ${LINE}`, fontFamily: MONO, fontSize: 18, color: SOFT, display: "flex", alignItems: "center", padding: "0 14px" }}>painel.clinica · resumo da noite</div>
      </div>
      <div style={{ padding: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <div style={{ fontSize: 22, color: SOFT, fontWeight: 600 }}>Bom dia, equipe</div>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>Enquanto vocês dormiam</div>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: SOFT, border: `2px solid ${LINE}`, padding: "4px 10px", borderRadius: 8 }}>DADOS DE EXEMPLO</span>
        </div>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginTop: 24 }}>
          {KPIS.map((k, i) => {
            const h = hot(k.hot);
            return (
              <div key={k.k} style={{ padding: "18px 18px", borderRadius: 20, background: h > 0.05 ? `rgba(20,199,154,${0.08 + 0.1 * h})` : "#F6F8FB", border: `2px solid ${h > 0.05 ? MINT : "transparent"}`, scale: `${1 + h * 0.05}` }}>
                <div style={{ fontSize: 17, color: SOFT, fontWeight: 600, lineHeight: 1.2, minHeight: 42 }}>{k.label}</div>
                <div style={{ fontFamily: MONO, fontSize: 52, fontWeight: 600, marginTop: 6, color: k.k === "respondidas" && h > 0.05 ? "#0B7A5E" : INK }}>{count(k.v, from + 0.5 + i * 0.12)}</div>
              </div>
            );
          })}
        </div>
        {/* chart + agenda + queue */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18, marginTop: 20 }}>
          <div style={{ padding: 20, borderRadius: 20, background: "#F6F8FB" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Mensagens por hora</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 150, marginTop: 14 }}>
              {BARS.map((b, i) => (
                <div key={i} style={{ flex: 1, height: `${(b / 9) * 100 * at(t, [from + 0.6 + i * 0.04, from + 1.1 + i * 0.04], [0, 1])}%`, minHeight: 4, borderRadius: "6px 6px 2px 2px", background: i < 10 ? "#7FA6FF" : "#0055FF" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 15, color: SOFT, marginTop: 6 }}>
              <span>18h</span>
              <span>00h</span>
              <span>07h</span>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ padding: 18, borderRadius: 20, background: "#F6F8FB", border: `2px solid ${hot("marcado") > 0.05 ? "#0055FF" : "transparent"}` }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Agenda de hoje</div>
              {AGENDA.map((a, i) => (
                <div key={a.h} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, fontSize: 19, opacity: at(t, [from + 0.8 + i * 0.1, from + 1.1 + i * 0.1], [0, 1]) }}>
                  <span style={{ fontFamily: MONO, color: SOFT }}>{a.h}</span>
                  <span style={{ flex: 1, fontWeight: 600 }}>{a.who}</span>
                  {a.novo ? <span style={{ fontSize: 14, fontWeight: 800, color: "#0B7A5E", background: "rgba(20,199,154,0.15)", padding: "2px 8px", borderRadius: 6 }}>NOVO</span> : null}
                </div>
              ))}
            </div>
            <div style={{ padding: 18, borderRadius: 20, background: "#F6F8FB", border: `2px solid ${hot("organizado") > 0.05 ? "#F5A524" : "transparent"}` }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Para a equipe responder</div>
              {FILA.map((q, i) => (
                <div key={q} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, fontSize: 19, opacity: at(t, [beats.organizado - 0.1 + i * 0.12, beats.organizado + 0.2 + i * 0.12], [0.35, 1]) }}>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: "#F5A524" }} />
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
