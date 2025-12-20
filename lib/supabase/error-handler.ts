export class SupabaseError extends Error {
    constructor(
      public code: string,
      public message: string,
      public statusCode: number
    ) {
      super(message);
      this.name = 'SupabaseError';
    }
  }
  
  // Interface pour typer "lâchement" ce qui ressemble à une erreur API
  interface SupabaseErrorLike {
    message?: string;
    code?: string;
    status?: number;
  }
  
  export function handleSupabaseError(error: unknown): never {
    // ✅ CORRECTION : On cast 'unknown' vers notre interface partielle pour lire les propriétés
    const err = error as SupabaseErrorLike;
    const message = err?.message || 'Une erreur inconnue est survenue';
    const code = err?.code || 'UNKNOWN';
    const status = err?.status || 500;
  
    // Erreurs réseau / Fetch
    if (message.includes('fetch') || message.includes('network')) {
      throw new SupabaseError(
        'NETWORK_ERROR',
        'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        503
      );
    }
  
    // Erreurs Auth Supabase spécifiques
    // 23505 = unique_violation (Postgres)
    if (message.includes('already registered') || code === '23505') { 
      throw new SupabaseError(
        'EMAIL_EXISTS',
        'Cet email ou ce pseudo possède déjà un compte.',
        400
      );
    }
  
    if (message.includes('Invalid login credentials')) {
      throw new SupabaseError(
        'INVALID_CREDENTIALS',
        'Email ou mot de passe incorrect.',
        401
      );
    }
  
    // Erreur Rate Limit
    if (status === 429 || message.includes('rate limit')) {
      throw new SupabaseError(
        'RATE_LIMIT',
        'Trop de tentatives. Veuillez patienter quelques minutes.',
        429
      );
    }
  
    // Erreur par défaut
    console.error('Unhandled Supabase Error:', error);
    throw new SupabaseError(
      'UNKNOWN_ERROR',
      message,
      500
    );
  }