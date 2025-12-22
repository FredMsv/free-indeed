import { z } from "zod";

// Validation étape par étape
export const step1Schema = z.object({
  addictionTypeId: z.string().min(1, "Veuillez choisir une catégorie"),
  sobrietyStartDate: z.string().min(1, "La date est requise"),
});

// Schéma complet
export const onboardingSchema = z.object({
  // Étape 1
  addictionTypeId: z.string().min(1, "Veuillez choisir une catégorie"),
  sobrietyStartDate: z.string().min(1, "La date est requise"),
  
  // Étape 2 (Emotionnel)
  emotionalTriggers: z.array(z.string()).optional(),
  
  // Étape 3 (Contexte)
  contextHabits: z.array(z.string()).optional(),
  
  // Étape 4 (Spécifique)
  specificBehaviors: z.array(z.string()).optional(),

  // ✅ CORRECTION : Le contact SOS devient optionnel
  // On accepte une chaîne vide OU un format valide
  emergencyContactPhone: z.string()
    .refine((val) => val === '' || val === undefined || /^\+?[0-9\s]+$/.test(val), "Format invalide")
    .refine((val) => val === '' || val === undefined || val.length >= 10, "Numéro trop court")
    .optional(),
    
  // pastorPhones est un tableau de chaînes (optionnel)
  pastorPhones: z.array(z.string()).optional(),
  
  doctorPhone: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;