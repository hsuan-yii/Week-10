
import { GoogleGenAI, Type } from "@google/genai";
import { State } from "../types";

export const getReflection = async (state: State): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = state === State.CALM 
    ? "Generate a short, poetic, one-sentence reflection in Traditional Chinese about the feeling of complete inner peace and flowing like water. Do not use quotes."
    : "Generate a short, soothing, one-sentence encouragement in Traditional Chinese for someone who is currently anxious and trying to breathe slowly. Focus on the imagery of water or breath. Do not use quotes.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    return response.text?.trim() || "在呼吸之間，找回自己。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "在呼吸之間，找回自己。";
  }
};
