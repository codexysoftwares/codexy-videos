import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../../shared/components/Caption";
import { C, EASE, MONO, SANS, clamp } from "../../shared/theme";
import { CUE, PHASE, f } from "./timeline";

const fade = (frame: number, p: { from: number; to: number }) =>
  interpolate(frame, [f(p.from), f(p.from) + 10, f(p.to) - 10, f(p.to)], [0, 1, 1, 0], clamp);

// Heading over the receipt while it turns into the total.
export const TotalMoment: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fade(frame, PHASE.total) }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(0,85,255,0.35), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 34,
          letterSpacing: 8,
          color: C.glow,
          opacity: interpolate(frame, [f(CUE.exemplo), f(CUE.exemplo) + 8], [0, 1], clamp),
        }}
      >
        SÓ NESSE EXEMPLO
      </div>
    </AbsoluteFill>
  );
};

// "A planilha nunca foi de graça": the R$ 0,00 tag returns and gets crossed out.
export const ViradaMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const slash = interpolate(frame, [f(CUE.risco), f(CUE.risco) + 8], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ opacity: fade(frame, PHASE.virada), backgroundColor: "#010309" }}>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 560,
          width: 600,
          height: 240,
          borderRadius: "26px 120px 120px 26px",
          backgroundColor: "#FFD54A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SANS,
          fontSize: 130,
          fontWeight: 800,
          color: C.deep,
          rotate: "-6deg",
          opacity: interpolate(frame, [f(CUE.virada), f(CUE.virada) + 6], [0, 1], clamp) * interpolate(slash, [0, 1], [1, 0.45]),
          scale: interpolate(frame, [f(CUE.virada), f(CUE.virada) + 12], [0.8, 1], { ...clamp, easing: EASE }),
        }}
      >
        R$ 0,00
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 668,
          width: 680,
          height: 22,
          borderRadius: 11,
          backgroundColor: C.red,
          rotate: "-14deg",
          transformOrigin: "left center",
          scale: `${slash} 1`,
          boxShadow: "0 0 30px rgba(255,59,92,0.8)",
        }}
      />
      <Caption text="A planilha nunca foi *de* *graça.*" at={f(CUE.virada)} speechFrames={f(1.5)} size={72} top={1000} center />
      <Caption
        text="Você só não estava vendo *a* *conta.*"
        at={f(CUE.vendoConta)}
        speechFrames={f(1.6)}
        size={72}
        top={1180}
        center
        accent="#FFD54A"
      />
    </AbsoluteFill>
  );
};

const CommentIcon = () => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2} strokeLinejoin="round">
    <path d="M4 5h16v11H9l-5 4z" />
  </svg>
);

// "Faz a conta da sua empresa e comenta... chama a Codexy."
export const CtaMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const card = interpolate(frame, [f(CUE.assustar) - 4, f(CUE.assustar) + 6], [1, 0], clamp);
  const logo = f(CUE.codexy);

  return (
    <AbsoluteFill style={{ opacity: fade(frame, PHASE.cta), fontFamily: SANS, color: C.white }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${C.navy}, #010309 75%)` }} />

      <div style={{ opacity: card }}>
        <Caption text="Faz a conta da *sua* *empresa:*" at={f(CUE.faca)} speechFrames={f(1.2)} size={74} top={300} center />
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 100,
            right: 100,
            padding: "40px 44px",
            borderRadius: 32,
            backgroundColor: "rgba(255,255,255,0.05)",
            border: `2px solid ${C.glow}55`,
            fontFamily: MONO,
            fontSize: 34,
            lineHeight: 1.7,
            color: C.ice,
            opacity: interpolate(frame, [f(CUE.faca) + 10, f(CUE.faca) + 20], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [f(CUE.faca) + 10, f(CUE.faca) + 26], [40, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          <div>horas/mês na planilha × R$/hora</div>
          <div>+ pedidos perdidos × ticket médio</div>
          <div style={{ borderTop: `3px solid ${C.glow}`, marginTop: 14, paddingTop: 10, fontSize: 64, fontWeight: 600, color: "#FFD54A" }}>
            = R$ ?
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 1010,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "24px 40px",
              borderRadius: 999,
              background: `linear-gradient(135deg, ${C.glow}, ${C.blue})`,
              fontSize: 44,
              fontWeight: 800,
              boxShadow: "0 20px 60px rgba(0,85,255,0.5)",
              opacity: interpolate(frame, [f(CUE.comenta), f(CUE.comenta) + 6], [0, 1], clamp),
              scale: interpolate(frame, [f(CUE.comenta), f(CUE.comenta) + 12], [0.7, 1], { ...clamp, easing: EASE }),
            }}
          >
            <CommentIcon />
            Comenta o seu resultado
          </div>
        </div>
      </div>

      <Caption
        text="Se o número *assustar...*"
        at={f(CUE.assustar)}
        speechFrames={f(1.1)}
        size={80}
        top={620}
        center
        outAt={logo - 6}
        accent="#FFD54A"
      />

      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          opacity: interpolate(frame, [logo, logo + 4], [0, 1], clamp),
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 700, color: C.ice }}>chama a</div>
        <Img
          src={staticFile("brand/codexy-logo-light.png")}
          style={{
            width: 820,
            filter: "drop-shadow(0 0 40px rgba(51,119,255,0.6))",
            scale: interpolate(frame, [logo, logo + 12], [1.35, 1], { ...clamp, easing: EASE, output: "perceptual-scale" }),
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 36,
            letterSpacing: 2,
            color: C.ice,
            opacity: interpolate(frame, [logo + 14, logo + 24], [0, 1], clamp),
          }}
        >
          codexy.com.br · @codexy.ai
        </div>
      </div>
    </AbsoluteFill>
  );
};
