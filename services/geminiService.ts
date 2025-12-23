
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function sendMessageToTutor(
  messages: Message[],
  imageUri?: string
): Promise<string> {
  const modelName = 'gemini-3-pro-preview';
  
  // Format history for Gemini
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: msg.imageUrl ? [
      { text: msg.content },
      { inlineData: { mimeType: 'image/jpeg', data: msg.imageUrl.split(',')[1] } }
    ] : [{ text: msg.content }]
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    return response.text || "I'm sorry, I couldn't process that. Let's try rephrasing the problem.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateProblemSteps(problem: string): Promise<string[]> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break this problem down into 4-6 high-level logical steps for a learning journey. Return ONLY a JSON array of strings. Problem: ${problem}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch {
    return ["Identify Problem", "Analysis", "Calculation", "Verification"];
  }
}
