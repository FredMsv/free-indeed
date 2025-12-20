import { logger } from '@/lib/logger';
import { z } from 'zod';

type ActionResponse<T> = {
  data?: T;
  error?: string;
  success?: boolean;
};

/**
 * Wrapper universel pour Server Actions avec :
 * - Validation Zod automatique
 * - Gestion d'erreurs structurée (Try/Catch global)
 * - Logging automatique (Start/Success/Error)
 */
export function createAction<TInput, TOutput>(config: {
  name: string;
  schema: z.ZodSchema<TInput>;
  handler: (data: TInput) => Promise<TOutput>;
}) {
  return async (rawData: unknown): Promise<ActionResponse<TOutput>> => {
    const actionId = crypto.randomUUID(); // ID unique pour tracer la requête
    
    try {
      // 1. Validation Zod
      const validation = config.schema.safeParse(rawData);
      
      if (!validation.success) {
        const firstError = validation.error.issues[0];
        logger.warn({ 
          action: config.name, 
          actionId,
          error: firstError.message,
          path: firstError.path 
        }, 'Validation failed');
        
        return { error: firstError.message, success: false };
      }

      // 2. Exécution du handler
      logger.info({ action: config.name, actionId }, 'Action started');
      
      const result = await config.handler(validation.data);
      
      logger.info({ action: config.name, actionId }, 'Action succeeded');
      return { data: result, success: true };

    } catch (error: unknown) {
      // Gestion d'erreur robuste avec vérification de type
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      logger.error({ 
        action: config.name, 
        actionId,
        error: errorMessage,
        stack: errorStack
      }, 'Action failed critical');
      
      // On retourne le message d'erreur
      return { error: errorMessage, success: false };
    }
  };
}