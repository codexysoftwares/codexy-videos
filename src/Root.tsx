import { Composition, Folder } from "remotion";
import { CtaScene } from "./shared/CtaScene";
import { MesmaSexta } from "./videos/mesma-sexta/MesmaSexta";
import { DURATION as SEXTA_DURATION } from "./videos/mesma-sexta/timeline";
import { Chatbot24h } from "./videos/chatbot-24h/Chatbot24h";
import { ClosingScene } from "./videos/chatbot-24h/ClosingScene";
import { PayoffScene } from "./videos/chatbot-24h/PayoffScene";
import { TimelineScene } from "./videos/chatbot-24h/TimelineScene";
import { ComoTrabalhamos } from "./videos/como-trabalhamos/ComoTrabalhamos";
import { GuaranteesScene } from "./videos/como-trabalhamos/GuaranteesScene";
import { ObjectionScene } from "./videos/como-trabalhamos/ObjectionScene";
import { ProcessScene } from "./videos/como-trabalhamos/ProcessScene";
import { AntesDepois } from "./videos/antes-depois/AntesDepois";
import { DURATION as AD_DURATION } from "./videos/antes-depois/timeline";
import { CustoPlanilha } from "./videos/custo-planilha/CustoPlanilha";
import { DURATION as LUZ_DURATION } from "./videos/ultima-luz/timeline";
import { UltimaLuz } from "./videos/ultima-luz/UltimaLuz";
import { DURATION as VIDA_DURATION } from "./videos/vida-de-um-pedido/timeline";
import { VidaDeUmPedido } from "./videos/vida-de-um-pedido/VidaDeUmPedido";
import { DURATION as CUSTO_DURATION } from "./videos/custo-planilha/timeline";
import { ChatbotScene } from "./videos/dor-solucao/ChatbotScene";
import { Manifesto } from "./videos/manifesto/Manifesto";
import { DURATION } from "./videos/manifesto/timeline";
import { DorSolucao } from "./videos/dor-solucao/DorSolucao";
import { HookScene } from "./videos/dor-solucao/HookScene";
import { PainScene } from "./videos/dor-solucao/PainScene";
import { ResultScene } from "./videos/dor-solucao/ResultScene";
import { SitesScene } from "./videos/dor-solucao/SitesScene";
import { SystemsScene } from "./videos/dor-solucao/SystemsScene";
import { TurnScene } from "./videos/dor-solucao/TurnScene";

// Composition ids match the folder names in src/videos, public/narracao and out.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="mesma-sexta">
        <Composition id="mesma-sexta" component={MesmaSexta} durationInFrames={SEXTA_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="antes-depois">
        <Composition id="antes-depois" component={AntesDepois} durationInFrames={AD_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="ultima-luz">
        <Composition id="ultima-luz" component={UltimaLuz} durationInFrames={LUZ_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="vida-de-um-pedido">
        <Composition id="vida-de-um-pedido" component={VidaDeUmPedido} durationInFrames={VIDA_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="custo-planilha">
        <Composition id="custo-planilha" component={CustoPlanilha} durationInFrames={CUSTO_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="manifesto">
        <Composition id="manifesto" component={Manifesto} durationInFrames={DURATION} fps={30} width={1080} height={1920} />
      </Folder>

      <Folder name="dor-solucao">
        <Composition id="dor-solucao" component={DorSolucao} durationInFrames={770} fps={30} width={1080} height={1920} />
        <Folder name="dor-solucao-cenas">
          <Composition id="dor-solucao-1-caos" component={HookScene} durationInFrames={105} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-2-dor" component={PainScene} durationInFrames={120} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-3-virada" component={TurnScene} durationInFrames={75} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-4-sistemas" component={SystemsScene} durationInFrames={100} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-5-sites" component={SitesScene} durationInFrames={100} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-6-chatbots" component={ChatbotScene} durationInFrames={110} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-7-resultado" component={ResultScene} durationInFrames={90} fps={30} width={1080} height={1920} />
          <Composition id="dor-solucao-8-cta" component={CtaScene} durationInFrames={130} fps={30} width={1080} height={1920} />
        </Folder>
      </Folder>

      <Folder name="chatbot-24h">
        <Composition id="chatbot-24h" component={Chatbot24h} durationInFrames={810} fps={30} width={1080} height={1920} />
        <Folder name="chatbot-24h-cenas">
          <Composition id="chatbot-24h-1-expediente" component={ClosingScene} durationInFrames={150} fps={30} width={1080} height={1920} />
          <Composition id="chatbot-24h-2-timeline" component={TimelineScene} durationInFrames={420} fps={30} width={1080} height={1920} />
          <Composition id="chatbot-24h-3-fechamento" component={PayoffScene} durationInFrames={150} fps={30} width={1080} height={1920} />
          <Composition
            id="chatbot-24h-4-cta"
            component={CtaScene}
            durationInFrames={130}
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
              tagline: "CHATBOTS COM IA · SOB MEDIDA",
              headline: "Atendimento que não\nfecha às 18h.",
              impact: true,
            }}
          />
        </Folder>
      </Folder>

      <Folder name="como-trabalhamos">
        <Composition id="como-trabalhamos" component={ComoTrabalhamos} durationInFrames={805} fps={30} width={1080} height={1920} />
        <Composition
          id="como-trabalhamos-narrado"
          component={ComoTrabalhamos}
          durationInFrames={1145}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ narrated: true }}
        />
        <Folder name="como-trabalhamos-cenas">
          <Composition id="como-trabalhamos-1-objecao" component={ObjectionScene} durationInFrames={165} fps={30} width={1080} height={1920} />
          <Composition id="como-trabalhamos-2-processo" component={ProcessScene} durationInFrames={420} fps={30} width={1080} height={1920} />
          <Composition id="como-trabalhamos-3-garantias" component={GuaranteesScene} durationInFrames={130} fps={30} width={1080} height={1920} />
        </Folder>
      </Folder>
    </>
  );
};
