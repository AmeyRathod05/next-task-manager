import { NextRequest, NextResponse } from 'next/server';
import { summarizeTask, improveTaskDescription, getAIServiceStatus } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { title, description, action } = await request.json();
    console.log('AI API - Request:', { title, description, action });

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    let result;
    let aiServiceUsed = 'unknown';

    if (action === 'summarize') {
      console.log('AI API - Calling unified summarizeTask...');
      result = await summarizeTask(title, description);
      console.log('AI API - Summarize result:', result);
    } else if (action === 'improve') {
      console.log('AI API - Calling unified improveTaskDescription...');
      result = await improveTaskDescription(title, description);
      console.log('AI API - Improve result:', result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const serviceStatus = getAIServiceStatus();
    aiServiceUsed = serviceStatus.primaryService;

    let response: any;
    
    if (action === 'summarize') {
      response = {
        summary: (result as any).summary,
        keyPoints: (result as any).keyPoints,
        estimatedTime: (result as any).estimatedTime,
        priority: (result as any).priority,
        aiService: aiServiceUsed,
        serviceStatus,
        message: `Using ${aiServiceUsed} AI service${aiServiceUsed === 'OpenAI' ? ' (GPT-3.5-turbo)' : ' (TinyLlama)'}`
      };
    } else {
      response = {
        improvedDescription: result,
        aiService: aiServiceUsed,
        serviceStatus,
        message: `Using ${aiServiceUsed} AI service${aiServiceUsed === 'OpenAI' ? ' (GPT-3.5-turbo)' : ' (TinyLlama)'}`
      };
    }
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process AI request', 
        details: error instanceof Error ? error.message : 'Unknown error',
        serviceStatus: getAIServiceStatus()
      },
      { status: 500 }
    );
  }
}
