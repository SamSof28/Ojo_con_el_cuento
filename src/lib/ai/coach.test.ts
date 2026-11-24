import { describe, expect, it, vi } from "vitest";
import { cases } from "@/content/cases";
import type { CoachRequest } from "@/domain/schemas";
import { getCoachResponse } from "./coach";
import type { AiCoach } from "./types";

const caseRecord = cases.find((item) => item.id === "job-p1");

if (!caseRecord) {
  throw new Error("Expected practice case job-p1");
}

const request: CoachRequest = {
  adultConfirmed: true,
  caseId: caseRecord.id,
  selectedSignals: { P: false, A: true, R: false, E: false },
  selectedAction: "proceed",
};

const validOutput = JSON.stringify({
  explanation: "En este caso hay un cobro antes de empezar y presión para responder.",
  nextHint: "¿Qué podrías comprobar por otro canal?",
  encouragement: "Puedes revisar cada señal con calma.",
});

describe("getCoachResponse", () => {
  it("uses validated Gemini feedback when available", async () => {
    const coach: AiCoach = { generate: vi.fn().mockResolvedValue(validOutput) };

    const response = await getCoachResponse(request, caseRecord, coach);

    expect(response.source).toBe("ai");
    expect(response.explanation).toContain("cobro");
    expect(coach.generate).toHaveBeenCalledOnce();
  });

  it("retries once then returns the case explanation for invalid output", async () => {
    const coach: AiCoach = {
      generate: vi.fn().mockResolvedValue(
        JSON.stringify({
          explanation: "La empresa es www.falsa.com.",
          nextHint: "¿Qué revisarías?",
          encouragement: "Vas bien.",
        }),
      ),
    };

    const response = await getCoachResponse(request, caseRecord, coach);

    expect(coach.generate).toHaveBeenCalledTimes(2);
    expect(response).toEqual({
      explanation: caseRecord.explanation,
      nextHint: "¿Qué podrías comprobar por un canal que ya conoces?",
      encouragement: "Puedes revisar el caso con calma y volver a intentarlo.",
      source: "fallback",
    });
  });

  it("returns prepared feedback when AI is disabled or no key is configured", async () => {
    const response = await getCoachResponse(request, caseRecord, null);

    expect(response.source).toBe("fallback");
    expect(response.explanation).toBe(caseRecord.explanation);
  });

  it("does not accept feedback that mentions a signal absent from the case", async () => {
    const coach: AiCoach = {
      generate: vi.fn().mockResolvedValue(
        JSON.stringify({
          explanation: "Aquí aparece Exposición, revisa esa señal.",
          nextHint: "¿Qué revisarías?",
          encouragement: "Vas bien.",
        }),
      ),
    };

    const response = await getCoachResponse(request, caseRecord, coach);

    expect(response.source).toBe("fallback");
    expect(coach.generate).toHaveBeenCalledTimes(2);
  });

  it("falls back when the response exceeds the 90-word limit", async () => {
    const coach: AiCoach = {
      generate: vi.fn().mockResolvedValue(
        JSON.stringify({
          explanation: Array.from({ length: 88 }, () => "va").join(" "),
          nextHint: "¿Qué revisarías?",
          encouragement: "Vas bien.",
        }),
      ),
    };

    const response = await getCoachResponse(request, caseRecord, coach);

    expect(response.source).toBe("fallback");
    expect(coach.generate).toHaveBeenCalledTimes(2);
  });
});
