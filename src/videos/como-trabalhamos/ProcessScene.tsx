import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../../shared/components/Background";
import { C, EASE, EASE_IN_OUT, MONO, SANS, SFX, clamp } from "../../shared/theme";
import { DeliveryVisual, DiagnosticVisual, KanbanVisual, PrototypeVisual } from "./StepVisuals";

const EXIT = 12;
const NARRATION_AT = 8;

// Frame where each step begins exiting / the next begins. Narrated values fit each step's speech length.
const BOUNDS = {
  silent: { starts: [0, 105, 210, 315], total: 420 },
  narrated: { starts: [0, 134, 294, 461], total: 629 },
} as const;

export const PROCESS_DURATION = BOUNDS;

const STEPS = [
  {
    title: "Diagnóstico",
    text: "Entendemos seu processo antes de escrever uma linha de código.",
    Visual: DiagnosticVisual,
    narration: "02-diagnostico.wav",
  },
  {
    title: "Protótipo",
    text: "Você vê e aprova as telas antes do desenvolvimento.",
    Visual: PrototypeVisual,
    narration: "03-prototipo.wav",
  },
  {
    title: "Desenvolvimento",
    text: "Entregas semanais. Você acompanha cada avanço.",
    Visual: KanbanVisual,
    narration: "04-desenvolvimento.wav",
  },
  {
    title: "Entrega e suporte",
    text: "Treinamento, ajustes e suporte depois da entrega.",
    Visual: DeliveryVisual,
    narration: "05-entrega.wav",
  },
];

const Step: React.FC<{
  readonly index: number;
  readonly exitAt: number | null;
  readonly narrated: boolean;
}> = ({ index, exitAt, narrated }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, text, Visual, narration } = STEPS[index];
  const exit =
    exitAt === null
      ? 0
      : interpolate(frame, [exitAt, exitAt + EXIT], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, translate: `${-80 * exit}px 0px` }}>
      <Audio src={staticFile(SFX.softWhoosh)} volume={narrated ? 0.2 : 0.3} premountFor={fps} />
      {narrated ? (
        <Sequence from={NARRATION_AT} premountFor={fps}>
          <Audio src={staticFile(`narracao/como-trabalhamos/${narration}`)} />
        </Sequence>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 80,
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: 4,
          color: C.glow,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        ETAPA {String(index + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          position: "absolute",
          top: 320,
          left: 80,
          right: 80,
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: -3.5,
          whiteSpace: "nowrap",
          lineHeight: 1.05,
          opacity: interpolate(frame, [2, 12], [0, 1], clamp),
          translate: `${interpolate(frame, [2, 22], [80, 0], { ...clamp, easing: EASE })}px 0px`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          top: 452,
          left: 80,
          right: 80,
          fontSize: 44,
          fontWeight: 500,
          lineHeight: 1.3,
          color: C.muted,
          opacity: interpolate(frame, [8, 18], [0, 1], clamp),
          translate: `${interpolate(frame, [8, 28], [60, 0], { ...clamp, easing: EASE })}px 0px`,
        }}
      >
        {text}
      </div>
      <Sequence
        from={6}
        layout="none"
      >
        <div
          style={{
            position: "absolute",
            top: 640,
            left: 80,
            width: 920,
            height: 760,
            opacity: interpolate(frame, [6, 18], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [6, 30], [70, 0], { ...clamp, easing: EASE })}px`,
          }}
        >
          <Visual narrated={narrated} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

export const ProcessScene: React.FC<{ readonly narrated?: boolean }> = ({ narrated = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { starts, total } = narrated ? BOUNDS.narrated : BOUNDS.silent;
  const boundary = (i: number) => (i < starts.length ? starts[i] : total);

  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: C.white }}>
      <Background tone="dark" />
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 80,
          right: 80,
          display: "flex",
          gap: 16,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.12)", overflow: "hidden" }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: C.glow,
                boxShadow: `0 0 16px ${C.glow}`,
                transformOrigin: "left center",
                scale: `${interpolate(frame, [boundary(i), boundary(i + 1) - 10], [0, 1], clamp)} 1`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Each step starts only after the previous one has fully exited, so titles never overlap. */}
      {STEPS.map((s, i) => {
        const start = boundary(i) + (i > 0 ? EXIT : 0);
        const last = i === STEPS.length - 1;
        const length = boundary(i + 1) + EXIT - start;
        return (
          <Sequence
            key={s.title}
            name={s.title}
            from={start}
            durationInFrames={last ? undefined : length}
            premountFor={fps}
          >
            <Step index={i} exitAt={last ? null : length - EXIT} narrated={narrated} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
