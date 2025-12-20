"use server";

import { actionClient } from "@/lib/safe-action";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { createClient } from "@/lib/supabase/server"; // ⚠️ Vérifiez ce chemin (voir note en bas)
import { revalidatePath } from "next/cache";

export const completeOnboardingAction = actionClient
  .inputSchema(onboardingSchema)
  .action(async ({ parsedInput: data }) => {
    const supabase = await createClient();

    // 1. Vérifier l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Vous devez être connecté pour finaliser l'inscription.");
    }

    // 2. Sauvegarder les données de l'addiction
    // Note : Adaptez le nom de la table 'user_addictions' si différent dans votre DB
    const { error: insertError } = await supabase
      .from('user_addictions')
      .insert({
        user_id: user.id,
        addiction_type_id: data.addictionTypeId,
        sobriety_start_date: data.sobrietyStartDate,
        // Champs optionnels mais utiles pour le dashboard
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Erreur insert user_addictions:", insertError);
      throw new Error("Impossible de sauvegarder vos choix. Veuillez réessayer.");
    }

    // 3. Sauvegarder les contacts (Profile Update)
    const { error: profileError } = await supabase
      .from('user_profiles') // ou 'profiles'
      .update({
        emergency_contact_phone: data.emergencyContactPhone,
        pastor_phone: data.pastorPhones, // Vérifiez le nom de colonne exact dans votre DB
        doctor_phone: data.doctorPhone,  // Vérifiez le nom de colonne exact dans votre DB
        is_onboarded: true,              // ✅ Marqueur crucial pour ne plus revenir ici
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error("Erreur update profile:", profileError);
      // On ne bloque pas tout pour ça, mais on loggue l'erreur
    }

    // 4. Nettoyer le cache du dashboard pour afficher les nouvelles données
    revalidatePath('/dashboard');

    // 5. Succès ! (Le client fera la redirection)
    return { success: true };
  });