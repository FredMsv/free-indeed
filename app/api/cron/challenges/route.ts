import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { Database } from '@/lib/types/supabase';
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/types/user-settings';

const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@free-indeed.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function GET(_req: Request) {
    const now = new Date();
    const currentDay = now.getDay() || 7; 
    const currentHour = now.getHours(); 

    const { data: users, error } = await supabaseAdmin
        .from('user_profiles')
        .select(`user_id, notification_settings, addiction_type_id`);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let notificationsSent = 0;

    for (const user of users) {
        // CORRECTION : Vérifier que user_id n'est pas null
        if (!user.user_id) continue;

        const settingsRaw = user.notification_settings as unknown as Record<string, unknown>;
        
        const userSettings: NotificationSettings = {
            daily_reminder: typeof settingsRaw?.daily_reminder === 'boolean' ? settingsRaw.daily_reminder : DEFAULT_NOTIFICATION_SETTINGS.daily_reminder,
            reminder_time: typeof settingsRaw?.reminder_time === 'string' ? settingsRaw.reminder_time : DEFAULT_NOTIFICATION_SETTINGS.reminder_time,
            community_activity: typeof settingsRaw?.community_activity === 'boolean' ? settingsRaw.community_activity : DEFAULT_NOTIFICATION_SETTINGS.community_activity,
            challenge_day: typeof settingsRaw?.challenge_day === 'string' ? settingsRaw.challenge_day : DEFAULT_NOTIFICATION_SETTINGS.challenge_day,
            challenge_time: typeof settingsRaw?.challenge_time === 'string' ? settingsRaw.challenge_time : DEFAULT_NOTIFICATION_SETTINGS.challenge_time,
            challenge_reminders: typeof settingsRaw?.challenge_reminders === 'boolean' ? settingsRaw.challenge_reminders : DEFAULT_NOTIFICATION_SETTINGS.challenge_reminders,
        };

        const { data: subData } = await supabaseAdmin
            .from('push_subscriptions')
            .select('subscription')
            .eq('user_id', user.user_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        
        if (!subData || !subData.subscription) continue;

        const { data: lastChallenge } = await supabaseAdmin
            .from('user_challenges')
            .select('*')
            .eq('user_id', user.user_id)
            .order('week_number', { ascending: false })
            .limit(1)
            .maybeSingle();

        // CORRECTION : Vérification que challenge_time n'est pas null avant le split
        const challengeTime = userSettings.challenge_time || DEFAULT_NOTIFICATION_SETTINGS.challenge_time;
        const settingHour = parseInt(challengeTime.split(':')[0]);
        const settingDay = parseInt(userSettings.challenge_day || DEFAULT_NOTIFICATION_SETTINGS.challenge_day);

        const isTargetTime = settingDay === currentDay && settingHour === currentHour;

        // --- LOGIQUE A : NOUVEAU DÉFI ---
        if (isTargetTime) {
            let readyForNext = false;
            
            if (!lastChallenge) {
                readyForNext = true; 
            } else if (lastChallenge.status === 'completed') {
                const unlockedAt = new Date(lastChallenge.created_at ?? new Date().toISOString());
                const diffDays = (now.getTime() - unlockedAt.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays >= 7) readyForNext = true;
            }

            if (readyForNext) {
                try {
                    const subscription = subData.subscription as unknown as webpush.PushSubscription;
                    await webpush.sendNotification(
                        subscription,
                        JSON.stringify({
                            title: "Nouveau Défi Disponible ! 🏔️",
                            body: "Votre prochaine étape vers la liberté est prête.",
                            url: "/challenges"
                        })
                    );
                    notificationsSent++;
                } catch (e) { console.error("Push error", e); }
                continue; 
            }
        }

        // --- LOGIQUE B : RAPPELS RETARD ---
        if (userSettings.challenge_reminders && lastChallenge && lastChallenge.status === 'joined') {
            const unlockedAt = new Date(lastChallenge.created_at ?? new Date().toISOString());
            const diffDays = Math.floor((now.getTime() - unlockedAt.getTime()) / (1000 * 60 * 60 * 24));
            
            let shouldRemind = false;
            let msgTitle = "";
            let msgBody = "";

            const lastRemindedDate = lastChallenge.last_reminder_at 
                ? new Date(lastChallenge.last_reminder_at).getDate() 
                : -1;
            
            const isToday = lastRemindedDate === now.getDate();

            if (diffDays === 5) {
                if (!isToday) {
                    shouldRemind = true;
                    msgTitle = "Défi en attente ⏳";
                    msgBody = "Plus que 2 jours pour valider votre défi de la semaine !";
                }
            }
            else if (diffDays >= 7 && diffDays % 7 === 0) {
                 if (!isToday) {
                    shouldRemind = true;
                    msgTitle = "N'abandonnez pas 💪";
                    msgBody = "Votre défi vous attend. Validez-le pour passer à l'étape suivante.";
                 }
            }

            if (shouldRemind) {
                try {
                    const subscription = subData.subscription as unknown as webpush.PushSubscription;
                    await webpush.sendNotification(
                        subscription,
                        JSON.stringify({ title: msgTitle, body: msgBody, url: "/challenges" })
                    );
                    
                    await supabaseAdmin
                        .from('user_challenges')
                        .update({ last_reminder_at: now.toISOString() })
                        .eq('id', lastChallenge.id);
                    notificationsSent++;
                } catch (e) { console.error("Push error reminder", e); }
            }
        }
    }

    return NextResponse.json({ success: true, sent: notificationsSent });
}