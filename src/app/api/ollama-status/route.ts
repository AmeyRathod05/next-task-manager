import { NextRequest, NextResponse } from 'next/server';
import { ollamaClient } from '@/lib/ollama-ai';

export async function GET(request: NextRequest) {
  try {
    const isAvailable = await ollamaClient.isAvailable();
    
    return NextResponse.json({
      status: isAvailable ? 'connected' : 'disconnected',
      message: isAvailable 
        ? 'Ollama is running and TinyLlama model is available'
        : 'Ollama is not running or TinyLlama model is not available',
      instructions: !isAvailable ? [
        '1. Make sure Ollama is installed: https://ollama.com/download',
        '2. Start Ollama service: ollama serve',
        '3. Pull TinyLlama model: ollama pull tinyllama',
        '4. Verify installation: ollama list'
      ] : [],
      nextSteps: isAvailable ? [
        'AI summarization is ready to use',
        'Try clicking "AI Summary" on any task'
      ] : []
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check Ollama status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
