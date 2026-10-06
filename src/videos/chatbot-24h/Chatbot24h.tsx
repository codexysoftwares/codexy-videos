import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { ChevronWipe } from "../../shared/components/ChevronWipe";
import { CtaScene } from "../../shared/CtaScene";
import { C, SFX, clamp } from "../../shared/theme";
import { ClosingScene } from "./ClosingScene";
import { PayoffScene } from "./PayoffScene";
import { TimelineScene } from "./TimelineScene";

export const Chatbot24h: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.deep }}>
      {/* Music sits lower under the quiet opening and lifts when the clock starts running. */}
      <Audio
        name="Música"
        src={staticFile("music/trilha-01.mp3")}
        trimBefore={5 * fps}
        volume={(f) =>
          interpolate(
            f,
            [0, 10, 120, 150, durationInFrames - 1.5 * fps, durationInFrames - 1],
            [0, 0.16, 0.16, 0.3, 0.3, 0],
            clamp,
          )
        }
        premountFor={fps}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 · Expediente" durationInFrames={150} premountFor={fps}>
          <ClosingScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence name="2 · 24 horas" durationInFrames={420} premountFor={fps}>
          <TimelineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence name="3 · Fechamento" durationInFrames={150} premountFor={fps}>
          <PayoffScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={26} premountFor={fps}>
          <ChevronWipe sound={SFX.softWhoosh} />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="4 · CTA" durationInFrames={130} premountFor={fps}>
          <CtaScene
            tagline="CHATBOTS COM IA · SOB MEDIDA"
            headline={"Atendimento que não\nfecha às 18h."}
            impact
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
