"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non connecté" };

  const username = formData.get("username") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  const updates = {
    username,
    avatar_url: avatarUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }

  revalidatePath("/profile");
  revalidatePath("/community"); // Pour mettre à jour l'avatar dans le chat
  return { success: true };
}