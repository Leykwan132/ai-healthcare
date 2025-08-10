// Test utilities for AI configuration

import { validateOpenAIKey, testOpenAIConnection } from './ai';

export interface AITestResult {
  apiKeyConfigured: boolean;
  apiKeyValid: boolean;
  connectionWorking: boolean;
  errors: string[];
  timestamp: string;
}

export async function runAIConfigurationTest(): Promise<AITestResult> {
  const testResult: AITestResult = {
    apiKeyConfigured: false,
    apiKeyValid: false,
    connectionWorking: false,
    errors: [],
    timestamp: new Date().toISOString()
  };

  console.log('test')
  try {
    // Test 1: Check if API key is configured
    try {
      const isKeyConfigured = validateOpenAIKey();
      testResult.apiKeyConfigured = isKeyConfigured;
    } catch (error) {
      testResult.errors.push(`API Key Configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 2: Check if API key is valid (if configured)
    if (testResult.apiKeyConfigured) {
      try {
        const isConnected = await testOpenAIConnection();
        testResult.apiKeyValid = isConnected;
        testResult.connectionWorking = isConnected;
      } catch (error) {
        testResult.errors.push(`API Key Validation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return testResult;
  } catch (error) {
    testResult.errors.push(`Test execution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return testResult;
  }
}

export function getAITestRecommendations(testResult: AITestResult): string[] {
  const recommendations: string[] = [];

  if (!testResult.apiKeyConfigured) {
    recommendations.push('Set OPENAI_API_KEY in your environment variables (.env.local)');
  }

  if (testResult.apiKeyConfigured && !testResult.apiKeyValid) {
    recommendations.push('Verify your OpenAI API key is valid and has sufficient credits');
    recommendations.push('Check if your OpenAI account is active and not suspended');
  }

  if (testResult.apiKeyValid && !testResult.connectionWorking) {
    recommendations.push('Check network connectivity to OpenAI API');
    recommendations.push('Verify firewall settings allow outbound connections');
  }

  if (testResult.errors.length > 0) {
    recommendations.push('Review error logs for specific issues');
  }

  return recommendations;
}

export function formatAITestResult(testResult: AITestResult): string {
  const status = testResult.apiKeyConfigured && testResult.apiKeyValid && testResult.connectionWorking
    ? '✅ PASSED'
    : '❌ FAILED';

  let output = `AI Configuration Test ${status}\n`;
  output += `Timestamp: ${testResult.timestamp}\n\n`;

  output += `Test Results:\n`;
  output += `- API Key Configured: ${testResult.apiKeyConfigured ? '✅' : '❌'}\n`;
  output += `- API Key Valid: ${testResult.apiKeyValid ? '✅' : '❌'}\n`;
  output += `- Connection Working: ${testResult.connectionWorking ? '✅' : '❌'}\n`;

  if (testResult.errors.length > 0) {
    output += `\nErrors:\n`;
    testResult.errors.forEach(error => {
      output += `- ${error}\n`;
    });
  }

  const recommendations = getAITestRecommendations(testResult);
  if (recommendations.length > 0) {
    output += `\nRecommendations:\n`;
    recommendations.forEach(rec => {
      output += `- ${rec}\n`;
    });
  }

  return output;
}
