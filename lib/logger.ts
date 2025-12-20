import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  browser: {
    asObject: true, // Pour un affichage propre côté client si utilisé
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  // 🔒 SÉCURITÉ : Masquage automatique des champs sensibles dans les logs
  redact: {
    paths: [
      'password', 
      'confirmPassword', 
      'token', 
      'access_token', 
      'refresh_token', 
      'email', 
      '*.password', 
      '*.email'
    ],
    remove: true,
  },
  // Note : Nous avons retiré 'transport: pino-pretty' car il cause des crashs
  // avec Next.js Turbopack. Les logs seront en JSON (standard industriel).
});

export { logger };