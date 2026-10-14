import { Composition, Folder } from "remotion";
import { CtaScene } from "./shared/CtaScene";
import { DURATION as FERIAS_DURATION, Ferias47 } from "./videos/ferias-47/Ferias47";
import { FeriasGancho, GANCHO_DURATION } from "./videos/ferias-47/Gancho";
import { CINCO_SINAIS_SLIDES, CincoSinais } from "./estaticos/CincoSinais";
import { COMO_NASCE_SLIDES, ComoNasce } from "./estaticos/ComoNasce";
import { PostDelivery } from "./estaticos/PostDelivery";
import { NAO_CONTRATE_SLIDES, NaoContrate } from "./estaticos/NaoContrate";
import { OFICINA_SLIDES, OficinaConceito } from "./estaticos/OficinaConceito";
import { QUANTO_CUSTA_SLIDES, QuantoCusta } from "./estaticos/QuantoCusta";
import { DURATION as PLANILHA_DURATION, PlanilhaDia30 } from "./videos/planilha-dia-30/PlanilhaDia30";
import { RAIO_X_PIZZARIA_SLIDES, RaioXPizzaria } from "./estaticos/RaioXPizzaria";
import { RAIO_X_SALAO_SLIDES, RaioXSalao } from "./estaticos/raiox/RaioXSalao";
import { MENSAGEM_2152_SLIDES, Mensagem2152 } from "./estaticos/Mensagem2152";
import { PrintClinica } from "./estaticos/PrintClinica";
import { Clinica24h } from "./videos/clinica-24h/Clinica24h";
import { OlhosDoPaciente } from "./videos/olhos-do-paciente/OlhosDoPaciente";
import { DURATION as OLHOS_DURATION } from "./videos/olhos-do-paciente/timeline";
import { PacientePerdido } from "./videos/paciente-perdido/PacientePerdido";
import { DURATION as PACIENTE_DURATION } from "./videos/paciente-perdido/timeline";
import { DURATION as CLINICA_DURATION } from "./videos/clinica-24h/timeline";
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
      {/* Static posts: 1 frame = 1 slide, 1080×1350. Render with npm run estatico -- <id> */}
      <Folder name="estaticos">
        <Composition id="carrossel-mensagem-2152" component={Mensagem2152} durationInFrames={MENSAGEM_2152_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="post-print-clinica" component={PrintClinica} durationInFrames={1} fps={1} width={1080} height={1350} />
        <Composition id="post-delivery-comissao" component={PostDelivery} durationInFrames={1} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-como-nasce" component={ComoNasce} durationInFrames={COMO_NASCE_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-raio-x-pizzaria" component={RaioXPizzaria} durationInFrames={RAIO_X_PIZZARIA_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-quanto-custa" component={QuantoCusta} durationInFrames={QUANTO_CUSTA_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-oficina-conceito" component={OficinaConceito} durationInFrames={OFICINA_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-nao-contrate" component={NaoContrate} durationInFrames={NAO_CONTRATE_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-raio-x-salao" component={RaioXSalao} durationInFrames={RAIO_X_SALAO_SLIDES} fps={1} width={1080} height={1350} />
        <Composition id="carrossel-cinco-sinais" component={CincoSinais} durationInFrames={CINCO_SINAIS_SLIDES} fps={1} width={1080} height={1350} />
      </Folder>

      <Folder name="ferias-47">
        <Composition id="ferias-47" component={Ferias47} durationInFrames={FERIAS_DURATION} fps={60} width={1080} height={1920} />
        <Composition id="ferias-47-gancho" component={FeriasGancho} durationInFrames={GANCHO_DURATION} fps={60} width={1080} height={1920} />
      </Folder>

      <Folder name="planilha-dia-30">
        <Composition id="planilha-dia-30" component={PlanilhaDia30} durationInFrames={PLANILHA_DURATION} fps={60} width={1080} height={1920} />
      </Folder>

      <Folder name="olhos-do-paciente">
        <Composition id="olhos-do-paciente" component={OlhosDoPaciente} durationInFrames={OLHOS_DURATION} fps={60} width={1080} height={1920} />
      </Folder>

      <Folder name="paciente-perdido">
        <Composition id="paciente-perdido" component={PacientePerdido} durationInFrames={PACIENTE_DURATION} fps={60} width={1080} height={1920} />
      </Folder>

      <Folder name="clinica-24h">
        <Composition id="clinica-24h" component={Clinica24h} durationInFrames={CLINICA_DURATION} fps={30} width={1080} height={1920} />
      </Folder>

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
