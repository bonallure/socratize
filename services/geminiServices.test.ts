import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Message } from '../types';

// Mock @google/genai
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models: { generateContent: any };
      constructor(_options?: any) {
        // Always return an object with text
        this.models = { generateContent: vi.fn().mockResolvedValue({ text: '' }) };
      }
    },
  };
});

import { sendMessageToTutor, generateProblemSteps } from './geminiService';
import { GoogleGenAI } from '@google/genai';

describe('Gemini Service', () => {
  let aiInstance: any;
  let generateContentMock: any;

  beforeEach(() => {
    aiInstance = new GoogleGenAI({ apiKey: 'dummy' });
    generateContentMock = aiInstance.models.generateContent;
    vi.clearAllMocks();
  });

  it('should send message to tutor', async () => {
    generateContentMock.mockResolvedValueOnce({ text: 'Mocked tutor response' });

    const messages: Message[] = [
      { id: '1', timestamp: Date.now(), role: 'user', content: 'Explain photosynthesis' },
    ];

    const result = await sendMessageToTutor(messages, aiInstance);
    expect(result).toBe('Mocked tutor response');
    expect(generateContentMock).toHaveBeenCalledOnce();
  });

  it('should generate problem steps', async () => {
    generateContentMock.mockResolvedValueOnce({
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
    expect(generateContentMock).toHaveBeenCalledOnce();
  });

  it('should handle full workflow: generate steps then send message', async () => {
    generateContentMock.mockResolvedValueOnce({
      text: JSON.stringify([
        'Step 1: Read the problem',
        'Step 2: Identify variables',
        'Step 3: Solve equation',
        'Step 4: Verify solution',
      ]),
    });

    generateContentMock.mockResolvedValueOnce({
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

    const tutorResponse = await sendMessageToTutor(messages, aiInstance);
    expect(tutorResponse).toBe('Tutor confirmed the steps are correct');
    expect(generateContentMock).toHaveBeenCalledTimes(2);
  });
});
