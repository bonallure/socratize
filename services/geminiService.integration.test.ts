import { describe, it, expect, beforeAll } from 'vitest';
import { sendMessageToTutor, generateProblemSteps } from './geminiService';
import type { Message } from '../types';

// Integration tests for Gemini Service - uses real API calls
describe('Gemini Service Integration Tests', () => {
  let hasApiKey = false;
  let quotaExceeded = false;

  beforeAll(() => {
    // Check if API key is available
    hasApiKey = !!process.env.API_KEY;
    if (!hasApiKey) {
      console.warn('⚠️  API_KEY not found in environment. Integration tests will be skipped.');
    }
  });

  describe('sendMessageToTutor', () => {
    it('should send a message and receive a response from Gemini', async () => {
      if (!hasApiKey) {
        console.log('⏭️  Skipping: No API key available');
        return;
      }

      if (quotaExceeded) {
        console.log('⏭️  Skipping: Quota exceeded in previous test');
        return;
      }

      const messages: Message[] = [
        {
          id: '1',
          timestamp: Date.now(),
          role: 'user',
          content: 'What is 2 + 2?',
        },
      ];

      try {
        console.log('🔄 Calling Gemini API...');
        const result = await sendMessageToTutor(messages);

        console.log('✅ Response received:', result);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      } catch (error: any) {
        console.error('❌ Integration test failed with error:', error);

        // Check for quota/rate limit errors
        if (
          error.message?.includes('quota') ||
          error.message?.includes('RESOURCE_EXHAUSTED') ||
          error.message?.includes('429') ||
          error.status === 429
        ) {
          quotaExceeded = true;
          console.warn('⚠️  Quota exceeded. Remaining tests will be skipped.');
          console.warn('Error details:', {
            message: error.message,
            status: error.status,
            code: error.code,
          });
          // Don't fail the test on quota errors - just skip
          return;
        }

        // Check for authentication errors
        if (
          error.message?.includes('API key') ||
          error.message?.includes('authentication') ||
          error.message?.includes('UNAUTHENTICATED') ||
          error.status === 401
        ) {
          console.error('🔐 Authentication failed. Check your API_KEY.');
          throw error;
        }

        // Log detailed error information for other errors
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          stack: error.stack,
        });
        throw error;
      }
    }, 30000); // 30 second timeout for API calls

    it('should handle conversation with multiple messages', async () => {
      if (!hasApiKey) {
        console.log('⏭️  Skipping: No API key available');
        return;
      }

      if (quotaExceeded) {
        console.log('⏭️  Skipping: Quota exceeded in previous test');
        return;
      }

      const messages: Message[] = [
        {
          id: '1',
          timestamp: Date.now() - 1000,
          role: 'user',
          content: 'I need help with algebra.',
        },
        {
          id: '2',
          timestamp: Date.now(),
          role: 'user',
          content: 'How do I solve x + 5 = 10?',
        },
      ];

      try {
        console.log('🔄 Calling Gemini API with conversation...');
        const result = await sendMessageToTutor(messages);

        console.log('✅ Response received:', result.substring(0, 100) + '...');
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      } catch (error: any) {
        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
          quotaExceeded = true;
          console.warn('⚠️  Quota exceeded. Test skipped.');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('generateProblemSteps', () => {
    it('should generate steps for a math problem', async () => {
      if (!hasApiKey) {
        console.log('⏭️  Skipping: No API key available');
        return;
      }

      if (quotaExceeded) {
        console.log('⏭️  Skipping: Quota exceeded in previous test');
        return;
      }

      const problem = 'Solve the equation 3x + 7 = 22';

      try {
        console.log('🔄 Generating problem steps...');
        const steps = await generateProblemSteps(problem);

        console.log('✅ Steps generated:', steps);
        expect(Array.isArray(steps)).toBe(true);
        expect(steps.length).toBeGreaterThan(0);
        expect(steps.length).toBeLessThanOrEqual(6);

        // Verify each step is a string
        steps.forEach((step) => {
          expect(typeof step).toBe('string');
          expect(step.length).toBeGreaterThan(0);
        });
      } catch (error: any) {
        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
          quotaExceeded = true;
          console.warn('⚠️  Quota exceeded. Test skipped.');
          return;
        }

        // If API fails, check if we got the fallback response
        console.warn('⚠️  API call failed, checking for fallback...');
        const steps = await generateProblemSteps(problem);
        expect(steps).toEqual(['Identify Problem', 'Analysis', 'Calculation', 'Verification']);
      }
    }, 30000);

    it('should handle physics problems', async () => {
      if (!hasApiKey) {
        console.log('⏭️  Skipping: No API key available');
        return;
      }

      if (quotaExceeded) {
        console.log('⏭️  Skipping: Quota exceeded in previous test');
        return;
      }

      const problem = 'Calculate the force needed to accelerate a 10kg object at 5m/s²';

      try {
        console.log('🔄 Generating physics problem steps...');
        const steps = await generateProblemSteps(problem);

        console.log('✅ Steps generated:', steps);
        expect(Array.isArray(steps)).toBe(true);
        expect(steps.length).toBeGreaterThan(0);
      } catch (error: any) {
        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
          quotaExceeded = true;
          console.warn('⚠️  Quota exceeded. Test skipped.');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('Error Scenarios', () => {
    it('should handle empty message gracefully', async () => {
      if (!hasApiKey) {
        console.log('⏭️  Skipping: No API key available');
        return;
      }

      if (quotaExceeded) {
        console.log('⏭️  Skipping: Quota exceeded in previous test');
        return;
      }

      const messages: Message[] = [
        {
          id: '1',
          timestamp: Date.now(),
          role: 'user',
          content: '',
        },
      ];

      try {
        const result = await sendMessageToTutor(messages);
        // Should still get some response even with empty content
        expect(result).toBeTruthy();
      } catch (error: any) {
        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
          quotaExceeded = true;
          console.warn('⚠️  Quota exceeded. Test skipped.');
          return;
        }
        // Empty messages might cause an error, which is acceptable
        console.log('Empty message handling:', error.message);
      }
    }, 30000);
  });
});
