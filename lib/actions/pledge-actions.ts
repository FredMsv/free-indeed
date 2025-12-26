"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { logger } from "@/lib/utils/logger";
import { ActionResponse } from './dashboard-actions';
import { awardBadge } from "@/lib/gamification/badge-service";
import { JokerEligibility } from '@/lib/types/joker';

export async function getDailyPledgeStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const today = new Date().toLocaleDateString('en-CA'); 
  const { data } = await supabase
    .from('daily_pledges')
    .select('id')
    .eq('user_id', user.id)
    .eq('pledge_date', today)
    .maybeSingle();
  
  return !!data;
}

export async function submitDailyPledge(): Promise<ActionResponse<{ message?: string, nextAvailableAt?: string }>> {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: "Non connecté" };
    }

    const todayStr = new Date().toLocaleDateString('en-CA');

    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('is_broken, sobriety_start_date')
        .eq('user_id', user.id)
        .single();

    if (profileError || !profile) {
        logger.error("Error fetching profile", profileError, { userId: user.id });
        return { success: false, error: "Erreur technique profil." };
    }

    // --- LOGIQUE DE COOLDOWN RECHUTE (Réduite à 1h) ---
    if (profile.is_broken) {
        const { data: lastRelapse } = await supabase
            .from('relapses')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastRelapse?.created_at) {
            const relapseTime = new Date(lastRelapse.created_at).getTime();
            const nowTime = Date.now();
            const hoursDiff = (nowTime - relapseTime) / (1000 * 60 * 60);

            // CHANGEMENT ICI : Comparaison avec 1 heure au lieu de 24
            if (hoursDiff < 1) {
                const minutesRemaining = Math.ceil(60 - (hoursDiff * 60));
                return { 
                    success: false, 
                    error: `Période de réflexion active. Revenez dans ${minutesRemaining} minutes.`,
                    data: { nextAvailableAt: new Date(relapseTime + 1 * 60 * 60 * 1000).toISOString() }
                };
            }
        }

        const todayISO = new Date().toISOString();
        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ 
                sobriety_start_date: todayISO,
                is_broken: false 
            })
            .eq('user_id', user.id);

        if (updateError) {
            logger.error("Error restarting streak", updateError);
            return { success: false, error: "Erreur lors du redémarrage." };
        }

        await awardBadge(user.id, 'phoenix');
        revalidatePath('/dashboard');
        return { 
            success: true, 
            data: { message: "Série redémarrée ! Le Phénix renaît." } 
        };
    }

    const { error: insertError } = await supabase
        .from('daily_pledges')
        .insert({ user_id: user.id, pledge_date: todayStr });

    if (insertError) {
        if (insertError.code === '23505') {
            return { success: true, data: { message: "Déjà validé pour aujourd'hui." } };
        }
        logger.error("Error submitting pledge", insertError);
        return { success: false, error: "Impossible de valider l'engagement." };
    }

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    logger.error("Exception submitDailyPledge", error);
    return { success: false, error: "Erreur inattendue." };
  }
}

export async function repairStreakWithJoker(): Promise<ActionResponse<{ remaining: number }>> {
  const supabase = await createClient(); 
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const { data: lastRelapse } = await supabase
        .from('relapses')
        .select('id, previous_streak_days, relapse_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!lastRelapse) {
        return { success: false, error: "Aucune rechute à réparer." };
    }

    const { data: eligibilityData, error: rpcError } = await supabase
        .rpc('can_use_joker', { 
            p_user_id: user.id, 
            p_relapse_id: lastRelapse.id 
        });

    if (rpcError) {
        logger.error("RPC can_use_joker failed", rpcError);
        return { success: false, error: "Erreur vérification Joker." };
    }

    const eligibility = eligibilityData as unknown as JokerEligibility;

    if (!eligibility.allowed) {
        return { success: false, error: eligibility.reason };
    }

    const now = new Date();
    const relapseDate = new Date(lastRelapse.relapse_date);
    const daysSinceRelapse = Math.floor((now.getTime() - relapseDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDaysTarget = lastRelapse.previous_streak_days + daysSinceRelapse;
    const newStartDate = new Date();
    newStartDate.setDate(newStartDate.getDate() - totalDaysTarget);

    const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
            is_broken: false,
            sobriety_start_date: newStartDate.toISOString(),
            updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

    if (updateError) throw updateError;

    await supabase
        .from('joker_usage_log')
        .insert({
            user_id: user.id,
            relapse_id: lastRelapse.id,
            days_restored: lastRelapse.previous_streak_days,
            used_at: new Date().toISOString()
        });

    const datesToFill = [
        new Date().toLocaleDateString('en-CA'),
        new Date(Date.now() - 86400000).toLocaleDateString('en-CA')
    ];

    for (const d of datesToFill) {
        await supabase.from('daily_pledges').insert({ user_id: user.id, pledge_date: d });
    }

    revalidatePath('/dashboard');
    return { 
        success: true, 
        data: { remaining: eligibility.remaining_uses - 1 }
    };

  } catch (error) {
    logger.error("Exception repairStreakWithJoker", error);
    return { success: false, error: "Impossible d'utiliser le joker." };
  }
}