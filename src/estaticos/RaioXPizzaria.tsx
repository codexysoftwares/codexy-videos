import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { BLUE, Check, CtaButton, INK, MINT, RED, SOFT, Slide, Title } from "./Slide";

// Carousel "Raio-X #2": a FICTIONAL pizzeria's order process, 14 steps → 4. Series format (Raio-X #2, #3…).
export const RAIO_X_PIZZARIA_SLIDES = 7;

type Kind = "redigita" | "espera" | "pergunta" | "ok";
const PASSOS: { t: string; k: Kind }[] = [
  { t: "Cliente manda áudio no WhatsApp", k: "ok" },
  { t: "Atendente escuta o áudio", k: "espera" },
  { t: "Anota o pedido no papel", k: "redigita" },
  { t: "Confere o preço no cardápio", k: "redigita" },
  { t: "Soma na calculadora", k: "redigita" },
  { t: "Manda o total e a chave Pix", k: "redigita" },
  { t: "Espera o comprovante", k: "espera" },
  { t: "Confere o Pix no app do banco", k: "espera" },
  { t: "Digita o pedido no caixa", k: "redigita" },
  { t: "Cozinha recebe a comanda", k: "ok" },
  { t: "Cozinha pergunta: “era meia calabresa?”", k: "pergunta" },
  { t: "Chama o motoboy no grupo", k: "ok" },
  { t: "Cliente pergunta: “cadê minha pizza?”", k: "pergunta" },
  { t: "Motoboy entrega", k: "ok" },
];
const COR: Record<Kind, string> = { redigita: RED, espera: "#F5A524", pergunta: "#8B5CF6", ok: "#94A3B8" };
const LEG: Record<Exclude<Kind, "ok">, string> = { redigita: "informação copiada à mão", espera: "alguém parado esperando", pergunta: "pergunta que não devia existir" };

const NOVOS = [
  { t: "Cliente pede pelo link", d: "Cardápio com preço, total e Pix gerados sozinhos." },
  { t: "O pedido cai na tela da cozinha", d: "Sabor por sabor, sem comanda de papel." },
  { t: "Saiu pra entrega: o cliente é avisado", d: "Ele acompanha pelo link. Ninguém pergunta “cadê?”." },
  { t: "O caixa fecha sozinho", d: "Cada pedido já entrou com o pagamento conferido." },
];

const Steps = ({ crossed = false, highlight = false, top = 300 }: { crossed?: boolean; highlight?: boolean; top?: number }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
    {PASSOS.map((p, i) => {
      const cut = crossed && p.k !== "ok";
      const color = highlight || crossed ? COR[p.k] : "#94A3B8";
      return (
        <div key={i} style={{ position: "relative", display: "flex", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 16, background: "#FFFFFF", boxShadow: "0 8px 20px rgba(14,27,51,0.06)", borderLeft: `8px solid ${color}`, opacity: cut ? 0.45 : 1 }}>
          <span style={{ fontFamily: MONO, fontSize: 22, color: SOFT, width: 30 }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 23, fontWeight: 600, color: INK, lineHeight: 1.2 }}>{p.t}</span>
          {cut ? <div style={{ position: "absolute", left: 12, right: 12, top: "50%", height: 4, borderRadius: 2, background: RED, rotate: "-2deg" }} /> : null}
        </div>
      );
    })}
  </div>
);

const Tag = () => (
  <div style={{ position: "absolute", right: 64, top: 70, fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: SOFT, background: "#EEF2F8", padding: "6px 12px", borderRadius: 8 }}>PIZZARIA FICTÍCIA · EXEMPLO</div>
);

export const RaioXPizzaria = () => {
  const i = useCurrentFrame();
  const n = RAIO_X_PIZZARIA_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", left: 64, top: 110, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ padding: "10px 20px", borderRadius: 12, background: BLUE, fontFamily: MONO, fontSize: 30, fontWeight: 600, letterSpacing: 3 }}>RAIO-X #2</span>
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#8FB8FF", letterSpacing: 2 }}>o pedido de uma pizzaria</span>
        </div>
        <Title text={"Desmontei o pedido\nde uma pizzaria.\nTinha *14 passos.*"} size={92} top={260} />
        <Title text={"Sobraram 4."} size={150} top={660} accent={MINT} color={MINT} />
        <div style={{ position: "absolute", left: 64, top: 900, fontSize: 36, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Arraste e veja onde foram parar os outros 10.</div>
      </Slide>
    );
  if (i === 1)
    return (
      <Slide tone="light" index={2} total={n}>
        <Tag />
        <Title text={"Como é hoje:\n*14 passos* por pedido."} size={70} top={110} accent={BLUE} />
        <Steps />
      </Slide>
    );
  if (i === 2) {
    const count = (k: Kind) => PASSOS.filter((p) => p.k === k).length;
    return (
      <Slide tone="light" index={3} total={n}>
        <Tag />
        <Title text={"Onde dói."} size={80} top={110} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 240, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {(Object.keys(LEG) as Exclude<Kind, "ok">[]).map((k) => (
            <div key={k} style={{ padding: "22px 20px", borderRadius: 22, background: "#FFFFFF", borderTop: `8px solid ${COR[k]}`, boxShadow: "0 12px 30px rgba(14,27,51,0.08)" }}>
              <div style={{ fontSize: 64, fontWeight: 800, color: COR[k], lineHeight: 1 }}>{count(k)}</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: INK, marginTop: 8, lineHeight: 1.25 }}>{LEG[k]}</div>
            </div>
          ))}
        </div>
        <Steps highlight top={470} />
      </Slide>
    );
  }
  if (i === 3)
    return (
      <Slide tone="light" index={4} total={n}>
        <Tag />
        <Title text={"Cada passo riscado\né trabalho que *o sistema\nfaz sozinho.*"} size={64} top={100} accent={BLUE} />
        <Steps crossed top={350} />
      </Slide>
    );
  if (i === 4)
    return (
      <Slide tone="light" index={5} total={n}>
        <Tag />
        <Title text={"Como fica:\n*4 passos.*"} size={84} top={110} accent={MINT} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 360, display: "grid", gap: 18 }}>
          {NOVOS.map((s, k) => (
            <div key={s.t} style={{ display: "flex", gap: 22, alignItems: "flex-start", padding: "26px 28px", borderRadius: 26, background: "#FFFFFF", boxShadow: "0 14px 34px rgba(14,27,51,0.08)", borderLeft: `8px solid ${MINT}` }}>
              <span style={{ width: 56, height: 56, borderRadius: 28, background: MINT, color: "#04291F", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>{k + 1}</span>
              <div>
                <div style={{ fontSize: 36, fontWeight: 800, color: INK }}>{s.t}</div>
                <div style={{ fontSize: 28, color: SOFT, marginTop: 4 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    );
  if (i === 5)
    return (
      <Slide tone="dark" index={6} total={n}>
        <Title text={"O que muda\n*de verdade:*"} size={88} top={130} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 400, display: "grid", gap: 26 }}>
          {[
            ["Ninguém copia pedido à mão.", "Sem pizza trocada, sem total errado."],
            ["O atendente para de ser digitador.", "Fica livre pra atender quem chega."],
            ["O cliente não precisa perguntar.", "Ele acompanha o pedido sozinho."],
            ["O caixa já nasce fechado.", "Pagamento conferido em cada pedido."],
          ].map(([a, b]) => (
            <div key={a} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <span style={{ width: 52, height: 52, borderRadius: 26, background: MINT, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 4 }}>
                <Check size={30} />
              </span>
              <div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>{a}</div>
                <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    );
  return (
    <Slide tone="dark" index={7} total={n}>
      <Title text={"Quer um Raio-X\nda *sua operação?*"} size={92} top={160} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 430, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>É exatamente o que a gente faz no diagnóstico gratuito: desenha o seu processo e mostra o que dá pra cortar.</div>
      <CtaButton y={760} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 960, padding: "26px 30px", borderRadius: 26, border: "2px dashed rgba(143,184,255,0.5)", fontSize: 34, lineHeight: 1.35, color: "#C9D8FF" }}>
        <span style={{ fontWeight: 800, color: "#FFFFFF" }}>Raio-X #3:</span> comenta qual negócio você quer ver desmontado.
      </div>
    </Slide>
  );
};
