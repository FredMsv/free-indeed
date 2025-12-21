export function mapSupabaseError(error: any): string {
    const errorMap: Record<string, string> = {
      'User already registered': 'Cet email possède déjà un compte',
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 8 caractères',
      'Signups not allowed': 'Les inscriptions sont temporairement désactivées',
      'Email rate limit exceeded': 'Trop de tentatives. Réessayez dans 1 heure',
      'Invalid email': 'Format d\'email invalide',
    };
    
    const message = error?.message || '';
    
    // Recherche par correspondance exacte
    if (errorMap[message]) {
      return errorMap[message];
    }
    
    // Recherche par inclusion (pour les messages dynamiques)
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key)) {
        return value;
      }
    }
    
    // Erreur réseau
    if (message.includes('fetch') || message.includes('network')) {
      return 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    }
    
    // Fallback
    return 'Une erreur est survenue. Veuillez réessayer.';
  }