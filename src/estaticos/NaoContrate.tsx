import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { Check, CtaButton, INK, MINT, RED, SOFT, Slide, Title } from "./Slide";

// Carousel (Contra a maré): "Não contrate um sistema. Ainda." Honest advice that builds trust.
export const NAO_CONTRATE_SLIDES = 6;

const NAO = [
  { t: "Se você ainda não sabe qual problema quer resolver.", d: "Sistema não descobre o problema por você. Primeiro a dor, depois a ferramenta." },
  { t: "Se o seu processo muda toda semana.", d: "Espere ele se estabilizar. Senão você paga pra construir algo que já nasce velho." },
  { t: "Se um sistema pronto e barato já resolve.", d: "Sério. Use ele. Sob medida é pra quando o pronto começa a te atrapalhar." },
];

export const NaoContrate = () => {
  const i = useCurrentFrame();
  const n = NAO_CONTRATE_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", left: 64, top: 120, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "#8FB8FF" }}>CONSELHO DE QUEM VENDE SISTEMA</div>
        <Title text={"Não contrate\num sistema."} size={124} top={300} />
        <Title text={"*Ainda.*"} size={190} top={590} accent={RED} />
      </Slide>
    );
  if (i <= 3) {
    const x = NAO[i - 1];
    return (
      <Slide tone="light" index={i + 1} total={n}>
        <div style={{ position: "absolute", left: 64, top: 90, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ padding: "10px 20px", borderRadius: 12, background: "rgba(255,59,92,0.12)", color: RED, fontWeight: 800, fontSize: 30 }}>NÃO CONTRATE</span>
          <span style={{ fontFamily: MONO, fontSize: 26, color: SOFT }}>{i}/3</span>
        </div>
        <Title text={x.t} size={78} top={230} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 700, padding: 36, borderRadius: 30, background: "#FFFFFF", boxShadow: "0 26px 60px rgba(14,27,51,0.12)", fontSize: 40, lineHeight: 1.42, color: INK, borderLeft: `10px solid ${RED}` }}>{x.d}</div>
      </Slide>
    );
  }
  if (i === 4)
    return (
      <Slide tone="light" index={5} total={n}>
        <div style={{ position: "absolute", left: 64, top: 90 }}>
          <span style={{ padding: "10px 20px", borderRadius: 12, background: "rgba(20,199,154,0.14)", color: "#0B7A5E", fontWeight: 800, fontSize: 30 }}>AGORA, CONTRATE QUANDO</span>
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 220, display: "grid", gap: 26 }}>
          {[
            "A mesma informação é digitada em mais de um lugar.",
            "O pronto te obriga a mudar um jeito de trabalhar que funciona.",
            "Você paga vários sistemas que não conversam.",
            "Só uma pessoa sabe como as coisas funcionam.",
            "Você não consegue ver os números do negócio na hora.",
          ].map((x) => (
            <div key={x} style={{ display: "flex", gap: 20, alignItems: "flex-start", fontSize: 40, fontWeight: 700, lineHeight: 1.28, color: INK }}>
              <span style={{ width: 54, height: 54, borderRadius: 27, background: MINT, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>
                <Check size={32} />
              </span>
              {x}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, top: 960, padding: "28px 32px", borderRadius: 28, background: "rgba(20,199,154,0.12)", border: `3px solid ${MINT}`, fontSize: 38, fontWeight: 700, lineHeight: 1.35, color: INK }}>
          Marcou 2 ou mais? Aí sim, sob medida faz sentido.
        </div>
      </Slide>
    );
  return (
    <Slide tone="dark" index={6} total={n}>
      <Title text={"No diagnóstico,\na gente pode te dizer\nque você *ainda não\nprecisa.*"} size={78} top={150} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 600, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>E tudo bem. Melhor ouvir isso agora do que pagar por um sistema que ninguém usa.</div>
      <CtaButton y={880} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
    </Slide>
  );
};
