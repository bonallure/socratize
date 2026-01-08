import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Message } from '../types';

// Mock @google/genai - use vi.hoisted to ensure mockGenerateContent is available during mock creation
const { mockGenerateContent } = vi.hoisted(() => {
  return {
    mockGenerateContent: vi.fn(),
  };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models: { generateContent: any };
      constructor(_options?: any) {
        this.models = { generateContent: mockGenerateContent };
      }
    },
  };
});

import { sendMessageToTutor, generateProblemSteps } from './geminiService';

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send message to tutor', async () => {
    const mockResponse = { text: 'Mocked tutor response' };
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const messages: Message[] = [
      { id: '1', timestamp: Date.now(), role: 'user', content: 'Explain photosynthesis' },
    ];

    console.log('=== DEBUG: Mock Response Object ===');
    console.log('Full response:', JSON.stringify(mockResponse, null, 2));
    console.log('Response.text:', mockResponse.text);

    const result = await sendMessageToTutor(messages);

    console.log('=== DEBUG: Function Result ===');
    console.log('Tutor Response:', result);
    console.log('Mock was called with:', mockGenerateContent.mock.calls[0]);

    expect(result).toBe('Mocked tutor response');
    expect(mockGenerateContent).toHaveBeenCalledOnce();
  });

  it('should generate problem steps', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify([
        'Understand the problem',
        'Identify knowns and unknowns',
        'Apply the formula',
        'Verify the result',
      ]),
    });

    const steps = await generateProblemSteps('Solve x + 2 = 5');
    expect(steps).toEqual([
      'Understand the problem',
      'Identify knowns and unknowns',
      'Apply the formula',
      'Verify the result',
    ]);
    expect(mockGenerateContent).toHaveBeenCalledOnce();
  });

  it('should handle full workflow: generate steps then send message', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify([
        'Step 1: Read the problem',
        'Step 2: Identify variables',
        'Step 3: Solve equation',
        'Step 4: Verify solution',
      ]),
    });

    mockGenerateContent.mockResolvedValueOnce({
      text: 'Tutor confirmed the steps are correct',
    });

    const problem = 'Solve y + 3 = 10';
    const steps = await generateProblemSteps(problem);

    const messages: Message[] = steps.map((step, index) => ({
      id: `${index + 1}`,
      timestamp: Date.now(),
      role: 'user',
      content: step,
    }));

    const tutorResponse = await sendMessageToTutor(messages);
    expect(tutorResponse).toBe('Tutor confirmed the steps are correct');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });
});
