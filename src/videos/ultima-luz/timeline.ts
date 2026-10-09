// Cues in seconds of video time. Narration cuts and word times come from public/narracao/ultima-luz
// (cut by text alignment; palavras.json has each word's time inside its cut).
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/ultima-luz";
export const MUSICA = "music/ultima-luz.mp3";
// Start the score at its fuller part so the short cut doesn't sit in the slow intro.
export const MUSIC_TRIM = 9;
export const DURATION = f(40);

export const N = [
  { file: "01-lucia.wav", at: 0.4 },
  { file: "02-ultima-luz.wav", at: 3.5 },
  { file: "03-rotina.wav", at: 7.9 },
  { file: "04-tempo.wav", at: 12.8 },
  { file: "05-virada.wav", at: 16.3 },
  { file: "06-sistema.wav", at: 20.1 },
  { file: "07-seis-da-tarde.wav", at: 27.0 },
  { file: "08-acende-outra.wav", at: 32.0 },
  { file: "09-assinatura.wav", at: 33.5 },
];

// Word-level cues: narration start + word time from palavras.json.
export const CUE = {
  ultima: 3.5 + 1.35,
  dela: 3.5 + 3.73,
  papel: 7.9 + 0.13,
  whatsapp: 7.9 + 1.58,
  planilha: 7.9 + 3.02,
  tarde: 7.9 + 4.16,
  cresceu: 12.8 + 0.78,
  nao: 12.8 + 2.28,
  silencio: 15.4,
  codexy: 16.3 + 0.6,
  construiu: 16.3 + 1.15,
  agenda: 20.1 + 0.13,
  pacientes: 20.1 + 1.82,
  caixa: 20.1 + 4.56,
  hoje: 27.0 + 0.15,
  seis: 27.0 + 0.91,
  apaga: 27.0 + 3.35,
  outra: 32.0 + 0.74,
  logo: 33.5 + 0.08,
  software: 33.5 + 1.25,
  casa: 33.5 + 3.48,
};

export const SUBS: { text: string; from: number; to: number; accent?: string }[] = [
  { text: "Essa é a *Lúcia.* Dona de uma clínica.", from: 0.4, to: 3.1 },
  { text: "Todo dia, a *última* *luz* *acesa* da rua... é a dela.", from: 3.63, to: 7.5 },
  { text: "Agenda no papel. WhatsApp um por um. Planilha *até* *tarde.*", from: 8.03, to: 12.6 },
  { text: "A clínica cresceu. *O* *tempo* *dela,* *não.*", from: 12.93, to: 15.4 },
  { text: "Até que a *Codexy* construiu um sistema do jeito que ela trabalha.", from: 16.45, to: 19.9, accent: "#7FB0FF" },
  { text: "Agenda organizada. Pacientes *confirmando* *sozinhos.*", from: 20.23, to: 23.9, accent: "#7FB0FF" },
  { text: "Caixa fechado *no* *fim* *do* *dia.*", from: 24.66, to: 26.8, accent: "#7FB0FF" },
  { text: "Hoje, às *seis* *da* *tarde,* a luz da clínica apaga com as outras.", from: 27.15, to: 31.6 },
  { text: "E *acende* *outra.*", from: 32.15, to: 33.3 },
];
