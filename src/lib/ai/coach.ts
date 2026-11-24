import {
  coachOutputSchema,
  type CoachRequest,
  type CoachResponse,
} from "@/domain/schemas";
import { SIGNALS, type CaseRecord, type Signal } from "@/domain/types";
import { logGeminiFailure, logGeminiOutputRejected } from "./gemini";
import type { AiCoach, CoachContext } from "./types";

const UNSAFE_OUTPUT_PATTERN = /https?:\/\/|www\.|\d{7,}/i;
const SIGNAL_NAMES: Record<Signal, RegExp> = {
  P: /\bpago\b/i,
  A: /\bapuro\b/i,
  R: /\brastro\b/i,
  E: /\bexposici[oó]n\b/i,
};

export function buildCoachFallback(caseRecord: CaseRecord): CoachResponse {
  return {
    explanation: caseRecord.explanation,
    nextHint: "¿Qué podrías comprobar por un canal que ya conoces?",
    encouragement: "Puedes revisar el caso con calma y volver a intentarlo.",
    source: "fallback",
  };
}

function parseSafeCoachOutput(
  text: string,
  caseRecord: CaseRecord,
): CoachResponse | null {
  let value: unknown;

  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }

  const parsed = coachOutputSchema.safeParse(value);

  if (!parsed.success || !parsed.data.nextHint.trim().endsWith("?")) {
    return null;
  }

  const outputText = Object.values(parsed.data).join(" ");

  if (
    UNSAFE_OUTPUT_PATTERN.test(outputText) ||
    outputText.trim().split(/\s+/).length > 90
  ) {
    return null;
  }

  const mentionsUnsupportedSignal = SIGNALS.some(
    (signal) => !caseRecord.signals[signal] && SIGNAL_NAMES[signal].test(outputText),
  );

  if (mentionsUnsupportedSignal) {
    return null;
  }

  return { ...parsed.data, source: "ai" };
}

export async function getCoachResponse(
  request: CoachRequest,
  caseRecord: CaseRecord,
  coach: AiCoach | null,
): Promise<CoachResponse> {
  if (!coach) {
    return buildCoachFallback(caseRecord);
  }

  const context: CoachContext = {
    caseRecord,
    selectedSignals: request.selectedSignals,
    selectedAction: request.selectedAction,
  };
  let lastFailure: unknown;
  let hadFailure = false;
  let outputRejected = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const text = await coach.generate(context);
      const output = parseSafeCoachOutput(text, caseRecord);

      if (output) {
        return output;
      }
      outputRejected = true;
    } catch (error) {
      lastFailure = error;
      hadFailure = true;
    }
  }

  if (hadFailure) {
    logGeminiFailure(lastFailure);
  }

  if (outputRejected) {
    logGeminiOutputRejected();
  }

  return buildCoachFallback(caseRecord);
}
