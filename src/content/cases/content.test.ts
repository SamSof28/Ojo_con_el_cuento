import { describe, expect, it } from "vitest";
import { SIGNALS, type CaseRecord } from "@/domain/types";
import { cases, diagnosticCases, finalCases, practiceCases } from "./index";

function requirePairId(caseRecord: CaseRecord): string {
  if (caseRecord.pairId === null) {
    throw new Error(`El caso ${caseRecord.id} no tiene pairId`);
  }

  return caseRecord.pairId;
}

describe("banco de casos", () => {
  it("contiene exactamente 16 casos con ids únicos", () => {
    expect(cases).toHaveLength(16);
    expect(new Set(cases.map((caseRecord) => caseRecord.id)).size).toBe(16);
  });

  it("marca los 16 casos como revisados por el autor", () => {
    expect(cases.every((caseRecord) => caseRecord.reviewedByAuthor)).toBe(true);
  });

  it("respeta la distribución 5 diagnóstico, 5 final y 6 práctica", () => {
    expect(diagnosticCases).toHaveLength(5);
    expect(finalCases).toHaveLength(5);
    expect(practiceCases).toHaveLength(6);
  });

  it("incluye 3 estafas y 2 casos legítimos en el diagnóstico", () => {
    expect(diagnosticCases.filter((caseRecord) => caseRecord.isScam)).toHaveLength(
      3,
    );
    expect(
      diagnosticCases.filter((caseRecord) => !caseRecord.isScam),
    ).toHaveLength(2);
    expect(
      diagnosticCases.some((caseRecord) => caseRecord.family === "emergency"),
    ).toBe(true);
  });

  it("hace aparecer cada letra PARE al menos dos veces en el diagnóstico", () => {
    for (const signal of SIGNALS) {
      const appearances = diagnosticCases.filter(
        (caseRecord) => caseRecord.signals[signal],
      ).length;

      expect(appearances, `La letra ${signal} aparece ${appearances} veces`).toBeGreaterThanOrEqual(
        2,
      );
    }
  });

  it("empareja cada caso final con su diagnóstico en señales, acción y dificultad", () => {
    const diagnosticByPair = new Map(
      diagnosticCases.map((caseRecord) => [
        requirePairId(caseRecord),
        caseRecord,
      ]),
    );
    const finalPairIds = new Set<string>();

    for (const finalCase of finalCases) {
      const pairId = requirePairId(finalCase);
      const diagnosticCase = diagnosticByPair.get(pairId);

      expect(diagnosticCase, `Falta el par ${pairId}`).toBeDefined();
      expect(finalPairIds.has(pairId)).toBe(false);
      finalPairIds.add(pairId);

      expect(finalCase.signals).toEqual(diagnosticCase?.signals);
      expect(finalCase.correctAction).toBe(diagnosticCase?.correctAction);
      expect(finalCase.difficulty).toBe(diagnosticCase?.difficulty);
      expect(finalCase.scenario).not.toBe(diagnosticCase?.scenario);
      expect(finalCase.id).not.toBe(diagnosticCase?.id);
    }

    expect(finalPairIds.size).toBe(5);
  });

  it("mantiene la práctica separada del diagnóstico y del final", () => {
    const evaluationIds = new Set(
      [...diagnosticCases, ...finalCases].map((caseRecord) => caseRecord.id),
    );
    const evaluationScenarios = new Set(
      [...diagnosticCases, ...finalCases].map(
        (caseRecord) => caseRecord.scenario,
      ),
    );

    for (const practiceCase of practiceCases) {
      expect(practiceCase.pool).toBe("practice");
      expect(practiceCase.pairId).toBeNull();
      expect(evaluationIds.has(practiceCase.id)).toBe(false);
      expect(evaluationScenarios.has(practiceCase.scenario)).toBe(false);
    }
  });

  it("incluye variedad y casos legítimos en la práctica", () => {
    expect(
      practiceCases.filter((caseRecord) => caseRecord.family === "emergency"),
    ).toHaveLength(2);
    expect(
      practiceCases.filter((caseRecord) => !caseRecord.isScam).length,
    ).toBeGreaterThanOrEqual(1);
    expect(new Set(practiceCases.map((caseRecord) => caseRecord.channel)).size)
      .toBeGreaterThanOrEqual(3);
  });

  it("no contiene URLs, correos ni secuencias de siete dígitos", () => {
    const content = cases
      .map(
        (caseRecord) =>
          `${caseRecord.sender} ${caseRecord.scenario} ${caseRecord.explanation}`,
      )
      .join(" ");

    expect(content).not.toMatch(/https?:\/\//i);
    expect(content).not.toMatch(/www\./i);
    expect(content).not.toMatch(/@/);
    expect(content).not.toMatch(/\d{7,}/);
  });

  it("mantiene un presupuesto de contenido para celulares de gama baja", () => {
    const bytes = Buffer.byteLength(JSON.stringify(cases), "utf8");

    expect(bytes).toBeLessThan(60_000);
  });

  it("nombra al menos una señal PARE en cada explicación de estafa", () => {
    for (const caseRecord of cases.filter((item) => item.isScam)) {
      expect(caseRecord.explanation).toMatch(
        /(Pago|Apuro|Rastro|Exposición)/,
      );
    }
  });
});
