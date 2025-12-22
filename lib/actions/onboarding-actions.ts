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
  
  // 1. Validation des données
  const validated = onboardingSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Données invalides." };
  }
  
  const values = validated.data;

  // 2. Vérifier User
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: false, error: "Session expirée. Veuillez vous reconnecter." };
  }

  try {
    // 3. Préparation des données

    // Nettoyage des téléphones pasteurs (retirer les entrées vides)
    const cleanPastorPhones = values.pastorPhones 
      ? values.pastorPhones.filter(p => p && p.trim().length > 0)
      : null;

    // Pour rétro-compatibilité (premier numéro)
    const primaryPastorPhone = cleanPastorPhones && cleanPastorPhones.length > 0 
      ? cleanPastorPhones[0] 
      : null;

    // ✅ CRUCIAL : On rassemble toutes les habitudes dans un objet JSON pour la colonne 'habits'
    const habitsData = {
      emotional_triggers: values.emotionalTriggers || [],
      context_habits: values.contextHabits || [],
      specific_behaviors: values.specificBehaviors || []
    };

    // 4. Update User Profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        // ✅ ENREGISTREMENT DE L'ADDICTION ET DE LA DATE
        addiction_type_id: values.addictionTypeId,
        sobriety_start_date: values.sobrietyStartDate, 
        
        // ✅ ENREGISTREMENT DES HABITUDES (JSON)
        habits: habitsData,

        // Contacts
        emergency_contact_phone: values.emergencyContactPhone || null,
        pastor_phones: cleanPastorPhones,
        pastor_phone: primaryPastorPhone,
        doctor_phone: values.doctorPhone || null,
        
        // Validation du statut
        is_onboarded: true, 
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