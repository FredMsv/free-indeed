"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";

export async function deleteJournalEntry(id: string) {
  const supabase = await createClient();
  const client = supabase as SupabaseClient;

  const { error } = await client
    .from('user_journals')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/stats');
  revalidatePath('/journal');
  return { success: true };
}

export async function saveJournalEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non connecté" };

  const mood = formData.get("mood") as string;
  const content = formData.get("content") as string;
  const today = new Date().toLocaleDateString('en-CA');

  const client = supabase as SupabaseClient;

  const { error } = await client
    .from('user_journals')
    .upsert({
      user_id: user.id,
      journal_date: today,
      mood,
      content,
      updated_at: new Date().toISOString()
    });

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/stats');
  revalidatePath('/journal');
  return { success: true };
}

export async function getTodayJournal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date().toLocaleDateString('en-CA');
  const client = supabase as SupabaseClient;

  const { data } = await client
    .from('user_journals')
    .select('mood, content')
    .eq('user_id', user.id)
    .eq('journal_date', today)
    .maybeSingle();

  return data as { mood: string; content: string | null } | null;
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