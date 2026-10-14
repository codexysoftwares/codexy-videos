import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MONO, SANS } from "../../shared/theme";
import { Achado, Frame, M, Tag, Why, X, XrayBg, cyanText, redText } from "./Xray";

// Carousel "Raio-X #1: o salão" — fictional salon "Studio Bella". 8 slides, 1080×1350.
export const RAIO_X_SALAO_SLIDES = 8;
const N = RAIO_X_SALAO_SLIDES;

/* --------------------------------------------------------------- 1 · cover --------------------------------------------------------------- */
// The day's agenda as an x-ray film: it looks full, but the scan shows where clients leak out.
type Row = { h: string; who?: string; kind?: "falta" | "cancel" | "ghost"; tag?: string };
const DIA: Row[] = [
  { h: "09:00", who: "Paula · escova", kind: "falta", tag: "FALTOU SEM AVISAR" },
  { h: "10:00", who: "Bruna · coloração" },
  { h: "11:00", who: "Lívia · manicure" },
  { h: "13:00", who: "Carla · corte" },
  { h: "14:00", who: "Juliana · cancelou", kind: "cancel", tag: "NINGUÉM ENCAIXADO" },
  { h: "15:00", who: "Marta · escova" },
  { h: "16:00", who: "Renata · hidratação" },
  { h: "17:00", who: "Ana?", kind: "ghost", tag: "NÃO VOLTOU DESDE MARÇO" },
];
const ROW_H = 58;
const BOARD = { x: 100, y: 158, w: 880 };

const Cover = () => (
  <XrayBg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(141,235,255,0.14) 0%, rgba(141,235,255,0) 55%)" }} />
    {/* the agenda board */}
    <div style={{ position: "absolute", left: BOARD.x, top: BOARD.y, width: BOARD.w, padding: "22px 26px 26px", borderRadius: 26, border: "3px solid rgba(141,235,255,0.75)", background: "rgba(141,235,255,0.06)", boxShadow: "0 0 50px rgba(141,235,255,0.18), inset 0 0 40px rgba(141,235,255,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 3, marginBottom: 16 }}>
        <span style={{ color: X.cyan }}>AGENDA · QUINTA-FEIRA</span>
        <span style={{ padding: "6px 12px", borderRadius: 8, border: `2px solid ${X.cyan}`, color: X.cyan }}>AGENDA CHEIA</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {DIA.map((r) => {
          const bad = !!r.kind;
          return (
            <div
              key={r.h}
              style={{
                position: "relative",
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 20px",
                borderRadius: 14,
                border: `2px ${r.kind === "ghost" ? "dashed" : "solid"} ${bad ? X.red : "rgba(141,235,255,0.5)"}`,
                background: bad ? "rgba(255,77,106,0.10)" : "rgba(141,235,255,0.10)",
                boxShadow: bad ? `0 0 22px ${X.redGlow}` : "none",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 24, color: bad ? X.red : X.cyanSoft, width: 84 }}>{r.h}</span>
              <span style={{ position: "relative", flex: 1, fontSize: 28, fontWeight: 700, color: r.kind === "ghost" ? "rgba(242,251,255,0.45)" : bad ? "rgba(242,251,255,0.7)" : "#DFF8FF", textDecoration: r.kind === "cancel" ? "line-through" : "none", textDecorationColor: X.red }}>
                {r.who}
              </span>
              {r.tag ? (
                <span style={{ padding: "6px 12px", borderRadius: 8, background: X.red, color: "#fff", fontFamily: MONO, fontWeight: 600, fontSize: 18, letterSpacing: 1.2, whiteSpace: "nowrap", boxShadow: `0 0 16px ${X.redGlow}` }}>{r.tag}</span>
              ) : (
                <span style={{ width: 70, height: 6, borderRadius: 3, background: "rgba(141,235,255,0.35)" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
    {/* scanner sweep across the board */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 422, height: 3, background: X.cyan, boxShadow: "0 0 26px 8px rgba(141,235,255,0.4)", opacity: 0.85 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, height: 152, background: "linear-gradient(180deg, rgba(141,235,255,0) 0%, rgba(141,235,255,0.10) 100%)", pointerEvents: "none" }} />

    <div style={{ position: "absolute", left: M, right: M, top: 858 }}>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: X.cyan }}>EXAME DE PROCESSO</div>
      <div style={{ marginTop: 14, fontWeight: 800, fontSize: 88, lineHeight: 1, letterSpacing: -3.2 }}>
        Esse salão perde
        <br />
        <span style={cyanText}>1 cliente por dia.</span>
      </div>
      <div style={{ marginTop: 20, fontWeight: 700, fontSize: 54, letterSpacing: -1.6, color: "rgba(242,251,255,0.88)" }}>
        E a agenda está <span style={redText}>cheia.</span>
      </div>
    </div>
    <Frame index={1} total={N} />
    <div style={{ position: "absolute", right: M, bottom: 120, fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: X.cyan }}>arraste pro exame →</div>
  </XrayBg>
);

/* ------------------------------------------------------------ 2 · no-shows ------------------------------------------------------------ */
const DIAS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const HORAS = ["09h", "10h", "11h", "14h", "16h"];
const FALTAS = new Set(["0-1", "1-3", "2-0", "3-4", "4-2", "5-1"]);

const Agenda = () => (
  <XrayBg>
    <Frame index={2} total={N} label="AGENDA" />
    <Achado n="01" title="Faltas sem aviso." />
    <div style={{ position: "absolute", left: M, right: M, top: 330, display: "grid", gridTemplateColumns: `80px repeat(6, 1fr)`, gap: 10 }}>
      <div />
      {DIAS.map((d) => (
        <div key={d} style={{ textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: X.cyanSoft }}>
          {d}
        </div>
      ))}
      {HORAS.map((h, r) => (
        <div key={h} style={{ display: "contents" }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: X.cyanSoft, display: "flex", alignItems: "center" }}>{h}</div>
          {DIAS.map((_, c) => {
            const miss = FALTAS.has(`${c}-${r}`);
            return (
              <div
                key={c}
                style={{
                  height: 70,
                  borderRadius: 10,
                  border: `2px solid ${miss ? X.red : "rgba(141,235,255,0.55)"}`,
                  background: miss ? "rgba(255,77,106,0.16)" : "rgba(141,235,255,0.10)",
                  boxShadow: miss ? `0 0 18px ${X.redGlow}` : "none",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {miss ? (
                  <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={X.red} strokeWidth={3.2} strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                ) : (
                  <div style={{ width: 34, height: 6, borderRadius: 3, background: "rgba(141,235,255,0.45)" }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: M, top: 790, display: "flex", gap: 26, fontFamily: MONO, fontSize: 22, letterSpacing: 1.5, color: X.cyanSoft }}>
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid rgba(141,235,255,0.55)", background: "rgba(141,235,255,0.10)" }} /> horário marcado
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 10, color: X.red }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${X.red}`, background: "rgba(255,77,106,0.16)" }} /> faltou sem avisar
      </span>
    </div>
    <Why top={870}>A confirmação depende de alguém lembrar de mandar mensagem. Em dia corrido, ninguém lembra.</Why>
    <div style={{ position: "absolute", left: M, right: M, top: 1075, padding: "24px 30px", borderRadius: 18, border: "2px dashed rgba(141,235,255,0.5)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: X.cyanSoft }}>CONTA DE BOLSO</div>
        <div style={{ fontFamily: MONO, fontSize: 28, marginTop: 6 }}>1 falta/dia × R$ 90 × 22 dias</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 50, ...redText }}>R$ 1.980</div>
        <div style={{ marginTop: 4 }}>
          <Tag>POR MÊS · EXEMPLO</Tag>
        </div>
      </div>
    </div>
  </XrayBg>
);

/* ------------------------------------------------------------ 3 · WhatsApp ------------------------------------------------------------ */
const Bubble = ({ side, text, time, alert, ticks }: { side: "in" | "out"; text: string; time: string; alert?: boolean; ticks?: boolean }) => {
  const isIn = side === "in";
  return (
    <div style={{ display: "flex", justifyContent: isIn ? "flex-start" : "flex-end" }}>
      <div
        style={{
          maxWidth: 640,
          padding: "20px 26px 14px",
          borderRadius: 28,
          borderTopLeftRadius: isIn ? 6 : 28,
          borderTopRightRadius: isIn ? 28 : 6,
          border: `2px solid ${alert ? X.red : X.cyanSoft}`,
          background: alert ? "rgba(255,77,106,0.14)" : isIn ? "rgba(141,235,255,0.08)" : "rgba(141,235,255,0.18)",
          boxShadow: alert ? `0 0 26px ${X.redGlow}` : "none",
          fontSize: 36,
          lineHeight: 1.3,
        }}
      >
        {text}
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 20, color: X.cyanSoft, marginTop: 6 }}>
          {time}
          {ticks ? <span style={{ marginLeft: 8, color: X.cyan }}>✓✓</span> : null}
        </div>
      </div>
    </div>
  );
};

const WhatsApp = () => (
  <XrayBg>
    <Frame index={3} total={N} label="ATENDIMENTO" />
    <Achado n="02" title={"Agendamento só no\nhorário comercial."} />
    <div style={{ position: "absolute", left: M, right: M, top: 400 }}>
      <Bubble side="in" text="Oi! Tem horário amanhã pra escova?" time="terça · 22:14" />
      {/* the fracture: hours of silence */}
      <div style={{ position: "relative", height: 150 }}>
        <svg width={120} height={150} style={{ position: "absolute", left: 60, top: 0 }}>
          <polyline points="20,8 48,38 18,66 50,96 22,124 44,146" fill="none" stroke={X.red} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${X.redGlow})` }} />
        </svg>
        <div style={{ position: "absolute", left: 200, top: 48, padding: "10px 18px", borderRadius: 10, background: X.red, color: "#fff", fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 1, boxShadow: `0 0 20px ${X.redGlow}` }}>
          11h16 SEM RESPOSTA
        </div>
      </div>
      <Bubble side="out" text="Bom dia! Temos às 15h, pode ser?" time="quarta · 09:30" ticks />
      <div style={{ height: 18 }} />
      <Bubble side="in" text="Obrigada, mas já marquei em outro salão." time="quarta · 09:31" alert />
    </div>
    <Why top={1040}>Quem responde o WhatsApp é quem está cortando cabelo. De noite, ninguém responde. E ela marca no salão que respondeu.</Why>
  </XrayBg>
);

/* ------------------------------------------------------------ 4 · cancellation ------------------------------------------------------------ */
const SLOTS = [
  { h: "13:00", who: "Paula · escova" },
  { h: "14:00", who: "", cancel: true },
  { h: "15:00", who: "Carla · coloração" },
  { h: "16:00", who: "Juliana · manicure" },
];

const Encaixe = () => (
  <XrayBg>
    <Frame index={4} total={N} label="AGENDA" />
    <Achado n="03" title={"Cancelou?\nO horário morre."} />
    <div style={{ position: "absolute", left: M, top: 400, width: 560, display: "grid", gap: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: X.cyanSoft }}>QUINTA-FEIRA</div>
      {SLOTS.map((s) => (
        <div key={s.h} style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 26, color: X.cyanSoft, width: 90 }}>{s.h}</span>
          <div
            style={{
              flex: 1,
              height: 92,
              borderRadius: 16,
              border: `2px ${s.cancel ? "dashed" : "solid"} ${s.cancel ? X.red : X.cyanSoft}`,
              background: s.cancel ? "rgba(255,77,106,0.08)" : "rgba(141,235,255,0.12)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              fontSize: 32,
              fontWeight: 700,
              color: s.cancel ? X.red : X.white,
              fontFamily: s.cancel ? MONO : SANS,
              letterSpacing: s.cancel ? 2 : 0,
            }}
          >
            {s.cancel ? "CANCELADO · VAZIO" : s.who}
          </div>
        </div>
      ))}
    </div>
    {/* the waiting list that does not exist */}
    <div style={{ position: "absolute", left: 690, right: M, top: 445, height: 450, borderRadius: 20, border: "2px dashed rgba(141,235,255,0.35)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: X.cyanSoft, textAlign: "center" }}>LISTA DE ESPERA</div>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.32 }}>
          <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={X.cyan} strokeWidth={1.6}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
          <div style={{ width: 120, height: 14, borderRadius: 7, background: "rgba(141,235,255,0.5)" }} />
        </div>
      ))}
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 24, fontWeight: 600, letterSpacing: 2, ...redText }}>NÃO EXISTE</div>
    </div>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1350, overflow: "visible" }}>
      <line x1={636} y1={600} x2={688} y2={600} stroke={X.red} strokeWidth={4} strokeDasharray="8 8" />
      <circle cx={662} cy={600} r={20} fill={X.bg} stroke={X.red} strokeWidth={3} />
      <path d="M654 592l16 16M670 592l-16 16" stroke={X.red} strokeWidth={3.4} strokeLinecap="round" />
    </svg>
    <div style={{ position: "absolute", left: 186, top: 900, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: X.red }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: X.red, boxShadow: "0 0 12px rgba(255,77,106,0.55)" }} />
      HORÁRIO PERDIDO · NINGUÉM FOI AVISADO
    </div>
    <Why top={1010}>Ninguém fica sabendo que o horário vagou. A cliente que queria as 14h marcou em outro lugar.</Why>
  </XrayBg>
);

/* ------------------------------------------------------------ 5 · hemorrhage ------------------------------------------------------------ */
const MESES = ["MAR", "ABR", "MAI", "JUN"];

const Hemorragia = () => {
  const xs = [180, 450, 690, 900];
  const y = 560;
  return (
    <XrayBg>
      <Frame index={5} total={N} label="RETORNO" />
      <div style={{ position: "absolute", left: M, right: M, top: 150 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: X.red }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: X.red, boxShadow: `0 0 14px ${X.redGlow}` }} />
          ACHADO 04 · HEMORRAGIA
        </div>
        <div style={{ marginTop: 14, fontWeight: 800, fontSize: 76, lineHeight: 1.02, letterSpacing: -2.6 }}>
          A cliente que
          <br />
          <span style={redText}>não volta.</span>
        </div>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1350, overflow: "visible" }}>
        <defs>
          <linearGradient id="bleed" gradientUnits="userSpaceOnUse" x1={xs[0]} y1={0} x2={xs[3] + 40} y2={0}>
            <stop offset="0%" stopColor={X.cyan} />
            <stop offset="32%" stopColor={X.cyan} />
            <stop offset="42%" stopColor={X.red} />
            <stop offset="100%" stopColor={X.red} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={xs[0]} y1={y} x2={xs[3] + 40} y2={y} stroke="url(#bleed)" strokeWidth={7} strokeLinecap="round" />
        {/* drops */}
        {[520, 590, 650, 720, 790].map((dx, i) => (
          <path key={i} d={`M ${dx} ${y + 6} q -9 ${22 + i * 6} 0 ${30 + i * 8} q 9 -8 0 -${30 + i * 8}z`} fill={X.red} opacity={0.85 - i * 0.14} />
        ))}
      </svg>
      {MESES.map((m, i) => (
        <div key={m} style={{ position: "absolute", left: xs[i] - 70, width: 140, top: y + 58, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: i < 2 ? X.cyanSoft : "rgba(255,77,106,0.6)" }}>
          {m}
        </div>
      ))}
      {/* March: service done */}
      <div style={{ position: "absolute", left: xs[0] - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: X.cyan, boxShadow: `0 0 24px rgba(141,235,255,0.7)` }} />
      <div style={{ position: "absolute", left: M, top: y - 120, width: 220, padding: "10px 14px", borderRadius: 12, border: `2px solid ${X.cyanSoft}`, background: "rgba(141,235,255,0.12)", fontSize: 24, fontWeight: 700, textAlign: "center" }}>coloração ✓</div>
      {/* April: should come back */}
      <div style={{ position: "absolute", left: xs[1] - 30, top: y - 30, width: 60, height: 60, borderRadius: 30, border: `4px dashed ${X.cyan}` }} />
      <div style={{ position: "absolute", left: xs[1] - 110, top: y - 120, width: 220, padding: "10px 14px", borderRadius: 12, border: `2px dashed ${X.cyanSoft}`, fontSize: 24, fontWeight: 700, textAlign: "center", color: X.cyan }}>deveria voltar</div>
      <div style={{ position: "absolute", left: xs[3] - 90, top: y - 110, fontFamily: MONO, fontSize: 30, fontWeight: 600, letterSpacing: 3, ...redText }}>SUMIU</div>

      <div style={{ position: "absolute", left: M, right: M, top: 730, padding: "34px 38px", borderRadius: 22, border: `2px solid rgba(255,77,106,0.55)`, background: "rgba(255,77,106,0.08)" }}>
        <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1.12, letterSpacing: -1.6 }}>
          O maior prejuízo não é quem falta.
          <br />
          <span style={redText}>É quem não volta.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: M, right: M, top: 1000, fontSize: 34, lineHeight: 1.38, color: "rgba(242,251,255,0.9)" }}>Todo serviço tem data de retorno. Ninguém avisa, e ela vai pro primeiro salão que lembrar dela.</div>
      <div style={{ position: "absolute", left: M, right: M, top: 1140, display: "flex", gap: 12 }}>
        {["escova · 7 dias", "unha · 15 dias", "coloração · 30 dias"].map((c) => (
          <Tag key={c}>{c}</Tag>
        ))}
      </div>
    </XrayBg>
  );
};

/* -------------------------------------------------------------- 6 · report -------------------------------------------------------------- */
const ACHADOS = [
  { n: "01", t: "Faltas sem aviso", g: "MODERADA", w: 0.6 },
  { n: "02", t: "WhatsApp só em horário comercial", g: "MODERADA", w: 0.62 },
  { n: "03", t: "Horário cancelado sem encaixe", g: "LEVE", w: 0.38 },
  { n: "04", t: "Cliente sem lembrete de retorno", g: "GRAVE", w: 1 },
];

const Laudo = () => (
  <XrayBg>
    <Frame index={6} total={N} />
    <div style={{ position: "absolute", left: M, right: M, top: 150, bottom: 140, borderRadius: 24, border: `2px solid ${X.cyanSoft}`, background: "rgba(141,235,255,0.05)", padding: "40px 44px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: X.cyan }}>LAUDO RADIOLÓGICO</div>
          <div style={{ marginTop: 8, fontWeight: 800, fontSize: 60, letterSpacing: -2 }}>Studio Bella</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 20, lineHeight: 1.6, color: X.cyanSoft }}>
          EXAME: RAIO-X #1
          <br />
          PROCESSO: ATENDIMENTO
          <br />
          SALÃO FICTÍCIO
        </div>
      </div>
      <div style={{ height: 2, background: X.cyanFaint, margin: "28px 0" }} />
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: X.cyanSoft }}>ACHADOS</div>
      <div style={{ display: "grid", gap: 20, marginTop: 18 }}>
        {ACHADOS.map((a) => {
          const grave = a.g === "GRAVE";
          return (
            <div key={a.n}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 30, fontWeight: 700 }}>
                <span>
                  <span style={{ fontFamily: MONO, color: X.cyanSoft, marginRight: 14 }}>{a.n}</span>
                  {a.t}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: grave ? X.red : X.cyanSoft }}>{a.g}</span>
              </div>
              <div style={{ marginTop: 10, height: 10, borderRadius: 5, background: "rgba(141,235,255,0.12)" }}>
                <div style={{ width: `${a.w * 100}%`, height: 10, borderRadius: 5, background: grave ? X.red : X.cyan, boxShadow: `0 0 14px ${grave ? X.redGlow : "rgba(141,235,255,0.5)"}` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 2, background: X.cyanFaint, margin: "34px 0 26px" }} />
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: X.cyanSoft }}>DIAGNÓSTICO</div>
      <div style={{ marginTop: 12, fontWeight: 800, fontSize: 46, lineHeight: 1.15, letterSpacing: -1.4, maxWidth: 640 }}>
        O salão está cheio, mas <span style={redText}>vaza cliente por 4 lugares.</span>
      </div>
      <div style={{ marginTop: 30, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: X.cyanSoft }}>PROGNÓSTICO</div>
      <div style={{ marginTop: 10, fontSize: 32, lineHeight: 1.35, color: "rgba(242,251,255,0.9)", maxWidth: 560 }}>Bom: 3 ajustes de processo fecham os 4 vazamentos.</div>
      <div style={{ position: "absolute", right: 46, bottom: 46, padding: "12px 26px", borderRadius: 12, border: `5px solid ${X.green}`, color: X.green, fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: 4, rotate: "-9deg", boxShadow: `0 0 26px rgba(62,230,168,0.35)` }}>TRATÁVEL</div>
    </div>
  </XrayBg>
);

/* ---------------------------------------------------------- 7 · prescription ---------------------------------------------------------- */
const Box = ({ checked }: { checked?: boolean }) => (
  <span style={{ width: 46, height: 46, borderRadius: 10, border: `3px solid ${checked ? X.cyan : "rgba(242,251,255,0.7)"}`, background: checked ? X.cyan : "transparent", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: checked ? "0 0 18px rgba(141,235,255,0.5)" : "none" }}>
    {checked ? (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={X.bg} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ) : null}
  </span>
);

const Receita = () => (
  <XrayBg>
    <Frame index={7} total={N} />
    <div style={{ position: "absolute", left: M, right: M, top: 150, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <span style={{ fontSize: 110, lineHeight: 1, fontWeight: 300, ...cyanText }}>℞</span>
        <span style={{ fontWeight: 800, fontSize: 76, letterSpacing: -2.6 }}>Prescrição</span>
      </div>
      <span style={{ padding: "10px 16px", borderRadius: 10, background: X.cyan, color: X.bg, fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 2 }}>SALVE ESTE SLIDE</span>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 330 }}>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: X.cyanSoft }}>DÁ PRA COMEÇAR HOJE, SEM SISTEMA</div>
      <div style={{ display: "grid", gap: 22, marginTop: 22 }}>
        {["Confirmar todos os horários na véspera", "Anotar uma lista de espera", "Marcar a data de retorno de cada cliente"].map((x) => (
          <div key={x} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 38, fontWeight: 700 }}>
            <Box />
            {x}
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 650, padding: "34px 36px", borderRadius: 22, border: `2px solid ${X.cyan}`, background: "rgba(141,235,255,0.08)", boxShadow: "0 0 40px rgba(141,235,255,0.12)" }}>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: X.cyan }}>COM SISTEMA, ACONTECE SOZINHO</div>
      <div style={{ display: "grid", gap: 22, marginTop: 22 }}>
        {["Confirmação automática no WhatsApp", "Horário vago vai direto pra lista de espera", "Lembrete de retorno no dia certo"].map((x) => (
          <div key={x} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36, fontWeight: 700 }}>
            <Box checked />
            {x}
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 1010, display: "flex", gap: 22 }}>
      <div style={{ width: 4, borderRadius: 2, background: X.cyan, flexShrink: 0 }} />
      <div style={{ fontSize: 34, lineHeight: 1.4, color: "rgba(242,251,255,0.9)" }}>No papel já ajuda. O sistema só faz isso <b style={cyanText}>sem depender de alguém lembrar</b>, todo dia.</div>
    </div>
  </XrayBg>
);

/* ---------------------------------------------------------------- 8 · CTA ---------------------------------------------------------------- */
const Cta = () => (
  <XrayBg>
    <Frame index={8} total={N} />
    <div style={{ position: "absolute", left: M, right: M, top: 170, fontWeight: 800, fontSize: 96, lineHeight: 1.0, letterSpacing: -3.4 }}>
      Quer o raio-x
      <br />
      <span style={cyanText}>do seu negócio?</span>
    </div>
    {/* instagram comment mock */}
    <div style={{ position: "absolute", left: M, right: M, top: 480, padding: "30px 32px", borderRadius: 26, background: "rgba(242,251,255,0.06)", border: `2px solid ${X.cyanFaint}`, display: "flex", gap: 22, alignItems: "flex-start" }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: "linear-gradient(135deg, #8DEBFF, #3377FF)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          seu_negocio <span style={{ fontWeight: 400, color: X.cyanSoft, fontSize: 24 }}>· agora</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 40, fontWeight: 800 }}>
          <span style={{ padding: "2px 12px", borderRadius: 8, background: X.cyan, color: X.bg }}>RAIO-X</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 24, color: X.cyanSoft }}>Responder</div>
      </div>
      <svg width={36} height={36} viewBox="0 0 24 24" fill={X.red} style={{ marginTop: 20 }}>
        <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.4 4.5 6.2 4.5c2.2 0 3.6 1.3 4.3 2.5h3c.7-1.2 2.1-2.5 4.3-2.5 3.8 0 5.7 3.9 4.2 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 730, fontSize: 40, lineHeight: 1.35, color: "rgba(242,251,255,0.92)" }}>
      Comenta <b style={cyanText}>RAIO-X</b> que a gente faz o exame do seu processo, de graça.
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 910, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "28px 44px", borderRadius: 999, background: "#25D366", color: "#05210F", fontWeight: 800, fontSize: 42, letterSpacing: -1, boxShadow: "0 0 50px rgba(37,211,102,0.4)" }}>
        <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="#05210F" strokeWidth={2.2} strokeLinejoin="round">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
        </svg>
        Diagnóstico gratuito no WhatsApp
      </div>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 1080, padding: "22px 28px", borderRadius: 18, border: "2px dashed rgba(141,235,255,0.45)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO }}>
      <span style={{ fontSize: 24, letterSpacing: 2, color: X.cyanSoft }}>PRÓXIMO EXAME</span>
      <span style={{ fontSize: 28, fontWeight: 600, color: X.cyan }}>RAIO-X #2 · em breve</span>
    </div>
  </XrayBg>
);

const SLIDES = [Cover, Agenda, WhatsApp, Encaixe, Hemorragia, Laudo, Receita, Cta];

export const RaioXSalao = () => {
  const i = useCurrentFrame();
  const S = SLIDES[Math.min(i, SLIDES.length - 1)];
  return <S />;
};
