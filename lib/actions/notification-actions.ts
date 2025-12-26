"use server";

import { createClient } from "@/lib/supabase/server";
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/types/user-settings";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "./dashboard-actions";
import { logger } from "@/lib/utils/logger";
import { Json } from "@/lib/types/supabase";

function parseSettings(input: Json): NotificationSettings {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  const obj = input as Record<string, unknown>;

  return {
    daily_reminder: typeof obj.daily_reminder === 'boolean' 
      ? obj.daily_reminder 
      : DEFAULT_NOTIFICATION_SETTINGS.daily_reminder,
      
    reminder_time: typeof obj.reminder_time === 'string' 
      ? obj.reminder_time 
      : DEFAULT_NOTIFICATION_SETTINGS.reminder_time,
      
    community_activity: typeof obj.community_activity === 'boolean' 
      ? obj.community_activity 
      : DEFAULT_NOTIFICATION_SETTINGS.community_activity,

    challenge_day: typeof obj.challenge_day === 'string' 
        ? obj.challenge_day 
        : DEFAULT_NOTIFICATION_SETTINGS.challenge_day,

    challenge_time: typeof obj.challenge_time === 'string' 
        ? obj.challenge_time 
        : DEFAULT_NOTIFICATION_SETTINGS.challenge_time,

    challenge_reminders: typeof obj.challenge_reminders === 'boolean' 
        ? obj.challenge_reminders 
        : DEFAULT_NOTIFICATION_SETTINGS.challenge_reminders,
  };
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return DEFAULT_NOTIFICATION_SETTINGS;

  const { data } = await supabase
    .from('user_profiles')
    .select('notification_settings')
    .eq('user_id', user.id)
    .single();

  return parseSettings(data?.notification_settings ?? null);
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non connecté" };

  try {
    const settingsJson: { [key: string]: string | boolean } = {
      daily_reminder: settings.daily_reminder,
      reminder_time: settings.reminder_time,
      community_activity: settings.community_activity,
      challenge_day: settings.challenge_day,
      challenge_time: settings.challenge_time,
      challenge_reminders: settings.challenge_reminders
    };

    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        notification_settings: settingsJson, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    logger.error("Error updating notification settings", error);
    return { success: false, error: "Erreur de sauvegarde" };
  }
}

export async function unsubscribeFromPush(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non connecté" };

  try {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error("Error unsubscribing push", error);
    return { success: false, error: "Erreur serveur lors de la désinscription" };
  }
}