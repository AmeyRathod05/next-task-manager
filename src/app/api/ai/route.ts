import { NextRequest, NextResponse } from 'next/server';
import { summarizeTask, improveTaskDescription } from '@/lib/ollama-ai';

export async function POST(request: NextRequest) {
  try {
    const { title, description, action } = await request.json();
    console.log('AI API - Request:', { title, description, action });

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let result;
    let usedOllama = true;

    if (action === 'summarize') {
      console.log('AI API - Calling Ollama summarizeTask...');
      result = await summarizeTask(title, description);
      console.log('AI API - Ollama Summarize result:', result);
    } else if (action === 'improve') {
      console.log('AI API - Calling Ollama improveTaskDescription...');
      result = await improveTaskDescription(title, description);
      console.log('AI API - Ollama Improve result:', result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    let response: any;
    
    if (action === 'summarize') {
      response = {
        summary: (result as any).summary,
        keyPoints: (result as any).keyPoints,
        estimatedTime: (result as any).estimatedTime,
        priority: (result as any).priority,
        usedOllama,
        message: usedOllama ? 'Using Ollama AI (TinyLlama)' : 'Using fallback AI service'
      };
    } else {
      response = {
        improvedDescription: result,
        usedOllama,
        message: usedOllama ? 'Using Ollama AI (TinyLlama)' : 'Using fallback AI service'
      };
    }
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
