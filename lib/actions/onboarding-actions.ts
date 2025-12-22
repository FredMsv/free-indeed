"use server";

import { onboardingSchema, type OnboardingFormValues } from "@/lib/validations/onboarding";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type OnboardingResponse = {
  success: boolean;
  error?: string;
};

export async function completeOnboardingAction(data: OnboardingFormValues): Promise<OnboardingResponse> {
  const supabase = await createClient();
  
  // 1. Validation des données côté serveur
  const validated = onboardingSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Données invalides." };
  }
  
  const values = validated.data;

  // 2. Vérifier l'utilisateur connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  // 3. Sauvegarder les données
  try {
    // Nettoyage des téléphones pasteurs (retirer les entrées vides)
    const cleanPastorPhones = values.pastorPhones 
      ? values.pastorPhones.filter(p => p && p.trim().length > 0)
      : null;

    // Pour la compatibilité avec l'ancienne colonne 'pastor_phone' (singulier), on prend le premier numéro
    const primaryPastorPhone = cleanPastorPhones && cleanPastorPhones.length > 0 
      ? cleanPastorPhones[0] 
      : null;

    // 4. Mettre à jour le profil (user_profiles)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        emergency_contact_phone: values.emergencyContactPhone,
        
        // On sauvegarde le tableau complet
        pastor_phones: cleanPastorPhones,
        // On sauvegarde le premier pour compatibilité
        pastor_phone: primaryPastorPhone,
        
        doctor_phone: values.doctorPhone || null,
        is_onboarded: true, // Marqueur crucial
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error("Erreur update profile:", profileError);
      return { success: false, error: "Impossible de mettre à jour le profil." };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error("Erreur serveur onboarding:", error);
    return { success: false, error: "Une erreur interne est survenue." };
  }
}