import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { ChevronWipe } from "../../shared/components/ChevronWipe";
import { CtaScene } from "../../shared/CtaScene";
import { C, SFX, clamp } from "../../shared/theme";
import { GuaranteesScene } from "./GuaranteesScene";
import { ObjectionScene } from "./ObjectionScene";
import { PROCESS_DURATION, ProcessScene } from "./ProcessScene";

const DURATIONS = {
  silent: { objection: 165, process: PROCESS_DURATION.silent.total, guarantees: 130 },
  narrated: { objection: 236, process: PROCESS_DURATION.narrated.total, guarantees: 190 },
} as const;

type Props = { readonly narrated?: boolean };

export const ComoTrabalhamos: React.FC<Props> = ({ narrated = false }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const d = narrated ? DURATIONS.narrated : DURATIONS.silent;

  return (
    <AbsoluteFill style={{ backgroundColor: C.deep }}>
      {/* With narration the music stays a low bed under the voice for the whole video. */}
      <Audio
        name="Música"
        src={staticFile("music/trilha-01.mp3")}
        trimBefore={20 * fps}
        volume={(f) =>
          narrated
            ? interpolate(
                f,
                [0, 10, durationInFrames - 1.5 * fps, durationInFrames - 1],
                [0, 0.09, 0.09, 0],
                clamp,
              )
            : interpolate(
                f,
                [0, 10, 140, 170, durationInFrames - 1.5 * fps, durationInFrames - 1],
                [0, 0.16, 0.16, 0.3, 0.3, 0],
                clamp,
              )
        }
        premountFor={fps}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 · Objeção" durationInFrames={d.objection} premountFor={fps}>
          <ObjectionScene narrated={narrated} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence name="2 · Processo" durationInFrames={d.process} premountFor={fps}>
          <ProcessScene narrated={narrated} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence name="3 · Garantias" durationInFrames={d.guarantees} premountFor={fps}>
          <GuaranteesScene narrated={narrated} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={26} premountFor={fps}>
          <ChevronWipe sound={SFX.softWhoosh} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="4 · CTA" durationInFrames={130} premountFor={fps}>
          <CtaScene
            headline={"Vamos desenhar\no seu projeto?"}
            impact
            narration={narrated ? "narracao/como-trabalhamos/07-cta.wav" : undefined}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
