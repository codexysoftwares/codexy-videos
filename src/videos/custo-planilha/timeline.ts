// All cues in seconds of video time. Narration cuts live in public/narracao/custo-planilha
// (each has ~0.15s of lead silence); phrase times below were measured from the pauses in each cut.
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/custo-planilha";
export const MUSICA = "music/custo-planilha.mp3";
// The opening question plays in silence; the music enters on "Vamos fazer as contas".
export const MUSIC_AT = 2.6;

export const DURATION = f(58.5);

export const N = [
  { file: "01-gancho.wav", at: 0.3 },
  { file: "02-tempo.wav", at: 4.3 },
  { file: "03-pessoa.wav", at: 16.1 },
  { file: "04-pedido.wav", at: 24.5 },
  { file: "05-lucro.wav", at: 32.7 },
  { file: "06-total.wav", at: 38.3 },
  { file: "07-virada.wav", at: 45.0 },
  { file: "08-cta.wav", at: 49.8 },
];

export const CUE = {
  tear: 2.75,
  umaHora: 5.4,
  vinteDuas: 9.2,
  vinteCinco: 11.6,
  linhaTempo: 13.52,
  pessoa: 16.26,
  sistema: 19.34,
  ferias: 21.34,
  trava: 22.82,
  linhaPessoa: 23.0,
  pedido: 24.66,
  papelVoa: 26.2,
  ticket: 27.98,
  linhaPedido: 30.16,
  lucro: 32.84,
  calendario: 33.9,
  luz: 35.6,
  linhaLucro: 36.1,
  riser: 37.2,
  exemplo: 38.44,
  mes: 39.72,
  ano: 42.3,
  virada: 45.16,
  risco: 46.3,
  vendoConta: 47.26,
  faca: 49.94,
  comenta: 51.62,
  assustar: 53.48,
  codexy: 55.04,
};

export const PHASE = {
  vinhetas: { from: 0, to: 38.4 },
  total: { from: 38.1, to: 44.9 },
  virada: { from: 44.7, to: 49.6 },
  cta: { from: 49.5, to: 58.5 },
};

export const SUBS: { text: string; from: number; to: number; accent?: string }[] = [
  { text: "Sua planilha é *de* *graça?*", from: 0.32, to: 2.0 },
  { text: "Vamos fazer as *contas.*", from: 2.74, to: 4.04 },
  { text: "Alguém da sua equipe gasta *uma* *hora* *por* *dia* arrumando planilha.", from: 4.44, to: 7.84 },
  { text: "São *22* *horas* por mês.", from: 8.56, to: 10.74 },
  { text: "A *R$* *25* a hora...", from: 11.2, to: 13.06 },
  { text: "*R$* *550.*", from: 13.52, to: 15.44 },
  { text: "E quando só *uma* *pessoa* sabe mexer nela...", from: 16.26, to: 18.78 },
  { text: "ela vira o *seu* *sistema.*", from: 19.34, to: 20.62 },
  { text: "Se ela sai de férias, a empresa *trava.*", from: 21.34, to: 23.84, accent: "#FF3B5C" },
  { text: "Um pedido anotado no papel *que* *se* *perde* por semana.", from: 24.66, to: 27.4 },
  { text: "Um ticket de *R$* *80...*", from: 27.98, to: 29.58 },
  { text: "mais *R$* *320* por mês.", from: 30.16, to: 32.04 },
  { text: "E o lucro? Você só descobre *no* *fim* *do* *mês,*", from: 32.84, to: 35.66 },
  { text: "quando já não dá pra *corrigir.*", from: 36.06, to: 37.36, accent: "#FF3B5C" },
];
