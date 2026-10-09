import { Img, interpolate, staticFile } from "remotion";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";

// Stylized restaurant app screens built with real dish photos from a client project
// (public/projetos/restaurante). No prices or restaurant name: we don't have the client's approval for that.
const photo = (name: string) => staticFile(`projetos/restaurante/${name}.jpg`);

const DISHES = [
  { file: "barca-de-grelhados", name: "Barca de grelhados" },
  { file: "porcao-tabua-mista-das-gerais", name: "Tábua mista" },
  { file: "torresmo-de-rolo-destaque", name: "Torresmo de rolo" },
  { file: "porcao-isca-de-frango-empanado", name: "Isca de frango" },
  { file: "kibinho", name: "Kibinho" },
  { file: "pastel-de-angu", name: "Pastel de angu" },
  { file: "contra-file-com-fritas", name: "Contra-filé com fritas" },
  { file: "brownie-recheado-de-ninho", name: "Brownie de Ninho" },
];

const Photo: React.FC<{ readonly file: string; readonly t: number; readonly style?: React.CSSProperties }> = ({
  file,
  t,
  style,
}) => (
  <div style={{ overflow: "hidden", ...style }}>
    <Img
      src={photo(file)}
      style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.04 + t * 0.004 }}
    />
  </div>
);

const Header: React.FC<{ readonly title: string; readonly tag: string }> = ({ title, tag }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "36px 40px 20px" }}>
    <div style={{ fontFamily: SANS, fontSize: 52, fontWeight: 800, color: C.white }}>{title}</div>
    <div
      style={{
        fontFamily: MONO,
        fontSize: 22,
        letterSpacing: 2,
        color: C.ice,
        padding: "10px 18px",
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.08)",
      }}
    >
      {tag}
    </div>
  </div>
);

const Menu: React.FC<{ readonly t: number }> = ({ t }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Header title="Cardápio" tag="ABERTO AGORA" />
    <div style={{ display: "flex", gap: 14, padding: "0 40px 24px" }}>
      {["Porções", "Pratos", "Chopes", "Sobremesas"].map((c, i) => (
        <div
          key={c}
          style={{
            fontFamily: SANS,
            fontSize: 26,
            fontWeight: 700,
            padding: "12px 22px",
            borderRadius: 999,
            color: i === 0 ? C.deep : C.ice,
            backgroundColor: i === 0 ? "#F5A524" : "rgba(255,255,255,0.08)",
          }}
        >
          {c}
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, padding: "0 40px", flex: 1 }}>
      {DISHES.slice(0, 4).map((d, i) => (
        <div
          key={d.file}
          style={{
            borderRadius: 26,
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.05)",
            opacity: interpolate(t, [i * 1.5, i * 1.5 + 4], [0, 1], clamp),
            translate: `0px ${interpolate(t, [i * 1.5, i * 1.5 + 6], [30, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          <Photo file={d.file} t={t} style={{ height: 300 }} />
          <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 700, color: C.white, padding: "18px 20px" }}>
            {d.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Detail: React.FC<{ readonly t: number }> = ({ t }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Photo file="barca-de-grelhados" t={t * 1.5} style={{ height: 720 }} />
    <div style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#F5A524" }}>MAIS PEDIDO</div>
      <div style={{ fontFamily: SANS, fontSize: 64, fontWeight: 800, color: C.white }}>Barca de grelhados</div>
      <div style={{ fontFamily: SANS, fontSize: 30, color: C.muted }}>Para compartilhar · serve 3 pessoas</div>
      <div
        style={{
          marginTop: 16,
          padding: "28px 0",
          borderRadius: 24,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 36,
          fontWeight: 800,
          color: C.white,
          background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
          scale: interpolate(t, [6, 8, 11], [1, 0.94, 1], clamp),
        }}
      >
        Adicionar ao pedido
      </div>
    </div>
  </div>
);

const Order: React.FC<{ readonly t: number }> = ({ t }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Header title="Seu pedido" tag="MESA 07" />
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 40px", flex: 1 }}>
      {[DISHES[0], DISHES[2], DISHES[4], DISHES[7]].map((d, i) => (
        <div
          key={d.file}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: 18,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.05)",
            opacity: interpolate(t, [i * 2, i * 2 + 4], [0, 1], clamp),
            translate: `${interpolate(t, [i * 2, i * 2 + 6], [60, 0], { ...clamp, easing: EASE })}px 0px`,
          }}
        >
          <Photo file={d.file} t={t} style={{ width: 150, height: 150, borderRadius: 18 }} />
          <div style={{ flex: 1, fontFamily: SANS, fontSize: 34, fontWeight: 700, color: C.white }}>{d.name}</div>
          <div style={{ fontFamily: MONO, fontSize: 32, color: C.ice }}>{i === 0 ? "1x" : i === 2 ? "2x" : "1x"}</div>
        </div>
      ))}
    </div>
    <div
      style={{
        margin: "0 40px 40px",
        padding: "28px 0",
        borderRadius: 24,
        textAlign: "center",
        fontFamily: SANS,
        fontSize: 36,
        fontWeight: 800,
        color: C.white,
        backgroundColor: C.green,
      }}
    >
      Pedido enviado para a cozinha ✓
    </div>
  </div>
);

const Kitchen: React.FC<{ readonly t: number }> = ({ t }) => {
  const tickets = [
    { mesa: "MESA 07", dish: DISHES[0], status: t > 5 ? "PRONTO" : "PREPARANDO" },
    { mesa: "DELIVERY", dish: DISHES[3], status: "PREPARANDO" },
    { mesa: "MESA 12", dish: DISHES[1], status: "NA FILA" },
  ];
  const color = (s: string) => (s === "PRONTO" ? C.green : s === "PREPARANDO" ? "#F5A524" : C.muted);
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header title="Produção" tag="COZINHA" />
      <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "10px 40px" }}>
        {tickets.map((k) => (
          <div
            key={k.mesa}
            style={{
              display: "flex",
              gap: 24,
              padding: 22,
              borderRadius: 26,
              backgroundColor: "rgba(255,255,255,0.05)",
              border: `2px solid ${color(k.status)}55`,
            }}
          >
            <Photo file={k.dish.file} t={t} style={{ width: 200, height: 200, borderRadius: 20 }} />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
              <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.muted }}>{k.mesa}</div>
              <div style={{ fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.white }}>{k.dish.name}</div>
              <div
                style={{
                  alignSelf: "flex-start",
                  fontFamily: MONO,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: 2,
                  padding: "8px 16px",
                  borderRadius: 999,
                  color: C.deep,
                  backgroundColor: color(k.status),
                }}
              >
                {k.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BARS = [0.42, 0.55, 0.48, 0.66, 0.6, 0.82, 1];

const Dashboard: React.FC<{ readonly t: number }> = ({ t }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Header title="Painel do dia" tag="AO VIVO" />
    <div style={{ display: "flex", gap: 18, padding: "10px 40px 30px" }}>
      {["Salão", "Delivery", "Caixa"].map((k, i) => (
        <div
          key={k}
          style={{
            flex: 1,
            padding: "26px 24px",
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.05)",
            fontFamily: SANS,
          }}
        >
          <div style={{ fontSize: 26, color: C.muted }}>{k}</div>
          <div
            style={{
              marginTop: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: [C.glow, "#F5A524", C.green][i],
              width: `${interpolate(t, [0, 10], [10, [80, 60, 90][i]], { ...clamp, easing: EASE })}%`,
            }}
          />
        </div>
      ))}
    </div>
    <div
      style={{
        margin: "0 40px",
        height: 460,
        display: "flex",
        alignItems: "flex-end",
        gap: 20,
        padding: 30,
        borderRadius: 26,
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      {BARS.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h * 100}%`,
            borderRadius: "14px 14px 6px 6px",
            background: i === BARS.length - 1 ? `linear-gradient(180deg, ${C.glow}, ${C.blue})` : "rgba(51,119,255,0.4)",
            transformOrigin: "bottom",
            scale: `1 ${interpolate(t, [i, i + 8], [0, 1], { ...clamp, easing: EASE })}`,
          }}
        />
      ))}
    </div>
    <div style={{ display: "flex", gap: 18, padding: "30px 40px" }}>
      {DISHES.slice(0, 3).map((d) => (
        <Photo key={d.file} file={d.file} t={t} style={{ flex: 1, height: 180, borderRadius: 20 }} />
      ))}
    </div>
  </div>
);

export const RESTAURANT_SCREENS = [Menu, Detail, Order, Kitchen, Dashboard];
