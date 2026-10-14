import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Easing, Sequence, getInputProps, getRemotionEnvironment, staticFile, useCurrentFrame } from "remotion";
import { Grain } from "../../shared/components/Grain";
import { BRoll } from "../../shared/kit/BRoll";
import { Kinetic, type KWord } from "../../shared/kit/Kinetic";
import { at, lin, spr } from "../../shared/kit/motion";
import { Phone, phoneSize } from "../../shared/kit/Phone";
import { MONO, SANS } from "../../shared/theme";

// "Ele tirou 3 dias de folga. A empresa ligou 47 vezes." — HOOK PREVIEW (first ~3.4 s, no narration yet).
// Vacation footage + phone lying on a beach towel whose lock screen explodes with notifications.
export const FPS = 60;
export const GANCHO_DURATION = Math.round(3.4 * FPS);

const SYS = "-apple-system, 'SF Pro Text', 'Helvetica Neue', 'Hanken Grotesk', Arial, sans-serif";
const RED = "#FF3B5C";
const END = 2.1; // the counter hits 47 and everything stops

// Notifications: missed calls + questions only the owner can answer.
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
// Accelerating arrivals (sqrt spacing): slow at first, a flood at the end.
const ARRIVE = NOTIFS.map((_, i) => 0.05 + (END - 0.12) * Math.sqrt(i / (NOTIFS.length - 1)));
const count = (t: number) => (t < 0.05 ? 1 : Math.min(47, Math.max(1, Math.round(47 * Math.pow(Math.min(1, (t - 0.05) / (END - 0.05)), 2)))));

const HOOK1: KWord[] = [
  { w: "Ele", at: 0.3 },
  { w: "tirou", at: 0.42 },
  { w: "3", at: 0.54, accent: true },
  { w: "dias", at: 0.62, accent: true },
  { w: "de", at: 0.74 },
  { w: "folga.", at: 0.82, accent: true },
];
const HOOK2: KWord[] = [
  { w: "A", at: 1.2 },
  { w: "empresa", at: 1.3 },
  { w: "ligou", at: 1.5 },
  { w: "|", at: 1.5 },
  { w: "47", at: 1.68, accent: true },
  { w: "vezes.", at: 1.85, accent: true },
];

const PW = 600;
const PS = phoneSize(PW);
const u = PS.u;

const LockScreen = ({ t }: { t: number }) => {
  const arrived = ARRIVE.filter((a) => t >= a).length;
  const focus = at(t, [END + 0.25, END + 0.6], [0, 1]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #1B3A6B 0%, #0B1630 55%, #05070F 100%)", fontFamily: SYS, color: "#fff" }}>
      <div style={{ position: "absolute", top: 70 * u, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontSize: 17 * u, fontWeight: 600, opacity: 0.85 }}>quarta-feira, 15 de outubro</div>
        <div style={{ fontSize: 82 * u, fontWeight: 600, lineHeight: 1, letterSpacing: -2 * u }}>14:32</div>
      </div>
      {/* notification stack, newest on top */}
      <div style={{ position: "absolute", left: 10 * u, right: 10 * u, top: 210 * u }}>
        {NOTIFS.slice(0, arrived)
          .map((n, i) => ({ n, i }))
          .reverse()
          .slice(0, 6)
          .map(({ n, i }, depth) => {
            const p = spr(t, ARRIVE[i], FPS, { damping: 15, stiffness: 260 });
            const isFocus = i === 1;
            const scaleF = isFocus ? 1 + focus * 0.06 : 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: depth * 74 * u + (1 - p) * -40 * u,
                  zIndex: 50 - depth,
                  opacity: Math.min(1, p * 1.5) * (1 - depth * 0.1) * (t > END + 0.25 && !isFocus ? 1 - focus * 0.75 : 1),
                  scale: `${(1 - depth * 0.02) * scaleF}`,
                  padding: `${10 * u}px ${12 * u}px`,
                  borderRadius: 18 * u,
                  background: "rgba(245,245,247,0.86)",
                  color: "#111",
                  display: "flex",
                  gap: 10 * u,
                  alignItems: "center",
                  boxShadow: `0 ${6 * u}px ${16 * u}px rgba(0,0,0,0.25)`,
                }}
              >
                <div style={{ width: 34 * u, height: 34 * u, borderRadius: 9 * u, background: n.call ? "#34C759" : "#25D366", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <svg width={20 * u} height={20 * u} viewBox="0 0 24 24" fill="#fff">
                    {n.call ? <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" /> : <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />}
                  </svg>
                </div>
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

// Everything that moves (inside the motion blur in the final render).
const Stage = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // phone vibrates and creeps on the towel at every arrival
  let jx = 0;
  let jy = 0;
  let creep = 0;
  ARRIVE.forEach((a) => {
    const d = t - a;
    if (d >= 0) creep += Math.min(d, 0.12) * 40;
    if (d >= 0 && d < 0.18 && t < END) {
      const k = 1 - d / 0.18;
      jx += Math.sin(d * 140) * 7 * k;
      jy += Math.cos(d * 120) * 4 * k;
    }
  });
  const push = lin(t, [0, END], [1, 1.14]);
  const focusZoom = at(t, [END + 0.2, 3.3], [1, 1.08], Easing.inOut(Easing.cubic));
  const n = count(t);
  const hit = at(t, [END, END + 0.15], [1.35, 1], Easing.out(Easing.back(2.5)));
  return (
    <AbsoluteFill>
      {/* camera: slow push-in, then a zoom into the notification after the cut */}
      <AbsoluteFill style={{ scale: `${push * focusZoom}`, transformOrigin: "540px 1150px" }}>
        {/* phone lying on the towel (perspective) */}
        <div
          style={{
            position: "absolute",
            left: 540 - PW / 2 + jx + creep * 0.35,
            top: 700 + jy,
            width: PW,
            height: PS.height,
            transform: `perspective(1800px) rotateX(9deg) rotateZ(${-7 + creep * 0.03}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <Phone width={PW} time="14:32" darkStatus>
            <LockScreen t={t} />
          </Phone>
        </div>
      </AbsoluteFill>

      {/* missed-call counter */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: SANS, opacity: at(t, [END + 0.35, END + 0.55], [1, 0]) }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "rgba(255,255,255,0.85)", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>CHAMADAS PERDIDAS</div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: -6, color: n >= 47 ? RED : "#FFFFFF", textShadow: "0 8px 40px rgba(0,0,0,0.55)", scale: `${n >= 47 ? hit : 1}`, transformOrigin: "50% 50%" }}>{n}</div>
      </div>

      {t > END + 0.2 ? (
        <div style={{ position: "absolute", left: 70, right: 70, top: 640, opacity: Math.min(1, spr(t, END + 0.25, FPS, { damping: 14, stiffness: 170 }) * 1.4), transform: `translateY(${(1 - spr(t, END + 0.25, FPS, { damping: 14, stiffness: 170 })) * 260}px) scale(${0.7 + 0.3 * spr(t, END + 0.25, FPS, { damping: 14, stiffness: 170 })})` }}>
          <div style={{ padding: "26px 30px", borderRadius: 38, background: "rgba(245,245,247,0.95)", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", display: "flex", gap: 22, alignItems: "center", fontFamily: SYS, color: "#111" }}>
            <div style={{ width: 86, height: 86, borderRadius: 22, background: "#25D366", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <svg width={50} height={50} viewBox="0 0 24 24" fill="#fff"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#666", fontWeight: 600 }}><span>WHATSAPP</span><span>agora</span></div>
              <div style={{ fontSize: 36, fontWeight: 800 }}>Ana · Loja</div>
              <div style={{ fontSize: 36, lineHeight: 1.25 }}>Seu Carlos, cadê a nota do fornecedor?</div>
            </div>
          </div>
        </div>
      ) : null}
      <Kinetic t={t} words={HOOK1} size={84} top={360} from={0.25} to={1.12} font={SANS} accent="#FFD166" />
      <Kinetic t={t} words={HOOK2} size={96} top={340} from={1.15} to={END + 0.3} font={SANS} accent={RED} />
    </AbsoluteFill>
  );
};

const Towel = () => (
  <div style={{ position: "absolute", left: -300, right: -300, top: 1180, height: 1400, transform: "perspective(1400px) rotateX(62deg)", transformOrigin: "50% 0%" }}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, #F4F1EA 0px, #F4F1EA 46px, #FF7A59 46px, #FF7A59 86px, #F4F1EA 86px, #F4F1EA 132px, #2BB3C0 132px, #2BB3C0 160px)", filter: "brightness(0.95) contrast(0.95)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15), rgba(0,0,0,0.35) 90%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(rgba(0,0,0,0.25) 1px, transparent 1.2px)", backgroundSize: "6px 6px" }} />
  </div>
);

export const FeriasGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const blurOn = getRemotionEnvironment().isRendering && !getInputProps().preview;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* vacation footage, shallow depth of field */}
      <AbsoluteFill style={{ filter: "blur(4px)", translate: "0px -430px" }}>
        <BRoll src="broll/ferias-47/praia.mp4" t={t} t0={0} t1={3.4} fps={FPS} focusX={0.5} zoom={[1.12, 1.2]} origin="50% 40%" grade="brightness(1.02) contrast(1.05) saturate(1.1)" />
      </AbsoluteFill>
      <Towel />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)" }} />
      {blurOn ? (
        <CameraMotionBlur shutterAngle={180} samples={6}>
          <Stage />
        </CameraMotionBlur>
      ) : (
        <Stage />
      )}
      <Grain vignette amount={0.05} />

      {/* sound: waves all along; vibrations accelerate and cut dead at 47 */}
      <Audio src={staticFile("sfx/ia-ondas.mp3")} volume={(f) => lin(f / FPS, [0, 0.2], [0.5, 0.75])} />
      {ARRIVE.map((a, i) => (
        <Sequence key={i} from={Math.round(a * FPS)} durationInFrames={Math.max(1, Math.round((END - a) * FPS))}>
          <Audio src={staticFile("sfx/ia-phone-vibrate.mp3")} volume={0.55} />
        </Sequence>
      ))}
      <Sequence from={Math.round(END * FPS)}>
        <Audio src={staticFile("sfx/ia-impact.mp3")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};
