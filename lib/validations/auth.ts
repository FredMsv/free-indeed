import { z } from "zod";

// --- SCHEMA INSCRIPTION (SIGN UP) ---
export const signUpSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  username: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Lettres, chiffres et underscores uniquement"),
  email: z.string().email({ message: "Format email invalide" }),
  phoneNumber: z.string().optional(),

  // ✅ CORRECTION : On utilise simplement 'message' comme indiqué par l'erreur TS
  gender: z.enum(["male", "female"], {
    message: "Veuillez sélectionner votre genre"
  }),

  birthDate: z.string().refine((date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  }, "Date de naissance invalide"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre"),
});

// ... (Le reste du fichier ne change pas) ...
export const signInSchema = z.object({
  email: z.string().email({ message: "Format email invalide" }),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Format email invalide" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;