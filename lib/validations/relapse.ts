import * as z from "zod";

export const relapseSchema = z.object({
  trigger_type: z.enum(["stress", "ennui", "solitude", "fatigue", "colere", "autre"]),
  location: z.enum(["maison", "travail", "exterieur", "soiree"]),
  premeditation_level: z.enum(["impulsif", "reflechi", "lutte_longue"]),
  mood_before: z.string().optional(),
  context: z.string().min(5, "Merci d'expliquer brièvement le contexte").max(500),
});

export type RelapseInput = z.infer<typeof relapseSchema>;