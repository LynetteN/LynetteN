import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  explanation: string;
  redFlags: string[];
  recommendation: string;
  linguisticBreakdown?: {
    tactic: string;
    psychologicalTrigger: string;
    markers: string[];
  };
}

const getSystemInstruction = (lang: string) => `
You are a world-class Cybersecurity Analyst and Forensic Linguist specializing in West African digital fraud (e.g., Yahoo Boys, emergency scams, job scams). 
Your task is to analyze text, images (screenshots), or audio transcripts for 'Social Engineering' tactics. 

CRITICAL LANGUAGE REQUIREMENT: 
- You MUST respond ENTIRELY in ${lang.toUpperCase()}. 
- All fields in the JSON response (explanation, redFlags, recommendation, tactic, psychologicalTrigger, markers) MUST be written in ${lang.toUpperCase()}.
- If the language is PIDGIN, use Nigerian Pidgin English.
- DO NOT use English if the requested language is French or Pidgin.

Look for:
1. Artificial Urgency (e.g., "Hurry", "Now", "Immediate").
2. Unusual Payment Requests (Mobile Money, Crypto, Gift Cards, Direct Transfer to personal accounts).
3. Grammar inconsistencies mixed with high-pressure tactics.
4. Impersonation of authority figures (Police, Banks, Government officials).
5. Emotional manipulation (Fear, Greed, Despair).
6. Linguistic patterns common in West African scams (Pidgin English, specific slang like "client", "format", "wire").

Provide a Risk Score (1-100), a Risk Level (Low, Medium, High), a 2-sentence explanation of the specific trick, a list of red flags, and a recommendation.
Also provide a 'linguisticBreakdown' with the specific tactic used, the psychological trigger, and 2-3 markers found.
`;

export const analyzeText = async (text: string, lang: string = "en"): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: text,
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          linguisticBreakdown: {
            type: Type.OBJECT,
            properties: {
              tactic: { type: Type.STRING },
              psychologicalTrigger: { type: Type.STRING },
              markers: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["tactic", "psychologicalTrigger", "markers"],
          },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation", "linguisticBreakdown"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeImage = async (base64Image: string, mimeType: string, lang: string = "en"): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: `Analyze this screenshot for potential scam tactics. Perform OCR if necessary to understand the text context. Respond in ${lang}.` }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          linguisticBreakdown: {
            type: Type.OBJECT,
            properties: {
              tactic: { type: Type.STRING },
              psychologicalTrigger: { type: Type.STRING },
              markers: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["tactic", "psychologicalTrigger", "markers"],
          },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation", "linguisticBreakdown"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeAudio = async (base64Audio: string, mimeType: string, lang: string = "en"): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType } },
        { text: `Analyze this audio/voice note for potential scam tactics. Listen to the tone, urgency, and specific requests. Respond in ${lang}.` }
      ]
    },
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          explanation: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          linguisticBreakdown: {
            type: Type.OBJECT,
            properties: {
              tactic: { type: Type.STRING },
              psychologicalTrigger: { type: Type.STRING },
              markers: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["tactic", "psychologicalTrigger", "markers"],
          },
        },
        required: ["riskScore", "riskLevel", "explanation", "redFlags", "recommendation", "linguisticBreakdown"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
