// "Esse paciente quase foi seu." — paid/organic Reels for clinic owners, told from the PATIENT's point of view.
// 60 fps. Cues in seconds of video time = N[i].at + word time in public/narracao/paciente-perdido/palavras.json.
// Footage: public/broll/paciente-perdido/ (Mixkit free license, via `npm run broll`). Music: re-edit of music/clinica-24h.mp3.
import type { KWord } from "../../shared/kit/Kinetic";

export const FPS = 60;
export const f = (s: number) => Math.round(s * FPS);
export const DURATION = f(24.5);

export const NARRACAO = "narracao/paciente-perdido";
export const N = [
  { file: "01-gancho.wav", at: 0.05 },
  { file: "02-mensagem.wav", at: 1.85 },
  { file: "03-concorrente.wav", at: 5.25 },
  { file: "04-agora.wav", at: 8.55 },
  { file: "05-resposta.wav", at: 10.6 },
  { file: "06-sistema.wav", at: 16.7 },
  { file: "07-cta.wav", at: 20.1 },
];

export const MUSICA = "music/clinica-24h.mp3";
// [video start, track start, track end, fade in, fade out]
export const MUSIC = [
  { from: 0, trackFrom: 3.0, trackTo: 11.5, fadeIn: 0.05, fadeOut: 0.35 },
  { from: 10.55, trackFrom: 22.5, trackTo: 31.0, fadeIn: 0.15, fadeOut: 0.5 },
  { from: 18.6, trackFrom: 26.9, trackTo: 32.9, fadeIn: 0.5, fadeOut: 0.4 },
];

// Real footage slots (null = not downloaded yet → graded placeholder).
export const BROLL: { hook: string | null; empty: string | null; clinic: string | null } = {
  hook: "broll/paciente-perdido/noite-celular.mp4",
  empty: "broll/paciente-perdido/celular-sozinho.mp4",
  clinic: "broll/paciente-perdido/clinica.mp4",
};

export const T = {
  // 1 hook
  seu: 1.33,
  // 2 message
  phoneIn: 1.75,
  draftFrom: 1.95,
  send: 2.95,
  delivered: 3.3,
  dezDaNoite: 3.13,
  ninguem: 4.15,
  cutBack: 4.85,
  // 3 competitor
  outra: 5.25,
  outraReply: 5.86,
  outraNove: 6.35,
  outraOk: 6.75,
  nemSabendo: 6.9,
  // 4 rewind
  agora: 8.45,
  mesma: 9.46,
  drop: 10.55,
  // 5 answer
  reply1: 11.2,
  nove: 11.75,
  marcado: 12.3,
  toAgenda: 12.55,
  slotFill: 13.05,
  recepcao: 13.86,
  ticket: 14.15,
  gente: 15.96,
  // 6 system
  sistema: 16.6,
  seuSistema: 17.5,
  conecta: 18.0,
  nosso: 19.03,
  // 7 cta
  cta: 20.0,
  diagnostico: 20.18,
  gratuito: 20.92,
  logo: 21.35,
  chama: 21.7,
  whats: 22.48,
};

export const HOOK: KWord[] = [
  { w: "Esse", at: 0.05 },
  { w: "paciente", at: 0.34, accent: true },
  { w: "|", at: 0.34 },
  { w: "quase", at: 0.82 },
  { w: "foi", at: 1.09 },
  { w: "seu.", at: 1.33, accent: true },
];

export const NINGUEM: KWord[] = [
  { w: "Ninguém", at: 4.15 },
  { w: "respondeu.", at: 4.47, accent: true },
];

export const NEM_SABENDO: KWord[] = [
  { w: "E", at: 6.74 },
  { w: "você", at: 6.9 },
  { w: "nem", at: 7.21, accent: true },
  { w: "|", at: 7.21 },
  { w: "ficou", at: 7.35, accent: true },
  { w: "sabendo.", at: 7.65, accent: true },
];

export const AGORA: KWord[] = [
  { w: "Agora,", at: 8.62 },
  { w: "|", at: 8.62 },
  { w: "a", at: 9.31 },
  { w: "mesma", at: 9.46, accent: true },
  { w: "mensagem.", at: 9.8, accent: true },
];

export const SISTEMA: KWord[] = [
  { w: "Com", at: 17.29 },
  { w: "o", at: 17.44 },
  { w: "sistema", at: 17.5 },
  { w: "que", at: 17.94 },
  { w: "você", at: 18.06 },
  { w: "já", at: 18.37 },
  { w: "usa…", at: 18.52, accent: true },
  { w: "|", at: 18.52 },
  { w: "ou", at: 19.03 },
  { w: "com", at: 19.24 },
  { w: "o", at: 19.42 },
  { w: "nosso.", at: 19.5, accent: true },
];

export const CTA: KWord[] = [
  { w: "Diagnóstico", at: 20.18 },
  { w: "|", at: 20.18 },
  { w: "gratuito.", at: 20.92, accent: true },
];

// Headlines during the answer beat (one replaces the other).
export const BEATS = [
  { text: "Resposta na hora.", from: T.drop + 0.1, to: 11.8 },
  { text: "Direto na agenda.", from: 11.84, to: 13.6 },
  { text: "Recepção só no que precisa.", from: 13.62, to: T.sistema },
];
