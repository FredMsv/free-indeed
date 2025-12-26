export class AppError extends Error {
    constructor(message: string, public code?: string) {
      super(message);
      this.name = 'AppError';
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string, public originalError?: unknown) {
      super(message, 'DATABASE_ERROR');
      this.name = 'DatabaseError';
    }
  }
  
  export class ActionError extends AppError {
    constructor(message: string) {
      super(message, 'ACTION_ERROR');
      this.name = 'ActionError';
    }
  }