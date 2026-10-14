// "A clínica fecha às 18h. O WhatsApp, não." — paid/organic Reels for clinic owners (odonto, estética, fisio).
// Cues are in seconds of video time = N[i].at + the word's time in public/narracao/clinica-24h/palavras.json.
// Music (public/music/clinica-24h.mp3) came with a near-silent hole at 18.5–22s, so it is re-edited in three clips
// (see MUSIC): the track's own night/morning/turn (0–18.3s), then its groove (from 22.5s) for the rest.
export const FPS = 30;
export const f = (seconds: number) => Math.round(seconds * FPS);

export const NARRACAO = "narracao/clinica-24h";
export const MUSICA = "music/clinica-24h.mp3";
export const DURATION = f(34.5);

export const N = [
  { file: "01-gancho.wav", at: 0.1 },
  { file: "02-noite.wav", at: 3.2 },
  { file: "03-manha.wav", at: 8.8 },
  { file: "04-virada.wav", at: 13.0 },
  { file: "05-ordem.wav", at: 15.5 },
  { file: "06-objecao.wav", at: 21.9 },
  { file: "07-cta.wav", at: 27.0 },
];

// Music clips: [video start, track start, track end, fade in, fade out]
export const MUSIC = [
  { from: 0, trackFrom: 0, trackTo: 18.3, fadeIn: 0, fadeOut: 0.7 },
  { from: 17.7, trackFrom: 22.5, trackTo: 29.7, fadeIn: 0.6, fadeOut: 0.7 },
  { from: 24.2, trackFrom: 23.0, trackTo: 33.2, fadeIn: 0.7, fadeOut: 0.6 },
];

export const T = {
  // 1 · hook
  lamp1: 0.5,
  lamp2: 0.72,
  lamp3: 0.94,
  seis: 1.24,
  phoneOn: 1.9,
  push: 2.15,
  // 2 · night
  noite: 3.15,
  m1: 3.26,
  m2: 4.45,
  m3: 5.74,
  m4: 6.3,
  m5: 6.87,
  m6: 7.3,
  m7: 7.69,
  semResposta: 7.69,
  // 3 · morning
  manha: 8.6,
  pacientes: 10.05,
  outroLugar: 11.34,
  // 4 · turn
  virada: 12.3,
  orb: 13.0,
  dorme: 14.78,
  drop: 15.45,
  // 5 · organized
  responde: 15.8,
  hora: 16.52,
  coloca: 17.07,
  agenda: 18.08,
  separa: 18.97,
  recepcao: 19.59,
  gente: 21.2,
  // 6 · objection
  objecao: 21.85,
  sistema: 22.47,
  avalia: 23.61,
  conecta: 24.3,
  naoUsa: 25.08,
  entrega: 25.82,
  junto: 26.35,
  // 7 · CTA
  cta: 26.85,
  ctaLogo: 30.85,
  ctaChama: 31.17,
  ctaWhats: 31.93,
};

export type Word = { w: string; at: number; accent?: boolean };

export const HOOK_WORDS: Word[] = [
  { w: "Sua", at: 0.1 },
  { w: "clínica", at: 0.39 },
  { w: "fecha", at: 0.83 },
  { w: "às", at: 1.14 },
  { w: "18h.", at: 1.24, accent: true },
  { w: "|", at: 1.24 },
  { w: "O", at: 1.88 },
  { w: "WhatsApp,", at: 1.98 },
  { w: "não.", at: 2.65, accent: true },
];

export const VIRADA_WORDS: Word[] = [
  { w: "Agora,", at: 13.07 },
  { w: "com", at: 13.61 },
  { w: "um", at: 13.82 },
  { w: "atendente", at: 13.95, accent: true },
  { w: "|", at: 13.95 },
  { w: "que", at: 14.65 },
  { w: "não", at: 14.78, accent: true },
  { w: "dorme.", at: 14.95, accent: true },
];

export const CTA_WORDS: Word[] = [
  { w: "Atendimento", at: 27.06 },
  { w: "24h", at: 27.87, accent: true },
  { w: "|", at: 27.87 },
  { w: "sob", at: 29.29 },
  { w: "medida", at: 29.65, accent: true },
  { w: "|", at: 29.65 },
  { w: "pra", at: 30.06 },
  { w: "sua", at: 30.24 },
  { w: "clínica.", at: 30.48, accent: true },
];

export const LABELS: { text: string; from: number; to: number; tone: "bad" | "good" }[] = [
  { text: "Ninguém pra responder.", from: 6.9, to: T.manha - 0.05, tone: "bad" },
  { text: "Paciente que foi embora.", from: T.pacientes - 0.1, to: T.virada, tone: "bad" },
  { text: "Responde na hora.", from: T.responde - 0.2, to: T.coloca - 0.05, tone: "good" },
  { text: "Marca na agenda.", from: T.coloca, to: T.separa - 0.05, tone: "good" },
  { text: "O resto vai pra recepção.", from: T.separa, to: T.objecao - 0.05, tone: "good" },
  { text: "Já tem sistema? A gente conecta.", from: T.sistema - 0.4, to: T.naoUsa - 0.05, tone: "good" },
  { text: "Não tem? Vai junto.", from: T.naoUsa, to: T.cta, tone: "good" },
];

// Clock at the top: minutes since 00:00 (values above 24h wrap to the next morning).
const CLOCK: [number, number][] = [
  [0, 17 * 60 + 59],
  [1.15, 17 * 60 + 59],
  [1.2, 18 * 60],
  [3.2, 18 * 60],
  [5.5, 21 * 60 + 40],
  [8.45, 27 * 60 + 12],
  [8.55, 32 * 60],
  [12.3, 32 * 60 + 4],
  [12.95, 18 * 60],
  [15.4, 18 * 60],
  [17.0, 19 * 60 + 42],
  [19.4, 23 * 60 + 18],
  [21.1, 27 * 60 + 35],
  [21.6, 32 * 60],
  [34.5, 32 * 60 + 6],
];

export const clockMinutes = (t: number) => {
  if (t <= CLOCK[0][0]) return CLOCK[0][1];
  for (let i = 1; i < CLOCK.length; i++) {
    const [t1, v1] = CLOCK[i];
    const [t0, v0] = CLOCK[i - 1];
    if (t <= t1) return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
  }
  return CLOCK[CLOCK.length - 1][1];
};

export const hhmm = (min: number) => {
  const m = Math.floor(min) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
