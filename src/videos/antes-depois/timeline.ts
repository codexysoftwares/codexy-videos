// Cues in seconds of video time. Narration word times come from public/narracao/antes-depois/palavras.json;
// lines are placed so each "antes → depois" swap lands on a beat of public/music/manifesto.mp3
// (impact at 8.05s, drop at ~16s, strong hits at 18s and 22s).
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/antes-depois";
export const MUSICA = "music/manifesto.mp3";
export const DURATION = f(30);

export const N = [
  { file: "01-mesma-empresa.wav", at: 0.4 },
  { file: "02-agenda.wav", at: 5.78 },
  { file: "03-mensagens.wav", at: 10.1 },
  { file: "04-planilha.wav", at: 14.8 },
  { file: "05-caixa.wav", at: 17.15 },
  { file: "06-nao-e-magica.wav", at: 20.3 },
  { file: "07-assinatura.wav", at: 25.6 },
];

export const AREAS = [
  { id: "agenda", label: "AGENDA", start: 5.6, swap: 5.78 + 2.27, end: 10.0 },
  { id: "mensagens", label: "ATENDIMENTO", start: 10.0, swap: 10.1 + 2.71, end: 14.7 },
  { id: "planilha", label: "VENDAS", start: 14.7, swap: 14.8 + 1.2, end: 17.05 },
  { id: "caixa", label: "FINANCEIRO", start: 17.05, swap: 17.15 + 0.85, end: 20.2 },
] as const;

export const CUE = {
  mesma: 0.4,
  time: 0.4 + 1.36,
  so: 0.4 + 2.62,
  sistema: 0.4 + 3.35,
  intoAreas: 5.6,
  magica: 20.3 + 0.09,
  umSistema: 20.3 + 1.7,
  logo: 25.6 + 0.08,
  software: 25.6 + 1.39,
};

export const SUBS: { text: string; from: number; to: number; accent?: string }[] = [
  { text: "Mesma empresa. Mesmo time. Só mudou *o* *sistema.*", from: 0.4, to: 4.5 },
  { text: "A agenda saiu do caderno... e passou a *se* *organizar* *sozinha.*", from: 5.93, to: 10.0 },
  { text: "As mensagens pararam de acumular. O chatbot *responde* *na* *hora.*", from: 10.23, to: 14.65 },
  { text: "A planilha virou *um* *painel.* *Ao* *vivo.*", from: 14.95, to: 17.0 },
  { text: "E o caixa fecha *sozinho,* *no* *fim* *do* *dia.*", from: 17.23, to: 20.1 },
  { text: "Não é mágica. É um sistema feito pro jeito que *a* *sua* *empresa* *funciona.*", from: 20.39, to: 25.3 },
];
