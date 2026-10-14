import { useCurrentFrame } from "remotion";
import type { ChatContact, ChatMsg } from "../shared/kit/Chat";
import { MONO } from "../shared/theme";
import { BLUE, ChatPhone, Check, CtaButton, INK, Kicker, MINT, Pill, RED, SOFT, Slide, Title, WhatsIcon } from "./Slide";

// Carousel: the story of "olhos-do-paciente" in 7 slides (clinic niche).
export const MENSAGEM_2152_SLIDES = 7;

const PEDIDO = "Oi! Consegue me encaixar amanhã cedo?";
const SUA: ChatContact = { name: "Sua Clínica", initials: "SC", color: "#0EA5A5", status: () => ({ text: "visto por último hoje às 18:02" }) };
const OUTRA: ChatContact = { name: "Clínica Sorriso", initials: "CS", color: "#7C3AED", status: () => ({ text: "online", color: "#25D366" }) };
const ANA: ChatContact = { name: "Ana", initials: "A", color: "#E0812F", status: () => ({ text: "online", color: "#25D366" }) };

const MSG_SUA: ChatMsg[] = [{ id: "1", side: "out", text: PEDIDO, at: 0, time: "21:52", deliveredAt: 0 }];
const MSG_OUTRA: ChatMsg[] = [
  { id: "1", side: "out", text: PEDIDO, at: 0, time: "21:52", deliveredAt: 0, readAt: 0 },
  { id: "2", side: "in", text: "Consigo sim! Amanhã às 8h ou 10h?", at: 0, time: "21:52" },
  { id: "3", side: "out", text: "8h", at: 0, time: "21:53", deliveredAt: 0, readAt: 0 },
  { id: "4", side: "in", text: "Marcado! Amanhã, 8h. Te mando um lembrete.", at: 0, time: "21:53" },
];
const MSG_RECEP: ChatMsg[] = [
  { id: "1", side: "in", text: PEDIDO, at: 0, time: "ontem 21:52" },
  { id: "2", side: "out", text: "Bom dia, Ana! Temos às 10h, pode ser?", at: 0, time: "08:02", deliveredAt: 0, readAt: 0 },
  { id: "3", side: "in", text: "Obrigada, mas já marquei em outra clínica ontem à noite.", at: 0, time: "08:03" },
];
const AUTO = "Atendimento automático";
const MSG_AUTO: ChatMsg[] = [
  { id: "1", side: "in", text: PEDIDO, at: 0, time: "21:52" },
  { id: "2", side: "out", text: "Consigo sim! Amanhã às 8h ou 10h?", at: 0, time: "21:52", deliveredAt: 0, readAt: 0, label: AUTO },
  { id: "3", side: "in", text: "8h", at: 0, time: "21:53" },
  { id: "4", side: "out", text: "Marcado! Amanhã, 8h. Te mando um lembrete.", at: 0, time: "21:53", deliveredAt: 0, readAt: 0, label: AUTO },
];

export const Mensagem2152 = () => {
  const i = useCurrentFrame();
  const n = MENSAGEM_2152_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <Kicker text="UMA HISTÓRIA REAL DE TODA CLÍNICA" color="#8FB8FF" />
        <Title text={"Essa mensagem\nchegou às *21:52.*"} size={92} top={130} />
        <Title text={"Sua clínica respondeu\nàs *8h.*"} size={60} top={360} accent={RED} color="rgba(255,255,255,0.85)" />
        <ChatPhone width={380} x={540} y={490} contact={SUA} msgs={MSG_SUA} />
      </Slide>
    );
  if (i === 1)
    return (
      <Slide tone="dark" index={2} total={n}>
        <Kicker text="QUINTA · 21:52" color="#8FB8FF" />
        <Title text={"Dor de dente.\nEla manda mensagem\npra *duas clínicas.*"} size={72} top={120} />
        <ChatPhone width={360} x={300} y={470} contact={SUA} msgs={MSG_SUA} rot={-3} />
        <ChatPhone width={360} x={780} y={480} contact={OUTRA} msgs={MSG_OUTRA.slice(0, 1)} rot={3} />
      </Slide>
    );
  if (i === 2)
    return (
      <Slide tone="dark" index={3} total={n}>
        <Title text={"Uma respondeu\nem segundos.\n*E marcou.*"} size={76} top={110} accent={MINT} />
        <ChatPhone width={460} x={710} y={300} contact={OUTRA} msgs={MSG_OUTRA} rot={2} />
        <Pill bg={MINT} fg="#04291F" x={64} y={520} size={38}>
          <Check size={34} /> marcou
        </Pill>
        <ChatPhone width={290} x={210} y={640} contact={SUA} msgs={MSG_SUA} dim={0.8} rot={-4} />
        <Pill bg={RED} fg="#FFFFFF" x={74} y={1110} size={30}>
          sem resposta
        </Pill>
      </Slide>
    );
  if (i === 3)
    return (
      <Slide tone="dark" index={4} total={n}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.8 }}>sexta-feira</div>
          <div style={{ fontSize: 230, fontWeight: 300, letterSpacing: -8, lineHeight: 1 }}>08:01</div>
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, top: 560, padding: "28px 32px", borderRadius: 40, background: "rgba(245,245,247,0.92)", color: "#111", display: "flex", gap: 22, alignItems: "center", boxShadow: "0 30px 70px rgba(0,0,0,0.45)" }}>
          <div style={{ width: 88, height: 88, borderRadius: 22, background: "#25D366", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <WhatsIcon size={52} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#555", fontWeight: 600 }}>
              <span>WHATSAPP</span>
              <span>ontem, 21:52</span>
            </div>
            <div style={{ fontSize: 38, fontWeight: 700 }}>Ana</div>
            <div style={{ fontSize: 34, color: "#333" }}>{PEDIDO}</div>
          </div>
        </div>
        <Title text={"Sua recepção chega\ne abre o WhatsApp."} size={70} top={900} align="center" />
      </Slide>
    );
  if (i === 4)
    return (
      <Slide tone="dark" index={5} total={n}>
        <Title text={"“Já marquei em\noutra clínica.”"} size={84} top={110} accent={RED} />
        <ChatPhone width={430} x={540} y={350} contact={ANA} msgs={MSG_RECEP} time="08:03" />
      </Slide>
    );
  if (i === 5)
    return (
      <Slide tone="dark" index={6} total={n}>
        <Title text={"A outra clínica não tinha\nninguém acordado."} size={62} top={100} />
        <Title text={"Tinha um *atendimento\nautomático*, ligado na agenda."} size={58} top={255} accent="#8FB8FF" color="rgba(255,255,255,0.85)" />
        <ChatPhone width={380} x={290} y={445} contact={{ ...ANA, status: () => ({ text: "visto por último hoje às 07:40" }) }} msgs={MSG_AUTO} time="21:53" />
        <div style={{ position: "absolute", left: 560, top: 640, width: 460, padding: 28, borderRadius: 30, background: "#FFFFFF", color: INK, boxShadow: "0 30px 70px rgba(0,0,0,0.35)" }}>
          <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: BLUE }}>AGENDA · SEXTA</div>
          {[
            { h: "08:00", who: "Ana · limpeza", fill: true },
            { h: "08:40", who: "Bruno · avaliação" },
            { h: "10:00", who: "livre" },
          ].map((s) => (
            <div key={s.h} style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, padding: "12px 14px", borderRadius: 16, background: s.fill ? "rgba(20,199,154,0.16)" : "#F1F4F9", border: `2px solid ${s.fill ? MINT : "transparent"}` }}>
              <span style={{ fontFamily: MONO, fontSize: 24, color: SOFT }}>{s.h}</span>
              <span style={{ flex: 1, fontSize: 25, fontWeight: 700, color: s.fill ? "#0B7A5E" : INK, opacity: s.who === "livre" ? 0.4 : 1 }}>{s.who}</span>
              {s.fill ? <Check size={26} color={MINT} /> : null}
            </div>
          ))}
        </div>
      </Slide>
    );
  return (
    <Slide tone="dark" index={7} total={n}>
      <Title text={"Quer isso funcionando\nna *sua clínica?*"} size={86} top={170} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 470, display: "grid", gap: 22, fontSize: 40, fontWeight: 600 }}>
        {["Responde na hora, 24h", "Marca direto na agenda", "Passa pra equipe só o que precisa", "Funciona com o sistema que você já usa"].map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: 26, background: MINT, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Check size={30} />
            </span>
            {b}
          </div>
        ))}
      </div>
      <CtaButton y={900} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
    </Slide>
  );
};
