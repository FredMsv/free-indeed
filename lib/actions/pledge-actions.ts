'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getDailyPledgeStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('daily_pledges')
    .select('id')
    .eq('user_id', user.id)
    .eq('pledge_date', today)
    .maybeSingle();
  
  return !!data;
}

export async function submitDailyPledge() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');

  // 1. Récupérer l'état actuel du profil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_broken')
    .eq('user_id', user.id)
    .single();

  // 2. CAS SPÉCIAL : REDÉMARRAGE APRÈS CHUTE
  // Si l'utilisateur est en état de "chute" (is_broken = true), 
  // ce clic sert à RÉPARER la série, peu importe s'il a déjà pledgé ce matin.
  if (profile?.is_broken) {
    // On répare le profil : Nouvelle date de départ = Maintenant, et on enlève le statut "Brisé"
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        sobriety_start_date: today.toISOString(),
        is_broken: false 
      })
      .eq('user_id', user.id);

    if (updateError) return { success: false, error: "Erreur lors du redémarrage." };

    // On s'assure qu'un pledge existe pour aujourd'hui (pour les stats), sinon on le crée
    // On utilise upsert ou insert ignore-like logic via le code d'erreur
    const { error: pledgeError } = await supabase
        .from('daily_pledges')
        .insert({ user_id: user.id, pledge_date: todayStr });
    
    // Si l'erreur est "duplicate key" (Code 23505), c'est normal et c'est tant mieux : 
    // l'utilisateur avait déjà pledgé le matin, il garde son point vert.
    if (pledgeError && pledgeError.code !== '23505') {
        return { success: false, error: pledgeError.message };
    }

    revalidatePath('/dashboard');
    return { success: true, message: "Série redémarrée !" };
  }

  // 3. CAS NORMAL : ENGAGEMENT DU MATIN
  const { error } = await supabase
    .from('daily_pledges')
    .insert({ user_id: user.id, pledge_date: todayStr });

  if (error) {
    if (error.code === '23505') return { success: true }; // Déjà fait, on considère succès
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}