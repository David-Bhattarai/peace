
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

/**
 * BACKEND LOGIC LAYER (TypeScript)
 * This service acts as the 'Brain' of the application.
 */

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Constants for backend consistency
const MODELS = {
  TEXT: 'gemini-3-flash-preview',
  PRO: 'gemini-3-pro-preview',
  VISION: 'gemini-2.5-flash-image',
  LIVE: 'gemini-2.5-flash-native-audio-preview-09-2025'
};

/**
 * Strict Data Structures for the Backend Responses
 */
export interface BiometricProfile {
  primaryEmotion: string;
  confidenceScore: number;
  microExpressions: string[];
  psychologicalContext: string;
  recommendedIntervention: string;
  stressLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

/**
 * Backend Function: Create a Therapeutic Chat Session
 */
export const startTherapySession = (): Chat => {
  const ai = getAI();
  return ai.chats.create({
    model: MODELS.PRO,
    config: {
      systemInstruction: `You are a clinical-grade AI therapist named Serenity. 
      Use CBT and DBT principles to guide users. Keep responses empathetic but professional. 
      Always prioritize safety and provide crisis resources if high distress is detected.`,
      temperature: 0.7,
    },
  });
};

/**
 * Backend Function: Process Visual Biometrics
 * This is the 'Kada' logic that performs high-level image analysis.
 */
export const analyzeBiometricState = async (base64Image: string): Promise<BiometricProfile> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: MODELS.VISION,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `PERFORM NEURAL EMOTION ANALYSIS. 
          Respond ONLY with a structured analysis in this format:
          EMOTION: [Name]
          CONFIDENCE: [0-100]
          CUES: [Feature1, Feature2, Feature3]
          ANALYSIS: [Deep psychological context]
          INTERVENTION: [Specific therapeutic advice]
          STRESS: [LOW/MEDIUM/HIGH/CRITICAL]` }
        ]
      }
    });

    const text = response.text || "";
    
    // Internal Backend Parsing Logic
    const getValue = (key: string) => text.match(new RegExp(`${key}:\\s*(.*)`))?.[1]?.trim() || "Unknown";

    return {
      primaryEmotion: getValue('EMOTION'),
      confidenceScore: parseInt(getValue('CONFIDENCE')) || 0,
      microExpressions: getValue('CUES').split(',').map(s => s.trim()),
      psychologicalContext: getValue('ANALYSIS'),
      recommendedIntervention: getValue('INTERVENTION'),
      stressLevel: (getValue('STRESS') as any) || 'LOW',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Backend Error in analyzeBiometricState:", error);
    throw new Error("Neural processing engine failed.");
  }
};

/**
 * Backend Function: Generate supportive reflection for mood entries
 */
export const getMoodReflection = async (note: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: `Analyze this mood note and provide a 1-sentence empathetic reflection: "${note}"`,
  });
  return response.text || "I'm listening and I'm here for you.";
};
