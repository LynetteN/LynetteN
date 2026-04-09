import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  explanation: string;
  redFlags: string[];
  recommendation: string;
}

const SYSTEM_INSTRUCTION = `
You are a world-class Cybersecurity Analyst and Forensic Linguist specializing in West African digital fraud (e.g., Yahoo Boys, emergency scams, job scams). 
Your task is to analyze text, images (screenshots), or audio transcripts for 'Social Engineering' tactics. 

Look for:
1. Artificial Urgency (e.g., "Hurry", "Now", "Immediate").
2. Unusual Payment Requests (Mobile Money, Crypto, Gift Cards, Direct Transfer to personal accounts).
3. Grammar inconsistencies mixed with high-pressure tactics.
4. Impersonation of authority figures (Police, Banks, Government officials).
5. Emotional manipulation (Fear, Greed, Despair).
6. Linguistic patterns common in West African scams (Pidgin English, specific slang like "client", "format", "wire").

Provide a Risk Score (1-100), a Risk Level (Low, Medium, High), a 2-sentence explanation of the specific trick, a list of red flags, and a recommendation.
`;

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: text,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: "Analyze this screenshot for potential scam tactics. Perform OCR if necessary to understand the text context." }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeAudio = async (base64Audio: string, mimeType: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType } },
        { text: "Analyze this audio/voice note for potential scam tactics. Listen to the tone, urgency, and specific requests." }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
