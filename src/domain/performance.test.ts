import { describe, expect, it } from "vitest";
import { scoreSession } from "@/domain/scoring";
import type { CaseAnswer } from "@/domain/types";
import { finalCases } from "@/content/cases";

function answerAll(cases: typeof finalCases): CaseAnswer[] {
  return cases.map((caseRecord) => ({
    caseId: caseRecord.id,
    selectedSignals: { ...caseRecord.signals },
    selectedAction: caseRecord.correctAction,
  }));
}

describe("rendimiento del puntaje", () => {
  it("puntúa 5.000 sesiones completas en menos de un segundo", () => {
    const answers = answerAll(finalCases);
    const start = performance.now();

    for (let index = 0; index < 5_000; index += 1) {
      scoreSession(finalCases, answers);
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1_000);
  });
});
