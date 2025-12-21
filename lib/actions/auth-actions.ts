'use server'

import { createClient } from '@/lib/supabase/server'
import { signUpSchema, signInSchema, type SignUpFormValues, type SignInFormValues } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'

export type ActionResponse = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
  redirectTo?: string
}

export async function signUpAction(data: SignUpFormValues): Promise<ActionResponse> {
  const supabase = await createClient()

  // 1. Validation des données
  const validatedFields = signUpSchema.safeParse(data)
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Données invalides",
      fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string>
    }
  }

  const { email, password, username, firstName, lastName, phoneNumber } = validatedFields.data

  // 2. Vérification d'unicité (Pseudo/Email) via RPC ou Query simple
  // On vérifie d'abord le pseudo car Auth gère l'email
  const { data: existingUser } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return {
      success: false,
      fieldErrors: { username: "Ce pseudo est déjà utilisé." }
    }
  }

  // 3. Création du compte Auth
  // NOTE: Le trigger SQL 'on_auth_user_created' s'occupera de remplir public.users et public.user_profiles
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        phone_number: phoneNumber,
      },
      // Important pour rediriger après confirmation email si activé
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Succès
  return { success: true, redirectTo: '/signup/success' }
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
    return { success: false, error: error.message }
  }

  // La redirection est gérée côté client ou via middleware, mais on peut renvoyer l'URL
  return { success: true, redirectTo: '/dashboard' } // Le middleware ajustera si onboarding nécessaire
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ... (Code précédent signUpAction, signInAction, signOutAction) ...

// AJOUTS POUR COMPATIBILITÉ ET PHASE 2
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordFormValues, type ResetPasswordFormValues } from '@/lib/validations/auth'

export async function forgotPasswordAction(data: ForgotPasswordFormValues): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const validated = forgotPasswordSchema.safeParse(data);
  if (!validated.success) return { success: false, error: "Email invalide" };

  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`,
  })

  // Sécurité: on ne dit jamais si l'email n'existe pas
  if (error) {
    console.error("Reset password error:", error);
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