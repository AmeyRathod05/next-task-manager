// Unified AI service that tries OpenAI first, then falls back to Ollama
import { summarizeTask as summarizeWithOpenAI, improveTaskDescription as improveWithOpenAI } from './openai-ai';
import { summarizeTask as summarizeWithOllama, improveTaskDescription as improveWithOllama } from './ollama-ai';

export interface TaskSummary {
  summary: string;
  keyPoints: string[];
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
}

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

export async function summarizeTask(title: string, description?: string): Promise<TaskSummary> {
  console.log('Unified AI - Starting task summarization:', title);
  console.log('Unified AI - Environment:', { isProduction, hasOpenAIKey });

  try {
    // Try OpenAI first in production or when API key is available
    if (isProduction && hasOpenAIKey) {
      console.log('Unified AI - Trying OpenAI first...');
      return await summarizeWithOpenAI(title, description);
    }
    
    // Try Ollama for development/testing
    console.log('Unified AI - Trying Ollama...');
    return await summarizeWithOllama(title, description);
    
  } catch (error) {
    console.error('Unified AI - Primary AI service failed:', error);
    
    // Fallback to the other service
    try {
      if (isProduction && hasOpenAIKey) {
        console.log('Unified AI - Falling back to Ollama...');
        return await summarizeWithOllama(title, description);
      } else {
        console.log('Unified AI - Falling back to OpenAI...');
        return await summarizeWithOpenAI(title, description);
      }
    } catch (fallbackError) {
      console.error('Unified AI - Both AI services failed:', fallbackError);
      throw new Error('All AI services are unavailable');
    }
  }
}

export async function improveTaskDescription(title: string, description?: string): Promise<string> {
  console.log('Unified AI - Starting task description improvement:', title);
  console.log('Unified AI - Environment:', { isProduction, hasOpenAIKey });

  try {
    // Try OpenAI first in production or when API key is available
    if (isProduction && hasOpenAIKey) {
      console.log('Unified AI - Trying OpenAI first...');
      return await improveWithOpenAI(title, description);
    }
    
    // Try Ollama for development/testing
    console.log('Unified AI - Trying Ollama...');
    return await improveWithOllama(title, description);
    
  } catch (error) {
    console.error('Unified AI - Primary AI service failed:', error);
    
    // Fallback to the other service
    try {
      if (isProduction && hasOpenAIKey) {
        console.log('Unified AI - Falling back to Ollama...');
        return await improveWithOllama(title, description);
      } else {
        console.log('Unified AI - Falling back to OpenAI...');
        return await improveWithOpenAI(title, description);
      }
    } catch (fallbackError) {
      console.error('Unified AI - Both AI services failed:', fallbackError);
      throw new Error('All AI services are unavailable');
    }
  }
}

// Export the AI service status for monitoring
export function getAIServiceStatus() {
  return {
    isProduction,
    hasOpenAIKey,
    primaryService: (isProduction && hasOpenAIKey) ? 'OpenAI' : 'Ollama',
    fallbackService: (isProduction && hasOpenAIKey) ? 'Ollama' : 'OpenAI'
  };
}
