import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/supabase';
import { CHALLENGES_DATA } from '@/lib/data/challenges-seed';

const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // 1. Récupérer les ID des addictions pour faire le lien
        const { data: addictionTypes, error: typesError } = await supabaseAdmin
            .from('addiction_types')
            .select('id, name');

        if (typesError || !addictionTypes) {
            return NextResponse.json({ error: "Impossible de lire les types d'addiction" }, { status: 500 });
        }

        const typeMap = new Map<string, string>();
        addictionTypes.forEach(t => typeMap.set(t.name.toLowerCase(), t.id));

        // Mapping manuel pour corriger les différences de nommage (JSON vs Base de données)
        const CORRECTION_MAP: Record<string, string> = {
            "porno": "pornographie",
            "ecrans": "réseaux sociaux", // Ajustez selon votre DB : "internet", "écrans", "jeux vidéo"...
            "drogues": "drogues"
        };

        let insertedCount = 0;
        const errors: string[] = [];

        // 2. Boucle d'insertion
        for (const challenge of CHALLENGES_DATA) {
            
            let addictionId: string | null = null;

            // Si c'est un défi spécifique, on cherche l'ID de l'addiction correspondante
            if (challenge.type === 'specific' && challenge.target_addiction !== 'Tous') {
                let lookupKey = challenge.target_addiction.toLowerCase();
                
                if (CORRECTION_MAP[lookupKey]) {
                    lookupKey = CORRECTION_MAP[lookupKey];
                }

                if (typeMap.has(lookupKey)) {
                    addictionId = typeMap.get(lookupKey) as string;
                } else {
                    errors.push(`Addiction inconnue: ${challenge.target_addiction} (Cherché: ${lookupKey}) (Semaine ${challenge.week_number})`);
                    continue; 
                }
            }

            // Tentative d'insertion
            const { error } = await supabaseAdmin
                .from('weekly_challenges')
                .insert({
                    week_number: challenge.week_number,
                    title: challenge.title,
                    description: challenge.description,
                    action_text: challenge.action_text,
                    scripture_text: challenge.scripture_text,
                    scripture_reference: challenge.scripture_reference,
                    addiction_type_id: addictionId,
                    // CORRECTION ICI : On force le type précis attendu par Supabase
                    challenge_type: challenge.type as 'specific' | 'transversal'
                });

            if (error) {
                // On log l'erreur mais on continue (pour ignorer les doublons éventuels)
                errors.push(`Erreur insert S${challenge.week_number} - ${challenge.target_addiction}: ${error.message}`);
            } else {
                insertedCount++;
            }
        }

        const availableNames = Array.from(typeMap.keys()).join(", ");

        return NextResponse.json({ 
            success: true, 
            message: `${insertedCount} nouveaux défis insérés.`,
            available_db_names: availableNames,
            errors: errors 
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}