import type { ParticipantRole } from "../models/game.js";

// Starter words shown to new rooms
export const STARTER_WORDS = [
  "rocket",
  "pizza",
  "castle",
  "guitar",
  "sunflower",
  "balloon",
  "dragon",
  "umbrella"
] as const;

export const STARTER_ROLES: ParticipantRole[] = ["drawer", "guesser"];
