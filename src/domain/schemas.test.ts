import { describe, expect, it } from "vitest";
import {
  adviceRequestSchema,
  caseSchema,
  coachOutputSchema,
  coachRequestSchema,
  recruiterRequestSchema,
  recruiterOutputSchema,
} from "./schemas";

const validCase = {
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
} as const;

const allFalse = { P: false, A: false, R: false, E: false };

describe("caseSchema", () => {
  it("acepta un caso completo", () => {
    expect(caseSchema.safeParse(validCase).success).toBe(true);
  });

  it("acepta un caso legítimo sin señales y con proceed", () => {
    const result = caseSchema.safeParse({
      ...validCase,
      isScam: false,
      signals: allFalse,
      correctAction: "proceed",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un caso legítimo con señales PARE", () => {
    const result = caseSchema.safeParse({
      ...validCase,
      isScam: false,
      signals: { ...allFalse, P: true },
      correctAction: "proceed",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza un caso legítimo que no se resuelve con proceed", () => {
    const result = caseSchema.safeParse({
      ...validCase,
      isScam: false,
      signals: allFalse,
      correctAction: "verify",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una estafa sin señales", () => {
    const result = caseSchema.safeParse({
      ...validCase,
      signals: allFalse,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza campos desconocidos, ids inválidos y escenarios cortos", () => {
    expect(
      caseSchema.safeParse({ ...validCase, extra: "no permitido" }).success,
    ).toBe(false);
    expect(caseSchema.safeParse({ ...validCase, id: "Job D1" }).success).toBe(
      false,
    );
    expect(caseSchema.safeParse({ ...validCase, scenario: "Muy corto" }).success)
      .toBe(false);
  });
});

describe("schemas de entrada de IA", () => {
  it("limita el consejo a 400 caracteres y elimina espacios sobrantes", () => {
    expect(
      adviceRequestSchema.safeParse({
        caseId: "job-d1",
        advice: "a".repeat(400),
      }).success,
    ).toBe(true);
    expect(
      adviceRequestSchema.safeParse({
        caseId: "job-d1",
        advice: "a".repeat(401),
      }).success,
    ).toBe(false);

    const parsed = adviceRequestSchema.parse({
      caseId: "job-d1",
      advice: "  Verifica por otro canal.  ",
    });
    expect(parsed.advice).toBe("Verifica por otro canal.");
  });

  it("limita el historial del simulador a seis turnos", () => {
    const history = Array.from({ length: 7 }, () => ({
      role: "user" as const,
      text: "Hola",
    }));

    expect(
      recruiterRequestSchema.safeParse({
        caseId: "job-d1",
        history,
        userMessage: "¿Quién eres?",
      }).success,
    ).toBe(false);
  });

  it("rechaza acciones desconocidas y campos extra", () => {
    expect(
      coachRequestSchema.safeParse({
        caseId: "job-d1",
        selectedSignals: allFalse,
        selectedAction: "llamar",
      }).success,
    ).toBe(false);
    expect(
      coachRequestSchema.safeParse({
        caseId: "job-d1",
        selectedSignals: allFalse,
        selectedAction: "cut",
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("valida las salidas de IA y rechaza campos extra", () => {
    expect(
      coachOutputSchema.safeParse({
        explanation: "Revisa la señal de pago.",
        nextHint: "¿Quién pide el dinero?",
        encouragement: "Vas bien.",
      }).success,
    ).toBe(true);
    expect(
      coachOutputSchema.safeParse({
        explanation: "Revisa la señal de pago.",
        nextHint: "¿Quién pide el dinero?",
        encouragement: "Vas bien.",
        source: "ai",
      }).success,
    ).toBe(false);

    expect(
      recruiterOutputSchema.safeParse({
        message: "Te ofrezco el trabajo.",
        finished: false,
      }).success,
    ).toBe(true);
  });
});
