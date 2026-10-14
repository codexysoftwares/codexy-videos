import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { at, bump, lin, spr } from "../../shared/kit/motion";
import { C, MONO, SANS } from "../../shared/theme";

// "POV: você é a planilha do financeiro no dia 30" — humor reel (Curiosidade pillar). NO narration and no audio:
// Kaike adds a trending sound inside Instagram. 60 fps, ~16 s. The spreadsheet is generic (no Microsoft branding).
export const FPS = 60;
export const DURATION = 16 * FPS;

const T = {
  abas: 2.4,
  ref: 5.0,
  lock: 7.4,
  conflito: 8.4,
  calc: 9.9,
  trava: 11.2,
  crash: 12.3,
  cta: 13.1,
};

const MEMES = [
  { from: T.abas, to: T.ref, t: "08:00 · alguém criou a aba\n“FINAL_v2_AGORA_VAI”" },
  { from: T.ref, to: T.lock, t: "09:00 · alguém apagou a coluna C" },
  { from: T.lock, to: T.calc, t: "10:00 · duas pessoas editando\nao mesmo tempo" },
  { from: T.calc, to: T.crash, t: "18:00 · fechamento do mês" },
];

const TABS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "FINAL", "FINAL_v2", "FINAL_v2_AGORA_VAI", "NÃO MEXER", "cópia de NÃO MEXER", "teste", "Plan47"];
const COLS = ["A", "B", "C", "D", "E"];
const ROWS = 14;
const GREEN = "#1F7A4D";

const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const Sheet = ({ t }: { t: number }) => {
  const refSpread = lin(t, [T.ref, T.ref + 2.2], [0, 1]);
  const tabsShown = Math.round(lin(t, [T.abas, T.abas + 2.2], [6, TABS.length]));
  const tabCount = Math.round(lin(t, [T.abas, T.abas + 2.2], [6, 47]));
  const calc = Math.floor(lin(t, [T.calc, T.trava + 1], [0, 3]));
  const frozen = t > T.trava;
  const grey = at(t, [T.trava, T.trava + 0.3], [0, 1]);
  const shake = t > T.trava && t < T.crash ? Math.sin(t * 70) * 6 * lin(t, [T.trava, T.crash], [0.3, 1]) : 0;
  return (
    <div style={{ position: "absolute", left: 50, top: 520, width: 980, height: 980, borderRadius: 22, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", fontFamily: SANS, translate: `${shake}px 0px`, filter: grey ? `grayscale(${grey * 0.7}) brightness(${1 - grey * 0.12})` : undefined }}>
      {/* title bar */}
      <div style={{ height: 64, background: GREEN, color: "#fff", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, fontSize: 26 }}>
        <span style={{ display: "flex", gap: 8 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
        </span>
        <span style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>financeiro_2026_FINAL_v7.xlsx{frozen ? "  (Não está respondendo)" : ""}</span>
      </div>
      {/* formula bar */}
      <div style={{ height: 56, borderBottom: "2px solid #E3E7EC", display: "flex", alignItems: "center", gap: 16, padding: "0 18px", fontFamily: MONO, fontSize: 24, color: "#333" }}>
        <span style={{ color: "#888" }}>fx</span>
        <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{t > T.calc ? "=SOMA(PROCV(B2:B9999;'FINAL_v2'!A:Z;3;0))*SE(…" : "=SOMA(B2:B13)"}</span>
      </div>
      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: `60px repeat(${COLS.length}, 1fr)`, fontSize: 22 }}>
        <div style={{ background: "#F3F5F7", height: 44 }} />
        {COLS.map((c) => (
          <div key={c} style={{ background: "#F3F5F7", height: 44, display: "grid", placeItems: "center", color: "#666", borderLeft: "1px solid #E3E7EC" }}>
            {c}
          </div>
        ))}
        {Array.from({ length: ROWS }).map((_, r) => (
          <div key={r} style={{ display: "contents" }}>
            <div style={{ background: "#F3F5F7", height: 50, display: "grid", placeItems: "center", color: "#666", borderTop: "1px solid #E3E7EC" }}>{r + 1}</div>
            {COLS.map((c, ci) => {
              const k = r * COLS.length + ci;
              const isRef = seeded(k) < refSpread * 0.75 && !(r === 0);
              const deleted = t > T.ref && ci === 2;
              const val = r === 0 ? ["Cliente", "Valor", "Pago?", "Obs", "Total"][ci] : ci === 1 || ci === 4 ? `R$ ${(1000 + Math.floor(seeded(k + 99) * 9000)).toLocaleString("pt-BR")}` : ci === 2 ? (seeded(k) > 0.5 ? "sim" : "ver c/ João") : ci === 0 ? `Cliente ${r}` : seeded(k) > 0.6 ? "???" : "";
              return (
                <div
                  key={c}
                  style={{
                    height: 50,
                    borderTop: "1px solid #E3E7EC",
                    borderLeft: "1px solid #E3E7EC",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 10px",
                    fontWeight: r === 0 ? 700 : 400,
                    color: isRef ? "#C62828" : "#222",
                    background: isRef ? "#FDECEC" : deleted ? "#FFF8E1" : r === 0 ? "#F8FAFB" : "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {deleted && r > 0 ? "" : isRef ? "#REF!" : val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* tabs */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "#F3F5F7", borderTop: "2px solid #E3E7EC", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", overflow: "hidden" }}>
        {TABS.slice(0, tabsShown).map((tb, i) => {
          const isNew = i >= 6;
          const p = isNew ? spr(t, T.abas + (i - 6) * 0.3, FPS, { damping: 12, stiffness: 220 }) : 1;
          return (
            <span key={tb} style={{ padding: "8px 14px", borderRadius: "10px 10px 0 0", background: i === tabsShown - 1 ? "#fff" : "#E7EBEF", fontSize: 20, color: i === tabsShown - 1 ? GREEN : "#555", fontWeight: i === tabsShown - 1 ? 700 : 400, whiteSpace: "nowrap", scale: `${p}` }}>
              {tb}
            </span>
          );
        })}
        <span style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 999, background: tabCount > 40 ? "#C62828" : "#888", color: "#fff", fontSize: 20, fontWeight: 700, whiteSpace: "nowrap" }}>{tabCount} abas</span>
      </div>
      {/* status bar while calculating */}
      {t > T.calc ? (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, height: 44, background: "#EEF1F4", display: "flex", alignItems: "center", padding: "0 18px", gap: 14, fontSize: 22, color: "#444" }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, border: "4px solid #C9D1DA", borderTopColor: GREEN, rotate: `${t * 400}deg` }} />
          Calculando (4 processadores): {calc}%
        </div>
      ) : null}
      {/* popups */}
      {t > T.lock && t < T.crash ? <Popup t={t} s={T.lock} y={330} title="Arquivo em uso" text="financeiro_2026_FINAL_v7.xlsx está bloqueado para edição por joao.financeiro." btn="Somente leitura" /> : null}
      {t > T.conflito && t < T.crash ? <Popup t={t} s={T.conflito} y={470} title="Conflito de alterações" text="Outra pessoa salvou uma versão diferente. Manter a sua ou a dela?" btn="Manter as duas (?)" /> : null}
    </div>
  );
};

const Popup = ({ t, s, y, title, text, btn }: { t: number; s: number; y: number; title: string; text: string; btn: string }) => {
  const p = spr(t, s, FPS, { damping: 13, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 110, right: 110, top: y, padding: "26px 30px", borderRadius: 18, background: "#FFFFFF", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", border: "1px solid #DDE2E7", scale: `${0.7 + 0.3 * p}`, opacity: Math.min(1, p * 1.4) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 800, color: "#222" }}>
        <span style={{ width: 36, height: 36, borderRadius: 18, background: "#F5A524", color: "#fff", display: "grid", placeItems: "center", fontSize: 24 }}>!</span>
        {title}
      </div>
      <div style={{ fontSize: 26, color: "#444", marginTop: 12, lineHeight: 1.35 }}>{text}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <span style={{ padding: "10px 20px", borderRadius: 10, background: "#E7EBEF", fontSize: 24, fontWeight: 600 }}>{btn}</span>
      </div>
    </div>
  );
};

// Meme-style caption: white box, black bold text (the format people expect on humor reels).
const Meme = ({ t, text, from, to, top }: { t: number; text: string; from: number; to: number; top: number }) => {
  const p = spr(t, from, FPS, { damping: 14, stiffness: 240 });
  const o = at(t, [to - 0.12, to], [1, 0]);
  if (t < from || t > to) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ padding: "18px 28px", borderRadius: 18, background: "#FFFFFF", color: "#111", fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.15, letterSpacing: -1.5, textAlign: "center", whiteSpace: "pre-line", scale: `${0.85 + 0.15 * p}`, boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}>{text}</div>
    </div>
  );
};

export const PlanilhaDia30: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sheetOut = at(t, [T.crash, T.crash + 0.5], [0, 1], Easing.in(Easing.cubic));
  const intro = spr(t, 0.1, FPS, { damping: 15, stiffness: 120 });
  const ctaP = at(t, [T.cta, T.cta + 0.4], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#0B1220", fontFamily: SANS, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #13305C 0%, #0B1220 70%)" }} />

      {/* the spreadsheet: pops in, suffers, collapses */}
      {t < T.cta ? (
        <div style={{ position: "absolute", inset: 0, scale: `${(0.85 + 0.15 * intro) * (1 - sheetOut * 0.9)}`, rotate: `${sheetOut * -12}deg`, opacity: 1 - sheetOut, transformOrigin: "540px 1010px", filter: sheetOut ? `blur(${sheetOut * 10}px)` : undefined }}>
          <Sheet t={t} />
        </div>
      ) : null}

      {/* hook */}
      {t < T.abas ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 150, textAlign: "center", color: "#fff", fontWeight: 800, fontSize: 74, lineHeight: 1.08, letterSpacing: -2.5, opacity: at(t, [0, 0.2], [0, 1]) * at(t, [T.abas - 0.15, T.abas], [1, 0]) }}>
          POV: você é a planilha
          <br />
          do financeiro
          <br />
          <span style={{ color: "#4ADE80" }}>no dia 30.</span>
        </div>
      ) : null}
      {MEMES.map((m) => (
        <Meme key={m.t} t={t} text={m.t} from={m.from} to={m.to} top={210} />
      ))}

      {/* the punchline */}
      {t > T.crash && t < T.cta + 0.1 ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 800, textAlign: "center", color: "#fff", fontWeight: 800, fontSize: 86, letterSpacing: -3, opacity: at(t, [T.crash + 0.15, T.crash + 0.35], [0, 1]) * at(t, [T.cta - 0.1, T.cta + 0.1], [1, 0]), scale: `${1 + bump(t, T.crash + 0.3, 0.4) * 0.06}` }}>
          A planilha
          <br />
          <span style={{ color: "#F87171" }}>pediu demissão.</span>
        </div>
      ) : null}

      {/* CTA */}
      {t >= T.cta ? (
        <AbsoluteFill style={{ opacity: ctaP, background: `radial-gradient(ellipse at 50% 38%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 470, textAlign: "center", color: "#fff", fontWeight: 800, fontSize: 92, lineHeight: 1.05, letterSpacing: -3, translate: `0px ${(1 - ctaP) * 30}px` }}>
            Sua empresa cresceu.
            <br />
            <span style={{ color: "#3377FF" }}>A planilha não.</span>
          </div>
          <div style={{ position: "absolute", left: 80, right: 80, top: 780, textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 40, lineHeight: 1.35, opacity: at(t, [T.cta + 0.5, T.cta + 0.8], [0, 1]) }}>Sistema sob medida, feito pro jeito que a sua equipe trabalha.</div>
          <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: at(t, [T.cta + 0.9, T.cta + 1.2], [0, 1]) }}>
            <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 460 }} />
          </div>
          <div style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 34, color: C.ice, opacity: at(t, [T.cta + 1.2, T.cta + 1.5], [0, 0.85]) }}>diagnóstico gratuito · @codexy.ai</div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
