import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { BLUE, Check, CtaButton, INK, MINT, RED, SOFT, Slide, Title } from "./Slide";

// Carousel (educational, any niche): 5 signs your company already needs a system.
export const CINCO_SINAIS_SLIDES = 7;

const Num = ({ n }: { n: number }) => (
  <div style={{ position: "absolute", left: 64, top: 70, width: 110, height: 110, borderRadius: 30, background: BLUE, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 64 }}>{n}</div>
);

const Card = ({ top, children, h }: { top: number; children: React.ReactNode; h?: number }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top, height: h, padding: 36, borderRadius: 36, background: "#FFFFFF", boxShadow: "0 30px 70px rgba(14,27,51,0.12)", color: INK }}>{children}</div>
);

const Example = () => <div style={{ position: "absolute", right: 100, top: 0, transform: "translateY(-50%)", fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: SOFT, background: "#EEF2F8", padding: "6px 12px", borderRadius: 8 }}>EXEMPLO</div>;

export const CincoSinais = () => {
  const i = useCurrentFrame();
  const n = CINCO_SINAIS_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", right: 30, top: 80, fontSize: 620, fontWeight: 800, lineHeight: 1, color: "rgba(51,119,255,0.22)", letterSpacing: -30 }}>5</div>
        <Title text={"sinais de que\nsua empresa\n*já precisa de\num sistema.*"} size={104} top={330} />
        <div style={{ position: "absolute", left: 64, top: 960, fontSize: 38, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Se você marcar 2 ou mais, leia até o fim.</div>
      </Slide>
    );
  if (i === 1)
    return (
      <Slide tone="light" index={2} total={n}>
        <Num n={1} />
        <Title text={"Só *uma pessoa*\nentende a planilha."} size={78} top={220} accent={RED} />
        <Card top={500}>
          <Example />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, fontFamily: MONO, fontSize: 22 }}>
            {Array.from({ length: 30 }).map((_, k) => (
              <div key={k} style={{ height: 52, borderRadius: 6, background: k < 5 ? "#E3E9F2" : k % 7 === 3 ? "rgba(255,59,92,0.18)" : "#F4F7FB", display: "grid", placeItems: "center", color: k % 7 === 3 ? RED : SOFT }}>{k < 5 ? ["Cliente", "Valor", "Status", "Obs", "???"][k] : k % 7 === 3 ? "#REF!" : k % 5 === 4 ? "ver c/ João" : "…"}</div>
            ))}
          </div>
          <div style={{ marginTop: 26, fontSize: 32, color: SOFT }}>Quando essa pessoa sai de férias, a empresa para junto.</div>
        </Card>
      </Slide>
    );
  if (i === 2)
    return (
      <Slide tone="light" index={3} total={n}>
        <Num n={2} />
        <Title text={"A mesma informação\né *digitada duas vezes.*\nOu três."} size={74} top={220} accent={RED} />
        <Card top={600}>
          <Example />
          {["WhatsApp", "Planilha", "Sistema do caixa"].map((w, k) => (
            <div key={w} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: k ? 18 : 0 }}>
              <span style={{ width: 230, fontSize: 30, fontWeight: 700 }}>{w}</span>
              <span style={{ flex: 1, padding: "16px 20px", borderRadius: 14, background: k === 2 ? "rgba(255,59,92,0.12)" : "#F4F7FB", fontFamily: MONO, fontSize: 28, color: k === 2 ? RED : INK }}>{k === 2 ? "Pedido 428 · R$ 1.250" : "Pedido 482 · R$ 1.520"}</span>
            </div>
          ))}
          <div style={{ marginTop: 26, fontSize: 32, color: SOFT }}>Cada redigitação é uma chance de erro.</div>
        </Card>
      </Slide>
    );
  if (i === 3)
    return (
      <Slide tone="light" index={4} total={n}>
        <Num n={3} />
        <Title text={"O cliente espera porque\n*ninguém viu a mensagem.*"} size={74} top={220} accent={RED} />
        <Card top={560}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ maxWidth: 680, padding: "22px 28px", borderRadius: 30, borderTopLeftRadius: 8, background: "#F4F7FB", fontSize: 36 }}>
              Oi, vocês ainda têm disponibilidade pra essa semana?
              <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 22, color: SOFT, marginTop: 6 }}>terça 19:40</div>
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 30, color: RED }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: RED }} />
            sem resposta há 14 horas
          </div>
          <div style={{ marginTop: 22, fontSize: 32, color: SOFT }}>Quem responde primeiro, leva o cliente.</div>
        </Card>
      </Slide>
    );
  if (i === 4)
    return (
      <Slide tone="light" index={5} total={n}>
        <Num n={4} />
        <Title text={"No fim do mês,\no *número não bate.*"} size={78} top={220} accent={RED} />
        <Card top={540}>
          <Example />
          {[
            { l: "Vendas no sistema", v: "R$ 48.320" },
            { l: "Vendas na planilha", v: "R$ 46.910" },
          ].map((r) => (
            <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 36, padding: "18px 0", borderBottom: "2px solid #E6ECF4" }}>
              <span style={{ fontWeight: 600 }}>{r.l}</span>
              <span style={{ fontFamily: MONO }}>{r.v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 800, paddingTop: 22 }}>
            <span>Diferença</span>
            <span style={{ fontFamily: MONO, color: RED }}>− R$ 1.410</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 32, color: SOFT }}>E ninguém sabe onde ficou.</div>
        </Card>
      </Slide>
    );
  if (i === 5)
    return (
      <Slide tone="light" index={6} total={n}>
        <Num n={5} />
        <Title text={"Você não consegue\nresponder *“quanto vendemos\nhoje?”* na hora."} size={70} top={220} accent={RED} />
        <Card top={600}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, border: "12px solid #E3E9F2", borderTopColor: BLUE, flexShrink: 0 }} />
            <div style={{ fontSize: 34, lineHeight: 1.35 }}>
              “Deixa eu juntar
              <br />
              as planilhas e te falo amanhã.”
            </div>
          </div>
          <div style={{ marginTop: 26, fontSize: 32, color: SOFT }}>Decisão boa precisa de número na hora.</div>
        </Card>
      </Slide>
    );
  return (
    <Slide tone="dark" index={7} total={n}>
      <Title text={"Marcou 2 ou mais?\nO problema não é\n*falta de esforço.*"} size={80} top={140} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 520, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>
        É falta de um sistema feito pro jeito que a sua empresa funciona. A Codexy faz sob medida: sistema, site e atendimento no WhatsApp.
      </div>
      <CtaButton y={900} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
      <div style={{ position: "absolute", left: 64, top: 760, display: "flex", gap: 14, alignItems: "center", fontSize: 30, color: MINT, fontWeight: 700 }}>
        <Check size={30} color={MINT} /> sem compromisso
      </div>
    </Slide>
  );
};
