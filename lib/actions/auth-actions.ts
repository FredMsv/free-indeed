'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema, type SignUpFormValues, type SignInFormValues, type ForgotPasswordFormValues, type ResetPasswordFormValues } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'

export type ActionResponse = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
  redirectTo?: string
}

export type AuthResponse = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export async function signUpAction(data: SignUpFormValues): Promise<AuthResponse> {
  // 1. Validation Zod des entrées
  const validated = signUpSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: validated.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  const { email, password, username, firstName, lastName, phoneNumber, gender, birthDate } = validated.data;

  // Normalisation basique du téléphone pour la recherche (suppression des espaces)
  const normalizedPhoneSearch = phoneNumber?.replace(/\s/g, ''); 

  // -------------------------------------------------------------------------
  // 🛡️ VÉRIFICATIONS PRÉALABLES
  // -------------------------------------------------------------------------
  
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // A. Vérifier le PSEUDO
  const { data: existingUser } = await supabaseAdmin
    .from("user_profiles")
    .select("username")
    .ilike("username", username)
    .maybeSingle();

  if (existingUser) {
    return { success: false, fieldErrors: { username: "Ce pseudo est déjà pris." } };
  }

  // B. Vérifier l'EMAIL
  const { data: existingEmail } = await supabaseAdmin
    .from("user_profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existingEmail) {
    return { success: false, fieldErrors: { email: "Un compte existe déjà avec cet email." } };
  }

  // C. Vérifier le TÉLÉPHONE (Tentative manuelle)
  if (normalizedPhoneSearch) {
    const { data: existingPhone } = await supabaseAdmin
      .from("user_profiles")
      .select("phone_number")
      .eq("phone_number", normalizedPhoneSearch) 
      .maybeSingle();

    if (existingPhone) {
      return { success: false, fieldErrors: { phoneNumber: "Ce numéro de téléphone est déjà utilisé." } };
    }
  }

  // -------------------------------------------------------------------------
  // 🚀 CRÉATION DU COMPTE
  // -------------------------------------------------------------------------
  const supabase = await createClient();

  // On définit l'URL de base pour la redirection (localhost en dev, domaine en prod)
  const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // ✅ CORRECTION 1 : On force la redirection vers la route API qui échange le code
      emailRedirectTo: `${origin}/auth/callback`,
      
      data: {
        username,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        gender: gender,
        birth_date: birthDate,
      },
    },
  });

  if (error) {
    console.error("Erreur Signup Supabase:", error);

    // --- FILET DE SÉCURITÉ ---
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes("already registered") || errorMessage.includes("user already exists") || errorMessage.includes("duplicate")) {
       return { 
         success: false, 
         fieldErrors: { phoneNumber: "Ce numéro (ou cet email) est déjà associé à un compte." } 
       };
    }
    
    return { success: false, error: error.message };
  }

  // ✅ CORRECTION 2 : On redirige vers la page publique de succès (pas l'onboarding protégé)
  return { success: true, redirectTo: "/signup/success" };
}

export async function signInAction(data: SignInFormValues): Promise<ActionResponse> {
  const supabase = await createClient()

  const validatedFields = signInSchema.safeParse(data)
  if (!validatedFields.success) {
    return { success: false, error: "Format invalide" }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: "Email ou mot de passe incorrect." }
  }

  return { success: true, redirectTo: '/dashboard' }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function forgotPasswordAction(data: ForgotPasswordFormValues): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const validated = forgotPasswordSchema.safeParse(data);
  if (!validated.success) return { success: false, error: "Email invalide" };

  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    console.error("Reset password error:", error);
    return { success: false, error: "Impossible d'envoyer l'email." };
  }

  return { success: true }
}

export async function resetPasswordAction(data: ResetPasswordFormValues): Promise<ActionResponse> {
  const supabase = await createClient()

  const validated = resetPasswordSchema.safeParse(data);
  if (!validated.success) return { success: false, error: "Données invalides" };

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}