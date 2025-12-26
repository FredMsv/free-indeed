"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { MOODS, getMoodFromValue } from "@/lib/constants/moods";
import { logger } from "@/lib/utils/logger";
import { ActionResponse } from './dashboard-actions';
import { checkAndUnlockBadges } from "@/lib/gamification/badge-service";

/**
 * Sauvegarde une entrée de journal et vérifie les badges associés.
 */
export async function saveJournalEntry(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non autorisé" };

    const mood = formData.get("mood") as string;
    const content = formData.get("content") as string;
    const context = formData.get("context") as string;
    
    // On force la date du jour pour l'entrée
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('user_journals')
      .insert({ 
        user_id: user.id, 
        journal_date: today, 
        mood, 
        content, 
        context 
      });

    if (error) {
      logger.error("Error saving journal", error, { userId: user.id });
      return { success: false, error: "Impossible de sauvegarder la note." };
    }

    // --- GAMIFICATION START ---
    // On vérifie si cette action débloque un badge "Journal"
    const newBadge = await checkAndUnlockBadges(user.id, 'journal');
    
    if (newBadge) {
        // Si un badge est gagné, on crée une notification système
        await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'system',
            title: `🏆 Badge débloqué : ${newBadge.label}`,
            message: newBadge.description,
            link: '/profile'
        });
    }
    // --- GAMIFICATION END ---

    revalidatePath('/dashboard');
    revalidatePath('/journal');
    revalidatePath('/profile'); // Pour mettre à jour le compteur de badges
    return { success: true };

  } catch (error) {
    logger.error("Exception saveJournalEntry", error);
    return { success: false, error: "Erreur serveur." };
  }
}

/**
 * Récupère l'entrée du jour pour l'affichage conditionnel ou le résumé.
 */
export async function getTodayJournal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];

  const { data: entries, error } = await supabase
    .from('user_journals')
    .select('mood, content, context')
    .eq('user_id', user.id)
    .eq('journal_date', today);

  if (error || !entries || entries.length === 0) return null;

  // Calcul de la moyenne de l'humeur si plusieurs entrées ce jour-là
  const totalValue = entries.reduce((acc, entry) => {
    const moodConfig = MOODS.find(m => m.id === entry.mood);
    return acc + (moodConfig?.value || 3);
  }, 0);

  const averageValue = totalValue / entries.length;
  const averageMood = getMoodFromValue(averageValue);

  return {
    mood: averageMood.id,
    content: entries[entries.length - 1].content, // On prend le dernier texte
    context: entries[entries.length - 1].context,
    count: entries.length
  };
}

/**
 * Récupère l'historique des journaux avec une limite optionnelle.
 */
export async function getJournalHistory(limit = 10) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
  
    const { data } = await supabase
      .from('user_journals')
      .select('*')
      .eq('user_id', user.id)
      .order('journal_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);
      
    return data || [];
}

/**
 * Supprime une entrée spécifique (vérifie la propriété).
 */
export async function deleteJournalEntry(entryId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Non autorisé" };

    // count: 'exact' est nécessaire pour savoir si une ligne a bien été supprimée
    const { error, count } = await supabase
      .from('user_journals')
      .delete({ count: 'exact' })
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (error) {
      logger.error("Error deleting journal", error, { entryId, userId: user.id });
      return { success: false, error: "Erreur technique lors de la suppression." };
    }

    if (count === 0) {
      return { success: false, error: "Note introuvable ou vous n'avez pas les droits." };
    }

    revalidatePath('/dashboard');
    revalidatePath('/journal');
    return { success: true };

  } catch (error) {
    logger.error("Exception deleteJournalEntry", error);
    return { success: false, error: "Erreur inattendue." };
  }
}