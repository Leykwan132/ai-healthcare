import { NextRequest, NextResponse } from 'next/server';
import { 
  testAIConnection, 
  validateOpenAIKey, 
  validateGroqKey, 
  createAICompletion,
  AIError 
} from '@/lib/ai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as 'openai' | 'groq' | null;

    const testResults = {
      openai: {
        apiKeyConfigured: false,
        apiKeyValid: false,
        connectionWorking: false,
        errors: [] as string[],
      },
      groq: {
        apiKeyConfigured: false,
        apiKeyValid: false,
        connectionWorking: false,
        errors: [] as string[],
      },
      timestamp: new Date().toISOString()
    };

    // Test OpenAI
    try {
      testResults.openai.apiKeyConfigured = validateOpenAIKey();
      testResults.openai.apiKeyValid = true;
    } catch (error) {
      if (error instanceof AIError) {
        testResults.openai.errors.push(`OpenAI Configuration: ${error.message}`);
      } else {
        testResults.openai.errors.push(`OpenAI Configuration: Unknown error`);
      }
    }

    if (testResults.openai.apiKeyValid) {
      try {
        testResults.openai.connectionWorking = await testAIConnection('openai');
      } catch (error) {
        if (error instanceof AIError) {
          testResults.openai.errors.push(`OpenAI Connection: ${error.message}`);
        } else {
          testResults.openai.errors.push(`OpenAI Connection: Unknown error`);
        }
      }
    }

    // Test Groq
    try {
      testResults.groq.apiKeyConfigured = validateGroqKey();
      testResults.groq.apiKeyValid = true;
    } catch (error) {
      if (error instanceof AIError) {
        testResults.groq.errors.push(`Groq Configuration: ${error.message}`);
      } else {
        testResults.groq.errors.push(`Groq Configuration: Unknown error`);
      }
    }

    if (testResults.groq.apiKeyValid) {
      try {
        testResults.groq.connectionWorking = await testAIConnection('groq');
      } catch (error) {
        if (error instanceof AIError) {
          testResults.groq.errors.push(`Groq Connection: ${error.message}`);
        } else {
          testResults.groq.errors.push(`Groq Connection: Unknown error`);
        }
      }
    }

    // If a specific provider was requested, test it with a completion
    let completionTest = null;
    if (provider && (provider === 'openai' || provider === 'groq')) {
      try {
        const testPrompt = 'Generate a simple greeting in one sentence.';
        const completion = await createAICompletion(testPrompt, provider, provider === 'openai' ? 'gpt-4o-mini' : 'llama3-8b-8192', 0.7, 50);
        completionTest = {
          provider,
          prompt: testPrompt,
          completion: completion.substring(0, 200), // Limit response length
          success: true
        };
      } catch (error) {
        const testPrompt = 'Generate a simple greeting in one sentence.';
        completionTest = {
          provider,
          prompt: testPrompt,
          error: error instanceof AIError ? error.message : 'Unknown error',
          success: false
        };
      }
    }

    // Determine overall status
    const hasWorkingProvider = testResults.openai.connectionWorking || testResults.groq.connectionWorking;
    const statusCode = hasWorkingProvider ? 200 : 500;

    const response = {
      success: hasWorkingProvider,
      providers: testResults,
      completionTest,
      recommendations: getRecommendations(testResults),
      timestamp: testResults.timestamp
    };

    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('AI test error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during AI testing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getRecommendations(testResults: any) {
  const recommendations = [];

  // OpenAI recommendations
  if (!testResults.openai.apiKeyValid) {
    recommendations.push({
      provider: 'openai',
      issue: 'OpenAI API key not configured',
      solution: 'Set OPENAI_API_KEY in your environment variables (.env.local)',
      example: 'OPENAI_API_KEY=your_openai_api_key_here'
    });
  }

  if (!testResults.openai.connectionWorking && testResults.openai.apiKeyValid) {
    recommendations.push({
      provider: 'openai',
      issue: 'OpenAI connection failed',
      solution: 'Check your OpenAI API key and internet connection',
      details: testResults.openai.errors.join(', ')
    });
  }

  // Groq recommendations
  if (!testResults.groq.apiKeyValid) {
    recommendations.push({
      provider: 'groq',
      issue: 'Groq API key not configured',
      solution: 'Set GROQ_API_KEY in your environment variables (.env.local)',
      example: 'GROQ_API_KEY=your_groq_api_key_here'
    });
  }

  if (!testResults.groq.connectionWorking && testResults.groq.apiKeyValid) {
    recommendations.push({
      provider: 'groq',
      issue: 'Groq connection failed',
      solution: 'Check your Groq API key and internet connection',
      details: testResults.groq.errors.join(', ')
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      message: 'All AI providers are working correctly!',
      nextSteps: [
        'Test completions by adding ?provider=openai or ?provider=groq to the URL',
        'Use the /api/ai/prescription endpoint for prescription parsing',
        'Check the documentation in docs/ai-integration.md'
      ]
    });
  }

  return recommendations;
}
