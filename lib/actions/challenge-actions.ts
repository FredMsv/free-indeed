"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ChallengeWithStatus, ChallengeRow } from "@/lib/types/challenge";
import { logger } from "@/lib/utils/logger";

export async function getCurrentChallenge(): Promise<ChallengeWithStatus | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    // 1. Récupérer le profil pour l'addiction
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('addiction_type_id')
        .eq('user_id', user.id)
        .single();

    if (!profile?.addiction_type_id) return null;

    // 2. Récupérer le DERNIER défi de l'utilisateur (le plus récent)
    const { data: lastUserChallenge } = await supabase
        .from('user_challenges')
        .select(`*, weekly_challenges(*)`)
        .eq('user_id', user.id)
        .order('week_number', { ascending: false })
        .limit(1)
        .maybeSingle();

    const now = new Date();

    // --- SCÉNARIO 1 : PREMIER DÉFI (Aucun historique) ---
    if (!lastUserChallenge) {
        const { data: firstChallenge } = await supabase
            .from('weekly_challenges')
            .select('*')
            .eq('week_number', 1)
            .eq('challenge_type', 'specific') // Le premier est toujours spécifique
            .eq('addiction_type_id', profile.addiction_type_id)
            .maybeSingle();
            
        if (!firstChallenge) return null;

        return {
            ...(firstChallenge as ChallengeRow),
            userStatus: 'none',
            unlockedAt: now.toISOString()
        };
    }

    const challengeData = lastUserChallenge.weekly_challenges as unknown as ChallengeRow;
    
    // --- SCÉNARIO 2 : DÉFI EN COURS (Non terminé) ---
    if (lastUserChallenge.status === 'joined') {
        return {
            ...challengeData,
            userStatus: 'joined',
            unlockedAt: lastUserChallenge.started_at // On affiche depuis quand c'est commencé
        };
    }

    // --- SCÉNARIO 3 : DÉFI TERMINÉ MAIS VERROUILLÉ (Timer en cours) ---
    // C'est ici que la base de données fait foi grâce à 'unlock_at'
    const unlockDate = new Date(lastUserChallenge.unlock_at);
    
    if (now < unlockDate) {
        return {
            ...challengeData,
            userStatus: 'locked', // Le front affichera le cadenas
            unlockedAt: lastUserChallenge.unlock_at // Date future pour le compte à rebours
        };
    }

    // --- SCÉNARIO 4 : PRÊT POUR LE SUIVANT ---
    const nextWeekNumber = lastUserChallenge.week_number + 1;

    // Récupérer le contenu du prochain défi
    let query = supabase
        .from('weekly_challenges')
        .select('*')
        .eq('week_number', nextWeekNumber);

    // Filtrage simple grâce à la nouvelle colonne 'challenge_type'
    // Soit c'est transversal, soit c'est spécifique à MON addiction
    query = query.or(`challenge_type.eq.transversal,and(challenge_type.eq.specific,addiction_type_id.eq.${profile.addiction_type_id})`);

    const { data: nextChallenge } = await query.maybeSingle();

    // Si pas de suite (fin du parcours), on renvoie le dernier complété
    if (!nextChallenge) {
        return {
            ...challengeData,
            userStatus: 'completed',
            unlockedAt: lastUserChallenge.completed_at || now.toISOString()
        };
    }

    // On propose le nouveau défi
    return {
        ...(nextChallenge as ChallengeRow),
        userStatus: 'none', // Prêt à être rejoint
        unlockedAt: now.toISOString()
    };

  } catch (error) {
    logger.error("Exception getCurrentChallenge", error);
    return null;
  }
}

export async function joinChallenge(challengeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    // Récupérer le numéro de semaine du défi
    const { data: challenge } = await supabase
        .from('weekly_challenges')
        .select('week_number')
        .eq('id', challengeId)
        .single();
        
    if (!challenge) return { success: false, error: "Défi introuvable" };

    const now = new Date();
    // Calcul précis de la date de déblocage (Maintenant + 7 jours)
    const unlockAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { error } = await supabase
        .from('user_challenges')
        .insert({
            user_id: user.id,
            challenge_id: challengeId,
            week_number: challenge.week_number,
            status: 'joined',
            started_at: now.toISOString(),
            unlock_at: unlockAt.toISOString() // On fige la date de fin ici !
        });

    if (error) {
        logger.error("Join challenge error", error);
        return { success: false };
    }

    revalidatePath('/challenges');
    return { success: true };
}

export async function completeChallenge(challengeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
        .from('user_challenges')
        .update({ 
            status: 'completed', 
            completed_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId);

    if (error) {
        logger.error("Complete challenge error", error);
        return { success: false };
    }
    
    revalidatePath('/challenges');
    return { success: true };
}