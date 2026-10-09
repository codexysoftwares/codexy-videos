// "A mesma sexta, duas vezes" — paid/organic Reels for bar and restaurant owners.
// Cues are in seconds of video time. Narration word times come from public/narracao/mesma-sexta/palavras.json
// (each fala is placed at N[i].at, so a word's video time = N.at + its time in the file).
// Music (public/music/mesma-sexta.mp3): tense until ~13.5s (muted from the rewind), groove hits at 13.75s, resolves ~29s.
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/mesma-sexta";
export const MUSICA = "music/mesma-sexta.mp3";
export const DURATION = f(31);

export const N = [
  { file: "01-gancho.wav", at: 0.05 },
  { file: "02-caos.wav", at: 3.0 },
  { file: "03-rebobina.wav", at: 11.95 },
  { file: "04-ordem.wav", at: 14.0 },
  { file: "05-caixa.wav", at: 20.85 },
  { file: "06-cta.wav", at: 23.2 },
];

// Scene boundaries
export const T = {
  hookEnd: 3,
  caosReserva: 3.08,
  caosPedido: 5.04,
  caosPreco: 8.05,
  caosCaixa: 9.53,
  caosNaoBate: 11.06,
  rewind: 11.55,
  rewindEnd: 12.8,
  agora: 12.02,
  mesmaSexta: 13.03,
  drop: 13.75,
  ordemReserva: 13.75,
  botResponde: 14.55,
  sozinha: 15.33,
  ordemPedido: 16.13,
  cozinha: 17.54,
  ordemPreco: 18.2,
  umSo: 19.1,
  ordemCaixa: 20.85,
  batendo: 22.03,
  cta: 22.9,
  ctaBar: 24.96,
  ctaChama: 25.88,
  ctaWhats: 26.65,
  ctaDiagnostico: 28.01,
};

// Hook caption = the narration itself, word by word on its real timing.
export const HOOK_WORDS = [
  { w: "Todo", at: 0.05 },
  { w: "dono", at: 0.42 },
  { w: "de", at: 0.65 },
  { w: "restaurante", at: 0.75, accent: true },
  { w: "já", at: 1.33 },
  { w: "viveu", at: 1.47 },
  { w: "essa", at: 1.83 },
  { w: "sexta.", at: 2.04, accent: true },
];

export const AGORA_WORDS = [
  { w: "Agora,", at: 12.02 },
  { w: "a", at: 12.86 },
  { w: "mesma", at: 13.03, accent: true },
  { w: "sexta.", at: 13.51, accent: true },
];

export const CTA_WORDS = [
  { w: "Um", at: 23.2 },
  { w: "sistema", at: 23.4 },
  { w: "sob", at: 23.89 },
  { w: "medida", at: 24.19, accent: true },
  { w: "|", at: 24.19 }, // line break
  { w: "pro", at: 24.61 },
  { w: "seu", at: 24.78 },
  { w: "restaurante.", at: 24.96, accent: true },
];

// Short on-screen labels (the approved "texto na tela"), shown while each beat plays.
export const LABELS: { text: string; from: number; to: number; tone: "bad" | "good" }[] = [
  { text: "Reserva sem resposta.", from: T.caosReserva, to: T.caosPedido - 0.1, tone: "bad" },
  { text: "Pedido redigitado.", from: T.caosPedido, to: T.caosPreco - 0.1, tone: "bad" },
  { text: "3 preços pro mesmo prato.", from: T.caosPreco, to: T.caosCaixa - 0.1, tone: "bad" },
  { text: "E o caixa não bate.", from: T.caosCaixa + 0.2, to: T.rewind, tone: "bad" },
  { text: "Reserva confirmada sozinha.", from: T.ordemReserva + 0.35, to: T.ordemPedido - 0.1, tone: "good" },
  { text: "Pedido direto na cozinha.", from: T.ordemPedido, to: T.ordemPreco - 0.1, tone: "good" },
  { text: "Um preço só. Em todo lugar.", from: T.ordemPreco, to: T.ordemCaixa - 0.1, tone: "good" },
  { text: "E o caixa bate.", from: T.ordemCaixa + 0.1, to: T.cta, tone: "good" },
];

// The clock at the top tells the night: minutes since 00:00 as a function of the "story time".
// Chaos runs 21:47 → 02:14; the rewind spins it back to 18:00; the second night runs 18:00 → 02:14 again.
const CHAOS_CLOCK: [number, number][] = [
  [0, 21 * 60 + 47],
  [2.95, 21 * 60 + 52],
  [4.95, 22 * 60 + 31],
  [7.95, 23 * 60 + 18],
  [9.45, 23 * 60 + 40],
  [9.95, 26 * 60 + 14],
  [11.55, 26 * 60 + 14],
];
const ORDER_CLOCK: [number, number][] = [
  [13.75, 18 * 60 + 2],
  [16.0, 18 * 60 + 2],
  [16.3, 20 * 60 + 31],
  [18.1, 20 * 60 + 31],
  [18.4, 21 * 60 + 47],
  [20.7, 21 * 60 + 47],
  [21.0, 26 * 60 + 14],
  [31, 26 * 60 + 14],
];

const piecewise = (pts: [number, number][], t: number) => {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    const [t1, v1] = pts[i];
    const [t0, v0] = pts[i - 1];
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return pts[pts.length - 1][1];
};

export const chaosMinutes = (t: number) => piecewise(CHAOS_CLOCK, t);
export const orderMinutes = (t: number) => piecewise(ORDER_CLOCK, t);
export const hhmm = (min: number) => {
  const m = Math.floor(min) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
