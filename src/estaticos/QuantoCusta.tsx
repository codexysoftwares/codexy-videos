import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { BLUE, Check, CtaButton, INK, MINT, SOFT, Slide, Title } from "./Slide";

// Carousel (Contra a maré): "Quanto custa um sistema sob medida? Depende de 4 coisas." No prices — what drives the price.
export const QUANTO_CUSTA_SLIDES = 7;

const FATORES = [
  {
    t: "O tamanho do problema",
    d: "Quantas telas, quantos fluxos, quantas regras. Um agendamento simples não custa o mesmo que um PDV com estoque.",
    ex: ["1 fluxo · agenda", "3 fluxos · pedido + cozinha + caixa", "8 fluxos · operação inteira"],
  },
  {
    t: "Com o que ele precisa conversar",
    d: "WhatsApp, banco, app de delivery, o sistema que você já usa. Cada integração é uma ponte a mais pra construir.",
    ex: ["WhatsApp", "Pagamentos / Pix", "Sistema atual (via API)"],
  },
  {
    t: "Quem vai usar e como",
    d: "Só o dono? Equipe com permissões diferentes? No celular, no computador, na TV da cozinha?",
    ex: ["Dono", "Equipe com níveis de acesso", "Cliente final"],
  },
  {
    t: "O que vem primeiro",
    d: "Você não precisa construir tudo de uma vez. Começar pela parte que mais dói reduz o investimento inicial.",
    ex: ["Etapa 1 · o que mais dói", "Etapa 2 · o que mais economiza", "Etapa 3 · o resto"],
  },
];

export const QuantoCusta = () => {
  const i = useCurrentFrame();
  const n = QUANTO_CUSTA_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", left: 64, top: 120, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "#8FB8FF" }}>A PERGUNTA QUE NINGUÉM RESPONDE</div>
        <Title text={"Quanto custa\num sistema\n*sob medida?*"} size={118} top={250} />
        <Title text={"Depende de 4 coisas.\nTe mostro quais."} size={58} top={760} color="rgba(255,255,255,0.8)" />
      </Slide>
    );
  if (i <= 4) {
    const f = FATORES[i - 1];
    return (
      <Slide tone="light" index={i + 1} total={n}>
        <div style={{ position: "absolute", left: 64, top: 80, display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ width: 96, height: 96, borderRadius: 26, background: BLUE, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 56 }}>{i}</span>
          <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: SOFT }}>DE 4 FATORES</span>
        </div>
        <Title text={f.t} size={80} top={220} />
        <div style={{ position: "absolute", left: 64, right: 64, top: i === 2 ? 480 : 400, fontSize: 38, lineHeight: 1.42, color: INK }}>{f.d}</div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 760, padding: 30, borderRadius: 30, background: "#FFFFFF", boxShadow: "0 26px 60px rgba(14,27,51,0.12)", display: "grid", gap: 14 }}>
          {f.ex.map((e, k) => (
            <div key={e} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#F4F7FB", fontSize: 30, fontWeight: 600 }}>
              <span style={{ height: 14, width: 40 + k * 60, borderRadius: 7, background: `rgba(0,85,255,${0.35 + k * 0.25})`, flexShrink: 0 }} />
              {e}
            </div>
          ))}
        </div>
      </Slide>
    );
  }
  if (i === 5)
    return (
      <Slide tone="light" index={6} total={n}>
        <Title text={"E o que *não*\ndeveria definir\no preço:"} size={84} top={130} accent="#FF3B5C" />
        <div style={{ position: "absolute", left: 64, right: 64, top: 560, display: "grid", gap: 22 }}>
          {["O tamanho da sua empresa.", "O nome bonito da tecnologia.", "Funcionalidades que ninguém vai usar."].map((x) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 42, fontWeight: 700, color: INK }}>
              <span style={{ width: 52, height: 52, borderRadius: 26, background: "rgba(255,59,92,0.15)", color: "#FF3B5C", display: "grid", placeItems: "center", fontSize: 30, fontWeight: 800, flexShrink: 0 }}>✕</span>
              {x}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 900, padding: "30px 34px", borderRadius: 28, background: "#FFFFFF", boxShadow: "0 20px 50px rgba(14,27,51,0.1)", fontSize: 36, lineHeight: 1.38, color: INK }}>
          O preço justo vem do <b>problema que o sistema resolve</b>, e do quanto ele te devolve em tempo e dinheiro.
        </div>
      </Slide>
    );
  return (
    <Slide tone="dark" index={7} total={n}>
      <Title text={"Quer saber quanto\ncusta *o seu?*"} size={92} top={170} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 440, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>No diagnóstico gratuito a gente entende o seu caso e te passa um número de verdade. Sem compromisso.</div>
      <div style={{ position: "absolute", left: 64, top: 700, display: "flex", gap: 14, alignItems: "center", fontSize: 32, color: MINT, fontWeight: 700 }}>
        <Check size={32} color={MINT} /> e dá pra começar pela etapa que mais dói
      </div>
      <CtaButton y={880} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
    </Slide>
  );
};
