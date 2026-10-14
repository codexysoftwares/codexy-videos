import { useCurrentFrame } from "remotion";
import { MONO } from "../shared/theme";
import { BLUE, Check, CtaButton, INK, MINT, RED, SOFT, Slide, Title } from "./Slide";

// Carousel (Bastidores): "Projeto conceito: o sistema de uma oficina em 6 telas". FICTIONAL, always labeled.
export const OFICINA_SLIDES = 8;

const AMBER = "#F5A524";
const Label = () => (
  <div style={{ position: "absolute", right: 64, top: 70, fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: SOFT, background: "#EEF2F8", padding: "6px 12px", borderRadius: 8 }}>PROJETO CONCEITO · OFICINA FICTÍCIA</div>
);

// Desktop-ish app window used by every screen.
const Screen = ({ title, children, top = 430, h = 760 }: { title: string; children: React.ReactNode; top?: number; h?: number }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top, height: h, borderRadius: 26, background: "#FFFFFF", boxShadow: "0 34px 80px rgba(14,27,51,0.16)", overflow: "hidden", color: INK }}>
    <div style={{ height: 54, background: "#F1F4F9", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: "2px solid #E3E9F2" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 20, color: SOFT }}>oficina · {title}</span>
    </div>
    <div style={{ padding: 28 }}>{children}</div>
  </div>
);

const Row = ({ a, b, c, color }: { a: string; b: string; c?: string; color?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 16, background: "#F6F8FB", fontSize: 26, marginBottom: 12 }}>
    <span style={{ fontWeight: 700, flex: 1 }}>{a}</span>
    <span style={{ fontFamily: MONO, color: SOFT }}>{b}</span>
    {c ? <span style={{ padding: "4px 12px", borderRadius: 999, background: color ?? "#E3E9F2", color: "#fff", fontWeight: 700, fontSize: 20 }}>{c}</span> : null}
  </div>
);

const TELAS: { titulo: string; frase: string; tela: React.ReactNode }[] = [
  {
    titulo: "Ordem de serviço digital",
    frase: "O carro chega e a OS nasce no tablet, com fotos e o que o cliente relatou.",
    tela: (
      <Screen title="nova OS">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 36, fontWeight: 800 }}>OS #1042</div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: SOFT }}>hoje 08:12</div>
        </div>
        <div style={{ marginTop: 18 }}>
          <Row a="Veículo" b="Onix 2019 · placa ABC1D23" />
          <Row a="Cliente relatou" b="barulho ao frear" />
          <Row a="Quilometragem" b="68.400 km" />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ flex: 1, height: 150, borderRadius: 16, background: `linear-gradient(135deg, #D7DEE8, #B9C4D3)`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 20, color: "#6B7A93" }}>
              foto {k + 1}
            </div>
          ))}
        </div>
      </Screen>
    ),
  },
  {
    titulo: "Orçamento aprovado pelo WhatsApp",
    frase: "O cliente recebe o orçamento no celular e aprova com um toque. Sem ligação, sem “esqueci de ver”.",
    tela: (
      <Screen title="orçamento OS #1042">
        <Row a="Pastilhas de freio (par)" b="R$ 240,00" />
        <Row a="Disco de freio (par)" b="R$ 380,00" />
        <Row a="Mão de obra" b="R$ 180,00" />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, fontWeight: 800, padding: "14px 18px" }}>
          <span>Total</span>
          <span style={{ fontFamily: MONO }}>R$ 800,00</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, padding: "18px 20px", borderRadius: 18, background: "rgba(20,199,154,0.14)", border: `2px solid ${MINT}`, fontSize: 28, fontWeight: 700, color: "#0B7A5E" }}>
          <Check size={30} color={MINT} /> Aprovado pelo cliente no WhatsApp · 09:40
        </div>
      </Screen>
    ),
  },
  {
    titulo: "Quadro do pátio",
    frase: "Cada carro numa coluna. Todo mundo sabe o que está esperando peça e o que está pronto.",
    tela: (
      <Screen title="pátio">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { c: "Aguardando peça", color: AMBER, cars: ["Onix · freio", "HB20 · embreagem"] },
            { c: "Em execução", color: BLUE, cars: ["Gol · revisão", "Strada · suspensão", "Kwid · óleo"] },
            { c: "Pronto", color: MINT, cars: ["Civic · alinhamento"] },
          ].map((col) => (
            <div key={col.c} style={{ padding: 14, borderRadius: 18, background: "#F6F8FB", minHeight: 520 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: col.color, marginBottom: 12 }}>{col.c}</div>
              {col.cars.map((car) => (
                <div key={car} style={{ padding: "14px 14px", borderRadius: 14, background: "#FFFFFF", borderLeft: `6px solid ${col.color}`, fontSize: 22, fontWeight: 700, marginBottom: 10, boxShadow: "0 6px 14px rgba(14,27,51,0.06)" }}>
                  {car}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Screen>
    ),
  },
  {
    titulo: "Estoque de peças com alerta",
    frase: "A peça usada na OS sai do estoque sozinha. Quando está acabando, o sistema avisa.",
    tela: (
      <Screen title="estoque">
        <Row a="Pastilha de freio · dianteira" b="2 un." c="repor" color={RED} />
        <Row a="Filtro de óleo" b="14 un." c="ok" color={MINT} />
        <Row a="Óleo 5W30 (litro)" b="6 un." c="baixo" color={AMBER} />
        <Row a="Disco de freio" b="9 un." c="ok" color={MINT} />
        <Row a="Correia dentada" b="3 un." c="baixo" color={AMBER} />
      </Screen>
    ),
  },
  {
    titulo: "O cliente acompanha o carro",
    frase: "Um link no WhatsApp mostra em que etapa o carro está. O telefone da oficina para de tocar.",
    tela: (
      <Screen title="acompanhamento do cliente">
        {[
          { s: "Recebido", ok: true },
          { s: "Orçamento aprovado", ok: true },
          { s: "Em execução", ok: true },
          { s: "Pronto para retirada", ok: false },
        ].map((s, k) => (
          <div key={s.s} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 10px", borderBottom: k < 3 ? "2px solid #EEF2F8" : "none", fontSize: 32, fontWeight: 700, color: s.ok ? INK : SOFT }}>
            <span style={{ width: 46, height: 46, borderRadius: 23, background: s.ok ? MINT : "#E3E9F2", display: "grid", placeItems: "center" }}>{s.ok ? <Check size={26} /> : null}</span>
            {s.s}
          </div>
        ))}
        <div style={{ marginTop: 18, fontSize: 26, color: SOFT }}>Previsão: hoje, 17h</div>
      </Screen>
    ),
  },
  {
    titulo: "O painel do dono",
    frase: "Faturamento do mês, carros no pátio e serviços que mais saem, sem montar planilha.",
    tela: (
      <Screen title="painel">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["Carros no pátio", "6"],
            ["OS abertas hoje", "4"],
            ["Ticket médio", "R$ 612"],
            ["Aprovação de orçamento", "78%"],
          ].map(([l, v]) => (
            <div key={l} style={{ padding: 20, borderRadius: 18, background: "#F6F8FB" }}>
              <div style={{ fontSize: 22, color: SOFT, fontWeight: 600 }}>{l}</div>
              <div style={{ fontFamily: MONO, fontSize: 48, fontWeight: 600, marginTop: 6 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 190, marginTop: 20 }}>
          {[0.4, 0.55, 0.5, 0.7, 0.65, 0.85, 0.95].map((h, k) => (
            <div key={k} style={{ flex: 1, height: `${h * 100}%`, borderRadius: "8px 8px 2px 2px", background: k === 6 ? BLUE : "#9DB8F5" }} />
          ))}
        </div>
        <div style={{ textAlign: "right", fontFamily: MONO, fontSize: 18, color: SOFT, marginTop: 8 }}>dados de exemplo</div>
      </Screen>
    ),
  },
];

export const OficinaConceito = () => {
  const i = useCurrentFrame();
  const n = OFICINA_SLIDES;
  if (i === 0)
    return (
      <Slide tone="dark" index={1} total={n} cover>
        <div style={{ position: "absolute", left: 64, top: 120, padding: "10px 20px", borderRadius: 12, border: "2px solid rgba(143,184,255,0.5)", fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: "#C9D8FF" }}>PROJETO CONCEITO</div>
        <Title text={"Como seria o sistema\nde uma *oficina\nmecânica*, em 6 telas."} size={92} top={250} />
        <div style={{ position: "absolute", left: 64, top: 760, fontSize: 36, color: "rgba(255,255,255,0.75)", fontWeight: 600, lineHeight: 1.4 }}>
          Da chegada do carro ao painel do dono.
          <br />
          Oficina fictícia, telas de exemplo.
        </div>
      </Slide>
    );
  if (i <= 6) {
    const s = TELAS[i - 1];
    return (
      <Slide tone="light" index={i + 1} total={n}>
        <Label />
        <div style={{ position: "absolute", left: 64, top: 70, fontFamily: MONO, fontSize: 28, color: BLUE, fontWeight: 600 }}>TELA {i}/6</div>
        <Title text={s.titulo} size={68} top={140} />
        <div style={{ position: "absolute", left: 64, right: 64, top: 240, fontSize: 32, lineHeight: 1.38, color: SOFT }}>{s.frase}</div>
        {s.tela}
      </Slide>
    );
  }
  return (
    <Slide tone="dark" index={8} total={n}>
      <Title text={"Sua empresa não é\numa oficina?\n*A lógica é a mesma.*"} size={80} top={150} />
      <div style={{ position: "absolute", left: 64, right: 64, top: 520, fontSize: 40, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>Entender o fluxo, cortar o que é manual e juntar tudo num sistema só. Feito pro jeito que vocês trabalham.</div>
      <CtaButton y={880} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1020, textAlign: "center", fontFamily: MONO, fontSize: 32, color: "#E8EEFF", opacity: 0.85 }}>link na bio · @codexy.ai</div>
    </Slide>
  );
};
