import { Easing } from "remotion";
import { MONO, SANS } from "../../shared/theme";
import { T, hhmm } from "./timeline";
import { Avatar, Bubble, Card, IconCalendar, IconChat, IconCheck, IconCross, IconPlug, IconUser, Kicker, Packet, Q, Typing, Wire, at, lin, pop } from "./Ui";

/* =========================================================================================
   1 · RECEPTION — the clinic closes at 18:00: lamps go out one by one, only the phone lights up.
   ========================================================================================= */

const LAMPS = [
  { x: 250, off: T.lamp1 },
  { x: 540, off: T.lamp2 },
  { x: 830, off: T.lamp3 },
];
const PHONE_DESK = { x: 640, y: 905, w: 170, h: 300 };

export const Reception = ({ t }: { t: number }) => {
  if (t > 3.45) return null;
  const lights = LAMPS.map((l) => 1 - at(t, [l.off, l.off + 0.12], [0, 1], Easing.linear) * (0.85 + 0.15 * Math.max(0, Math.sin((t - l.off) * 60))));
  const room = lights.reduce((a, b) => a + b, 0) / LAMPS.length;
  const phone = at(t, [T.phoneOn, T.phoneOn + 0.15], [0, 1]);
  const push = at(t, [T.push, 3.3], [1, 3.4], Easing.in(Easing.cubic));
  const out = at(t, [2.95, 3.35], [1, 0]);
  const tilt = Math.sin(Math.max(0, t - T.phoneOn) * 70) * Math.max(0, 1 - (t - T.phoneOn) / 0.35) * 3;
  const minute = t < T.seis - 0.02 ? 59 : 0;
  const secAngle = (t * 140) % 360;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out, scale: `${push}`, transformOrigin: `${PHONE_DESK.x + PHONE_DESK.w / 2}px ${PHONE_DESK.y + PHONE_DESK.h / 2}px` }}>
      {/* wall */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgb(${28 * room + 5},${42 * room + 11},${68 * room + 26}) 0%, rgb(${14 * room + 5},${22 * room + 11},${40 * room + 26}) 100%)` }} />
      {/* lamps + light cones */}
      {LAMPS.map((l, i) => (
        <div key={i}>
          <div style={{ position: "absolute", left: l.x - 2, top: 0, width: 4, height: 150, background: "#2A3A5C" }} />
          <div style={{ position: "absolute", left: l.x - 80, top: 150, width: 160, height: 70, borderRadius: "80px 80px 12px 12px", background: "#24324F" }} />
          <div style={{ position: "absolute", left: l.x - 46, top: 208, width: 92, height: 24, borderRadius: 12, background: `rgba(255,236,190,${0.15 + lights[i] * 0.85})`, boxShadow: `0 0 ${60 * lights[i]}px ${30 * lights[i]}px rgba(255,226,170,${0.55 * lights[i]})` }} />
          <div style={{ position: "absolute", left: l.x - 260, top: 220, width: 520, height: 900, background: "radial-gradient(ellipse at 50% 0%, rgba(255,232,180,0.22), transparent 70%)", opacity: lights[i] }} />
        </div>
      ))}
      {/* wall clock */}
      <div style={{ position: "absolute", left: 540 - 105, top: 300, width: 210, height: 210, borderRadius: 105, background: room > 0.2 ? "#E9EEF6" : "#1A2540", border: "8px solid #33456E", display: "grid", placeItems: "center", transition: "none" }}>
        <div style={{ position: "absolute", left: 101 - 4, top: 101 - 70, width: 8, height: 70, borderRadius: 4, background: room > 0.2 ? Q.ink : "#7C8DB5", transformOrigin: "4px 70px", rotate: `${minute * 6}deg` }} />
        <div style={{ position: "absolute", left: 101 - 5, top: 101 - 48, width: 10, height: 48, borderRadius: 5, background: room > 0.2 ? Q.ink : "#7C8DB5", transformOrigin: "5px 48px", rotate: `${(minute === 0 ? 180 : 179.5)}deg` }} />
        <div style={{ position: "absolute", left: 101 - 1.5, top: 101 - 80, width: 3, height: 80, background: Q.red, transformOrigin: "1.5px 80px", rotate: `${secAngle}deg` }} />
        <div style={{ position: "absolute", left: 101 - 9, top: 101 - 9, width: 18, height: 18, borderRadius: 9, background: Q.red }} />
      </div>
      <div style={{ position: "absolute", top: 525, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 40, letterSpacing: 4, color: room > 0.2 ? "#C9D4EA" : "#56658A" }}>{t < T.seis - 0.02 ? "17:59" : "18:00"}</div>
      {/* desk */}
      <div style={{ position: "absolute", left: 70, top: 1080, width: 940, height: 40, borderRadius: 14, background: `rgb(${60 * room + 20},${78 * room + 28},${110 * room + 48})` }} />
      <div style={{ position: "absolute", left: 100, top: 1118, width: 880, height: 330, borderRadius: "0 0 26px 26px", background: `rgb(${40 * room + 12},${54 * room + 20},${84 * room + 36})`, display: "grid", placeItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.25 + room * 0.6 }}>
          <IconCross size={46} color={Q.mint} />
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, letterSpacing: 8, color: "#C9D4EA" }}>CLÍNICA</span>
        </div>
      </div>
      {/* monitor */}
      <div style={{ position: "absolute", left: 180, top: 860, width: 300, height: 200, borderRadius: 18, background: "#0B1222", border: "8px solid #2A3A5C" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2D5BD8, #12306E)", opacity: lights[0] * 0.9 }} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 1060, width: 60, height: 22, background: "#2A3A5C" }} />
      {/* phone on the desk */}
      <div style={{ position: "absolute", left: PHONE_DESK.x, top: PHONE_DESK.y, width: PHONE_DESK.w, height: PHONE_DESK.h, borderRadius: 26, background: "#0A0F1C", border: "6px solid #2A3A5C", rotate: `${-8 + tilt}deg`, boxShadow: phone ? `0 0 ${90 * phone}px ${24 * phone}px rgba(120,170,255,${0.45 * phone})` : "none" }}>
        <div style={{ position: "absolute", inset: 6, borderRadius: 18, background: "linear-gradient(180deg, #DCE8FF, #7FA6FF)", opacity: phone }} />
        <div style={{ position: "absolute", left: 14, right: 14, top: 40, height: 56, borderRadius: 12, background: "#fff", opacity: phone, display: "flex", alignItems: "center", gap: 8, padding: "0 8px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: Q.whats }} />
          <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#C7D2E6" }} />
        </div>
      </div>
      {/* first message floating above the phone */}
      {t > T.phoneOn + 0.05 ? (
        <div style={{ position: "absolute", left: 130, top: 1140, scale: `${pop(t, T.phoneOn + 0.05)}`, transformOrigin: "100% 0%" }}>
          <div style={{ padding: "14px 22px", borderRadius: 22, background: "#FFFFFF", color: Q.ink, fontFamily: SANS, fontSize: 30, fontWeight: 600, boxShadow: "0 16px 40px rgba(0,0,0,0.35)", display: "flex", gap: 12, alignItems: "center" }}>
            <IconChat size={30} color={Q.whats} stroke={2.5} />
            tem horário amanhã?
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* =========================================================================================
   2 + 3 · THE PHONE — night: messages pile up unanswered. Morning: 37 unread, patients gone.
   ========================================================================================= */

const NIGHT_MSGS = [
  { at: T.m1, who: "Ana", c: "#4F7DF3", text: "Tem horário amanhã de manhã?" },
  { at: T.m2, who: "Bruno", c: "#E0812F", text: "Quanto custa a limpeza?" },
  { at: T.m3, who: "Carla", c: "#B44FD6", text: "Preciso remarcar minha consulta" },
  { at: T.m4, who: "Diego", c: "#1E9E8A", text: "Vocês atendem convênio?" },
  { at: T.m5, who: "Elisa", c: "#D64F7A", text: "Abre sábado?" },
  { at: T.m6, who: "Fábio", c: "#5B6B8C", text: "oi??" },
  { at: T.m7, who: "Gabi", c: "#C9A227", text: "alguém responde?" },
];

const INBOX = [
  { who: "Ana", c: "#4F7DF3", text: "Tem horário amanhã de manhã?", n: 3 },
  { who: "Bruno", c: "#E0812F", text: "Quanto custa a limpeza?", n: 2 },
  { who: "Elisa", c: "#D64F7A", text: "Abre sábado?", n: 2, lost: T.pacientes, lostText: "deixa, marquei em outra clínica" },
  { who: "Carla", c: "#B44FD6", text: "Preciso remarcar minha consulta", n: 4 },
  { who: "Diego", c: "#1E9E8A", text: "Vocês atendem convênio?", n: 1 },
  { who: "Gabi", c: "#C9A227", text: "alguém responde?", n: 5, lost: T.outroLugar, lostText: "já consegui em outro lugar" },
  { who: "Fábio", c: "#5B6B8C", text: "oi??", n: 3 },
];

const PH = { x: 170, y: 330, w: 740, h: 1060 };

const unreadAt = (t: number) => {
  const arrived = NIGHT_MSGS.filter((m) => t >= m.at).length;
  return Math.max(arrived, Math.floor(lin(t, [T.m5, 8.35], [5, 37])));
};

const NightScreen = ({ t }: { t: number }) => {
  const arrived = NIGHT_MSGS.filter((m) => t >= m.at);
  return (
    <div style={{ position: "absolute", inset: 0, padding: "120px 34px 0", background: "linear-gradient(180deg, #0D1A3A 0%, #060C1E 100%)" }}>
      <div style={{ textAlign: "center", fontFamily: SANS, color: "#C9D4EA", opacity: 0.55, fontSize: 30 }}>Tela de bloqueio</div>
      <div style={{ position: "relative", marginTop: 40, height: 760 }}>
        {arrived.map((m, i) => {
          const depth = arrived.length - 1 - i;
          const p = pop(t, m.at, 0.3);
          return (
            <div
              key={m.who}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: depth * 118,
                opacity: Math.min(1, p * 1.4) * (1 - depth * 0.1),
                translate: `0px ${(1 - p) * -60}px`,
                scale: `${1 - depth * 0.02}`,
                zIndex: 50 - depth,
              }}
            >
              <div style={{ display: "flex", gap: 18, alignItems: "center", padding: "18px 22px", borderRadius: 28, background: "rgba(232,238,255,0.12)", border: "1px solid rgba(232,238,255,0.12)", color: "#E8EEFF", fontFamily: SANS }}>
                <Avatar letter={m.who[0]} color={m.c} size={60} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, opacity: 0.6, fontWeight: 600 }}>
                    <span>WHATSAPP · {m.who}</span>
                    <span>agora</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.text}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InboxScreen = ({ t }: { t: number }) => (
  <div style={{ position: "absolute", inset: 0, background: "#F4F7FB", fontFamily: SANS, color: Q.ink }}>
    <div style={{ padding: "90px 34px 22px", background: "#FFFFFF", borderBottom: `2px solid ${Q.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 46, fontWeight: 800 }}>Conversas</span>
      <span style={{ padding: "8px 18px", borderRadius: 999, background: Q.red, color: "#fff", fontWeight: 800, fontSize: 30, scale: `${at(t, [T.manha + 0.1, T.manha + 0.4], [1.4, 1], Easing.out(Easing.back(2)))}` }}>37 não lidas</span>
    </div>
    {INBOX.map((r, i) => {
      const p = at(t, [T.manha + 0.15 + i * 0.07, T.manha + 0.4 + i * 0.07], [0, 1]);
      const lost = r.lost !== undefined && t >= r.lost;
      const lp = r.lost !== undefined ? at(t, [r.lost, r.lost + 0.35], [0, 1]) : 0;
      return (
        <div
          key={r.who}
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            padding: "20px 34px",
            borderBottom: `2px solid ${Q.line}`,
            background: lost ? `rgba(255,59,92,${0.1 * lp})` : "#FFFFFF",
            opacity: p * (1 - lp * 0.35),
            translate: `${(1 - p) * 60}px 0px`,
          }}
        >
          <div style={{ filter: `grayscale(${lp})` }}>
            <Avatar letter={r.who[0]} color={r.c} size={70} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{r.who}</div>
            <div style={{ fontSize: 28, color: lost ? Q.red : Q.soft, fontWeight: lost ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lost ? r.lostText : r.text}</div>
          </div>
          {lost ? (
            <span style={{ fontFamily: MONO, fontSize: 22, color: Q.red, letterSpacing: 2 }}>SAIU</span>
          ) : (
            <span style={{ minWidth: 44, height: 44, borderRadius: 22, background: Q.whats, color: "#fff", fontWeight: 800, fontSize: 24, display: "grid", placeItems: "center" }}>{r.n}</span>
          )}
        </div>
      );
    })}
  </div>
);

export const PhoneStory = ({ t }: { t: number }) => {
  if (t < 2.9 || t > 13.0) return null;
  const enter = at(t, [2.95, 3.4], [0, 1]);
  const shrink = at(t, [T.virada, T.virada + 0.5], [1, 0.02], Easing.in(Easing.cubic));
  const wiggle = NIGHT_MSGS.reduce((acc, m) => acc + Math.sin((t - m.at) * 70) * Math.max(0, 1 - (t - m.at) / 0.3) * (t >= m.at ? 2.2 : 0), 0);
  const morning = t >= T.manha;
  const swap = at(t, [T.manha - 0.1, T.manha + 0.15], [0, 1]);
  const unread = morning ? 37 : unreadAt(t);
  const glow = NIGHT_MSGS.reduce((acc, m) => Math.max(acc, t >= m.at ? Math.max(0, 1 - (t - m.at) / 0.5) : 0), 0);
  return (
    <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, opacity: enter, scale: `${(0.9 + enter * 0.1) * shrink}`, rotate: `${wiggle}deg`, borderRadius: 80 * (2 - shrink) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 80, background: "#0A0F1C", border: "10px solid #26324D", boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 ${120 * glow}px rgba(110,160,255,${0.5 * glow})`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
          <NightScreen t={t} />
        </div>
        {swap > 0 ? (
          <div style={{ position: "absolute", inset: 0, opacity: swap }}>
            <InboxScreen t={t} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: "50%", top: 22, width: 200, height: 46, marginLeft: -100, borderRadius: 23, background: "#05080F" }} />
      </div>
      {/* unread badge */}
      {unread > 0 ? (
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            minWidth: 110,
            height: 110,
            borderRadius: 55,
            padding: "0 22px",
            background: Q.red,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 56,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 12px 40px rgba(255,59,92,0.55)",
            scale: `${1 + glow * 0.18}`,
          }}
        >
          {unread}
        </div>
      ) : null}
    </div>
  );
};

/* =========================================================================================
   4 · THE TURN — the phone collapses to a point; from it, an attendant that never sleeps.
   ========================================================================================= */

export const ORB = { x: 540, y: 820 };

export const Orb = ({ t, x, y, r, intensity = 1 }: { t: number; x: number; y: number; r: number; intensity?: number }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.7 + i / 3) % 1 + 1) % 1;
      return (
        <div
          key={i}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid ${Q.glow}`, scale: `${1 + k * 1.3}`, opacity: (1 - k) * 0.55 * intensity }}
        />
      );
    })}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #6E9BFF, ${Q.blue} 55%, #0033A0)`, boxShadow: `0 0 ${80 * intensity}px ${20 * intensity}px rgba(51,119,255,0.55)`, display: "grid", placeItems: "center" }}>
      <IconChat size={r * 0.95} color="#FFFFFF" stroke={2} />
    </div>
    <div style={{ position: "absolute", left: r - 9, top: -26, width: 18, height: 18, borderRadius: 9, background: Q.mint, boxShadow: `0 0 18px ${Q.mint}`, transformOrigin: `9px ${r + 26}px`, rotate: `${t * 160}deg` }} />
  </div>
);

export const Turn = ({ t }: { t: number }) => {
  if (t < T.orb - 0.1 || t > T.drop + 0.2) return null;
  const g = at(t, [T.orb, T.orb + 0.45], [0, 1], Easing.out(Easing.back(1.6)));
  const charge = at(t, [T.dorme, T.drop], [0, 1], Easing.in(Easing.quad));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: at(t, [T.drop, T.drop + 0.15], [1, 0]) }}>
      <div style={{ position: "absolute", inset: 0, scale: `${g * (1 + charge * 0.25)}`, transformOrigin: `${ORB.x}px ${ORB.y}px` }}>
        <Orb t={t} x={ORB.x} y={ORB.y} r={150} intensity={1 + charge} />
      </div>
    </div>
  );
};

/* =========================================================================================
   5 · THE SAME NIGHT, ORGANIZED — chat ↔ agenda ↔ reception, connected and moving.
   ========================================================================================= */

const CHAT = { x: 80, y: 330, w: 920, h: 560 };
const AGENDA = { x: 80, y: 1000, w: 440, h: 390 };
const RECEP = { x: 560, y: 1000, w: 440, h: 390 };
const HUB = { x: 540, y: CHAT.y + CHAT.h };

const ChatA = ({ t }: { t: number }) => (
  <div style={{ display: "grid", gap: 16 }}>
    <Bubble side="in" time="19:42" p={pop(t, T.drop + 0.1)}>
      Tem horário amanhã de manhã?
    </Bubble>
    {t > T.drop + 0.45 && t < T.responde + 0.35 ? <Typing t={t} /> : null}
    {t >= T.responde + 0.35 ? (
      <Bubble side="out" time="19:42" p={pop(t, T.responde + 0.35)}>
        Tenho 9h ou 14h. Qual prefere?
      </Bubble>
    ) : null}
    {t >= T.hora + 0.25 ? (
      <Bubble side="in" time="19:43" p={pop(t, T.hora + 0.25)}>
        14h, por favor
      </Bubble>
    ) : null}
    {t >= T.agenda ? (
      <Bubble side="out" time="19:43" p={pop(t, T.agenda)}>
        Pronto! Marcado: amanhã, 14h.
      </Bubble>
    ) : null}
  </div>
);

const ChatB = ({ t }: { t: number }) => (
  <div style={{ display: "grid", gap: 16 }}>
    <Bubble side="in" time="23:18" p={pop(t, T.separa - 0.1)}>
      Vocês atendem meu convênio?
    </Bubble>
    {t > T.separa + 0.2 && t < T.recepcao - 0.1 ? <Typing t={t} /> : null}
    {t >= T.recepcao - 0.1 ? (
      <Bubble side="out" time="23:18" p={pop(t, T.recepcao - 0.1)}>
        Vou passar pra nossa recepção confirmar. Te respondem às 8h!
      </Bubble>
    ) : null}
  </div>
);

const SLOTS = [
  { h: "09:00", who: "Paula", base: true },
  { h: "10:30", who: "" },
  { h: "14:00", who: "Ana", fill: true },
  { h: "16:00", who: "Rui", base: true },
];

export const Organized = ({ t }: { t: number }) => {
  if (t < T.drop - 0.05 || t > T.objecao + 0.6) return null;
  const inP = at(t, [T.drop, T.drop + 0.45], [0, 1]);
  const outP = at(t, [T.objecao, T.objecao + 0.5], [0, 1], Easing.in(Easing.cubic));
  const second = t >= T.separa - 0.25;
  const swapChat = at(t, [T.separa - 0.3, T.separa - 0.05], [0, 1]);
  const wireP = at(t, [T.drop + 0.2, T.drop + 0.7], [0, 1]);
  const answered = Math.floor(lin(t, [T.drop + 0.4, T.gente], [1, 37]));
  const slotFill = at(t, [T.agenda - 0.15, T.agenda + 0.15], [0, 1]);
  const ticket = pop(t, T.recepcao + 0.45);
  const card = (d: number) => ({ opacity: inP * (1 - outP), translate: `0px ${(1 - inP) * (60 + d * 40) + outP * -40}px`, scale: `${1 - outP * 0.15}` });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* wires behind the cards */}
      <div style={{ opacity: inP * (1 - outP) }}>
        <Wire x1={HUB.x} y1={HUB.y} x2={AGENDA.x + AGENDA.w / 2} y2={AGENDA.y} p={wireP} flow={0.35} t={t} curve={-60} packets={2} />
        <Wire x1={HUB.x} y1={HUB.y} x2={RECEP.x + RECEP.w / 2} y2={RECEP.y} p={wireP} flow={0.35} t={t} curve={60} packets={2} color={Q.mint} />
        <Packet x1={HUB.x} y1={HUB.y} x2={AGENDA.x + AGENDA.w / 2} y2={AGENDA.y} s={T.coloca + 0.2} dur={0.6} t={t} curve={-60} />
        <Packet x1={HUB.x} y1={HUB.y} x2={RECEP.x + RECEP.w / 2} y2={RECEP.y} s={T.recepcao} dur={0.5} t={t} curve={60} color={Q.mint} />
      </div>

      {/* chat */}
      <Card x={CHAT.x} y={CHAT.y} w={CHAT.w} h={CHAT.h} style={card(0)}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 30px", borderBottom: `2px solid ${Q.line}` }}>
          <Avatar letter={second ? "D" : "A"} color={second ? "#1E9E8A" : "#4F7DF3"} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{second ? "Diego" : "Ana"}</div>
            <div style={{ fontSize: 24, color: Q.mint, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: Q.mint }} />
              atendimento automático · online
            </div>
          </div>
          <div style={{ textAlign: "right", fontFamily: MONO }}>
            <div style={{ fontSize: 22, color: Q.soft, letterSpacing: 1 }}>RESPONDIDAS</div>
            <div style={{ fontSize: 40, color: Q.ink }}>
              {answered}
              <span style={{ fontSize: 22, color: Q.mint }}> · 0 sem resposta</span>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", padding: "24px 30px", height: CHAT.h - 112, background: "#F7FAFD", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "24px 30px", opacity: 1 - swapChat, translate: `0px ${-swapChat * 60 - at(t, [T.agenda - 0.05, T.agenda + 0.3], [0, 118])}px` }}>
            <ChatA t={t} />
          </div>
          {second ? (
            <div style={{ position: "absolute", inset: "24px 30px", opacity: swapChat, translate: `0px ${(1 - swapChat) * 60}px` }}>
              <ChatB t={t} />
            </div>
          ) : null}
        </div>
      </Card>

      {/* agenda */}
      <Card x={AGENDA.x} y={AGENDA.y} w={AGENDA.w} h={AGENDA.h} style={{ ...card(1), padding: 26, border: `2px solid ${slotFill > 0 && t < T.separa ? Q.blue : Q.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconCalendar size={34} color={Q.blue} />
          <Kicker color={Q.blue}>AGENDA · AMANHÃ</Kicker>
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {SLOTS.map((s) => {
            const filled = s.fill ? slotFill : 0;
            return (
              <div
                key={s.h}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: s.fill ? `rgba(0,85,255,${0.12 * filled})` : s.base ? "#F1F4F9" : "transparent",
                  border: `2px ${s.base || filled ? "solid" : "dashed"} ${s.fill && filled ? Q.blue : Q.line}`,
                  scale: s.fill ? `${1 + Math.sin(Math.PI * filled) * 0.06}` : "1",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 28, color: Q.soft }}>{s.h}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: s.fill ? Q.blue : Q.ink, opacity: s.base ? 0.7 : s.fill ? filled : 0.35 }}>{s.who || (s.fill && !filled ? "livre" : "livre")}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* reception */}
      <Card x={RECEP.x} y={RECEP.y} w={RECEP.w} h={RECEP.h} style={{ ...card(2), padding: 26, border: `2px solid ${ticket > 0 ? Q.mint : Q.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconUser size={34} color={Q.mint} />
          <Kicker color={Q.mint}>RECEPÇÃO · 08:00</Kicker>
        </div>
        {ticket <= 0 ? (
          <div style={{ marginTop: 40, fontSize: 30, color: Q.soft, lineHeight: 1.35 }}>Só chega aqui o que precisa de alguém da equipe.</div>
        ) : (
          <div style={{ marginTop: 24, padding: 22, borderRadius: 22, background: "#F1FBF7", border: `2px solid ${Q.mint}`, opacity: Math.min(1, ticket * 1.4), scale: `${0.85 + ticket * 0.15}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar letter="D" color="#1E9E8A" size={56} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>Diego</div>
                <div style={{ fontSize: 24, color: Q.soft }}>dúvida de convênio</div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 22, color: Q.amber }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: Q.amber }} />
              AGUARDANDO A EQUIPE
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

/* =========================================================================================
   6 · OBJECTION — "Já usa um sistema? A gente avalia e conecta. Não usa? Entrega junto."
   ========================================================================================= */

const HUB_ORB = { x: 540, y: 560 };
const SYS = { x: 150, y: 860, w: 780, h: 440 };
const MODULOS = ["Agenda", "Pacientes", "Financeiro", "Relatórios"];

export const Objection = ({ t }: { t: number }) => {
  if (t < T.objecao + 0.1 || t > T.cta + 0.5) return null;
  const orbIn = pop(t, T.objecao + 0.2, 0.4);
  const sysIn = pop(t, T.sistema - 0.1, 0.35);
  const scan = lin(t, [T.avalia - 0.05, T.conecta], [0, 1]);
  const wire = at(t, [T.conecta, T.conecta + 0.35], [0, 1]);
  const flip = lin(t, [T.naoUsa, T.naoUsa + 0.45], [0, 1]);
  const front = flip < 0.5;
  const rot = front ? flip * 180 : (flip - 1) * 180;
  const out = at(t, [T.cta - 0.05, T.cta + 0.35], [0, 1], Easing.in(Easing.cubic));
  const plugSnap = pop(t, T.conecta + 0.25, 0.3);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, scale: `${1 - out * 0.1}` }}>
      <div style={{ opacity: orbIn }}>
        <Wire x1={HUB_ORB.x} y1={HUB_ORB.y + 110} x2={540} y2={SYS.y} p={wire} flow={wire} t={t} packets={4} both color={flip > 0.5 ? Q.blue : Q.mint} />
      </div>
      <div style={{ scale: `${orbIn}`, transformOrigin: `${HUB_ORB.x}px ${HUB_ORB.y}px` }}>
        <Orb t={t} x={HUB_ORB.x} y={HUB_ORB.y} r={100} />
        <div style={{ position: "absolute", top: HUB_ORB.y + 120, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: Q.blue }}>ATENDIMENTO 24H</div>
      </div>
      {/* plug / API tag at the middle of the wire */}
      {plugSnap > 0 ? (
        <div style={{ position: "absolute", left: 540 - 70, top: (HUB_ORB.y + 110 + SYS.y) / 2 - 34, width: 140, height: 68, borderRadius: 34, background: Q.paper, border: `3px solid ${flip > 0.5 ? Q.blue : Q.mint}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, scale: `${plugSnap}`, fontFamily: MONO, fontSize: 26, color: Q.ink }}>
          <IconPlug size={30} color={flip > 0.5 ? Q.blue : Q.mint} />
          API
        </div>
      ) : null}

      {/* the system card, front: client's current system, back: Codexy management system */}
      <div style={{ position: "absolute", left: SYS.x, top: SYS.y, width: SYS.w, height: SYS.h, perspective: 2400, opacity: Math.min(1, sysIn * 1.3), scale: `${0.8 + sysIn * 0.2}` }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${rot}deg)` }}>
          {front ? (
            <Card x={0} y={0} w={SYS.w} h={SYS.h} style={{ border: `3px solid ${wire > 0 ? Q.mint : Q.line}` }}>
              <div style={{ display: "flex", gap: 10, padding: "20px 26px", borderBottom: `2px solid ${Q.line}`, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: "#D3DCE8" }} />
                ))}
                <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 24, color: Q.soft, letterSpacing: 2 }}>SEU SISTEMA ATUAL</span>
              </div>
              <div style={{ padding: 28, display: "grid", gap: 18 }}>
                {[0.9, 0.65, 0.8, 0.5].map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 54, height: 54, borderRadius: 14, background: "#EEF2F8" }} />
                    <div style={{ height: 20, width: `${w * 100}%`, borderRadius: 10, background: "#E3E9F2" }} />
                  </div>
                ))}
              </div>
              {/* evaluating scan */}
              {scan > 0 && scan < 1 ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: scan * SYS.h - 60, height: 120, background: "linear-gradient(180deg, transparent, rgba(20,199,154,0.28), transparent)" }} />
              ) : null}
              {t > T.avalia - 0.05 && t < T.conecta + 0.2 ? (
                <div style={{ position: "absolute", right: 26, top: 20, fontFamily: MONO, fontSize: 22, color: Q.mint }}>AVALIANDO…</div>
              ) : null}
              {wire > 0.6 ? (
                <div style={{ position: "absolute", right: 22, top: 16, display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: Q.mint, color: "#fff", fontFamily: MONO, fontSize: 22, scale: `${pop(t, T.conecta + 0.25)}` }}>
                  <IconCheck size={22} />
                  CONECTADO
                </div>
              ) : null}
            </Card>
          ) : (
            <Card x={0} y={0} w={SYS.w} h={SYS.h} style={{ background: `linear-gradient(135deg, ${Q.blue}, #0A2A8A)`, border: "none", color: "#fff" }}>
              <div style={{ padding: "26px 30px" }}>
                <Kicker color="rgba(255,255,255,0.75)">CODEXY · SOB MEDIDA</Kicker>
                <div style={{ fontSize: 48, fontWeight: 800, marginTop: 6, letterSpacing: -1 }}>Sistema de gestão</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
                  {MODULOS.map((m, i) => {
                    const q = pop(t, T.entrega + i * 0.12, 0.3);
                    return (
                      <div key={m} style={{ padding: "20px 22px", borderRadius: 20, background: "rgba(255,255,255,0.14)", border: "2px solid rgba(255,255,255,0.25)", fontSize: 32, fontWeight: 700, opacity: Math.min(1, q * 1.4), scale: `${0.7 + q * 0.3}`, display: "flex", alignItems: "center", gap: 12 }}>
                        <IconCheck size={28} color={Q.mint} />
                        {m}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export const statusFor = (t: number) => {
  if (t < T.manha) return { label: "FECHADA", color: Q.red, night: true };
  if (t < T.virada) return { label: "ABERTA", color: Q.amber, night: false };
  if (t < T.drop) return { label: "FECHADA", color: Q.red, night: true };
  if (t < 21.6) return { label: "FECHADA", color: Q.red, night: true, online: true };
  return { label: "ABERTA", color: Q.mint, night: false };
};

export { hhmm };
