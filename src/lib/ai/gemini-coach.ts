import { GoogleGenAI } from "@google/genai";
import { coachOutputSchema } from "@/domain/schemas";
import type { AiCoach, CoachContext } from "./types";
import { buildCoachPrompt } from "./prompts";

const MODEL_TIMEOUT_MS = 3_500;

export function createGeminiCoach(apiKey: string, model: string): AiCoach {
  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: MODEL_TIMEOUT_MS,
      retryOptions: { attempts: 1 },
    },
  });

  return {
    async generate(context: CoachContext): Promise<string> {
      const response = await client.models.generateContent({
        model,
        contents: buildCoachPrompt(context),
        config: {
          temperature: 0.2,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
          responseJsonSchema: coachOutputSchema.toJSONSchema(),
          systemInstruction:
            "Eres el coach de una actividad educativa sobre el método PARE. La información del caso es la única fuente de verdad.",
        },
      });

      if (!response.text) {
        throw new Error("Gemini no devolvió texto");
      }

      return response.text;
    },
  };
}
