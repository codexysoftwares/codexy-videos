import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from "remotion";
import { ChevronWipe } from "../../shared/components/ChevronWipe";
import { ChatbotScene } from "./ChatbotScene";
import { CtaScene } from "../../shared/CtaScene";
import { HookScene } from "./HookScene";
import { PainScene } from "./PainScene";
import { ResultScene } from "./ResultScene";
import { SitesScene } from "./SitesScene";
import { SystemsScene } from "./SystemsScene";
import { TurnScene } from "./TurnScene";
import { C } from "../../shared/theme";

export const DorSolucao: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.deep }}>
      {/* Trimming 1.5s lands the track's section change on the "sozinho?" highlight at 8.0s. */}
      <Audio
        name="Música"
        src={staticFile("music/trilha-01.mp3")}
        trimBefore={1.5 * fps}
        volume={(f) =>
          interpolate(
            f,
            [0, 8, durationInFrames - 1.5 * fps, durationInFrames - 1],
            [0, 0.32, 0.32, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
        premountFor={fps}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 · Caos" durationInFrames={105} premountFor={fps}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={26} premountFor={fps}>
          <ChevronWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="2 · Dor" durationInFrames={120} premountFor={fps}>
          <PainScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={26} premountFor={fps}>
          <ChevronWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="3 · Virada" durationInFrames={75} premountFor={fps}>
          <TurnScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="4 · Sistemas" durationInFrames={100} premountFor={fps}>
          <SystemsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="5 · Sites" durationInFrames={100} premountFor={fps}>
          <SitesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="6 · Chatbots" durationInFrames={110} premountFor={fps}>
          <ChatbotScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence name="7 · Resultado" durationInFrames={90} premountFor={fps}>
          <ResultScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Overlay durationInFrames={26} premountFor={fps}>
          <ChevronWipe />
        </TransitionSeries.Overlay>
        <TransitionSeries.Sequence name="8 · CTA" durationInFrames={130} premountFor={fps}>
          <CtaScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
