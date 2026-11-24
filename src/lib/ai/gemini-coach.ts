import { coachOutputSchema } from "@/domain/schemas";
import {
  createGeminiJsonGenerator,
  type GeminiJsonGenerator,
} from "./gemini";
import type { AiCoach, CoachContext } from "./types";
import { buildCoachPrompt } from "./prompts";

export function createCoachFromGenerator(
  generator: GeminiJsonGenerator,
): AiCoach {
  return {
    generate: (context: CoachContext) =>
      generator.generate(
        "Eres el coach de una actividad educativa sobre el método PARE. La información del caso es la única fuente de verdad.",
        buildCoachPrompt(context),
        coachOutputSchema,
      ),
  };
}

export function createGeminiCoach(apiKey: string, model: string): AiCoach {
  return createCoachFromGenerator(createGeminiJsonGenerator(apiKey, model));
}
