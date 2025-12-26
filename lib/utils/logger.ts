export const logger = {
    error: (message: string, error: unknown, context?: Record<string, unknown>) => {
      console.error(JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...context
      }, null, 2));
    },
  
    info: (message: string, context?: Record<string, unknown>) => {
      console.log(JSON.stringify({
        level: 'INFO',
        timestamp: new Date().toISOString(),
        message,
        ...context
      }, null, 2));
    }
  };