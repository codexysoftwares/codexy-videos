import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { Check, CtaButton, INK, MINT, SOFT, Slide, Title } from "./Slide";

// Carousel (authority): how a custom system is built at Codexy, in 4 steps.
export const COMO_NASCE_SLIDES = 6;

const ETAPAS = [
  {
    n: "01",
    t: "Diagnóstico",
    d: "A gente entende como a sua empresa funciona hoje: quem faz o quê, onde a informação se perde e o que mais custa tempo.",
    tag: "gratuito",
    visual: ["Atendimento no WhatsApp", "Planilha de pedidos", "Caixa em outro sistema"],
  },
  {
    n: "02",
    t: "Desenho",
    d: "Você vê e aprova as telas antes de qualquer linha de código. O sistema nasce com o jeito da sua operação.",
    tag: "você aprova",
    visual: ["Tela de agenda", "Tela de pedidos", "Painel do dono"],
  },
  {
    n: "03",
    t: "Construção em etapas",
    d: "Entregas curtas: você acompanha, testa e ajusta durante o caminho. Nada de sumir por meses.",
    tag: "prazo ágil",
    visual: ["Etapa 1 · entregue", "Etapa 2 · em teste", "Etapa 3 · em construção"],
  },
  {
    n: "04",
    t: "Entrega e suporte",
    d: "Treinamos a sua equipe e seguimos junto depois: ajustes, melhorias e suporte contínuo.",
    tag: "garantia + suporte",
    visual: ["Equipe treinada", "Ajustes inclusos", "Suporte contínuo"],
  },
];

export const ComoNasce = () => {
  const i = useCurrentFrame();
  const n = COMO_NASCE_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", left: 64, top: 120, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "#8FB8FF" }}>CODEXY · SOFTWARE SOB MEDIDA</div>
        <Title text={"Como nasce um\nsistema feito\n*pro jeito da sua\nempresa.*"} size={100} top={250} />
        <div style={{ position: "absolute", left: 64, top: 820, display: "flex", gap: 14 }}>
          {ETAPAS.map((e) => (
            <div key={e.n} style={{ padding: "14px 22px", borderRadius: 999, border: "2px solid rgba(143,184,255,0.45)", fontFamily: MONO, fontSize: 24, color: "#C9D8FF" }}>
              {e.n} {e.t.split(" ")[0]}
            </div>
          ))}
        </div>
      </Slide>
    );
  if (i <= 4) {
    const e = ETAPAS[i - 1];
    return (
      <Slide tone="light" index={i + 1} total={n}>
        <div style={{ position: "absolute", left: 64, top: 80, fontWeight: 800, fontSize: 200, lineHeight: 1, color: "rgba(0,85,255,0.12)", letterSpacing: -8 }}>{e.n}</div>
        <Title text={e.t} size={88} top={250} />
        <div style={{ position: "absolute", left: 64, top: 360, padding: "10px 20px", borderRadius: 999, background: "rgba(20,199,154,0.14)", color: "#0B7A5E", fontWeight: 800, fontSize: 28 }}>{e.tag}</div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 450, fontSize: 40, lineHeight: 1.4, color: INK }}>{e.d}</div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 790, padding: 30, borderRadius: 30, background: "#FFFFFF", boxShadow: "0 26px 60px rgba(14,27,51,0.12)", display: "grid", gap: 14 }}>
          {e.visual.map((v, k) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 18, background: "#F4F7FB", fontSize: 30, fontWeight: 600 }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: i === 3 && k > 0 ? "#DCE5F0" : MINT, display: "grid", placeItems: "center" }}>{i === 3 && k > 0 ? null : <Check size={24} />}</span>
              <span style={{ color: i === 3 && k > 0 ? SOFT : INK }}>{v}</span>
            </div>
          ))}
        </div>
      </Slide>
    );
  }
  return (
    <Slide tone="dark" index={6} total={n}>
      <Title text={"O primeiro passo\né *de graça.*"} size={96} top={170} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 470, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>
        No diagnóstico gratuito a gente olha a sua operação e mostra o que um sistema sob medida resolveria. Sem compromisso.
      </div>
      <div style={{ position: "absolute", left: 64, top: 720, display: "flex", gap: 14, fontSize: 30, fontWeight: 700, color: MINT }}>
        {["Sistemas", "Sites", "Atendimento no WhatsApp"].map((s) => (
          <span key={s} style={{ padding: "10px 18px", borderRadius: 999, border: `2px solid ${MINT}` }}>
            {s}
          </span>
        ))}
      </div>
      <CtaButton y={900} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
    </Slide>
  );
};
