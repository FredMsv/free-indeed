// 📌 [TYPES D'AUTHENTIFICATION]
// Définit ce que les Server Actions renvoient au formulaire
export interface AuthResponse {
    error?: string;   // 📌 Message d'erreur optionnel [cite: 418]
    success?: boolean; // 📌 Indicateur de réussite [cite: 237]
  }
  
  // 📌 [TYPE UTILISATEUR]
  // Correspond à la structure de votre table SQL 'users'
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
  // Correspond à la structure de l'onboarding
  export interface OnboardingData {
    addictionTypeId: string;
    sobrietyStartDate: string;
    emergencyPhone?: string;
  }