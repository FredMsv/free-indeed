import { z } from "zod";

// 1. Constantes
export const TRIGGERS = [
  "stress",
  "boredom",
  "loneliness",
  "anger",
  "celebration",
  "fatigue",
  "social_pressure",
  "other",
] as const;

export const MOODS = [
  "anxious",
  "depressed",
  "angry",
  "happy",
  "neutral",
  "tired",
] as const;

// 2. Schéma avec validation manuelle (.refine)
export const relapseSchema = z.object({
  
  trigger_type: z
    .string()
    .min(1, "Veuillez sélectionner un déclencheur.")
    // On cast TRIGGERS en tableau de strings simple pour la vérification
    .refine((val) => (TRIGGERS as readonly string[]).includes(val), {
      message: "Déclencheur invalide.",
    }),

  mood_before: z
    .string()
    .min(1, "Comment vous sentiez-vous ?")
    .refine((val) => (MOODS as readonly string[]).includes(val), {
      message: "Humeur invalide.",
    }),

  context: z.string()
    .max(500, "Le contexte ne doit pas dépasser 500 caractères.")
    .optional(),
});

export type RelapseInput = z.infer<typeof relapseSchema>;