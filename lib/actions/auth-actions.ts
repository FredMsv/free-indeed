"use server";

// ✅ Vérifiez bien que ce chemin est correct selon votre structure
import { createClient } from "@/lib/supabase/server"; 
import { actionClient } from "@/lib/safe-action";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { redirect } from "next/navigation";

// --- SIGN UP ---
export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput: data }) => {
    const supabase = await createClient(); // ✅ AJOUT DE AWAIT

    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: `${data.firstName} ${data.lastName}`,
          username: data.username,
          phone_number: data.phoneNumber,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        throw new Error("Cet email possède déjà un compte.");
      }
      throw new Error("Impossible de créer le compte. Contactez le support.");
    }

    return { success: true };
  });

// --- SIGN IN ---
export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput: data }) => {
    const supabase = await createClient(); // ✅ AJOUT DE AWAIT

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    return { success: true };
  });

// --- FORGOT PASSWORD ---
export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: data }) => {
    const supabase = await createClient(); // ✅ AJOUT DE AWAIT

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    });

    if (error) {
      console.error("Forgot password error:", error.message);
    } 

    return { success: true };
  });

// --- RESET PASSWORD ---
export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: data }) => {
    const supabase = await createClient(); // ✅ AJOUT DE AWAIT

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new Error("Impossible de modifier le mot de passe.");
    }

    return { success: true };
  });

// --- SIGN OUT ---
export const signOutAction = async () => {
  const supabase = await createClient(); // ✅ AJOUT DE AWAIT
  await supabase.auth.signOut();
  redirect("/login");
};