import { AbsoluteFill, Img, staticFile } from "remotion";
import { Chat, type ChatContact, type ChatMsg } from "../shared/kit/Chat";
import { Phone, phoneSize } from "../shared/kit/Phone";
import { C, MONO, SANS } from "../shared/theme";

// Building blocks for static posts (1080×1350, Instagram 4:5). One composition frame = one carousel slide.
export const W = 1080;
export const H = 1350;
export const INK = "#0E1B33";
export const SOFT = "#6B7A93";
export const MINT = "#14C79A";
export const RED = "#FF3B5C";
export const BLUE = "#0055FF";

export type Tone = "dark" | "light";

export const Slide = ({ tone, index, total, children, cover }: { tone: Tone; index: number; total: number; children: React.ReactNode; cover?: boolean }) => (
  <AbsoluteFill
    style={{
      background: tone === "dark" ? `radial-gradient(ellipse at 50% 25%, #0D2A6E 0%, ${C.navy} 55%, ${C.deep} 100%)` : "radial-gradient(ellipse at 50% 20%, #FFFFFF 0%, #EAF0F8 75%)",
      fontFamily: SANS,
      color: tone === "dark" ? "#FFFFFF" : INK,
      overflow: "hidden",
    }}
  >
    {children}
    {/* footer: logo + counter */}
    <div style={{ position: "absolute", left: 64, right: 64, bottom: 44, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Img src={staticFile(tone === "dark" ? "brand/codexy-logo-light.png" : "brand/codexy-logo.png")} style={{ height: 34, opacity: 0.9 }} />
      {total > 1 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: MONO, fontSize: 26, color: tone === "dark" ? "rgba(255,255,255,0.6)" : SOFT }}>
          {cover ? <span style={{ fontFamily: SANS, fontWeight: 700, color: tone === "dark" ? "#FFFFFF" : BLUE }}>arraste →</span> : null}
          {index}/{total}
        </div>
      ) : null}
    </div>
  </AbsoluteFill>
);

// Big headline; wrap words in *asterisks* to color them with `accent`.
export const Title = ({ text, size = 84, top = 110, accent = "#3377FF", align = "left", color }: { text: string; size?: number; top?: number; accent?: string; align?: "left" | "center"; color?: string }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -size * 0.035, textAlign: align, color, whiteSpace: "pre-line" }}>
    {/* accents may span line breaks: split on the markers first and let pre-line render the \n */}
    {text.split(/(\*[^*]+\*)/).map((part, j) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={j} style={{ color: accent }}>
          {part.slice(1, -1)}
        </span>
      ) : (
        <span key={j}>{part}</span>
      ),
    )}
  </div>
);

export const Kicker = ({ text, top = 64, color = "#3377FF" }: { text: string; top?: number; color?: string }) => (
  <div style={{ position: "absolute", left: 64, top, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color }}>{text}</div>
);

// A static phone with a chat already in its final state.
export const ChatPhone = ({ width, x, y, contact, msgs, time = "21:52", rot = 0, dim = 0 }: { width: number; x: number; y: number; contact: ChatContact; msgs: ChatMsg[]; time?: string; rot?: number; dim?: number }) => {
  const s = phoneSize(width);
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y, width, height: s.height, rotate: `${rot}deg`, filter: dim ? `grayscale(${dim}) brightness(${1 - dim * 0.4})` : undefined }}>
      <Phone width={width} time={time}>
        <Chat t={60} fps={30} u={s.u} w={s.screenW} h={s.screenH} contact={contact} messages={msgs} />
      </Phone>
    </div>
  );
};

export const Pill = ({ children, bg, fg, x, y, size = 32 }: { children: React.ReactNode; bg: string; fg: string; x: number; y: number; size?: number }) => (
  <div style={{ position: "absolute", left: x, top: y, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: 999, background: bg, color: fg, fontWeight: 800, fontSize: size, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 14px 34px rgba(0,0,0,0.25)", whiteSpace: "nowrap" }}>
    {children}
  </div>
);

export const Check = ({ size = 30, color = "#04291F" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const WhatsIcon = ({ size = 44, color = "#05210F" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round">
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
  </svg>
);

export const CtaButton = ({ y, text = "Diagnóstico gratuito no WhatsApp" }: { y: number; text?: string }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "28px 44px", borderRadius: 999, background: "#25D366", color: "#05210F", fontWeight: 800, fontSize: 44, letterSpacing: -1, boxShadow: "0 0 60px rgba(37,211,102,0.4)" }}>
      <WhatsIcon size={50} />
      {text}
    </div>
  </div>
);
