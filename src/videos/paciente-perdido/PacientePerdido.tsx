import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { BRoll } from "../../shared/kit/BRoll";
import { Chat, type ChatContact, type ChatMsg } from "../../shared/kit/Chat";
import { Kinetic } from "../../shared/kit/Kinetic";
import { at, bump, lin, spr } from "../../shared/kit/motion";
import { Phone, phoneSize } from "../../shared/kit/Phone";
import { C, MONO, SANS } from "../../shared/theme";
import { AGORA, BEATS, BROLL, CTA, DURATION, FPS, HOOK, MUSIC, MUSICA, N, NARRACAO, NEM_SABENDO, NINGUEM, SISTEMA, T, f } from "./timeline";

const MINT = "#14C79A";
const RED = "#FF3B5C";
const INK = "#0E1B33";
const SOFT = "#6B7A93";
const LINE = "#DCE5F0";

/* ------------------------------------------------------------------ data ------------------------------------------------------------------ */

const PEDIDO = "Oi! Ainda dá pra marcar uma limpeza amanhã?";
const OFERTA = "Oi! Temos amanhã às 9h ou 15h. Qual prefere?";

const SUA: ChatContact = {
  name: "Sua Clínica",
  initials: "SC",
  color: "#0EA5A5",
  status: (t) =>
    t < T.agora
      ? { text: "visto por último hoje às 18:02" }
      : t > 10.8 && t < T.reply1
        ? { text: "digitando…", color: "#25D366" }
        : { text: "online", color: "#25D366" },
};
const OUTRA: ChatContact = {
  name: "Outra Clínica",
  initials: "OC",
  color: "#7C3AED",
  status: (t) => (t > 5.45 && t < T.outraReply ? { text: "digitando…", color: "#25D366" } : { text: "online", color: "#25D366" }),
};

const NIGHT_MSGS: ChatMsg[] = [{ id: "a1", side: "out", text: PEDIDO, at: T.send, time: "22:04", deliveredAt: T.delivered }];
const OUTRA_MSGS: ChatMsg[] = [
  { id: "b1", side: "out", text: PEDIDO, at: T.outra - 0.05, time: "23:12", deliveredAt: T.outra + 0.05, readAt: T.outra + 0.2 },
  { id: "b2", side: "in", text: OFERTA, at: T.outraReply, time: "23:12" },
  { id: "b3", side: "out", text: "9h, por favor", at: T.outraNove, time: "23:13", deliveredAt: T.outraNove + 0.05, readAt: T.outraNove + 0.15 },
  { id: "b4", side: "in", text: "Marcado! Te esperamos amanhã às 9h.", at: T.outraOk, time: "23:13" },
];
const DAY_MSGS: ChatMsg[] = [
  { id: "c1", side: "out", text: PEDIDO, at: T.drop, time: "22:04", deliveredAt: T.drop + 0.05, readAt: T.drop + 0.2 },
  { id: "c2", side: "in", text: OFERTA, at: T.reply1, time: "22:04" },
  { id: "c3", side: "out", text: "9h, por favor", at: T.nove, time: "22:05", deliveredAt: T.nove + 0.05, readAt: T.nove + 0.12 },
  { id: "c4", side: "in", text: "Pronto! Limpeza marcada: amanhã, 9h.", at: T.marcado, time: "22:05" },
];

/* --------------------------------------------------------------- pieces --------------------------------------------------------------- */

const PW = 660;
const PS = phoneSize(PW);

// A phone floating in 3D space with a gentle idle drift.
const FloatingPhone = ({
  t,
  x,
  y,
  scale = 1,
  rotY = -6,
  opacity = 1,
  filter,
  glow = 0,
  zoom = 1,
  time,
  children,
}: {
  t: number;
  x: number;
  y: number;
  scale?: number;
  rotY?: number;
  opacity?: number;
  filter?: string;
  glow?: number;
  zoom?: number;
  time: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      position: "absolute",
      left: x - PW / 2,
      top: y - PS.height / 2,
      width: PW,
      height: PS.height,
      opacity,
      filter,
      transform: `perspective(2600px) translateY(${Math.sin(t * 1.1) * 8}px) rotateY(${rotY + Math.sin(t * 0.8) * 2}deg) rotateX(${3 + Math.cos(t * 0.7) * 1.5}deg) scale(${scale * zoom})`,
      transformOrigin: "50% 78%",
    }}
  >
    <Phone width={PW} time={time} glow={glow}>
      {children}
    </Phone>
  </div>
);

const ChatIn = ({ t, contact, msgs, typing, draft }: { t: number; contact: ChatContact; msgs: ChatMsg[]; typing?: { from: number; to: number }[]; draft?: { text: string; from: number; sendAt: number } }) => (
  <Chat t={t} fps={FPS} u={PS.u} w={PS.screenW} h={PS.screenH} contact={contact} messages={msgs} typing={typing} draft={draft} />
);

const Headline = ({ t, text, from, to, top, size = 74, color = INK }: { t: number; text: string; from: number; to: number; top: number; size?: number; color?: string }) => {
  const p = at(t, [from, from + 0.28], [0, 1]);
  const o = Math.min(p, at(t, [to - 0.15, to], [1, 0]));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.035, color, opacity: o, translate: `0px ${(1 - p) * 30}px`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined }}>
      {text}
    </div>
  );
};

const Check = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Panel = ({ x, y, w, p, children, accent }: { x: number; y: number; w: number; p: number; children: React.ReactNode; accent?: string }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      padding: 28,
      borderRadius: 34,
      background: "#FFFFFF",
      border: `3px solid ${accent ?? LINE}`,
      boxShadow: "0 18px 40px rgba(14,27,51,0.12)",
      fontFamily: SANS,
      color: INK,
      opacity: Math.min(1, p * 1.5),
      transform: `translateX(${(1 - p) * 140}px) scale(${0.9 + 0.1 * p})`,
    }}
  >
    {children}
  </div>
);

const SLOTS = [
  { h: "08:00", who: "Paula · avaliação" },
  { h: "09:00", who: "Paciente novo · limpeza", fill: true },
  { h: "10:30", who: "Rui · retorno" },
  { h: "15:00", who: "" },
];

/* ---------------------------------------------------------------- stage ---------------------------------------------------------------- */
// Everything that moves lives here, inside the motion blur (it reads the frame itself, as CameraMotionBlur requires).

const Stage = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // 2 · night chat phone
  const inA = spr(t, T.phoneIn, FPS, { damping: 14, stiffness: 120 });
  const cutOut = at(t, [T.ninguem - 0.08, T.ninguem + 0.06], [0, 1], Easing.in(Easing.cubic));
  const cutIn = at(t, [T.cutBack, T.cutBack + 0.16], [0, 1]);
  const toB = at(t, [T.outra - 0.05, T.outra + 0.18], [0, 1], Easing.inOut(Easing.cubic));
  const aBack = spr(t, T.nemSabendo - 0.1, FPS, { damping: 16, stiffness: 130 });
  const spin = lin(t, [T.agora, T.agora + 0.75], [0, 1]);
  const spinE = Easing.in(Easing.cubic)(spin);

  let ax = 540 + (1 - inA) * 0 - cutOut * (1 - cutIn) * 1300 - toB * 1300;
  let ay = 980 + (1 - inA) * 1400;
  let aScale = 1;
  let aOp = t < T.phoneIn ? 0 : 1;
  let aFilter: string | undefined;
  if (t >= T.nemSabendo - 0.1) {
    // the forgotten chat comes back, small and grey, next to the competitor's
    ax = 1300 - aBack * (1300 - 735);
    ay = 900;
    aScale = 0.62;
    aFilter = `grayscale(${aBack}) brightness(${1 - aBack * 0.25})`;
  }
  // competitor phone
  const bx = 540 + (1 - toB) * 1300 - aBack * (540 - 330);
  const bScale = 1 - aBack * 0.38;
  // rewind spin
  const spinRot = spinE * 540;
  const spinScale = 1 - spinE * 0.85;
  const spinOp = 1 - at(t, [T.agora + 0.55, T.agora + 0.8], [0, 1]);

  // 5 · answer phone
  const inC = spr(t, T.drop + 0.02, FPS, { damping: 15, stiffness: 140 });
  const side = spr(t, T.toAgenda, FPS, { damping: 17, stiffness: 120 });
  const sysOut = at(t, [T.sistema, T.sistema + 0.45], [0, 1], Easing.inOut(Easing.cubic));
  const cx = 540 - side * 215;
  const cScale = (0.9 + 0.1 * inC) * (1 - side * 0.24) * (1 - sysOut * 0.6);

  const agendaP = spr(t, T.toAgenda + 0.12, FPS, { damping: 15, stiffness: 130 }) * (1 - sysOut);
  const recP = spr(t, T.recepcao + 0.05, FPS, { damping: 15, stiffness: 130 }) * (1 - sysOut);
  const fill = at(t, [T.slotFill - 0.05, T.slotFill + 0.2], [0, 1]);
  const ticketP = spr(t, T.ticket + 0.35, FPS, { damping: 13, stiffness: 160 });

  // flying chips (with the motion blur they streak naturally)
  const fly = (s: number, x1: number, y1: number, x2: number, y2: number, label: string, color: string) => {
    if (t < s || t > s + 0.55) return null;
    const u = at(t, [s, s + 0.45], [0, 1], Easing.inOut(Easing.cubic));
    const x = x1 + (x2 - x1) * u;
    const y = y1 + (y2 - y1) * u - Math.sin(Math.PI * u) * 120;
    return (
      <div style={{ position: "absolute", left: x - 150, top: y - 34, width: 300, height: 68, borderRadius: 34, background: color, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 28, display: "grid", placeItems: "center", boxShadow: `0 0 40px ${color}`, opacity: at(t, [s + 0.45, s + 0.55], [1, 0]), scale: `${1 - u * 0.2}` }}>
        {label}
      </div>
    );
  };

  // 6 · system graph
  const g = (s: number) => spr(t, s, FPS, { damping: 14, stiffness: 140 });
  const hubP = g(T.sistema + 0.15) * (1 - at(t, [T.cta - 0.05, T.cta + 0.25], [0, 1]));
  const leftP = g(T.seuSistema) * hubP;
  const rightP = g(T.nosso) * hubP;
  const wire = (x1: number, y1: number, x2: number, y2: number, p: number, color: string) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={6} strokeLinecap="round" />
        {p > 0.95
          ? [0, 1, 2].map((i) => {
              const u = (t * 0.9 + i / 3) % 1;
              return <circle key={i} cx={x1 + (x2 - x1) * u} cy={y1 + (y2 - y1) * u} r={11} fill={color} opacity={Math.sin(Math.PI * u)} />;
            })
          : null}
        <title>{len}</title>
      </g>
    );
  };

  return (
    <AbsoluteFill>
      {/* 1 · hook */}
      <Kinetic t={t} words={HOOK} size={124} top={1060} from={0} to={T.phoneIn + 0.15} font={SANS} accent="#7FB0FF" />

      {/* 2-3 · night chat (Sua Clínica) */}
      {t >= T.phoneIn - 0.05 && t < T.agora + 0.85 ? (
        <div style={{ position: "absolute", inset: 0, opacity: aOp * spinOp, transform: t > T.agora ? `perspective(2400px) rotateY(${spinRot}deg) scale(${spinScale})` : undefined, transformOrigin: "735px 900px" }}>
          <FloatingPhone t={t} x={ax} y={ay} scale={aScale} filter={aFilter} time="22:04" glow={bump(t, T.send + 0.05, 0.5) * 0.6} zoom={1 + at(t, [T.send - 0.2, T.send + 0.6], [0, 0.28]) * (1 - aBack)}>
            <ChatIn t={t} contact={SUA} msgs={NIGHT_MSGS} draft={{ text: PEDIDO, from: T.draftFrom, sendAt: T.send }} />
          </FloatingPhone>
        </div>
      ) : null}
      <Kinetic t={t} words={NINGUEM} size={112} top={1150} from={T.ninguem - 0.05} to={T.cutBack + 0.1} font={SANS} accent={RED} />

      {/* 3 · competitor */}
      {t >= T.outra - 0.1 && t < T.agora + 0.85 ? (
        <div style={{ position: "absolute", inset: 0, opacity: spinOp, transform: t > T.agora ? `perspective(2400px) rotateY(${-spinRot}deg) scale(${spinScale})` : undefined, transformOrigin: "330px 900px" }}>
          <FloatingPhone t={t} x={bx} y={t >= T.nemSabendo - 0.1 ? 980 - aBack * 80 : 980} scale={bScale} rotY={-6 + aBack * 10} time="23:12" zoom={1 + at(t, [T.outra, T.outraReply + 0.3], [0, 0.22]) * (1 - aBack)}>
            <ChatIn t={t} contact={OUTRA} msgs={OUTRA_MSGS} typing={[{ from: T.outra + 0.25, to: T.outraReply }]} />
          </FloatingPhone>
        </div>
      ) : null}
      {t > T.outraOk - 0.05 && t < T.agora + 0.4 ? (
        <div style={{ position: "absolute", left: 330 - 170 * (1 - aBack * 0.38), top: 300, padding: "12px 24px", borderRadius: 999, background: MINT, color: "#04291F", fontFamily: SANS, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", gap: 10, scale: `${spr(t, T.outraOk, FPS, { damping: 11, stiffness: 220 })}` }}>
          <Check size={30} color="#04291F" /> marcou com a outra
        </div>
      ) : null}
      <Kinetic t={t} words={NEM_SABENDO} size={104} top={1440} from={T.nemSabendo - 0.2} to={T.agora + 0.3} font={SANS} accent={RED} />

      {/* 4 · rewind */}
      <Kinetic t={t} words={AGORA} size={128} top={760} from={T.agora} to={T.drop + 0.05} font={SANS} accent="#7FB0FF" />

      {/* 5 · the same message, answered */}
      {t >= T.drop - 0.02 && t < T.cta ? (
        <FloatingPhone t={t} x={cx} y={1000 - sysOut * 200} scale={cScale} rotY={-4 + side * 6} opacity={Math.min(1, inC * 1.5) * (1 - sysOut)} time="22:04" zoom={1 + at(t, [T.drop, T.reply1 + 0.3], [0, 0.12]) * (1 - side)}>
          <ChatIn t={t} contact={SUA} msgs={DAY_MSGS} typing={[{ from: T.drop + 0.25, to: T.reply1 }]} />
        </FloatingPhone>
      ) : null}
      {BEATS.map((b) => (
        <Headline key={b.text} t={t} text={b.text} from={b.from} to={b.to} top={110} />
      ))}

      {agendaP > 0.001 ? (
        <Panel x={590} y={430} w={440} p={agendaP} accent={fill > 0 ? "#0055FF" : undefined}>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#0055FF" }}>AGENDA · AMANHÃ</div>
          <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
            {SLOTS.map((s) => {
              const on = s.fill ? fill : 0;
              return (
                <div key={s.h} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: s.fill ? `rgba(20,199,154,${0.16 * on})` : s.who ? "#F1F4F9" : "transparent", border: `2px ${s.who || on ? "solid" : "dashed"} ${s.fill && on ? MINT : LINE}`, scale: s.fill ? `${1 + Math.sin(Math.PI * on) * 0.07}` : "1" }}>
                  <span style={{ fontFamily: MONO, fontSize: 26, color: SOFT }}>{s.h}</span>
                  <span style={{ flex: 1, fontSize: 25, fontWeight: 700, color: s.fill ? "#0B7A5E" : INK, opacity: s.fill ? on : s.who ? 0.75 : 0.35 }}>{s.fill ? s.who : s.who || "livre"}</span>
                  {s.fill && on > 0.5 ? <Check size={28} color={MINT} /> : null}
                </div>
              );
            })}
          </div>
        </Panel>
      ) : null}
      {fly(T.toAgenda + 0.15, 420, 1250, 810, 640, "09:00 · limpeza", MINT)}

      {recP > 0.001 ? (
        <Panel x={590} y={1010} w={440} p={recP} accent={ticketP > 0 ? MINT : undefined}>
          <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#0B7A5E" }}>RECEPÇÃO</div>
          {ticketP <= 0 ? (
            <div style={{ marginTop: 18, fontSize: 28, color: SOFT, lineHeight: 1.35 }}>Só chega aqui o que precisa da equipe.</div>
          ) : (
            <div style={{ marginTop: 18, padding: 20, borderRadius: 22, background: "#F1FBF7", border: `2px solid ${MINT}`, opacity: Math.min(1, ticketP * 1.5), scale: `${0.85 + 0.15 * ticketP}` }}>
              <div style={{ fontSize: 30, fontWeight: 800 }}>Diego · convênio</div>
              <div style={{ fontSize: 24, color: SOFT, marginTop: 2 }}>“Vocês atendem o meu plano?”</div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 21, color: "#C47F00" }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: "#F5A524" }} />
                {t > T.gente - 0.1 ? "EQUIPE RESPONDE ÀS 8H" : "AGUARDANDO A EQUIPE"}
              </div>
            </div>
          )}
        </Panel>
      ) : null}
      {fly(T.ticket, 420, 1150, 810, 1190, "dúvida de convênio", "#F5A524")}

      {/* 6 · works with your system, or ours */}
      {hubP > 0.001 ? (
        <AbsoluteFill>
          <Kinetic t={t} words={SISTEMA} size={78} top={170} from={T.sistema + 0.3} to={T.cta} font={SANS} color={INK} accent="#0055FF" shadow={false} />
          <svg style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
            {wire(540, 830, 285, 1190, leftP, MINT)}
            {wire(540, 830, 795, 1190, rightP, "#0055FF")}
          </svg>
          <div style={{ position: "absolute", left: 540 - 200, top: 700, width: 400, height: 150, borderRadius: 80, background: "linear-gradient(135deg, #3377FF, #0047D6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: SANS, fontWeight: 800, fontSize: 40, boxShadow: "0 24px 70px rgba(0,85,255,0.4)", scale: `${hubP}` }}>
            <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
            </svg>
            Atendimento 24h
          </div>
          {[
            { p: leftP, x: 285, title: "Seu sistema", sub: "agenda e cadastro que você já usa", bg: "#FFFFFF", fg: INK, border: MINT },
            { p: rightP, x: 795, title: "Gestão Codexy", sub: "agenda, pacientes, financeiro", bg: "linear-gradient(135deg, #0055FF, #0A2A8A)", fg: "#FFFFFF", border: "transparent" },
          ].map((n) => (
            <div key={n.title} style={{ position: "absolute", left: n.x - 225, top: 1190, width: 450, padding: "30px 30px", borderRadius: 34, background: n.bg, color: n.fg, border: `3px solid ${n.border}`, boxShadow: "0 26px 60px rgba(14,27,51,0.18)", fontFamily: SANS, textAlign: "center", opacity: Math.min(1, n.p * 1.5), scale: `${0.6 + 0.4 * n.p}` }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>{n.title}</div>
              <div style={{ fontSize: 25, opacity: 0.75, marginTop: 6 }}>{n.sub}</div>
            </div>
          ))}
        </AbsoluteFill>
      ) : null}

      {/* 7 · CTA */}
      <Kinetic t={t} words={CTA} size={140} top={470} from={T.cta + 0.05} to={99} font={SANS} accent="#3377FF" />
      {t > T.logo ? (
        <div style={{ position: "absolute", top: 870, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: at(t, [T.logo, T.logo + 0.3], [0, 1]), translate: `0px ${(1 - at(t, [T.logo, T.logo + 0.4], [0, 1])) * 40}px` }}>
          <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 520 }} />
        </div>
      ) : null}
      {t > T.chama - 0.05 ? (
        <div style={{ position: "absolute", top: 1070, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "30px 48px",
              borderRadius: 999,
              background: "#25D366",
              color: "#05210F",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 52,
              letterSpacing: -1,
              scale: `${spr(t, T.chama - 0.05, FPS, { damping: 10, stiffness: 200 }) + bump(t, T.whats + 0.1, 0.4) * 0.07}`,
              boxShadow: `0 0 ${50 + bump(t, T.whats + 0.1, 0.5) * 60}px rgba(37,211,102,0.45)`,
            }}
          >
            <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#05210F" strokeWidth={2.2} strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
            </svg>
            Chama no WhatsApp
          </div>
          <div style={{ fontFamily: MONO, fontSize: 36, color: C.ice, letterSpacing: 2, opacity: at(t, [T.whats - 0.2, T.whats + 0.2], [0, 0.85]) }}>@codexy.ai</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- background ------------------------------------------------------------- */

// Placeholder when a footage slot has no clip yet: dark gradient with soft drifting bokeh.
const Bokeh = ({ t, tint }: { t: number; tint: string }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${tint} 0%, #03060F 75%)` }}>
    {Array.from({ length: 14 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: ((i * 241) % 1000) + Math.sin(t * 0.3 + i) * 30, top: ((i * 389) % 1800) + Math.cos(t * 0.25 + i) * 30, width: 80 + (i % 4) * 50, height: 80 + (i % 4) * 50, borderRadius: "50%", background: `rgba(${120 + (i % 3) * 40},${150 + (i % 2) * 40},255,0.10)`, filter: "blur(8px)" }} />
    ))}
  </AbsoluteFill>
);

const Footage = ({ src, t, t0, t1, tint, blur = 0, dim = 1, trimBefore = 0 }: { src: string | null; t: number; t0: number; t1: number; tint: string; blur?: number; dim?: number; trimBefore?: number }) => (
  <AbsoluteFill style={{ filter: `${blur ? `blur(${blur}px) ` : ""}brightness(${dim})` }}>
    {src ? <BRoll src={src} t={t} t0={t0} t1={t1} fps={FPS} trimBefore={trimBefore} tint={tint} /> : <Bokeh t={t} tint={tint.replace(/[\d.]+\)$/, "1)")} />}
  </AbsoluteFill>
);

const Background = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const light = at(t, [T.drop - 0.05, T.drop + 0.15], [0, 1]);
  const ctaP = at(t, [T.cta - 0.05, T.cta + 0.3], [0, 1]);
  return (
    <AbsoluteFill style={{ background: "#03060F" }}>
      {t < T.ninguem ? <Footage src={BROLL.hook} t={t} t0={0} t1={T.ninguem} tint="rgba(10,25,70,0.35)" blur={lin(t, [T.phoneIn - 0.1, T.phoneIn + 0.3], [0, 26])} dim={lin(t, [T.phoneIn - 0.1, T.phoneIn + 0.3], [0.85, 0.45])} /> : null}
      {t >= T.ninguem && t < T.cutBack ? <Footage src={BROLL.empty} t={t} t0={T.ninguem} t1={T.cutBack} tint="rgba(20,40,90,0.35)" dim={0.8} /> : null}
      {t >= T.cutBack && t < T.drop + 0.2 ? <Footage src={BROLL.empty} t={t} t0={T.cutBack} t1={T.drop} tint="rgba(10,20,50,0.5)" blur={26} dim={0.4} trimBefore={1} /> : null}
      {/* light world */}
      {light > 0 && ctaP < 1 ? (
        <AbsoluteFill style={{ opacity: light }}>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #F4F8FD 0%, #E7EEF8 100%)" }} />
          {BROLL.clinic ? (
            <AbsoluteFill style={{ opacity: 0.22, filter: "blur(20px) saturate(0.6)" }}>
              <BRoll src={BROLL.clinic} t={t} t0={T.drop} t1={T.cta} fps={FPS} />
            </AbsoluteFill>
          ) : null}
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)" }} />
        </AbsoluteFill>
      ) : null}
      {ctaP > 0 ? <AbsoluteFill style={{ opacity: ctaP, background: `radial-gradient(ellipse at 50% 38%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }} /> : null}
      {/* hook darkening for legibility */}
      {t < T.phoneIn + 0.3 ? <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)" }} /> : null}
    </AbsoluteFill>
  );
};

/* --------------------------------------------------------------- audio --------------------------------------------------------------- */

const sfx = (name: string, s: number, volume: number) => (
  <Sequence key={`${name}-${s}`} from={Math.max(0, f(s))} premountFor={FPS}>
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

export const PacientePerdido: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const flash = bump(t, T.drop, 0.4);
  const dark = t < T.drop || t >= T.cta;
  return (
    <AbsoluteFill style={{ background: "#03060F" }}>
      <Background />
      <CameraMotionBlur shutterAngle={200} samples={6}>
        <Stage />
      </CameraMotionBlur>
      {flash > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash * 0.9 }} /> : null}
      <Grain vignette={dark} amount={dark ? 0.08 : 0.035} />

      {MUSIC.map((m, i) => {
        const len = m.trackTo - m.trackFrom;
        return (
          <Sequence key={`mus-${i}`} from={f(m.from)} durationInFrames={f(len)} premountFor={FPS}>
            <Audio
              src={staticFile(MUSICA)}
              trimBefore={f(m.trackFrom)}
              volume={(fr) => {
                const s = fr / FPS;
                return 0.9 * lin(s, [0, m.fadeIn], [0, 1]) * lin(s, [len - m.fadeOut, len], [1, 0]);
              }}
            />
          </Sequence>
        );
      })}
      {N.map((n) => (
        <Sequence key={n.file} from={f(n.at)} premountFor={FPS}>
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {sfx("ia-phone-vibrate", 0.25, 0.45)}
      {sfx("ia-whip", T.phoneIn - 0.1, 0.35)}
      {sfx("ia-typing", T.draftFrom, 0.5)}
      {sfx("ia-send-swoosh", T.send, 0.6)}
      {sfx("ia-whip", T.ninguem - 0.1, 0.5)}
      {sfx("ia-whip", T.cutBack - 0.05, 0.4)}
      {sfx("ia-whip", T.outra - 0.1, 0.45)}
      {sfx("ia-ui-pop", T.outraReply, 0.5)}
      {sfx("ia-ui-pop", T.outraNove, 0.45)}
      {sfx("ia-ui-pop", T.outraOk, 0.5)}
      {sfx("ia-impact", T.nemSabendo, 0.45)}
      {sfx("ia-rewind", T.agora, 0.55)}
      {sfx("ia-impact", T.drop - 0.03, 0.7)}
      {sfx("ia-ui-pop", T.reply1, 0.5)}
      {sfx("ia-ui-pop", T.nove, 0.45)}
      {sfx("ia-ui-pop", T.marcado, 0.5)}
      {sfx("ia-whip", T.toAgenda, 0.4)}
      {sfx("ia-ui-pop", T.slotFill, 0.55)}
      {sfx("ia-whip", T.ticket, 0.35)}
      {sfx("ia-ui-pop", T.ticket + 0.4, 0.5)}
      {sfx("ia-whip", T.sistema, 0.4)}
      {sfx("ia-ui-pop", T.seuSistema + 0.2, 0.5)}
      {sfx("ia-ui-pop", T.nosso + 0.2, 0.5)}
      {sfx("ia-whip", T.cta - 0.1, 0.45)}
      {sfx("ia-impact", T.cta + 0.1, 0.4)}
      {sfx("ia-ui-pop", T.chama, 0.5)}
    </AbsoluteFill>
  );
};

export { DURATION };
