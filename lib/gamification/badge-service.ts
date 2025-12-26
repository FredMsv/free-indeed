"use server";

import { createClient } from "@/lib/supabase/server";
import { BADGES, BadgeDef } from "@/lib/constants/badges";
import { logger } from "@/lib/utils/logger";
import { TablesInsert } from "@/lib/types/supabase";

export async function awardBadge(userId: string, badgeCode: string): Promise<BadgeDef | null> {
  const supabase = await createClient();
  const badgeDef = BADGES.find(b => b.code === badgeCode);

  if (!badgeDef) return null;

  try {
    const { data: awarded, error } = await supabase.rpc('award_badge_safe', {
        p_user_id: userId,
        p_badge_code: badgeCode
    });

    if (error) {
        logger.error("Error calling award_badge_safe", error);
        return null;
    }

    if (awarded) {
        const newNotification: TablesInsert<'notifications'> = {
            user_id: userId,
            type: 'challenge',
            title: `🏆 Nouveau Badge : ${badgeDef.label}`,
            message: badgeDef.description,
            link: '/profile',
            is_read: false
        };

        await supabase.from('notifications').insert(newNotification);
        return badgeDef;
    }

    return null;
  } catch (error) {
    logger.error("Exception awardBadge", error);
    return null;
  }
}

export async function checkAndUnlockBadges(
    userId: string, 
    category: BadgeDef['category']
): Promise<BadgeDef | null> {
    const supabase = await createClient();
    try {
        let count = 0;
        
        if (category === 'journal') {
            const { count: c } = await supabase.from('user_journals').select('*', { count: 'exact', head: true }).eq('user_id', userId);
            count = c || 0;
        } 
        else if (category === 'prayer_personal') {
            const { count: c } = await supabase.from('prayer_requests').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_shared', false);
            count = c || 0;
        }
        else if (category === 'prayer_support') {
            const { count: c } = await supabase.from('prayer_supports').select('*', { count: 'exact', head: true }).eq('supporter_id', userId);
            count = c || 0;
        }
        else if (category === 'challenge') {
            const { count: c } = await supabase.from('user_challenges').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed');
            count = c || 0;
        }
        else if (category === 'sobriety') {
             const { data } = await supabase.from('user_profiles').select('sobriety_start_date, is_broken').eq('user_id', userId).single();
             if (data && data.sobriety_start_date && !data.is_broken) {
                 const start = new Date(data.sobriety_start_date);
                 const now = new Date();
                 count = Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
             }
        }

        const potentialBadges = BADGES.filter(b => b.category === category && count >= b.threshold);
        let lastUnlocked: BadgeDef | null = null;
        
        for (const badge of potentialBadges) {
            const unlocked = await awardBadge(userId, badge.code);
            if (unlocked) lastUnlocked = unlocked;
        }

        return lastUnlocked;
    } catch (error) {
        logger.error("Check badges error", error);
        return null;
    }
}

export async function getUserBadges(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('earned_badges')
        .select('badge_code, created_at')
        .eq('user_id', userId);
    return data || [];
}