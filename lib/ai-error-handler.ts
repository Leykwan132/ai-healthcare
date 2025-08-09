// Comprehensive error handling for AI services

export interface AIErrorDetails {
  code: string;
  message: string;
  statusCode: number;
  retryable: boolean;
  timestamp: string;
  context?: Record<string, any>;
}

export class AIError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly timestamp: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'UNKNOWN_ERROR',
    retryable: boolean = false,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
    this.context = context;
  }

  toJSON(): AIErrorDetails {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      retryable: this.retryable,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}

// Error codes and their corresponding details
export const AI_ERROR_CODES = {
  MISSING_API_KEY: {
    message: 'API key not configured',
    statusCode: 500,
    retryable: false,
  },
  INVALID_API_KEY: {
    message: 'Invalid API key',
    statusCode: 401,
    retryable: false,
  },
  RATE_LIMIT: {
    message: 'API rate limit exceeded',
    statusCode: 429,
    retryable: true,
  },
  SERVER_ERROR: {
    message: 'API server error',
    statusCode: 500,
    retryable: true,
  },
  NETWORK_ERROR: {
    message: 'Network error occurred',
    statusCode: 503,
    retryable: true,
  },
  TIMEOUT_ERROR: {
    message: 'Request timeout',
    statusCode: 408,
    retryable: true,
  },
  INVALID_REQUEST: {
    message: 'Invalid request format',
    statusCode: 400,
    retryable: false,
  },
  QUOTA_EXCEEDED: {
    message: 'API quota exceeded',
    statusCode: 429,
    retryable: false,
  },
  MODEL_NOT_FOUND: {
    message: 'Specified model not found',
    statusCode: 400,
    retryable: false,
  },
  CONTENT_FILTER: {
    message: 'Content filtered by API',
    statusCode: 400,
    retryable: false,
  },
  INVALID_PROVIDER: {
    message: 'Invalid AI provider specified',
    statusCode: 400,
    retryable: false,
  },
} as const;

// Error handler factory
export function createAIError(
  code: keyof typeof AI_ERROR_CODES,
  context?: Record<string, any>
): AIError {
  const errorDetails = AI_ERROR_CODES[code];
  return new AIError(
    errorDetails.message,
    errorDetails.statusCode,
    code,
    errorDetails.retryable,
    context
  );
}

// Error handler for OpenAI API errors
export function handleOpenAIError(error: any, context?: Record<string, any>): AIError {
  console.error('OpenAI API error:', error);

  if (error instanceof AIError) {
    return error;
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return createAIError('INVALID_API_KEY', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return createAIError('RATE_LIMIT', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('500') || errorMessage.includes('server error')) {
      return createAIError('SERVER_ERROR', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return createAIError('TIMEOUT_ERROR', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
      return createAIError('QUOTA_EXCEEDED', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('model') || errorMessage.includes('not found')) {
      return createAIError('MODEL_NOT_FOUND', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('content') || errorMessage.includes('filter')) {
      return createAIError('CONTENT_FILTER', { ...context, provider: 'openai' });
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return createAIError('NETWORK_ERROR', { ...context, provider: 'openai' });
    }
  }

  // Default error
  return createAIError('SERVER_ERROR', { ...context, provider: 'openai' });
}

// Error handler for Groq API errors
export function handleGroqError(error: any, context?: Record<string, any>): AIError {
  console.error('Groq API error:', error);

  if (error instanceof AIError) {
    return error;
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return createAIError('INVALID_API_KEY', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return createAIError('RATE_LIMIT', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('500') || errorMessage.includes('server error')) {
      return createAIError('SERVER_ERROR', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return createAIError('TIMEOUT_ERROR', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
      return createAIError('QUOTA_EXCEEDED', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('model') || errorMessage.includes('not found')) {
      return createAIError('MODEL_NOT_FOUND', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('content') || errorMessage.includes('filter')) {
      return createAIError('CONTENT_FILTER', { ...context, provider: 'groq' });
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return createAIError('NETWORK_ERROR', { ...context, provider: 'groq' });
    }
  }

  // Default error
  return createAIError('SERVER_ERROR', { ...context, provider: 'groq' });
}

// Retry logic for retryable errors
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: AIError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Determine which error handler to use based on the error context
      const aiError = error instanceof AIError ? error : handleOpenAIError(error);
      lastError = aiError;
      
      if (!aiError.retryable || attempt === maxRetries) {
        throw aiError;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = delay * Math.pow(2, attempt - 1);
      console.log(`Retrying operation in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}

// Error logging utility
export function logAIError(error: AIError, additionalContext?: Record<string, any>) {
  const errorLog = {
    ...error.toJSON(),
    additionalContext,
    stack: error.stack,
  };
  
  console.error('AI Error Log:', JSON.stringify(errorLog, null, 2));
  
  // In a production environment, you might want to send this to a logging service
  // like Sentry, LogRocket, or a custom logging endpoint
}

// Error response formatter for API routes
export function formatErrorResponse(error: AIError) {
  return {
    error: error.message,
    code: error.code,
    statusCode: error.statusCode,
    retryable: error.retryable,
    timestamp: error.timestamp,
    ...(error.context && { context: error.context }),
  };
}
