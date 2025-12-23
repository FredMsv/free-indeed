"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";
import { MOODS, getMoodFromValue } from "@/lib/constants/moods";

export async function saveJournalEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non autorisé" };

  const mood = formData.get("mood") as string;
  const content = formData.get("content") as string;
  const context = formData.get("context") as string; // AJOUTÉ
  
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('user_journals')
    .insert({ 
      user_id: user.id, 
      journal_date: today, 
      mood, 
      content,
      context // AJOUTÉ
    });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/journal');
  return { success: true };
}

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

  const totalValue = entries.reduce((acc, entry) => {
    const moodConfig = MOODS.find(m => m.id === entry.mood);
    return acc + (moodConfig?.value || 3);
  }, 0);

  const averageValue = totalValue / entries.length;
  const averageMood = getMoodFromValue(averageValue);

  return {
    mood: averageMood.id,
    content: entries[entries.length - 1].content,
    context: entries[entries.length - 1].context, // AJOUTÉ
    count: entries.length
  };
}

export async function getLast7DaysMoods() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const client = supabase as SupabaseClient;

  const { data } = await client
    .from('user_journals')
    .select('journal_date, mood')
    .eq('user_id', user.id)
    .gte('journal_date', sevenDaysAgo.toLocaleDateString('en-CA'))
    .order('journal_date', { ascending: true });

  const entries = (data || []) as { journal_date: string, mood: string }[];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const sqlDate = d.toLocaleDateString('en-CA');
    const found = entries.find((item) => item.journal_date === sqlDate);

    result.push({
      day: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
      mood: found ? found.mood : null
    });
  }

  return result;
}

export async function deleteJournalEntry(entryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non autorisé" };

  console.log("🔍 TENTATIVE SUPPRESSION :");
  console.log("- User ID :", user.id);
  console.log("- Entry ID :", entryId);

  const { error, count } = await supabase
    .from('user_journals')
    .delete({ count: 'exact' })
    .eq('id', entryId)
    .eq('user_id', user.id);

  console.log("- Résultat Count :", count);
  
  if (error) {
    console.error("❌ Erreur SQL :", error.message);
    return { success: false, error: error.message };
  }

  if (count === 0) {
    console.error("⚠️ Aucune ligne supprimée (Problème de droits ou ID introuvable)");
    return { success: false, error: "Impossible de supprimer (Ligne introuvable ou droits insuffisants)" };
  }

  console.log("✅ Succès");
  revalidatePath('/dashboard');
  revalidatePath('/journal');
  
  return { success: true };
}