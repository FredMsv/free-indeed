import * as z from 'zod';
// Assurez-vous d'avoir installé : npm install libphonenumber-js
import { isValidPhoneNumber } from 'libphonenumber-js';

// ✅ ÉTAPE 1 : Addiction et Date
export const step1Schema = z.object({
  addictionTypeId: z.string().uuid("Veuillez sélectionner un combat"),
  
  sobrietyStartDate: z.string()
    .min(1, "La date est requise")
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, "La date ne peut pas être dans le futur")
    .refine((date) => {
      const selected = new Date(date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return selected >= oneYearAgo;
    }, "La date ne peut pas remonter à plus d'un an"),
});

// ✅ ÉTAPE 2 : Contacts
export const step2Schema = z.object({
  pastorPhones: z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Numéro de téléphone invalide"
    }),
    
  doctorPhone: z.string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: "Numéro de téléphone invalide"
    }),
    
  emergencyContactPhone: z.string()
    .min(1, "Le contact d'urgence est requis")
    .refine((val) => isValidPhoneNumber(val || ''), {
      message: "Numéro de téléphone invalide (format international requis)"
    }),
});

// ✅ CORRECTION : Utilisation du spread des shapes au lieu de .merge()
// Cela évite l'erreur de dépréciation TS(6387) et crée un objet propre
export const onboardingSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;