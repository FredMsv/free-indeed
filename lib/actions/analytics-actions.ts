"use server";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { getStatsData, getVulnerabilityData } from "./stats-actions";
import { EnrichedUserAnalytics, PredictionInsight, RiskFactor } from "@/lib/types/analytics";

export async function getEnrichedUserContext(): Promise<EnrichedUserAnalytics | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  try {
    // Récupération des données de base de la Phase 1
    const [stats, vulnerability] = await Promise.all([
      getStatsData('30d'),
      getVulnerabilityData()
    ]);

    if (!stats) return null;

    // 1. CALCUL DE LA PRÉDICTION DE RISQUE
    const factors: RiskFactor[] = [];
    let riskScore = 0;

    // Facteur Engagement (Pledge)
    if (stats.kpi.successRate < 70) {
      factors.push({ 
        label: "Engagement irrégulier", 
        intensity: 'high', 
        description: "Moins de 70% de vos journées sont validées." 
      });
      riskScore += 35;
    }

    // Facteur Émotionnel (Journaux de lutte)
    if (stats.kpi.contextCounts.struggle > 3) {
      factors.push({ 
        label: "Tension émotionnelle", 
        intensity: 'medium', 
        description: "Plusieurs moments de lutte rapportés récemment." 
      });
      riskScore += 25;
    }

    const prediction: PredictionInsight = {
      score: Math.min(riskScore, 100),
      level: riskScore > 60 ? 'danger' : riskScore > 30 ? 'caution' : 'stable',
      factors,
      advice: riskScore > 60 
        ? "Le risque est élevé. Appelez un contact SOS." 
        : "Maintenez vos habitudes de prière et de journalisation."
    };

    // 2. CALCUL DU SCORE DE SANTÉ GLOBAL
    const health = {
      total: Math.round((stats.kpi.successRate * 0.6) + (Math.min(stats.kpi.prayersAsked * 10, 40))),
      constance: stats.kpi.successRate,
      emotional: 75, // Placeholder jusqu'à l'implémentation de la volatilité
      spiritual: Math.min(stats.kpi.prayersAsked * 20, 100),
      trend: 'stable' as const
    };

    return {
      health,
      prediction,
      patterns: {
        topTriggerCombo: vulnerability?.topTrigger?.name || "Non identifié",
        criticalWindow: "Calcul en cours..."
      }
    };

  } catch (error) {
    logger.error("Enriched Analytics Error", error);
    return null;
  }
}