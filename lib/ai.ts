import { OpenAI } from 'openai';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { 
  AIError, 
  createAIError, 
  handleOpenAIError, 
  handleGroqError,
  withRetry, 
  logAIError,
  formatErrorResponse 
} from './ai-error-handler';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Provider types
export type AIProvider = 'openai' | 'groq';

// Validate OpenAI API key
export function validateOpenAIKey(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw createAIError('MISSING_API_KEY', { provider: 'openai' });
  }
  if (apiKey === 'your_openai_api_key_here' || apiKey.length < 10) {
    throw createAIError('INVALID_API_KEY', { provider: 'openai' });
  }
  return true;
}

// Validate Groq API key
export function validateGroqKey(): boolean {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw createAIError('MISSING_API_KEY', { provider: 'groq' });
  }
  if (apiKey === 'your_groq_api_key_here' || apiKey.length < 10) {
    throw createAIError('INVALID_API_KEY', { provider: 'groq' });
  }
  return true;
}

// Create AI completion with retry logic (supports both OpenAI and Groq)
export async function createAICompletion(
  prompt: string,
  provider: AIProvider = 'openai',
  model: string = provider === 'openai' ? 'gpt-4o-mini' : 'llama3-8b-8192',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      if (provider === 'openai') {
        return await createOpenAICompletion(prompt, model, temperature, maxTokens);
      } else if (provider === 'groq') {
        return await createGroqCompletion(prompt, model, temperature, maxTokens);
      } else {
        throw createAIError('INVALID_PROVIDER', { provider });
      }
    } catch (error) {
      const aiError = provider === 'openai' 
        ? handleOpenAIError(error, { model, temperature, maxTokens })
        : handleGroqError(error, { model, temperature, maxTokens });
      logAIError(aiError, { prompt, provider, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Create OpenAI completion with retry logic
export async function createOpenAICompletion(
  prompt: string,
  model: string = 'gpt-4o-mini',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      // Validate API key
      validateOpenAIKey();

      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
        stream: false,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      const aiError = handleOpenAIError(error, { model, temperature, maxTokens });
      logAIError(aiError, { prompt, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Create Groq completion with retry logic
export async function createGroqCompletion(
  prompt: string,
  model: string = 'llama3-8b-8192',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      // Validate API key
      validateGroqKey();

      const result = await generateText({
        model: groq(model),
        prompt,
        temperature,
        maxOutputTokens: maxTokens,
      });

      return result.text;
    } catch (error) {
      const aiError = handleGroqError(error, { model, temperature, maxTokens });
      logAIError(aiError, { prompt, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Create AI stream for chat completions with retry logic (supports both providers)
export async function createAIStream(
  messages: any[],
  provider: AIProvider = 'openai',
  model: string = provider === 'openai' ? 'gpt-4o-mini' : 'llama3-8b-8192',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      if (provider === 'openai') {
        return await createOpenAIStream(messages, model, temperature, maxTokens);
      } else if (provider === 'groq') {
        return await createGroqStream(messages, model, temperature, maxTokens);
      } else {
        throw createAIError('INVALID_PROVIDER', { provider });
      }
    } catch (error) {
      const aiError = provider === 'openai' 
        ? handleOpenAIError(error, { model, temperature, maxTokens })
        : handleGroqError(error, { model, temperature, maxTokens });
      logAIError(aiError, { messages, provider, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Create OpenAI stream for chat completions with retry logic
export async function createOpenAIStream(
  messages: any[],
  model: string = 'gpt-4o-mini',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      // Validate API key
      validateOpenAIKey();

      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      // Convert the response to a ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } catch (error) {
      const aiError = handleOpenAIError(error, { model, temperature, maxTokens });
      logAIError(aiError, { messages, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Create Groq stream for chat completions with retry logic
export async function createGroqStream(
  messages: any[],
  model: string = 'llama3-8b-8192',
  temperature: number = 0.7,
  maxTokens: number = 1000
) {
  return withRetry(async () => {
    try {
      // Validate API key
      validateGroqKey();

      const result = await generateText({
        model: groq(model),
        messages,
        temperature,
        maxOutputTokens: maxTokens,
      });

      // Convert the result to a ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(result.text));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    } catch (error) {
      const aiError = handleGroqError(error, { model, temperature, maxTokens });
      logAIError(aiError, { messages, model, temperature, maxTokens });
      throw aiError;
    }
  });
}

// Test OpenAI connection with error handling
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    validateOpenAIKey();
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });
    
    return !!response.choices[0]?.message?.content;
  } catch (error) {
    const aiError = handleOpenAIError(error, { testType: 'connection' });
    logAIError(aiError, { testType: 'connection' });
    return false;
  }
}

// Test Groq connection with error handling
export async function testGroqConnection(): Promise<boolean> {
  try {
    validateGroqKey();
    
    const result = await generateText({
      model: groq('llama3-8b-8192'),
      prompt: 'Hello',
      maxOutputTokens: 5,
    });
    
    return !!result.text;
  } catch (error) {
    const aiError = handleGroqError(error, { testType: 'connection' });
    logAIError(aiError, { testType: 'connection' });
    return false;
  }
}

// Test AI connection (supports both providers)
export async function testAIConnection(provider: AIProvider = 'openai'): Promise<boolean> {
  if (provider === 'openai') {
    return await testOpenAIConnection();
  } else if (provider === 'groq') {
    return await testGroqConnection();
  } else {
    throw createAIError('INVALID_PROVIDER', { provider });
  }
}

// Export error handling utilities for use in API routes
export { AIError, createAIError, handleOpenAIError, handleGroqError, logAIError, formatErrorResponse };
