import { loadFont as loadSans } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing } from "remotion";

export const { fontFamily: SANS } = loadSans("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export const { fontFamily: MONO } = loadMono("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const C = {
  deep: "#000A1F",
  navy: "#00143D",
  panel: "#081738",
  blue: "#0055FF",
  glow: "#3377FF",
  ice: "#E8EEFF",
  muted: "#8A9BC4",
  red: "#FF3B5C",
  green: "#21D07A",
  white: "#FFFFFF",
};

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const SFX = {
  whoosh: "sfx/whoosh.wav",
  click: "sfx/mouse-click.wav",
  ding: "sfx/ding.wav",
  pop: "sfx/switch.wav",
  notif: "sfx/snapchat-notification.wav",
};
