import { Easing } from "remotion";
import { at, spr } from "./motion";

// High-fidelity WhatsApp-style conversation (light theme) driven by a timeline in seconds.
// Sizes are in iOS points × u (u = screen width / 390), so it fits inside <Phone>.

export type ChatMsg = {
  id: string;
  side: "in" | "out"; // in = contact, out = me
  text: string;
  at: number;
  time: string;
  deliveredAt?: number;
  readAt?: number;
  label?: string; // small caption above the text, e.g. "Atendimento automático"
};

export type ChatContact = { name: string; initials: string; color: string; status: (t: number) => { text: string; color?: string } };

const SYS = "-apple-system, 'SF Pro Text', 'Helvetica Neue', 'Hanken Grotesk', Arial, sans-serif";
const GREEN = "#25D366";

const Ticks = ({ u, state }: { u: number; state: 0 | 1 | 2 | 3 }) => {
  if (state === 0) return null;
  const c = state === 3 ? "#53BDEB" : "#8696A0";
  return (
    <svg width={18 * u} height={11 * u} viewBox="0 0 18 11" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 6l3 3 6-7" />
      {state >= 2 ? <path d="M7 9l1 0.5L15 2" /> : null}
    </svg>
  );
};

const estimateLines = (text: string, u: number, maxW: number) => {
  const charW = 8.6 * u;
  const timeArea = 64 * u;
  const avail = maxW - 22 * u;
  return Math.max(1, Math.ceil((text.length * charW + timeArea) / avail));
};

export const Chat = ({
  t,
  fps,
  u,
  w,
  h,
  contact,
  messages,
  typing = [],
  draft,
}: {
  t: number;
  fps: number;
  u: number;
  w: number;
  h: number;
  contact: ChatContact;
  messages: ChatMsg[];
  typing?: { from: number; to: number }[];
  draft?: { text: string; from: number; sendAt: number };
}) => {
  const headerH = 104 * u;
  const footerH = 86 * u;
  const areaH = h - headerH - footerH;
  const maxW = w * 0.78;
  const lineH = 22 * u;

  const visible = messages.filter((m) => t >= m.at);
  const showTyping = typing.find((ty) => t >= ty.from && t < ty.to);
  const items = visible.map((m) => {
    const lines = estimateLines(m.text, u, maxW);
    const height = 16 * u + lines * lineH + 6 * u + (m.label ? 18 * u : 0);
    return { m, height, p: spr(t, m.at, fps, { damping: 16, stiffness: 170 }) };
  });
  const typingH = showTyping ? 44 * u * spr(t, showTyping.from, fps, { damping: 18, stiffness: 200 }) : 0;
  const gap = 6 * u;
  const total = items.reduce((s, it) => s + (it.height + gap) * Math.min(1, it.p), 0) + typingH;

  const status = contact.status(t);
  const typedChars = draft ? Math.floor(at(t, [draft.from, draft.sendAt - 0.08], [0, draft.text.length], Easing.linear)) : 0;
  const drafting = draft && t >= draft.from && t < draft.sendAt;

  let y = areaH - 10 * u - total;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: SYS, background: "#EFE7DE" }}>
      {/* wallpaper doodle texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "radial-gradient(rgba(120,100,80,0.18) 1.2px, transparent 1.3px)", backgroundSize: `${22 * u}px ${22 * u}px` }} />

      {/* messages */}
      <div style={{ position: "absolute", left: 0, right: 0, top: headerH, height: areaH, overflow: "hidden" }}>
        {/* WhatsApp chat opening details: date pill + encryption notice */}
        <div style={{ position: "absolute", top: 12 * u, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * u }}>
          <div style={{ padding: `${4 * u}px ${10 * u}px`, borderRadius: 8 * u, background: "rgba(255,255,255,0.92)", fontSize: 12 * u, fontWeight: 600, color: "#54656F", boxShadow: `0 ${u}px ${u}px rgba(0,0,0,0.08)` }}>HOJE</div>
          <div style={{ maxWidth: w * 0.82, padding: `${7 * u}px ${12 * u}px`, borderRadius: 8 * u, background: "#FFF3C2", fontSize: 12.5 * u, lineHeight: 1.35, color: "#54656F", textAlign: "center" }}>
            As mensagens e ligações são protegidas com a criptografia de ponta a ponta.
          </div>
        </div>
        {items.map(({ m, height, p }) => {
          const top = y;
          y += (height + gap) * Math.min(1, p);
          const out = m.side === "out";
          const tick: 0 | 1 | 2 | 3 = !out ? 0 : m.readAt !== undefined && t >= m.readAt ? 3 : m.deliveredAt !== undefined && t >= m.deliveredAt ? 2 : 1;
          return (
            <div key={m.id} style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: out ? "flex-end" : "flex-start", padding: `0 ${12 * u}px` }}>
              <div
                style={{
                  position: "relative",
                  maxWidth: maxW,
                  padding: `${7 * u}px ${10 * u}px ${6 * u}px`,
                  borderRadius: 16 * u,
                  borderTopRightRadius: out ? 4 * u : 16 * u,
                  borderTopLeftRadius: out ? 16 * u : 4 * u,
                  background: out ? "#D9FDD3" : "#FFFFFF",
                  boxShadow: `0 ${1 * u}px ${1 * u}px rgba(0,0,0,0.13)`,
                  fontSize: 17 * u,
                  lineHeight: `${lineH}px`,
                  color: "#111B21",
                  opacity: Math.min(1, p * 1.6),
                  scale: `${0.82 + 0.18 * Math.min(1.05, p)}`,
                  transformOrigin: out ? "100% 100%" : "0% 100%",
                }}
              >
                {m.label ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 * u, fontSize: 12 * u, lineHeight: `${16 * u}px`, fontWeight: 700, color: "#0B7A5E", marginBottom: 2 * u }}>
                    <span style={{ width: 7 * u, height: 7 * u, borderRadius: 4 * u, background: "#14C79A" }} />
                    {m.label}
                  </div>
                ) : null}
                {m.text}
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 * u, float: "right", marginLeft: 10 * u, marginTop: 6 * u, fontSize: 11 * u, color: "#667781" }}>
                  {m.time}
                  <Ticks u={u} state={tick} />
                </span>
              </div>
            </div>
          );
        })}
        {showTyping ? (
          <div style={{ position: "absolute", top: y, left: 12 * u, padding: `${12 * u}px ${14 * u}px`, borderRadius: 16 * u, borderTopLeftRadius: 4 * u, background: "#FFFFFF", boxShadow: `0 ${u}px ${u}px rgba(0,0,0,0.13)`, display: "flex", gap: 5 * u, opacity: Math.min(1, typingH / (44 * u)) }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8 * u, height: 8 * u, borderRadius: 4 * u, background: "#8696A0", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(t * 11 - i * 0.9)), translate: `0px ${-2 * u * Math.max(0, Math.sin(t * 11 - i * 0.9))}px` }} />
            ))}
          </div>
        ) : null}
      </div>

      {/* header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: headerH, background: "rgba(246,246,246,0.96)", borderBottom: `${u}px solid rgba(0,0,0,0.1)`, display: "flex", alignItems: "flex-end", padding: `0 ${12 * u}px ${8 * u}px`, gap: 10 * u, zIndex: 10 }}>
        <svg width={12 * u} height={20 * u} viewBox="0 0 12 20" fill="none" stroke="#007AFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 9 * u }}>
          <path d="M10 2 2 10l8 8" />
        </svg>
        <div style={{ width: 38 * u, height: 38 * u, borderRadius: 19 * u, background: contact.color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 15 * u, flexShrink: 0 }}>{contact.initials}</div>
        <div style={{ flex: 1, minWidth: 0, marginBottom: 1 * u }}>
          <div style={{ fontSize: 17 * u, fontWeight: 600, color: "#111B21", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.name}</div>
          <div style={{ fontSize: 13 * u, color: status.color ?? "#667781", whiteSpace: "nowrap" }}>{status.text}</div>
        </div>
        <svg width={26 * u} height={20 * u} viewBox="0 0 26 20" fill="none" stroke="#007AFF" strokeWidth={2} strokeLinejoin="round" style={{ marginBottom: 9 * u }}>
          <rect x="1" y="3" width="16" height="14" rx="3" />
          <path d="m17 8 7-4v12l-7-4z" />
        </svg>
        <svg width={22 * u} height={22 * u} viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth={2} strokeLinejoin="round" style={{ marginBottom: 8 * u, marginLeft: 8 * u }}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        </svg>
      </div>

      {/* input bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: footerH, background: "rgba(246,246,246,0.97)", borderTop: `${u}px solid rgba(0,0,0,0.08)`, display: "flex", alignItems: "flex-start", gap: 8 * u, padding: `${8 * u}px ${10 * u}px 0` }}>
        <svg width={24 * u} height={24 * u} viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth={2.2} strokeLinecap="round" style={{ marginTop: 6 * u }}>
          <path d="M12 5v14M5 12h14" />
        </svg>
        <div style={{ flex: 1, minHeight: 36 * u, borderRadius: 18 * u, background: "#FFFFFF", border: `${u}px solid rgba(0,0,0,0.12)`, padding: `${7 * u}px ${12 * u}px`, fontSize: 17 * u, color: drafting ? "#111B21" : "#8696A0", whiteSpace: "nowrap", overflow: "hidden" }}>
          {drafting ? (
            <>
              {draft!.text.slice(Math.max(0, typedChars - 30), typedChars)}
              <span style={{ display: "inline-block", width: 2 * u, height: 20 * u, marginLeft: u, verticalAlign: "middle", background: "#007AFF", opacity: Math.floor(t * 3) % 2 ? 1 : 0 }} />
            </>
          ) : (
            " "
          )}
        </div>
        <div style={{ width: 36 * u, height: 36 * u, borderRadius: 18 * u, background: drafting ? GREEN : "transparent", display: "grid", placeItems: "center" }}>
          {drafting ? (
            <svg width={18 * u} height={18 * u} viewBox="0 0 24 24" fill="#fff">
              <path d="M3 20.5 21 12 3 3.5l.01 6.6L15 12 3.01 13.9z" />
            </svg>
          ) : (
            <svg width={22 * u} height={22 * u} viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth={2} strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
