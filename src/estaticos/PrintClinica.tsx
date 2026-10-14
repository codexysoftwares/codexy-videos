import type { ChatContact, ChatMsg } from "../shared/kit/Chat";
import { MONO } from "../shared/theme";
import { ChatPhone, RED, SOFT, Slide, Title } from "./Slide";

// Single post (paid test): the conversation every clinic has and never sees.
const ANA: ChatContact = { name: "Ana", initials: "A", color: "#E0812F", status: () => ({ text: "online", color: "#25D366" }) };
const MSGS: ChatMsg[] = [
  { id: "1", side: "in", text: "Oi! Consegue me encaixar amanhã cedo?", at: 0, time: "ontem 21:52" },
  { id: "2", side: "in", text: "Queria fazer uma limpeza", at: 0, time: "ontem 21:52" },
  { id: "3", side: "in", text: "??", at: 0, time: "ontem 22:30" },
  { id: "4", side: "in", text: "deixa, já marquei em outra clínica", at: 0, time: "07:15" },
];

export const PrintClinica = () => (
  <Slide tone="light" index={1} total={1}>
    <Title text={"Quantas dessas sua\nclínica recebeu *essa semana?*"} size={70} top={70} accent={RED} />
    <div style={{ position: "absolute", left: 64, right: 64, top: 245, fontFamily: MONO, fontSize: 26, color: SOFT }}>atendimento 24h no WhatsApp · diagnóstico gratuito</div>
    <ChatPhone width={440} x={540} y={315} contact={ANA} msgs={MSGS} time="08:02" />
  </Slide>
);
