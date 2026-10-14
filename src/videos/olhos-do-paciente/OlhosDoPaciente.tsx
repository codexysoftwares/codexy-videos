import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Easing, Img, Sequence, getInputProps, getRemotionEnvironment, staticFile, useCurrentFrame } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { BRoll } from "../../shared/kit/BRoll";
import { Chat, type ChatContact, type ChatMsg } from "../../shared/kit/Chat";
import { Kinetic } from "../../shared/kit/Kinetic";
import { at, bump, lin, spr } from "../../shared/kit/motion";
import { Phone, phoneSize } from "../../shared/kit/Phone";
import { C, MONO, SANS } from "../../shared/theme";
import { Dashboard, LockNotif, SearchScreen } from "./Screens";
import { BROLL, CTA_D, CTA_Q, DOR, FPS, HOOK, MUSIC, MUSICA, N, NARRACAO, NEM_VIU, REVELA, S, SOCO, T, f } from "./timeline";

const MINT = "#14C79A";
const RED = "#FF3B5C";
const INK = "#0E1B33";
const PW = 680;
const PS = phoneSize(PW);
const PEDIDO = "Oi! Consegue me encaixar amanhã cedo?";

/* ------------------------------------------------------------ helpers ------------------------------------------------------------ */

// Whip transition for a scene living in [a, b): slides in from the right and out to the left (motion blur streaks it).
const whip = (t: number, a: number, b: number, inDur = 0.22, outDur = 0.16) => {
  const i = at(t, [a, a + inDur], [1, 0], Easing.out(Easing.cubic));
  const o = at(t, [b - outDur, b], [0, 1], Easing.in(Easing.cubic));
  return { x: i * 900 - o * 900, visible: t >= a - 0.01 && t < b + 0.01 };
};

const Floating = ({ t, x, y, scale = 1, rotY = -5, dim = 0, glow = 0, time, children }: { t: number; x: number; y: number; scale?: number; rotY?: number; dim?: number; glow?: number; time: string; children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      left: x - PW / 2,
      top: y - PS.height / 2,
      width: PW,
      height: PS.height,
      filter: dim ? `grayscale(${dim}) brightness(${1 - dim * 0.45})` : undefined,
      transform: `perspective(2600px) translateY(${Math.sin(t * 1.2) * 7}px) rotateY(${rotY + Math.sin(t * 0.8) * 2}deg) rotateX(${3 + Math.cos(t * 0.7) * 1.4}deg) scale(${scale})`,
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

const Chip = ({ t, at: s, x, y, bg, fg, children, origin = "50% 50%" }: { t: number; at: number; x: number; y: number; bg: string; fg: string; children: React.ReactNode; origin?: string }) => {
  const p = spr(t, s, FPS, { damping: 11, stiffness: 210 });
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "14px 26px", borderRadius: 999, background: bg, color: fg, fontFamily: SANS, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", gap: 12, scale: `${p}`, transformOrigin: origin, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};

const Check = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* -------------------------------------------------------------- data -------------------------------------------------------------- */

const SUA: ChatContact = { name: "Sua Clínica", initials: "SC", color: "#0EA5A5", status: () => ({ text: "visto por último hoje às 18:02" }) };
const SORRISO: ChatContact = {
  name: "Clínica Sorriso",
  initials: "CS",
  color: "#7C3AED",
  status: (t) => (t > T.send + 0.15 && t < T.responde ? { text: "digitando…", color: "#25D366" } : { text: "online", color: "#25D366" }),
};
const ANA_SUA: ChatContact = { name: "Ana", initials: "A", color: "#E0812F", status: () => ({ text: "online", color: "#25D366" }) };
const ANA_SORRISO: ChatContact = { name: "Ana", initials: "A", color: "#E0812F", status: () => ({ text: "visto por último hoje às 07:40" }) };

const A_MSGS: ChatMsg[] = [{ id: "a1", side: "out", text: PEDIDO, at: T.send, time: "21:52", deliveredAt: T.send + 0.25 }];
const B_MSGS: ChatMsg[] = [
  { id: "b1", side: "out", text: PEDIDO, at: T.send, time: "21:52", deliveredAt: T.send + 0.1, readAt: T.send + 0.3 },
  { id: "b2", side: "in", text: "Consigo sim! Amanhã às 8h ou 10h?", at: T.responde, time: "21:52" },
  { id: "b3", side: "out", text: "8h", at: 10.02, time: "21:53", deliveredAt: 10.06, readAt: 10.12 },
  { id: "b4", side: "in", text: "Marcado! Amanhã, 8h. Te mando um lembrete.", at: T.oito8h, time: "21:53" },
];
// The clinic's receptionist the next morning
const RECEP_MSGS: ChatMsg[] = [
  { id: "r1", side: "in", text: PEDIDO, at: 0, time: "ontem 21:52" },
  { id: "r2", side: "out", text: "Bom dia, Ana! Temos às 10h, pode ser?", at: 15.2, time: "08:02", deliveredAt: 15.3, readAt: 15.5 },
  { id: "r3", side: "in", text: "Obrigada, mas já marquei em outra clínica ontem à noite.", at: T.cadeira - 0.05, time: "08:03" },
];
// The competitor's side of the same night
const AUTO = "Atendimento automático";
const REV_MSGS: ChatMsg[] = [
  { id: "v1", side: "in", text: PEDIDO, at: 0, time: "21:52" },
  { id: "v2", side: "out", text: "Consigo sim! Amanhã às 8h ou 10h?", at: 0, time: "21:52", deliveredAt: 0, readAt: 0, label: AUTO },
  { id: "v3", side: "in", text: "8h", at: 0, time: "21:53" },
  { id: "v4", side: "out", text: "Marcado! Amanhã, 8h. Te mando um lembrete.", at: 0, time: "21:53", deliveredAt: 0, readAt: 0, label: AUTO },
];

/* -------------------------------------------------------------- stage -------------------------------------------------------------- */

const Stage = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const els: React.ReactNode[] = [];

  /* 1 · hook — text over the night footage */
  els.push(<Kinetic key="hook" t={t} words={HOOK} size={112} top={1180} from={0} to={S.hook[1] + 0.05} font={SANS} accent="#8FB8FF" />);

  /* 2 · pain */
  if (t >= S.dor[0] && t < S.dor[1]) {
    els.push(
      <div key="clock" style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", fontFamily: MONO, color: "#E8EEFF", opacity: at(t, [S.dor[0], S.dor[0] + 0.2], [0, 1]) }}>
        <div style={{ fontSize: 30, letterSpacing: 10, opacity: 0.65 }}>QUINTA · NOITE</div>
        <div style={{ fontSize: 150, fontWeight: 600, lineHeight: 1, scale: `${1 + bump(t, 2.95, 0.4) * 0.08}` }}>21:40</div>
      </div>,
    );
    els.push(<Kinetic key="dor" t={t} words={DOR} size={130} top={1250} from={4.2} to={S.dor[1] + 0.05} font={SANS} accent={RED} />);
  }

  /* 3-4 · search → two chats → the silent race (ONE continuous scene, phones never leave) */
  if (t >= S.busca[0] - 0.01 && t < S.corrida[1] + 0.01) {
    const w = whip(t, S.busca[0], S.corrida[1], 0.01, 0.16);
    // camera: dive out of the screen at the start, then push into "Sua Clínica" on "a outra nem viu"
    const dive = at(t, [S.busca[0], S.busca[0] + 0.55], [2.6, 1], Easing.out(Easing.cubic));
    const push = at(t, [T.outra - 0.1, S.corrida[1]], [1, 1.55], Easing.inOut(Easing.cubic));
    const split = spr(t, T.manda - 0.05, FPS, { damping: 17, stiffness: 120 });
    const ax = 540 - split * 262;
    const aScale = 1 - split * 0.31;
    const bIn = spr(t, T.manda + 0.05, FPS, { damping: 15, stiffness: 120 });
    const bx = 540 + 262 + (1 - bIn) * 800;
    const dimB = at(t, [T.outra - 0.05, T.outra + 0.35], [0, 0.75]);
    const won = spr(t, T.oito8h + 0.1, FPS, { damping: 12, stiffness: 200 });
    els.push(
      <div key="race" style={{ position: "absolute", inset: 0, translate: `${w.x}px 0px`, scale: `${dive * push}`, transformOrigin: "278px 980px" }}>
        <Floating t={t} x={ax} y={1000} scale={aScale} rotY={-4 + split * 8} time="21:52" dim={0}>
          {t < T.manda ? <SearchScreen t={t} u={PS.u} from={S.busca[0] + 0.2} fps={FPS} /> : <ChatIn t={t} contact={SUA} msgs={A_MSGS} draft={{ text: PEDIDO, from: T.manda + 0.12, sendAt: T.send }} />}
        </Floating>
        {bIn > 0.001 ? (
          <Floating t={t} x={bx} y={1000} scale={0.69} rotY={-12} time="21:52" dim={dimB} glow={won * 0.5 * (1 - dimB)}>
            <ChatIn t={t} contact={SORRISO} msgs={B_MSGS} draft={{ text: PEDIDO, from: T.manda + 0.12, sendAt: T.send }} />
          </Floating>
        ) : null}
        {/* labels above each phone */}
        {split > 0.3 ? (
          <>
            <div style={{ position: "absolute", left: 278 - 200, width: 400, top: 470, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "#C9D4EA", opacity: split }}>SUA CLÍNICA</div>
            <div style={{ position: "absolute", left: 802 - 200, width: 400, top: 470, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "#C9D4EA", opacity: split * (1 - dimB) }}>OUTRA CLÍNICA</div>
          </>
        ) : null}
        <Chip t={t} at={T.oito8h + 0.1} x={802 - 165} y={1510} bg={MINT} fg="#04291F">
          <Check size={32} color="#04291F" /> marcou
        </Chip>
        {t > T.outra ? (
          <Chip t={t} at={T.outra + 0.1} x={278 - 190} y={1510} bg={RED} fg="#FFFFFF">
            sem resposta
          </Chip>
        ) : null}
      </div>,
    );
    els.push(<Kinetic key="nemviu" t={t} words={NEM_VIU} size={118} top={190} from={T.outra - 0.25} to={S.corrida[1]} font={SANS} accent={RED} />);
  }

  /* 5 · next morning — the notification nobody opened (over the real footage) */
  if (t >= S.manha[0] && t < S.manha[1] + 0.01) {
    const dive = at(t, [T.abre, S.manha[1]], [1, 3.2], Easing.in(Easing.cubic));
    els.push(
      <div key="manha" style={{ position: "absolute", inset: 0, scale: `${dive}`, transformOrigin: "540px 900px", opacity: at(t, [S.manha[1] - 0.12, S.manha[1]], [1, 0]) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: SANS, color: "#FFFFFF", textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.85 }}>sexta-feira, 08:01</div>
          <div style={{ fontSize: 200, fontWeight: 300, letterSpacing: -6, lineHeight: 1 }}>08:01</div>
        </div>
        <LockNotif t={t} from={S.manha[0] + 0.25} fps={FPS} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#FFFFFF", textShadow: "0 6px 30px rgba(0,0,0,0.6)", opacity: at(t, [12.9, 13.1], [0, 1]) }}>
          Sua recepção abre
          <br />o WhatsApp.
        </div>
      </div>,
    );
  }

  /* 6 · the punch — the receptionist answers, too late */
  if (t >= S.soco[0] - 0.01 && t < S.soco[1] + 0.01) {
    const w = whip(t, S.soco[0], S.soco[1], 0.01, 0.16);
    const zoomIn = at(t, [S.soco[0], S.soco[0] + 0.4], [1.9, 1], Easing.out(Easing.cubic));
    const punch = at(t, [T.cadeira, T.cadeira + 0.9], [1, 1.12], Easing.out(Easing.cubic));
    els.push(
      <div key="soco" style={{ position: "absolute", inset: 0, translate: `${w.x}px 0px`, scale: `${zoomIn * punch}`, transformOrigin: "540px 1500px" }}>
        <Floating t={t} x={540} y={1180} scale={0.86} rotY={4} time="08:03">
          <ChatIn t={t} contact={ANA_SUA} msgs={RECEP_MSGS} draft={{ text: "Bom dia, Ana! Temos às 10h, pode ser?", from: S.soco[0] + 0.02, sendAt: 15.2 }} />
        </Floating>
      </div>,
    );
    els.push(<Kinetic key="soco-t" t={t} words={SOCO} size={104} top={110} from={S.soco[0]} to={S.soco[1] + 0.05} font={SANS} accent={RED} />);
  }

  /* 7 · the reveal — the competitor's side of the same night */
  if (t >= S.revelacao[0] - 0.01 && t < S.revelacao[1] + 0.01) {
    const w = whip(t, S.revelacao[0], S.revelacao[1], 0.22, 0.16);
    const pull = at(t, [S.revelacao[0], T.ligado], [1.25, 0.95], Easing.inOut(Easing.cubic));
    const side = spr(t, T.ligado - 0.05, FPS, { damping: 16, stiffness: 120 });
    const agendaP = spr(t, T.ligado + 0.1, FPS, { damping: 14, stiffness: 140 });
    const fill = at(t, [T.agenda - 0.05, T.agenda + 0.2], [0, 1]);
    const autoGlow = bump(t, T.automatico + 0.2, 0.8);
    els.push(
      <div key="rev" style={{ position: "absolute", inset: 0, translate: `${w.x}px 0px` }}>
        <div style={{ position: "absolute", inset: 0, scale: `${pull}`, transformOrigin: "540px 1100px" }}>
          <Floating t={t} x={540 - side * 240} y={1130} scale={0.86 - side * 0.14} rotY={-6} time="21:53" glow={autoGlow * 0.7}>
            <ChatIn t={t} contact={ANA_SORRISO} msgs={REV_MSGS} />
          </Floating>
        </div>
        <Chip t={t} at={T.um} x={540 - 330 - side * 150} y={420} bg="#0055FF" fg="#FFFFFF">
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
          </svg>
          Atendimento automático · 21:52
        </Chip>
        {agendaP > 0.001 ? (
          <>
            <svg style={{ position: "absolute", inset: 0, width: 1080, height: 1920 }}>
              <path d="M 520 1050 C 640 1050, 660 900, 700 860" stroke="#0055FF" strokeWidth={6} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - agendaP)} strokeLinecap="round" />
              {agendaP > 0.9 ? <circle cx={520 + 180 * ((t * 1.3) % 1)} cy={1050 - 190 * ((t * 1.3) % 1)} r={10} fill="#3377FF" /> : null}
            </svg>
            <div style={{ position: "absolute", left: 600, top: 640, width: 420, padding: 26, borderRadius: 30, background: "#FFFFFF", boxShadow: "0 30px 70px rgba(0,0,0,0.35)", fontFamily: SANS, color: INK, opacity: Math.min(1, agendaP * 1.5), transform: `translateX(${(1 - agendaP) * 160}px) scale(${0.9 + 0.1 * agendaP})` }}>
              <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#0055FF" }}>AGENDA · SEXTA</div>
              {[
                { h: "08:00", who: "Ana · limpeza", fill: true },
                { h: "08:40", who: "Bruno · avaliação" },
                { h: "10:00", who: "livre" },
              ].map((s) => (
                <div key={s.h} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, padding: "12px 14px", borderRadius: 16, background: s.fill ? `rgba(20,199,154,${0.16 * fill})` : "#F1F4F9", border: `2px solid ${s.fill && fill > 0.5 ? MINT : "transparent"}`, scale: s.fill ? `${1 + Math.sin(Math.PI * fill) * 0.07}` : "1" }}>
                  <span style={{ fontFamily: MONO, fontSize: 24, color: "#6B7A93" }}>{s.h}</span>
                  <span style={{ flex: 1, fontSize: 24, fontWeight: 700, opacity: s.fill ? Math.max(0.3, fill) : s.who === "livre" ? 0.4 : 0.8, color: s.fill ? "#0B7A5E" : INK }}>{s.who}</span>
                  {s.fill && fill > 0.5 ? <Check size={26} color={MINT} /> : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>,
    );
    els.push(<Kinetic key="rev-t" t={t} words={REVELA} size={118} top={170} from={S.revelacao[0] + 0.05} to={T.um + 0.05} font={SANS} accent="#8FB8FF" />);
  }

  /* 8 · the morning dashboard */
  if (t >= S.painel[0] - 0.01 && t < S.painel[1] + 0.01) {
    const w = whip(t, S.painel[0], S.painel[1], 0.22, 0.16);
    const drift = lin(t, [S.painel[0], S.painel[1]], [1, 1.06]);
    const hp = at(t, [S.painel[0] + 0.1, S.painel[0] + 0.45], [0, 1]);
    els.push(
      <div key="painel" style={{ position: "absolute", inset: 0, translate: `${w.x}px 0px` }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 76, letterSpacing: -2.5, lineHeight: 1.05, color: INK, opacity: hp, translate: `0px ${(1 - hp) * 30}px` }}>
          Às 8h, a equipe
          <br />
          <span style={{ color: "#0055FF" }}>só abre o painel.</span>
        </div>
        <div style={{ position: "absolute", inset: 0, scale: `${drift}`, transformOrigin: "540px 900px" }}>
          <Dashboard t={t} from={S.painel[0] + 0.15} fps={FPS} beats={{ tudo: T.tudo, respondido: T.respondido, marcado: T.marcadoP, organizado: T.organizado }} />
        </div>
      </div>,
    );
  }

  /* 9 · CTA */
  if (t >= S.cta[0] - 0.01) {
    const w = whip(t, S.cta[0], 999, 0.22, 0.01);
    const logo = at(t, [T.gratuito + 0.2, T.gratuito + 0.5], [0, 1]);
    const btn = spr(t, T.whatsCta - 0.15, FPS, { damping: 10, stiffness: 200 });
    els.push(
      <div key="cta" style={{ position: "absolute", inset: 0, translate: `${w.x}px 0px` }}>
        <Kinetic t={t} words={CTA_Q} size={108} top={330} from={S.cta[0]} to={99} font={SANS} accent="#3377FF" />
        <Kinetic t={t} words={CTA_D} size={136} top={640} from={T.diagnostico - 0.05} to={99} font={SANS} accent="#3377FF" />
        <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logo, translate: `0px ${(1 - logo) * 30}px` }}>
          <Img src={staticFile("brand/codexy-logo-light.png")} style={{ width: 500 }} />
        </div>
        {btn > 0.001 ? (
          <div style={{ position: "absolute", top: 1200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "30px 48px", borderRadius: 999, background: "#25D366", color: "#05210F", fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: -1, scale: `${btn + bump(t, T.whatsCta + 0.5, 0.5) * 0.06}`, boxShadow: `0 0 ${50 + bump(t, T.whatsCta + 0.5, 0.6) * 60}px rgba(37,211,102,0.45)` }}>
              <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#05210F" strokeWidth={2.2} strokeLinejoin="round">
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
              </svg>
              Chama no WhatsApp
            </div>
            <div style={{ fontFamily: MONO, fontSize: 36, color: C.ice, letterSpacing: 2, opacity: at(t, [T.whatsCta + 0.2, T.whatsCta + 0.5], [0, 0.85]) }}>@codexy.ai</div>
          </div>
        ) : null}
      </div>,
    );
  }

  return <AbsoluteFill>{els}</AbsoluteFill>;
};

/* ----------------------------------------------------------- background ----------------------------------------------------------- */

const Night = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, #0D1E4A 0%, #050B1A 70%)" }}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: ((i * 241) % 1000) + Math.sin(t * 0.3 + i) * 30, top: ((i * 389) % 1800) + Math.cos(t * 0.25 + i) * 30, width: 90 + (i % 4) * 50, height: 90 + (i % 4) * 50, borderRadius: "50%", background: `rgba(${110 + (i % 3) * 40},${140 + (i % 2) * 40},255,0.08)`, filter: "blur(10px)" }} />
    ))}
  </AbsoluteFill>
);

const Background = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inS = (s: readonly [number, number]) => t >= s[0] && t < s[1];
  return (
    <AbsoluteFill style={{ background: "#03060F" }}>
      {inS(S.hook) ? (
        <>
          <BRoll src={BROLL.noite} t={t} t0={0} t1={S.hook[1]} fps={FPS} focusX={0.42} zoom={[1.0, 1.75]} origin="40% 40%" grade="brightness(0.9) contrast(1.1)" />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
        </>
      ) : null}
      {inS(S.dor) ? (
        <BRoll src={BROLL.dor} t={t} t0={S.dor[0]} t1={S.dor[1]} fps={FPS} trimBefore={1.5} focusX={0.7} zoom={[1.18, 1.32]} origin="50% 55%" grade="brightness(0.55) contrast(1.15) saturate(0.55)" tint="rgba(15,35,110,0.35)" />
      ) : null}
      {t >= S.busca[0] && t < S.manha[0] ? <Night t={t} /> : null}
      {inS(S.manha) ? <BRoll src={BROLL.mesa} t={t} t0={S.manha[0]} t1={S.manha[1]} fps={FPS} zoom={[1.08, 1.2]} grade="brightness(0.95) contrast(1.05) saturate(1.05)" tint="rgba(255,170,90,0.14)" /> : null}
      {inS(S.soco) ? (
        <AbsoluteFill style={{ filter: "blur(28px) brightness(0.45)" }}>
          <BRoll src={BROLL.mesa} t={t} t0={S.soco[0]} t1={S.soco[1]} fps={FPS} trimBefore={3} tint="rgba(255,150,80,0.15)" />
        </AbsoluteFill>
      ) : null}
      {inS(S.revelacao) ? <Night t={t} /> : null}
      {inS(S.painel) ? <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #EAF0F8 70%)" }} /> : null}
      {t >= S.cta[0] ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #0A2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` }} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- audio ------------------------------------------------------------- */

const sfx = (name: string, s: number, volume: number) => (
  <Sequence key={`${name}-${s}`} from={Math.max(0, f(s))} premountFor={FPS}>
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

export const OlhosDoPaciente: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const light = t >= S.painel[0] && t < S.cta[0];
  const redPulse = bump(t, T.cadeira + 0.05, 0.7);
  return (
    <AbsoluteFill style={{ background: "#03060F" }}>
      <Background />
      {/* Motion blur draws every frame 6×: only in the final render (not in the Studio nor in --props={"preview":true} drafts). */}
      {getRemotionEnvironment().isRendering && !getInputProps().preview ? (
        <CameraMotionBlur shutterAngle={200} samples={6}>
          <Stage />
        </CameraMotionBlur>
      ) : (
        <Stage />
      )}
      {redPulse > 0 ? <AbsoluteFill style={{ boxShadow: `inset 0 0 260px rgba(255,59,92,${redPulse * 0.55})` }} /> : null}
      <Grain vignette={!light} amount={light ? 0.035 : 0.08} />

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
          <Audio src={staticFile(`${NARRACAO}/${n.file}`)} />
        </Sequence>
      ))}
      {sfx("ia-whip", 0, 0.3)}
      {sfx("ia-impact", S.dor[0] - 0.02, 0.45)}
      {sfx("ia-whip", S.busca[0] - 0.05, 0.4)}
      {sfx("ia-typing", S.busca[0] + 0.25, 0.4)}
      {sfx("ia-typing", T.manda + 0.12, 0.45)}
      {sfx("ia-send-swoosh", T.send, 0.6)}
      {sfx("ia-ui-pop", T.responde, 0.5)}
      {sfx("ia-ui-pop", 10.02, 0.45)}
      {sfx("ia-ui-pop", T.oito8h, 0.5)}
      {sfx("ia-impact", T.outra + 0.1, 0.35)}
      {sfx("ia-whip", S.manha[0] - 0.05, 0.4)}
      {sfx("ia-phone-vibrate", S.manha[0] + 0.25, 0.5)}
      {sfx("ia-whip", T.abre, 0.35)}
      {sfx("ia-typing", S.soco[0] + 0.02, 0.4)}
      {sfx("ia-send-swoosh", 15.2, 0.5)}
      {sfx("ia-impact", T.cadeira, 0.65)}
      {sfx("ia-whip", S.revelacao[0] - 0.05, 0.45)}
      {sfx("ia-ui-pop", T.um, 0.5)}
      {sfx("ia-whip", T.ligado, 0.35)}
      {sfx("ia-ui-pop", T.agenda, 0.5)}
      {sfx("ia-whip", S.painel[0] - 0.05, 0.45)}
      {sfx("ia-ui-pop", T.respondido, 0.45)}
      {sfx("ia-ui-pop", T.marcadoP, 0.45)}
      {sfx("ia-ui-pop", T.organizado, 0.45)}
      {sfx("ia-whip", S.cta[0] - 0.05, 0.45)}
      {sfx("ia-impact", T.diagnostico, 0.35)}
      {sfx("ia-ui-pop", T.whatsCta - 0.1, 0.5)}
    </AbsoluteFill>
  );
};
