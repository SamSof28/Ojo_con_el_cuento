import { describe, expect, it } from "vitest";
import {
  emptySignalMap,
  isMastery,
  MASTERY_MAX_POINTS,
  MASTERY_MIN_POINTS,
  scoreCase,
  scoreSession,
  compareScores,
} from "./scoring";
import type { CaseAnswer, CaseRecord, ScoreSummary } from "./types";

function makeCase(overrides: Partial<CaseRecord> = {}): CaseRecord {
  return {
    id: "job-d1",
    pool: "diagnostic",
    pairId: "p1",
    family: "job",
    channel: "whatsapp",
    sender: "Aurora Digital",
    time: "09:15",
    scenario:
      "Hola, buscamos personas para trabajar desde el celular. Cupos limitados.",
    isScam: true,
    signals: { P: true, A: true, R: false, E: false },
    correctAction: "cut",
    explanation:
      "Piden dinero y meten prisa. Lo correcto es cortar y verificar por otro canal.",
    difficulty: 1,
    reviewedByAuthor: false,
    ...overrides,
  };
}

function makeAnswer(
  caseRecord: CaseRecord,
  overrides: Partial<CaseAnswer> = {},
): CaseAnswer {
  return {
    caseId: caseRecord.id,
    selectedSignals: { ...caseRecord.signals },
    selectedAction: caseRecord.correctAction,
    ...overrides,
  };
}

function makeSummary(total: number, max: number): ScoreSummary {
  return {
    total,
    max,
    percent: max === 0 ? 0 : Math.round((total / max) * 1000) / 10,
    byLetter: {
      P: { correct: 0, total: 0, percent: 0 },
      A: { correct: 0, total: 0, percent: 0 },
      R: { correct: 0, total: 0, percent: 0 },
      E: { correct: 0, total: 0, percent: 0 },
    },
    cases: [],
  };
}

describe("scoreCase", () => {
  it("da 2 puntos cuando la acción y las cuatro letras son correctas", () => {
    const caseRecord = makeCase();
    const result = scoreCase(caseRecord, makeAnswer(caseRecord));

    expect(result.decision).toBe(1);
    expect(result.signals).toBe(1);
    expect(result.total).toBe(2);
    expect(result.signalMatches).toEqual({
      P: true,
      A: true,
      R: true,
      E: true,
    });
  });

  it("acierta las letras que no se marcan cuando la verdad es falsa", () => {
    const caseRecord = makeCase({
      signals: { P: true, A: false, R: false, E: false },
    });
    const result = scoreCase(
      caseRecord,
      makeAnswer(caseRecord, {
        selectedSignals: { ...emptySignalMap(), P: true },
      }),
    );

    expect(result.signals).toBe(1);
    expect(result.total).toBe(2);
  });

  it("penaliza marcar una señal que no está en el caso", () => {
    const caseRecord = makeCase({
      signals: { P: true, A: false, R: false, E: false },
    });
    const result = scoreCase(
      caseRecord,
      makeAnswer(caseRecord, {
        selectedSignals: { ...emptySignalMap(), P: true, A: true },
      }),
    );

    expect(result.signals).toBe(0.75);
    expect(result.total).toBe(1.75);
  });

  it("da cero en decisión cuando la acción es distinta", () => {
    const caseRecord = makeCase();
    const result = scoreCase(
      caseRecord,
      makeAnswer(caseRecord, { selectedAction: "proceed" }),
    );

    expect(result.decision).toBe(0);
    expect(result.signals).toBe(1);
    expect(result.total).toBe(1);
  });

  it("trata una respuesta ausente como cero sin lanzar errores", () => {
    const result = scoreCase(makeCase(), undefined);

    expect(result.total).toBe(0);
    expect(result.selected.selectedAction).toBeNull();
  });
});

describe("scoreSession", () => {
  it("calcula el porcentaje por letra a lo largo de los casos", () => {
    const cases = Array.from({ length: 5 }, (_, index) =>
      makeCase({
        id: `job-d${index + 1}`,
        pairId: `p${index + 1}`,
        signals: { P: true, A: false, R: false, E: false },
        correctAction: "proceed",
      }),
    );
    const answers = cases.map((caseRecord, index) =>
      makeAnswer(caseRecord, {
        selectedSignals: {
          ...emptySignalMap(),
          P: index < 2,
        },
      }),
    );

    const summary = scoreSession(cases, answers);

    expect(summary.byLetter.P.correct).toBe(2);
    expect(summary.byLetter.P.total).toBe(5);
    expect(summary.byLetter.P.percent).toBe(40);
    expect(summary.byLetter.A.percent).toBe(100);
  });

  it("suma el máximo de 10 puntos para cinco casos", () => {
    const cases = Array.from({ length: 5 }, (_, index) =>
      makeCase({
        id: `job-d${index + 1}`,
        pairId: `p${index + 1}`,
      }),
    );
    const summary = scoreSession(
      cases,
      cases.map((caseRecord) => makeAnswer(caseRecord)),
    );

    expect(summary.max).toBe(10);
    expect(summary.total).toBe(10);
    expect(summary.percent).toBe(100);
  });

  it("devuelve cero de forma segura cuando no hay casos", () => {
    const summary = scoreSession([], []);

    expect(summary.total).toBe(0);
    expect(summary.max).toBe(0);
    expect(summary.percent).toBe(0);
  });
});

describe("isMastery", () => {
  it("exige 8 de 10 puntos", () => {
    expect(isMastery(makeSummary(7.75, 10))).toBe(false);
    expect(isMastery(makeSummary(8, 10))).toBe(true);
    expect(isMastery(makeSummary(10, 10))).toBe(true);
    expect(isMastery(makeSummary(8, 8))).toBe(false);
  });

  it("publica el umbral usado en la interfaz", () => {
    expect(MASTERY_MIN_POINTS).toBe(8);
    expect(MASTERY_MAX_POINTS).toBe(10);
  });
});

describe("compareScores", () => {
  it("compara antes y después sin inventar el resultado", () => {
    const comparison = compareScores(
      makeSummary(5, 10),
      makeSummary(8, 10),
    );

    expect(comparison.improvement).toBe(30);
    expect(comparison.mastery).toBe(true);
  });
});
