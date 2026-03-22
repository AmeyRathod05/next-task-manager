// OpenAI integration for production deployment on Vercel
import OpenAI from 'openai';

export interface TaskSummary {
  summary: string;
  keyPoints: string[];
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
}

class OpenAIClient {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }

  public async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes tasks and provides comprehensive summaries. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.log('OpenAI API key not found');
        return false;
      }

      const response = await this.getClient().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5,
      });

      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI availability check failed:', error);
      return false;
    }
  }
}

const openaiClient = new OpenAIClient();

export { openaiClient };

export async function summarizeTask(title: string, description?: string): Promise<TaskSummary> {
  console.log('OpenAI AI - Processing task:', title);
  
  try {
    const isOpenAIAvailable = await openaiClient.isAvailable();
    
    if (!isOpenAIAvailable) {
      console.log('OpenAI not available, falling back to rule-based AI');
      return await fallbackSummarizeTask(title, description);
    }

    const taskContent = `Title: ${title}\n${description ? `Description: ${description}` : ''}`;
    console.log('OpenAI AI - Full task content being processed:', taskContent);
    
    const prompt = `Analyze this task and provide a comprehensive summary in JSON format:

Task Title: ${title}
Task Description: ${description || 'No description provided'}

Please read the ENTIRE description above and provide a detailed analysis. Return a JSON object with:
{
  "summary": "A comprehensive 2-3 sentence summary that captures main requirements and goals",
  "keyPoints": [
    "4-6 specific, actionable key points based on the full description",
    "Each point should be a complete sentence with specific actions",
    "Focus on technical requirements, UI improvements, and implementation steps"
  ],
  "estimatedTime": "Realistic time estimate based on complexity described",
  "priority": "Appropriate priority level (low/medium/high) based on urgency and importance"
}

Important guidelines:
- Read the COMPLETE description, don't truncate
- Extract specific technical details and requirements
- Create actionable implementation steps
- Consider both frontend and backend aspects if mentioned
- Provide realistic time estimates
- Ensure valid JSON format with proper quotes and commas`;

    console.log('OpenAI AI - Full prompt being sent:', prompt);

    const response = await openaiClient.generateResponse(prompt);
    
    // Try to parse JSON from response
    let aiResponse;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        aiResponse = JSON.parse(response);
      }
      
      console.log('OpenAI AI - Parsed AI response:', aiResponse);
      console.log('OpenAI AI - keyPoints type:', typeof aiResponse.keyPoints);
      console.log('OpenAI AI - keyPoints value:', aiResponse.keyPoints);
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw response:', response);
      return await fallbackSummarizeTask(title, description);
    }

    return {
      summary: aiResponse.summary || 'No summary available',
      keyPoints: Array.isArray(aiResponse.keyPoints) 
        ? aiResponse.keyPoints.map((point: any) => 
            typeof point === 'string' ? point : 
            typeof point === 'object' ? point.description || point.actionable || JSON.stringify(point) : 
            String(point)
          )
        : [],
      estimatedTime: aiResponse.estimatedTime || 'Unknown',
      priority: aiResponse.priority || 'medium'
    };

  } catch (error) {
    console.error('OpenAI summarization failed:', error);
    return await fallbackSummarizeTask(title, description);
  }
}

export async function improveTaskDescription(title: string, description?: string): Promise<string> {
  try {
    const isOpenAIAvailable = await openaiClient.isAvailable();
    
    if (!isOpenAIAvailable) {
      return `Task: ${title}\n\nDescription: ${description || 'No description provided'}\n\nRequirements:\n- Clearly define success criteria\n- Identify necessary resources\n- Establish timeline and milestones\n- Plan for testing and validation`;
    }

    const taskContent = `Title: ${title}\n${description ? `Description: ${description}` : ''}`;
    
    const prompt = `Improve this task description to make it clearer and more actionable. Keep it concise and practical.

Task: ${taskContent}

Provide an improved description that includes:
- Clear objectives
- Specific requirements
- Actionable steps
- Success criteria

Keep the response under 150 words.`;

    const response = await openaiClient.generateResponse(prompt);
    return response.trim();

  } catch (error) {
    console.error('OpenAI description improvement failed:', error);
    return `Task: ${title}\n\nDescription: ${description || 'No description provided'}\n\nRequirements:\n- Clearly define success criteria\n- Identify necessary resources\n- Establish timeline and milestones\n- Plan for testing and validation`;
  }
}

// Fallback rule-based summarization
async function fallbackSummarizeTask(title: string, description?: string): Promise<TaskSummary> {
  const taskContent = `${title} ${description || ''}`.toLowerCase();
  
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (taskContent.includes('urgent') || taskContent.includes('critical') || taskContent.includes('asap')) {
    priority = 'high';
  } else if (taskContent.includes('low') || taskContent.includes('minor') || taskContent.includes('later')) {
    priority = 'low';
  }
  
  let estimatedTime = 'Unknown';
  if (taskContent.includes('quick') || taskContent.includes('simple') || taskContent.includes('easy')) {
    estimatedTime = '30 minutes';
  } else if (taskContent.includes('complex') || taskContent.includes('detailed') || taskContent.includes('research')) {
    estimatedTime = '2-4 hours';
  } else if (taskContent.includes('large') || taskContent.includes('multiple') || taskContent.includes('comprehensive')) {
    estimatedTime = '1-2 days';
  } else if (taskContent.includes('ui') || taskContent.includes('responsive') || taskContent.includes('design')) {
    estimatedTime = '2-3 hours';
  } else {
    estimatedTime = '1-2 hours';
  }
  
  const keyPoints: string[] = [];
  
  if (description) {
    // Split description into sentences and create action points
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((sentence, index) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20) {
        const actionWords = ['improve', 'implement', 'create', 'update', 'fix', 'design', 'optimize', 'enhance', 'refactor', 'build', 'develop', 'test', 'review'];
        const hasAction = actionWords.some(word => trimmed.toLowerCase().includes(word));
        
        if (hasAction) {
          keyPoints.push(`• ${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}`);
        } else if (index < 5) { // Allow more points for longer descriptions
          keyPoints.push(`• ${trimmed.charAt(0).toUpperCase() + trimmed.slice(1)}`);
        }
      }
    });
    
    // If no key points were generated, create generic ones based on content
    if (keyPoints.length === 0) {
      if (taskContent.includes('ui') || taskContent.includes('responsive')) {
        keyPoints.push(`• Analyze current UI layout and identify responsive issues`);
        keyPoints.push(`• Implement responsive design improvements for mobile/tablet`);
        keyPoints.push(`• Update CSS/Tailwind classes for better breakpoints`);
        keyPoints.push(`• Test UI across different screen sizes and devices`);
      } else {
        keyPoints.push(`• Review and analyze task: ${title}`);
        keyPoints.push(`• Identify key requirements and dependencies`);
        keyPoints.push(`• Create an action plan and timeline`);
        keyPoints.push(`• Execute task with quality assurance`);
      }
    }
    
    // Ensure we have at least 4-6 points
    if (keyPoints.length < 4) {
      keyPoints.push(`• Test implementation thoroughly`);
      keyPoints.push(`• Document changes and updates`);
    }
  } else {
    keyPoints.push(`• Complete task: ${title}`);
    keyPoints.push(`• Ensure all requirements are met`);
    keyPoints.push(`• Test and validate solution`);
    keyPoints.push(`• Document implementation`);
  }
  
  const summary = `This task involves ${title.toLowerCase()}. ${description ? `The main focus is on ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}.` : 'No detailed description provided.'}`;
  
  return {
    summary: summary.trim(),
    keyPoints: keyPoints.slice(0, 6),
    estimatedTime,
    priority
  };
}
