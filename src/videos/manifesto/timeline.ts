// All cues in seconds of video time. Narration starts come from the cut files in
// public/narracao/manifesto (each has ~0.15s of lead silence); beats come from public/music/manifesto.mp3.
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/manifesto";
export const MUSICA = "music/manifesto.mp3";

export const DURATION = f(28.5);

export const N = {
  jeitoUnico: 0.8,
  molde: 3.4,
  contrario: 7.25,
  entende: 9.3,
  constroi: 11.7,
  // "Sistemas. Sites. Chatbots." is split into three clips so each word lands on a beat.
  sistemas: { at: 15.86, from: 0, to: 0.95 },
  sites: { at: 17.1, from: 1.02, to: 1.95 },
  chatbots: { at: 17.85, from: 1.95, to: 3.08 },
  seuJeito: 19.5,
  assinatura: 21.86,
};

export const BEAT = {
  contrario: 8.05,
  proofCuts: [13.57, 13.94, 14.31, 14.69, 15.31],
  sistemas: 16.0,
  sites: 17.25,
  chatbots: 18.0,
  logo: 22.0,
  final: 24.0,
};

export const SCENE = {
  rede: { from: 0, to: 6.9 },
  contrario: { from: 6.9, to: 9.0 },
  entende: { from: 8.8, to: 11.75 },
  constroi: { from: 11.6, to: 13.65 },
  prova: { from: 13.55, to: 15.9 },
  servicos: { from: 15.85, to: 19.35 },
  seuJeito: { from: 19.3, to: 21.3 },
  logo: { from: 21.0, to: 28.5 },
};
