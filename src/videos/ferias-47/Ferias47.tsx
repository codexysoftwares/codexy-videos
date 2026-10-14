import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Easing, Img, Sequence, getInputProps, getRemotionEnvironment, staticFile, useCurrentFrame } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { BRoll } from "../../shared/kit/BRoll";
import { Kinetic, type KWord } from "../../shared/kit/Kinetic";
import { at, bump, life, lin, spr } from "../../shared/kit/motion";
import { Phone, phoneSize } from "../../shared/kit/Phone";
import { C, MONO, SANS } from "../../shared/theme";

// "Ele tirou 3 dias de folga. A empresa ligou 47 vezes." — Reels for any business owner (Oferta/Curiosidade).
// 60 fps. Narration: public/narracao/ferias-47 (word times from palavras.json, placed at N[i].at).
// Footage: public/broll/ferias-47/praia.mp4 (Mixkit). Music: re-edit of music/clinica-24h.mp3.
export const FPS = 60;
export const DURATION = Math.round(32.5 * FPS);
const f = (s: number) => Math.round(s * FPS);

const N = [
  { file: "01-gancho.wav", at: 0.1 },
  { file: "02-perguntas.wav", at: 4.6 },
  { file: "03-virada.wav", at: 11.9 },
  { file: "04-sistema.wav", at: 17.7 },
  { file: "05-fecho.wav", at: 23.0 },
  { file: "06-cta.wav", at: 27.1 },
];

const S = { hook: 0, perguntas: 4.3, virada: 11.7, sistema: 17.4, fecho: 22.6, cta: 26.9 };
const END = 3.55; // counter hits 47 ("...quarenta e sete")

const SYS = "-apple-system, 'SF Pro Text', 'Helvetica Neue', 'Hanken Grotesk', Arial, sans-serif";
const RED = "#FF3B5C";
const MINT = "#14C79A";
const BLUE = "#0055FF";
const GLOW = "#3377FF";
const INK = "#0E1B33";

/* ------------------------------------------------------------------ words ------------------------------------------------------------------ */
const w = (txt: string, t: number, accent?: boolean): KWord => ({ w: txt, at: t, accent });
const HOOK1 = [w("Ele", 0.1), w("tirou", 0.36), w("3", 0.7, true), w("dias", 1.03, true), w("de", 1.25), w("folga.", 1.38, true)];
const HOOK2 = [w("A", 1.95), w("empresa", 2.05), w("ligou", 2.46), w("|", 2.46), w("47", 2.78, true), w("vezes.", 3.8, true)];
const SO_ELE = [w("Só", 6.89, true), w("ele", 7.15, true), w("|", 7.15), w("sabia", 7.35), w("responder.", 7.7)];
const NAO_EQUIPE = [w("O", 11.97), w("problema", 12.11), w("|", 12.11), w("não", 12.52), w("era", 12.69), w("a", 12.82), w("equipe.", 12.91, true)];
const CABECA = [w("A", 13.6), w("empresa", 13.94), w("inteira", 14.46), w("|", 14.46), w("morando", 15.01), w("na", 15.4), w("cabeça", 15.51, true), w("|", 15.51), w("de", 16.0), w("uma", 16.07), w("pessoa", 16.23, true), w("só.", 16.67, true)];
const ENCONTRA = [w("A", 19.85), w("equipe", 19.95), w("não", 20.3), w("precisa", 20.44), w("ligar.", 20.83), w("|", 20.83), w("Ela", 21.38, true), w("encontra.", 21.6, true)];
const FECHO = [w("Próximas", 23.06), w("férias.", 23.59), w("|", 23.59), w("Mesma", 24.31), w("praia.", 24.76), w("|", 24.76), w("Zero", 25.37, true), w("ligações.", 25.79, true)];
const CTA_Q = [w("Sua", 27.17), w("empresa", 27.38), w("|", 27.38), w("funciona", 27.81), w("sem", 28.26, true), w("você?", 28.43, true)];
const T = { senha: 8.72, preco: 9.57, nota: 10.25, cabeca: 15.51, so: 16.67, hub: 17.9, ligar: 20.83, encontra: 21.6, zero: 25.37, diag: 29.05, whats: 30.4 };

/* ------------------------------------------------------------- the phone + lock ------------------------------------------------------------- */
const NOTIFS = [
  { app: "Telefone", who: "Loja · Ana", text: "Chamada perdida", call: true },
  { app: "WhatsApp", who: "Ana · Loja", text: "Seu Carlos, cadê a nota do fornecedor?" },
  { app: "Telefone", who: "Financeiro", text: "Chamada perdida (3)", call: true },
  { app: "WhatsApp", who: "Rafa · Financeiro", text: "Qual a senha do banco??" },
  { app: "WhatsApp", who: "Bruno · Vendas", text: "Quanto eu cobro desse cliente?" },
  { app: "Telefone", who: "Loja · Ana", text: "Chamada perdida (5)", call: true },
  { app: "WhatsApp", who: "Ana · Loja", text: "O sistema travou, faço o quê?" },
  { app: "Telefone", who: "Fornecedor", text: "Chamada perdida", call: true },
  { app: "WhatsApp", who: "Rafa · Financeiro", text: "Liberou o pagamento?" },
  { app: "WhatsApp", who: "Bruno · Vendas", text: "Cliente quer falar só com o senhor" },
  { app: "Telefone", who: "Loja · Ana", text: "Chamada perdida (9)", call: true },
  { app: "WhatsApp", who: "Ana · Loja", text: "Onde fica a chave do depósito?" },
  { app: "Telefone", who: "Financeiro", text: "Chamada perdida (12)", call: true },
  { app: "WhatsApp", who: "Rafa · Financeiro", text: "URGENTE" },
];
const ARRIVE = NOTIFS.map((_, i) => 0.05 + (END - 0.15) * Math.sqrt(i / (NOTIFS.length - 1)));
const count = (t: number) => (t < 0.05 ? 1 : Math.min(47, Math.max(1, Math.round(47 * Math.pow(Math.min(1, (t - 0.05) / (END - 0.05)), 2)))));

const PW = 600;
const PS = phoneSize(PW);
const u = PS.u;

const AppIcon = ({ call, size }: { call?: boolean; size: number }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: call ? "#34C759" : "#25D366", display: "grid", placeItems: "center", flexShrink: 0 }}>
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="#fff">
      {call ? <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" /> : <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />}
    </svg>
  </div>
);

const LockScreen = ({ t, empty }: { t: number; empty?: boolean }) => {
  const arrived = empty ? 0 : ARRIVE.filter((a) => t >= a).length;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #1B3A6B 0%, #0B1630 55%, #05070F 100%)", fontFamily: SYS, color: "#fff" }}>
      <div style={{ position: "absolute", top: 70 * u, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 17 * u, fontWeight: 600, opacity: 0.85 }}>{empty ? "terça-feira, 14 de abril" : "quarta-feira, 15 de outubro"}</div>
        <div style={{ fontSize: 82 * u, fontWeight: 600, lineHeight: 1, letterSpacing: -2 * u }}>14:32</div>
      </div>
      {empty ? <div style={{ position: "absolute", left: 0, right: 0, top: 330 * u, textAlign: "center", fontSize: 16 * u, opacity: 0.55 }}>Nenhuma notificação</div> : null}
      <div style={{ position: "absolute", left: 10 * u, right: 10 * u, top: 210 * u }}>
        {NOTIFS.slice(0, arrived)
          .map((n, i) => ({ n, i }))
          .reverse()
          .slice(0, 6)
          .map(({ n, i }, depth) => {
            const p = spr(t, ARRIVE[i], FPS, { damping: 15, stiffness: 260 });
            return (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: depth * 74 * u + (1 - p) * -40 * u, zIndex: 50 - depth, opacity: Math.min(1, p * 1.5) * (1 - depth * 0.1), scale: `${1 - depth * 0.02}`, padding: `${10 * u}px ${12 * u}px`, borderRadius: 18 * u, background: "rgba(245,245,247,0.86)", color: "#111", display: "flex", gap: 10 * u, alignItems: "center", boxShadow: `0 ${6 * u}px ${16 * u}px rgba(0,0,0,0.25)` }}>
                <AppIcon call={n.call} size={34 * u} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 * u, color: "#666", fontWeight: 600 }}>
                    <span>{n.app.toUpperCase()}</span>
                    <span>agora</span>
                  </div>
                  <div style={{ fontSize: 14 * u, fontWeight: 700 }}>{n.who}</div>
                  <div style={{ fontSize: 13.5 * u, color: n.call ? RED : "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: n.call ? 600 : 400 }}>{n.text}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const PhoneOnTowel = ({ t, empty, vibrate }: { t: number; empty?: boolean; vibrate?: boolean }) => {
  let jx = 0;
  let jy = 0;
  let creep = 0;
  if (vibrate)
    ARRIVE.forEach((a) => {
      const d = t - a;
      if (d >= 0) creep += Math.min(d, 0.12) * 40;
      if (d >= 0 && d < 0.18 && t < END) {
        const k = 1 - d / 0.18;
        jx += Math.sin(d * 140) * 7 * k;
        jy += Math.cos(d * 120) * 4 * k;
      }
    });
  return (
    <div style={{ position: "absolute", left: 540 - PW / 2 + jx + creep * 0.35, top: 700 + jy, width: PW, height: PS.height, transform: `perspective(1800px) rotateX(9deg) rotateZ(${-7 + creep * 0.03}deg)`, transformOrigin: "50% 100%" }}>
      <Phone width={PW} time="14:32" darkStatus>
        <LockScreen t={t} empty={empty} />
      </Phone>
    </div>
  );
};

/* ------------------------------------------------------------- shared pieces ------------------------------------------------------------- */
const Notif = ({ who, text, call, scale = 1 }: { who: string; text: string; call?: boolean; scale?: number }) => (
  <div style={{ padding: `${24 * scale}px ${28 * scale}px`, borderRadius: 36 * scale, background: "rgba(245,245,247,0.96)", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", display: "flex", gap: 20 * scale, alignItems: "center", fontFamily: SYS, color: "#111" }}>
    <AppIcon call={call} size={80 * scale} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 * scale, color: "#666", fontWeight: 600 }}>
        <span>WHATSAPP</span>
        <span>agora</span>
      </div>
      <div style={{ fontSize: 34 * scale, fontWeight: 800 }}>{who}</div>
      <div style={{ fontSize: 34 * scale, lineHeight: 1.25 }}>{text}</div>
    </div>
  </div>
);

const Stamp = ({ t, from }: { t: number; from: number }) => {
  const p = at(t, [from, from + 0.2], [0, 1], Easing.out(Easing.back(2.2)));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", right: -10, top: -26, padding: "8px 18px", borderRadius: 12, border: `5px solid ${RED}`, color: RED, background: "rgba(255,255,255,0.92)", fontFamily: MONO, fontWeight: 600, fontSize: 30, letterSpacing: 3, rotate: "6deg", scale: `${2.2 - 1.2 * p}`, opacity: Math.min(1, p * 1.6) }}>
      SÓ ELE SABE
    </div>
  );
};

// Whip in/out for a scene living in [a, b)
const whipX = (t: number, a: number, b: number) => at(t, [a, a + 0.22], [1, 0], Easing.out(Easing.cubic)) * 900 - at(t, [b - 0.16, b], [0, 1], Easing.in(Easing.cubic)) * 900;

/* ---------------------------------------------------------------- the map ---------------------------------------------------------------- */
const CENTER = { x: 540, y: 1020 };
const NODES = [
  { id: "loja", label: "Loja", x: 210, y: 720 },
  { id: "fin", label: "Financeiro", x: 870, y: 720 },
  { id: "vendas", label: "Vendas", x: 150, y: 1030 },
  { id: "estoque", label: "Estoque", x: 930, y: 1030 },
  { id: "forn", label: "Fornecedor", x: 210, y: 1340 },
  { id: "cli", label: "Clientes", x: 870, y: 1340 },
];
const ANSWERS: Record<string, { q: string; a: string; at: number }> = {
  fin: { q: "Senha", a: "acesso por função", at: 19.95 },
  vendas: { q: "Preço", a: "tabela no sistema", at: 20.2 },
  loja: { q: "Nota", a: "anexada no pedido", at: 20.45 },
  forn: { q: "Pagamento", a: "aprovação no fluxo", at: 20.7 },
};

const MapScene = ({ t }: { t: number }) => {
  const toHub = spr(t, T.hub, FPS, { damping: 16, stiffness: 110 }); // Carlos leaves, hub arrives
  const red = at(t, [T.cabeca - 0.1, T.cabeca + 0.25], [0, 1]) * (1 - toHub);
  const tremble = red > 0.5 && t < T.hub ? Math.sin(t * 90) * 4 * lin(t, [T.cabeca, T.so + 0.3], [0.4, 1.4]) : 0;
  const carlos = { x: CENTER.x, y: CENTER.y + toHub * 620, s: 1 - toHub * 0.45 };
  const hubP = spr(t, T.hub + 0.1, FPS, { damping: 12, stiffness: 170 });
  const green = at(t, [T.encontra - 0.05, T.encontra + 0.2], [0, 1]);
  return (
    <AbsoluteFill>
      <svg style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
        {NODES.map((n, i) => {
          const draw = at(t, [S.virada + 0.3 + i * 0.12, S.virada + 0.75 + i * 0.12], [0, 1]);
          const ox = n.x + (i % 2 ? 1 : -1) * tremble;
          const oy = n.y + tremble * 0.6;
          // old line to Carlos (fades as the hub takes over)
          const oldOpacity = 1 - at(t, [T.hub, T.hub + 0.3], [0, 1]);
          const reroute = at(t, [T.hub + 0.25 + i * 0.07, T.hub + 0.65 + i * 0.07], [0, 1]);
          const lineColor = red > 0.01 ? `rgba(255,59,92,${0.55 + 0.45 * red})` : "rgba(143,184,255,0.55)";
          return (
            <g key={n.id}>
              {oldOpacity > 0 ? (
                <line x1={ox} y1={oy} x2={ox + (carlos.x - ox) * draw} y2={oy + (CENTER.y - oy) * draw} stroke={lineColor} strokeWidth={6 + red * 3} strokeLinecap="round" opacity={oldOpacity} />
              ) : null}
              {/* packets running into Carlos (questions) */}
              {draw >= 1 && oldOpacity > 0.5
                ? [0, 1].map((k) => {
                    const q = (t * (0.9 + red * 1.4) + k * 0.5 + i * 0.17) % 1;
                    return <circle key={k} cx={ox + (CENTER.x - ox) * q} cy={oy + (CENTER.y - oy) * q} r={10} fill={red > 0.3 ? RED : GLOW} opacity={Math.sin(Math.PI * q) * oldOpacity} />;
                  })
                : null}
              {reroute > 0 ? <line x1={n.x} y1={n.y} x2={n.x + (CENTER.x - n.x) * reroute} y2={n.y + (CENTER.y - n.y) * reroute} stroke={green > 0.5 ? MINT : GLOW} strokeWidth={6} strokeLinecap="round" /> : null}
              {reroute >= 1
                ? [0, 1].map((k) => {
                    const q = (t * 0.8 + k * 0.5 + i * 0.13) % 1;
                    return <circle key={`r${k}`} cx={n.x + (CENTER.x - n.x) * q} cy={n.y + (CENTER.y - n.y) * q} r={9} fill={green > 0.5 ? MINT : GLOW} opacity={Math.sin(Math.PI * q)} />;
                  })
                : null}
            </g>
          );
        })}
      </svg>
      {/* outer nodes */}
      {NODES.map((n, i) => {
        const p = spr(t, S.virada + 0.2 + i * 0.1, FPS, { damping: 13, stiffness: 190 });
        const ans = ANSWERS[n.id];
        const ap = ans ? spr(t, ans.at, FPS, { damping: 13, stiffness: 200 }) : 0;
        const chipLeft = Math.min(1080 - 30 - 330, Math.max(30, n.x - 165));
        return (
          <div key={n.id}>
            <div style={{ position: "absolute", left: n.x - 95 + (i % 2 ? 1 : -1) * tremble, top: n.y - 50 + tremble * 0.6, width: 190, height: 100, borderRadius: 26, background: "#FFFFFF", color: INK, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, boxShadow: `0 16px 40px rgba(0,0,0,0.35)${red > 0.5 ? `, 0 0 0 4px ${RED}` : green > 0.5 && ans ? `, 0 0 0 4px ${MINT}` : ""}`, scale: `${p}` }}>{n.label}</div>
            {ans && ap > 0.001 ? (
              <div style={{ position: "absolute", left: chipLeft, top: n.y + 64, width: 330, padding: "12px 16px", borderRadius: 18, background: green > 0.5 ? "rgba(20,199,154,0.95)" : "rgba(255,255,255,0.95)", color: green > 0.5 ? "#04291F" : INK, fontFamily: SANS, fontSize: 24, lineHeight: 1.2, opacity: Math.min(1, ap * 1.5), scale: `${(0.7 + 0.3 * ap) * (1 + bump(t, T.encontra + 0.05, 0.4) * 0.08)}`, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", textAlign: "center" }}>
                <b>{ans.q}</b> → {ans.a}
              </div>
            ) : null}
          </div>
        );
      })}
      {/* Carlos */}
      <div style={{ position: "absolute", left: carlos.x - 120, top: carlos.y - 120, width: 240, height: 240, scale: `${carlos.s * spr(t, S.virada + 0.1, FPS, { damping: 13, stiffness: 160 }) * (1 + bump(t, T.so + 0.05, 0.4) * 0.12)}`, translate: `${tremble}px 0px` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: red > 0.01 ? `rgba(255,59,92,${0.2 + 0.25 * red})` : "rgba(51,119,255,0.18)", boxShadow: red > 0.3 ? `0 0 ${80 * red}px ${20 * red}px rgba(255,59,92,0.45)` : "none" }} />
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: red > 0.3 ? RED : "#E8EEFF", color: red > 0.3 ? "#fff" : INK, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 80 }}>C</div>
        <div style={{ position: "absolute", left: -40, right: -40, top: 250, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#fff" }}>Seu Carlos</div>
        {toHub > 0.5 ? <div style={{ position: "absolute", left: -20, right: -20, top: 300, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#FFD166", opacity: toHub }}>de férias</div> : null}
      </div>
      {/* the system hub */}
      {hubP > 0.001 ? (
        <div style={{ position: "absolute", left: CENTER.x - 160, top: CENTER.y - 90, width: 320, height: 180, borderRadius: 40, background: `linear-gradient(135deg, ${GLOW}, #0039B8)`, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS, boxShadow: `0 0 ${60 + green * 40}px rgba(51,119,255,0.6)`, scale: `${hubP}` }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, opacity: 0.8 }}>TUDO EM UM LUGAR</div>
          <div style={{ fontWeight: 800, fontSize: 52 }}>Sistema</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- stage ---------------------------------------------------------------- */
const QUESTIONS = [
  { who: "Ana · Loja", text: "Seu Carlos, cadê a nota do fornecedor?", hi: T.nota },
  { who: "Rafa · Financeiro", text: "Qual a senha do banco??", hi: T.senha },
  { who: "Bruno · Vendas", text: "Quanto eu cobro desse cliente?", hi: T.preco },
  { who: "Rafa · Financeiro", text: "Liberou o pagamento do fornecedor?", hi: 10.9 },
];

const Stage = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const els: React.ReactNode[] = [];

  /* 1 · hook */
  if (t < S.perguntas + 0.05) {
    const push = lin(t, [0, END], [1, 1.12]);
    const out = at(t, [S.perguntas - 0.25, S.perguntas], [0, 1], Easing.in(Easing.cubic));
    const n = count(t);
    const hit = at(t, [END, END + 0.15], [1.35, 1], Easing.out(Easing.back(2.5)));
    const lift = spr(t, END + 0.25, FPS, { damping: 14, stiffness: 170 });
    els.push(
      <AbsoluteFill key="hook" style={{ opacity: 1 - out }}>
        <AbsoluteFill style={{ scale: `${push * (1 + out * 0.3)}`, transformOrigin: "540px 1150px" }}>
          <PhoneOnTowel t={t} vibrate />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, opacity: at(t, [END + 0.3, END + 0.5], [1, 0]) }}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>CHAMADAS PERDIDAS</div>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: -6, color: n >= 47 ? RED : "#FFFFFF", textShadow: "0 8px 40px rgba(0,0,0,0.55)", scale: `${n >= 47 ? hit : 1}` }}>{n}</div>
        </div>
        <Kinetic t={t} words={HOOK1} size={84} top={360} from={0.05} to={1.9} font={SANS} accent="#FFD166" />
        <Kinetic t={t} words={HOOK2} size={96} top={340} from={1.9} to={END + 0.45} font={SANS} accent={RED} />
        {t > END + 0.2 ? (
          <div style={{ position: "absolute", left: 70, right: 70, top: 640, opacity: Math.min(1, lift * 1.4), transform: `translateY(${(1 - lift) * 260}px) scale(${0.7 + 0.3 * lift})` }}>
            <Notif who="Ana · Loja" text="Seu Carlos, cadê a nota do fornecedor?" />
          </div>
        ) : null}
      </AbsoluteFill>,
    );
  }

  /* 2 · only he knows */
  if (t >= S.perguntas - 0.01 && t < S.virada + 0.01) {
    const x = whipX(t, S.perguntas, S.virada) * (t < S.perguntas + 0.3 ? 0 : 1);
    const hiNow = QUESTIONS.findIndex((q) => q.hi > 0 && t >= q.hi && t < q.hi + (q.hi === T.nota ? 1.4 : 0.85));
    els.push(
      <AbsoluteFill key="perg" style={{ translate: `${x}px 0px` }}>
        <Kinetic t={t} words={SO_ELE} size={104} top={150} from={6.8} to={S.virada} font={SANS} accent={RED} />
        {QUESTIONS.map((q, i) => {
          const p = i === 0 ? 1 : spr(t, 4.75 + i * 0.55, FPS, { damping: 14, stiffness: 170 });
          const y0 = i === 0 ? at(t, [S.perguntas, S.perguntas + 0.5], [640, 430]) : 430 + i * 270;
          const focus = hiNow < 0 ? 1 : hiNow === i ? 1.06 : 0.9;
          const dim = hiNow < 0 || hiNow === i ? 1 : 0.4;
          return (
            <div key={i} style={{ position: "absolute", left: 70 + (i % 2) * 20, right: 70 - (i % 2) * 20, top: y0, rotate: `${[-1.5, 1.5, -1, 1.2][i]}deg`, opacity: Math.min(1, p * 1.5) * dim, transform: `translateY(${(1 - p) * 200}px) scale(${(0.8 + 0.2 * p) * focus})` }}>
              <div style={{ position: "relative" }}>
                <Notif who={q.who} text={q.text} scale={0.92} />
                <Stamp t={t} from={7.45 + i * 0.12} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>,
    );
  }

  /* 3-4 · the map: the company lives in one head → the system */
  if (t >= S.virada - 0.01 && t < S.fecho + 0.01) {
    const x = whipX(t, S.virada, S.fecho);
    els.push(
      <AbsoluteFill key="map" style={{ translate: `${x}px 0px` }}>
        <MapScene t={t} />
        <Kinetic t={t} words={NAO_EQUIPE} size={96} top={150} from={S.virada + 0.1} to={13.5} font={SANS} accent="#8FB8FF" />
        <Kinetic t={t} words={CABECA} size={84} top={130} from={13.5} to={S.sistema + 0.1} font={SANS} accent={RED} />
        <Kinetic t={t} words={ENCONTRA} size={92} top={150} from={19.8} to={S.fecho} font={SANS} accent={MINT} />
      </AbsoluteFill>,
    );
  }

  /* 5 · same beach, zero calls */
  if (t >= S.fecho - 0.01 && t < S.cta + 0.01) {
    const x = whipX(t, S.fecho, S.cta);
    const z = bump(t, T.zero + 0.1, 0.5);
    els.push(
      <AbsoluteFill key="fecho" style={{ translate: `${x}px 0px` }}>
        <AbsoluteFill style={{ scale: `${lin(t, [S.fecho, S.cta], [1.08, 1])}`, transformOrigin: "540px 1150px" }}>
          <PhoneOnTowel t={t} empty />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS }}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.9)", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>CHAMADAS PERDIDAS</div>
          <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: -6, color: t > T.zero ? MINT : "#FFFFFF", textShadow: "0 8px 40px rgba(0,0,0,0.55)", scale: `${1 + z * 0.15}` }}>0</div>
        </div>
        <Kinetic t={t} words={FECHO} size={76} top={330} from={S.fecho + 0.1} to={S.cta} font={SANS} accent={MINT} />
      </AbsoluteFill>,
    );
  }

  /* 6 · CTA */
  if (t >= S.cta - 0.01) {
    const x = whipX(t, S.cta, 999);
    const logo = at(t, [T.diag + 0.6, T.diag + 0.9], [0, 1]);
    const btn = spr(t, T.diag - 0.05, FPS, { damping: 10, stiffness: 200 });
    els.push(
      <AbsoluteFill key="cta" style={{ translate: `${x}px 0px` }}>
        <Kinetic t={t} words={CTA_Q} size={112} top={400} from={S.cta} to={99} font={SANS} accent="#3377FF" />
        {btn > 0.001 ? (
          <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 46px", borderRadius: 999, background: "#25D366", color: "#05210F", fontFamily: SANS, fontWeight: 800, fontSize: 50, letterSpacing: -1, scale: `${btn + bump(t, T.whats + 0.2, 0.5) * 0.06}`, boxShadow: `0 0 ${50 + bump(t, T.whats + 0.2, 0.6) * 60}px rgba(37,211,102,0.45)` }}>
              <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke="#05210F" strokeWidth={2.2} strokeLinejoin="round">
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
              </svg>
              Diagnóstico gratuito
            </div>
          </div>
        ) : null}
        <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, translate: `0px ${(1 - logo) * 30}px` }}>
          <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 480 }} />
        </div>
        <div style={{ position: "absolute", top: 1220, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 36, color: C.ice, opacity: at(t, [T.whats, T.whats + 0.3], [0, 0.85]) }}>no WhatsApp · @codexy.ai</div>
      </AbsoluteFill>,
    );
  }

  return <AbsoluteFill>{els}</AbsoluteFill>;
};

/* ------------------------------------------------------------- background ------------------------------------------------------------- */
const Towel = () => (
  <div style={{ position: "absolute", left: -300, right: -300, top: 1180, height: 1400, transform: "perspective(1400px) rotateX(62deg)", transformOrigin: "50% 0%" }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, #F4F1EA 0px, #F4F1EA 46px, #FF7A59 46px, #FF7A59 86px, #F4F1EA 86px, #F4F1EA 132px, #2BB3C0 132px, #2BB3C0 160px)", filter: "brightness(0.95) contrast(0.95)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15), rgba(0,0,0,0.35) 90%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1.2px)", backgroundSize: "6px 6px" }} />
  </div>
);

const Beach = ({ t, t0, t1, dim = 0 }: { t: number; t0: number; t1: number; dim?: number }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: `blur(${4 + dim * 18}px) brightness(${1 - dim * 0.55})`, translate: "0px -430px" }}>
      <BRoll src="broll/ferias-47/praia.mp4" t={t} t0={t0} t1={t1} fps={FPS} zoom={[1.12, 1.2]} origin="50% 40%" grade="brightness(1.02) contrast(1.05) saturate(1.1)" />
    </AbsoluteFill>
    {dim < 0.5 ? <Towel /> : null}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
);

const Background = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: "#03060F" }}>
      {t < S.perguntas + 0.2 ? <Beach t={t} t0={0} t1={S.perguntas} /> : null}
      {t >= S.perguntas && t < S.virada ? <Beach t={t} t0={S.perguntas} t1={S.virada} dim={at(t, [S.perguntas, S.perguntas + 0.4], [0, 1])} /> : null}
      {t >= S.virada && t < S.fecho ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #0D2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }} /> : null}
      {t >= S.fecho && t < S.cta ? <Beach t={t} t0={S.fecho} t1={S.cta} /> : null}
      {t >= S.cta ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }} /> : null}
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- audio --------------------------------------------------------------- */
const MUSICA = "music/clinica-24h.mp3";
const MUSIC = [
  { from: 4.3, trackFrom: 3.0, trackTo: 16.1, fadeIn: 0.4, fadeOut: 0.3, vol: 0.75 },
  { from: 17.4, trackFrom: 22.5, trackTo: 27.8, fadeIn: 0.15, fadeOut: 0.6, vol: 0.75 },
  { from: 26.9, trackFrom: 27.4, trackTo: 33.0, fadeIn: 0.4, fadeOut: 0.5, vol: 0.75 },
];

const sfx = (name: string, s: number, volume: number) => (
  <Sequence key={`${name}-${s}`} from={Math.max(0, f(s))} premountFor={FPS}>
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

export const Ferias47: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const blurOn = getRemotionEnvironment().isRendering && !getInputProps().preview;
  const redPulse = bump(t, T.so + 0.05, 0.6);
  return (
    <AbsoluteFill style={{ background: "#03060F", overflow: "hidden" }}>
      <Background />
      {blurOn ? (
        <CameraMotionBlur shutterAngle={180} samples={6}>
          <Stage />
        </CameraMotionBlur>
      ) : (
        <Stage />
      )}
      {redPulse > 0 ? <AbsoluteFill style={{ boxShadow: `inset 0 0 260px rgba(255,59,92,${redPulse * 0.5})` }} /> : null}
      <Grain vignette amount={0.05} />

      {/* waves: hook and the closing beach */}
      <Sequence from={0} durationInFrames={f(S.perguntas + 0.6)}>
        <Audio src={staticFile("sfx/ia-ondas.mp3")} volume={(fr) => 0.75 * lin(fr / FPS, [S.perguntas - 0.1, S.perguntas + 0.6], [1, 0])} />
      </Sequence>
      <Sequence from={f(S.fecho - 0.1)} durationInFrames={f(S.cta - S.fecho + 0.5)}>
        <Audio src={staticFile("sfx/ia-ondas.mp3")} volume={(fr) => 0.8 * lin(fr / FPS, [0, 0.3], [0, 1]) * lin(fr / FPS, [S.cta - S.fecho, S.cta - S.fecho + 0.5], [1, 0])} />
      </Sequence>
      {ARRIVE.map((a, i) => (
        <Sequence key={`vib-${i}`} from={f(a)} durationInFrames={Math.max(1, f(END - a))}>
          <Audio src={staticFile("sfx/ia-phone-vibrate.mp3")} volume={0.5} />
        </Sequence>
      ))}
      {MUSIC.map((m, i) => {
        const len = m.trackTo - m.trackFrom;
        return (
          <Sequence key={`mus-${i}`} from={f(m.from)} durationInFrames={f(len)} premountFor={FPS}>
            <Audio src={staticFile(MUSICA)} trimBefore={f(m.trackFrom)} volume={(fr) => m.vol * lin(fr / FPS, [0, m.fadeIn], [0, 1]) * lin(fr / FPS, [len - m.fadeOut, len], [1, 0])} />
          </Sequence>
        );
      })}
      {N.map((n) => (
        <Sequence key={n.file} from={f(n.at)} premountFor={FPS}>
          <Audio src={staticFile(`narracao/ferias-47/${n.file}`)} />
        </Sequence>
      ))}
      {sfx("ia-impact", END, 0.45)}
      {sfx("ia-whip", S.perguntas - 0.05, 0.4)}
      {[0, 1, 2, 3].map((i) => sfx("ia-ui-pop", 7.45 + i * 0.12, 0.45))}
      {[T.senha, T.preco, T.nota].map((s) => sfx("ia-ui-pop", s, 0.4))}
      {sfx("ia-whip", S.virada - 0.05, 0.45)}
      {sfx("ia-impact", T.cabeca, 0.4)}
      {sfx("ia-impact", T.so, 0.55)}
      {sfx("ia-whip", T.hub, 0.45)}
      {Object.values(ANSWERS).map((a) => sfx("ia-ui-pop", a.at, 0.45))}
      {sfx("ia-ui-pop", T.encontra, 0.55)}
      {sfx("ia-whip", S.fecho - 0.05, 0.4)}
      {sfx("ia-whip", S.cta - 0.05, 0.45)}
      {sfx("ia-ui-pop", T.diag, 0.5)}
    </AbsoluteFill>
  );
};

void life;
void BLUE;
