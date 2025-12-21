// FICHIER: lib/types/auth.ts

// 📌 [NOUVEAU STANDARD]
// Utilisé par les Server Actions (Login, Signup) pour communiquer avec le client
export interface AuthActionResponse {
  success: boolean;
  error?: string; // Erreur globale (ex: "Erreur serveur", "Identifiants incorrects")
  fieldErrors?: {
    [key: string]: string; // Erreurs spécifiques aux champs (ex: username: "Déjà pris")
  };
  redirectTo?: string; // L'URL de destination (Dashboard ou Onboarding)
}

// 📌 [TYPE UTILISATEUR]
// Correspond à la structure de votre table SQL 'users' (Conservé du code original)
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  avatar_url?: string;
  created_at: string;
}

// 📌 [TYPE COMBAT]
// Correspond à la structure de l'onboarding (Conservé du code original)
export interface OnboardingData {
  addictionTypeId: string;
  sobrietyStartDate: string;
  emergencyPhone?: string;
}