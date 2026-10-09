// All cues in seconds of video time. Narration cuts live in public/narracao/vida-de-um-pedido
// (each has ~0.15s of lead silence); phrase times were measured from the pauses inside each cut.
// The music (public/music/vida-de-um-pedido.mp3) goes fully silent from ~18.5s to ~24s, under the problem beat.
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/vida-de-um-pedido";
export const MUSICA = "music/vida-de-um-pedido.mp3";
export const DURATION = f(58.5);

export const N = [
  { file: "01-pedido.wav", at: 0.6 },
  { file: "02-whatsapp.wav", at: 4.4 },
  { file: "03-planilha.wav", at: 7.9 },
  { file: "04-nota.wav", at: 10.2 },
  { file: "05-entregador.wav", at: 13.3 },
  { file: "06-quatro.wav", at: 16.5 },
  { file: "07-sob-medida.wav", at: 24.0 },
  { file: "08-encaixa.wav", at: 29.1 },
  { file: "09-uma-vez.wav", at: 36.4 },
  { file: "10-tempo-real.wav", at: 41.1 },
  { file: "11-comenta.wav", at: 45.8 },
  { file: "12-assinatura.wav", at: 53.4 },
];

// The order hops from station to station; each landing is one more "digitação".
export const HOPS = [
  { to: 0, at: 0.62 },
  { to: 1, at: 6.3 },
  { to: 2, at: 8.2 },
  { to: 3, at: 11.2 },
  { to: 4, at: 14.3 },
];
export const HOP_LEN = 0.55;

export const CUE = {
  reveal: 2.2,
  lost: 12.0,
  quatro: 16.64,
  chances: 18.68,
  ninguem: 20.62,
  agora: 24.14,
  fita: 24.8,
  fitaFim: 28.3,
  caixaCai: 29.4,
  caixaBate: 30.0,
  caixaSome: 30.7,
  trilhos: 32.2,
  trilhosFim: 35.0,
  umaVez: 36.6,
  corre: 38.8,
  naHora: 40.0,
  painel: 41.3,
  comenta: 45.96,
  comentaAqui: 49.0,
  chance: 50.78,
  logo: 53.0,
  codexy: 53.54,
  software: 54.62,
};

export const SUBS: { text: string; from: number; to: number; accent?: string }[] = [
  { text: "Esse é *um* *pedido.*", from: 0.62, to: 1.68 },
  { text: "Vamos acompanhar a vida dele.", from: 2.32, to: 3.74 },
  { text: "Ele chega pelo *WhatsApp...*", from: 4.56, to: 5.88 },
  { text: "e alguém anota *no* *papel.*", from: 6.08, to: 7.16 },
  { text: "Do papel, vai pra *planilha.*", from: 8.06, to: 9.56 },
  { text: "Da planilha, pro *sistema* *da* *nota* *fiscal.*", from: 10.36, to: 12.58 },
  { text: "E da nota, pro *caderno* *do* *entregador.*", from: 13.44, to: 15.54 },
  { text: "*Quatro* digitações.", from: 16.64, to: 18.08, accent: "#E5484D" },
  { text: "*Quatro* chances de erro.", from: 18.68, to: 19.96, accent: "#E5484D" },
  { text: "E ninguém sabe *onde* *o* *pedido* *está* agora.", from: 20.62, to: 22.68, accent: "#E5484D" },
  { text: "Agora, o mesmo pedido num sistema feito *sob* *medida* pra sua empresa.", from: 24.14, to: 28.32 },
  { text: "Não é a sua empresa que se adapta ao sistema.", from: 29.26, to: 31.68 },
  { text: "É o sistema que *se* *encaixa* no jeito que ela já funciona.", from: 32.18, to: 35.42 },
  { text: "O pedido é digitado *uma* *vez...*", from: 36.56, to: 38.3 },
  { text: "e chega em *todo* *mundo,* *na* *hora.*", from: 38.82, to: 40.34 },
  { text: "E você acompanha, *em* *tempo* *real,* onde cada pedido está.", from: 41.24, to: 44.82 },
];
