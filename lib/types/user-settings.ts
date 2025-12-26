export interface NotificationSettings {
  daily_reminder: boolean;
  reminder_time: string;
  community_activity: boolean;
  // Nouveaux champs
  challenge_day: string; // "1" à "7" (String pour gérer le select HTML facilement)
  challenge_time: string;
  challenge_reminders: boolean; // Pour les relances à J+5, J+7...
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  daily_reminder: true,
  reminder_time: "08:00",
  community_activity: true,
  challenge_day: "1", // Lundi par défaut
  challenge_time: "09:00",
  challenge_reminders: true,
};