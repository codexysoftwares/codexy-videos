// "Você nunca viu sua clínica pelos olhos do paciente." — Reels for clinic owners. One continuous story (night → morning),
// reveal (the competitor answered with an automatic attendant), morning dashboard, CTA. 60 fps.
// Cues in seconds of video time = N[i].at + word time in public/narracao/olhos-do-paciente/palavras.json.
// Footage: public/broll/olhos-do-paciente/ (Mixkit free license). Music: re-edit of music/clinica-24h.mp3.
import type { KWord } from "../../shared/kit/Kinetic";

export const FPS = 60;
export const f = (s: number) => Math.round(s * FPS);
export const DURATION = f(32.6);

export const NARRACAO = "narracao/olhos-do-paciente";
export const N = [
  { file: "01-gancho.wav", at: 0.05 },
  { file: "02-dor.wav", at: 2.75 },
  { file: "03-busca.wav", at: 5.2 },
  { file: "04-corrida.wav", at: 9.15 },
  { file: "05-manha.wav", at: 12.15 },
  { file: "06-soco.wav", at: 14.75 },
  { file: "07-revelacao.wav", at: 17.0 },
  { file: "08-painel.wav", at: 20.45 },
  { file: "09-cta.wav", at: 27.2 },
];

export const MUSICA = "music/clinica-24h.mp3";
// [video start, track start, track end, fade in, fade out] — night/tension, quiet morning, groove, resolve
export const MUSIC = [
  { from: 0, trackFrom: 0.3, trackTo: 12.4, fadeIn: 0.05, fadeOut: 0.25, vol: 0.95 },
  { from: 12.1, trackFrom: 12.3, trackTo: 17.2, fadeIn: 0.1, fadeOut: 0.3, vol: 0.85 },
  { from: 16.95, trackFrom: 22.5, trackTo: 31.0, fadeIn: 0.2, fadeOut: 0.6, vol: 0.85 },
  { from: 24.9, trackFrom: 25.7, trackTo: 33.4, fadeIn: 0.6, fadeOut: 0.5, vol: 0.85 },
];

export const BROLL = {
  noite: "broll/olhos-do-paciente/noite-celular.mp4",
  dor: "broll/olhos-do-paciente/dor-de-dente.mp4",
  mesa: "broll/olhos-do-paciente/celular-sozinho.mp4",
};

// Scene boundaries and beats (seconds)
export const S = {
  hook: [0, 2.75],
  dor: [2.75, 5.2],
  busca: [5.2, 9.15],
  corrida: [9.15, 12.15],
  manha: [12.15, 14.75],
  soco: [14.75, 17.0],
  revelacao: [17.0, 20.45],
  painel: [20.45, 27.2],
  cta: [27.2, 32.6],
} as const;

export const T = {
  paciente: 2.0,
  noite: 3.8,
  dor: 4.34,
  procura: 5.5,
  acha: 6.23,
  clinicas: 6.85,
  manda: 7.76,
  send: 8.7,
  responde: 9.46,
  hora: 10.11,
  oito8h: 10.45,
  marcado: 10.85,
  outra: 10.81,
  nemViu: 11.42,
  manhaOito: 12.21,
  abre: 13.83,
  whatsapp: 14.16,
  bomDia: 14.85,
  sentada: 15.34,
  cadeira: 15.93,
  quem: 17.06,
  um: 17.99,
  automatico: 18.67,
  ligado: 19.43,
  agenda: 19.94,
  painel: 22.55,
  tudo: 23.12,
  noiteP: 23.96,
  respondido: 24.49,
  marcadoP: 25.39,
  organizado: 26.27,
  quer: 27.26,
  clinica: 28.49,
  diagnostico: 29.12,
  gratuito: 29.75,
  whatsCta: 30.39,
};

export const HOOK: KWord[] = [
  { w: "Você", at: 0.05 },
  { w: "nunca", at: 0.34 },
  { w: "viu", at: 0.58 },
  { w: "sua", at: 0.75 },
  { w: "clínica", at: 0.94, accent: true },
  { w: "|", at: 0.94 },
  { w: "pelos", at: 1.34 },
  { w: "olhos", at: 1.66 },
  { w: "do", at: 1.9 },
  { w: "paciente.", at: 2.0, accent: true },
];

export const DOR: KWord[] = [
  { w: "Dor", at: 4.34 },
  { w: "de", at: 4.58 },
  { w: "dente.", at: 4.71, accent: true },
];

export const NEM_VIU: KWord[] = [
  { w: "A", at: 10.62 },
  { w: "outra…", at: 10.81 },
  { w: "nem", at: 11.42, accent: true },
  { w: "viu.", at: 11.66, accent: true },
];

export const SOCO: KWord[] = [
  { w: "Ela", at: 14.76 },
  { w: "já", at: 14.96 },
  { w: "está", at: 15.1 },
  { w: "|", at: 15.1 },
  { w: "na", at: 15.82 },
  { w: "cadeira", at: 15.93, accent: true },
  { w: "|", at: 15.93 },
  { w: "da", at: 16.34 },
  { w: "outra.", at: 16.49, accent: true },
];

export const REVELA: KWord[] = [
  { w: "Quem", at: 17.06 },
  { w: "respondeu?", at: 17.26, accent: true },
];

export const CTA_Q: KWord[] = [
  { w: "Quer", at: 27.26 },
  { w: "isso", at: 27.47 },
  { w: "|", at: 27.47 },
  { w: "na", at: 28.17 },
  { w: "sua", at: 28.29 },
  { w: "clínica?", at: 28.49, accent: true },
];

export const CTA_D: KWord[] = [
  { w: "Diagnóstico", at: 29.12 },
  { w: "|", at: 29.12 },
  { w: "gratuito.", at: 29.75, accent: true },
];
