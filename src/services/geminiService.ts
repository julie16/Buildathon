/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const diagnosisModel = "gemini-3-flash-preview";
export const calendarModel = "gemini-3-flash-preview";

export const geminiService = {
  async diagnosePlant(imageBase64: string, mimeType: string) {
    const prompt = `Tu es un expert agronome spécialisé en agriculture tropicale et de l'Afrique de l'Ouest. 
    Analyse cette photo de plante et identifie :
    1. Le nom de la plante (si identifiable).
    2. La maladie, le ravageur ou la carence nutritionnelle.
    3. Des solutions de lutte intégrée, biologiques ou locales (accessibles aux petits agriculteurs).
    4. Des conseils de prévention.
    
    Réponds de manière concise, pédagogique et en français.`;

    const response = await ai.models.generateContent({
      model: diagnosisModel,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBase64,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    return response.text;
  },

  async generateCalendar(crop: string, region: string) {
    const prompt = `Génère un calendrier de culture détaillé pour : "${crop}" dans la région de : "${region}". 
    Tiens compte du climat spécifique de l'Afrique de l'Ouest (saisons des pluies/sèche).
    Formatte la réponse pour chaque étape clé du cycle de culture (préparation, semis, entretien, récolte).`;

    const response = await ai.models.generateContent({
      model: calendarModel,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING },
            region: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  action: { type: Type.STRING },
                  advice: { type: Type.STRING },
                },
                required: ["month", "action", "advice"],
              },
            },
          },
          required: ["crop", "region", "steps"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  }
};
