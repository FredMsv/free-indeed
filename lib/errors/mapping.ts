export function mapAuthError(error: Error | null): string {
    if (!error) return "";
  
    const message = error.message.toLowerCase();
  
    // Erreurs d'inscription
    if (message.includes("already registered") || message.includes("unique constraint")) {
      return "Cet email ou ce pseudo est déjà utilisé.";
    }
    
    // Erreurs de connexion
    if (message.includes("invalid login credentials")) {
      return "Email ou mot de passe incorrect.";
    }
    if (message.includes("email not confirmed")) {
      return "Veuillez confirmer votre email avant de vous connecter.";
    }
  
    // Erreurs de mot de passe
    if (message.includes("password should be at least")) {
      return "Le mot de passe est trop court.";
    }
  
    // Erreurs réseau / Rate limit
    if (message.includes("rate limit")) {
      return "Trop de tentatives. Veuillez patienter quelques minutes.";
    }
    if (message.includes("fetch") || message.includes("network")) {
      return "Erreur de connexion internet.";
    }
  
    // Par défaut
    return "Une erreur est survenue. Veuillez réessayer.";
  }