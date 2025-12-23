"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateConsumptionSettings(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non autorisé" };

  const dailyValue1 = parseFloat(formData.get("dailyValue1") as string) || 0;
  const dailyValue2 = parseFloat(formData.get("dailyValue2") as string) || 0;

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        daily_value_1: dailyValue1,
        daily_value_2: dailyValue2,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) throw error;

    // On rafraîchit le dashboard pour que les calculs se mettent à jour instantanément
    revalidatePath('/dashboard');
    revalidatePath('/stats');
    revalidatePath('/consumption');

    return { success: true };
  } catch (error) {
    console.error("Erreur update consumption:", error);
    return { success: false, error: "Erreur lors de la mise à jour." };
  }
}