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
  console.log("⚡ ACTION SERVEUR REÇUE : submitDailyPledge"); // Regardez le terminal VSCode

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("❌ Erreur : Pas d'utilisateur connecté");
    return { success: false, error: "Utilisateur non connecté" };
  }

  const today = new Date().toISOString().split('T')[0];
  console.log(`📝 Tentative d'insertion pour User ${user.id} à la date ${today}`);

  const { error } = await supabase
    .from('daily_pledges')
    .insert({
      user_id: user.id,
      pledge_date: today
    });

  if (error) {
    // Si c'est un doublon, c'est OK
    if (error.code === '23505') {
        console.log("⚠️ Déjà fait aujourd'hui (Doublon)");
        return { success: true };
    }
    
    console.error("❌ ERREUR SQL SUPABASE :", error); // TRÈS IMPORTANT
    return { success: false, error: error.message || "Erreur base de données" };
  }

  console.log("✅ SUCCÈS : Insertion réussie");
  revalidatePath('/dashboard');
  return { success: true };
}