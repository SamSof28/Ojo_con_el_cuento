import { describe, expect, it } from "vitest";
import {
  createSession,
  sessionReducer,
  type SessionState,
} from "./session";
import type { CaseAnswer } from "./types";

function answer(caseId: string): CaseAnswer {
  return {
    caseId,
    selectedSignals: { P: true, A: false, R: false, E: false },
    selectedAction: "cut",
  };
}

function stateAt(phase: SessionState["phase"]): SessionState {
  return {
    ...createSession("2026-11-24T00:00:00.000Z"),
    phase,
  };
}

describe("sessionReducer", () => {
  it("crea una sesión nueva en diagnóstico", () => {
    const state = createSession("2026-11-24T00:00:00.000Z");

    expect(state.phase).toBe("diagnostic");
    expect(state.version).toBe(1);
    expect(state.diagnosticIndex).toBe(0);
    expect(state.diagnosticAnswers).toEqual({});
  });

  it("avanza el diagnóstico y cambia a la lección en el último caso", () => {
    const first = sessionReducer(stateAt("diagnostic"), {
      type: "ANSWER_DIAGNOSTIC",
      answer: answer("job-d1"),
      isLast: false,
    });

    expect(first.diagnosticIndex).toBe(1);
    expect(first.phase).toBe("diagnostic");
    expect(first.diagnosticAnswers["job-d1"]).toBeDefined();

    const last = sessionReducer(first, {
      type: "ANSWER_DIAGNOSTIC",
      answer: answer("job-d2"),
      isLast: true,
    });

    expect(last.diagnosticIndex).toBe(2);
    expect(last.phase).toBe("lesson");
  });

  it("guarda las respuestas de la lección sin calificarlas", () => {
    const state = sessionReducer(stateAt("lesson"), {
      type: "ANSWER_LESSON",
      signal: "P",
      option: 1,
    });

    expect(state.lessonAnswers.P).toBe(1);
    expect(state.phase).toBe("lesson");
  });

  it("no avanza la práctica hasta que la persona pide el siguiente caso", () => {
    const submitted = sessionReducer(stateAt("practice"), {
      type: "ANSWER_PRACTICE",
      answer: answer("job-p1"),
    });

    expect(submitted.practiceIndex).toBe(0);
    expect(submitted.practiceAnswers["job-p1"]).toBeDefined();

    const next = sessionReducer(submitted, {
      type: "NEXT_PRACTICE",
      isLast: false,
    });

    expect(next.practiceIndex).toBe(1);
    expect(next.practiceAnswers["job-p1"]).toBeDefined();
  });

  it("mantiene el índice en el último caso de práctica", () => {
    const state = sessionReducer(
      { ...stateAt("practice"), practiceIndex: 5 },
      { type: "NEXT_PRACTICE", isLast: true },
    );

    expect(state.practiceIndex).toBe(5);
  });

  it("entra a la prueba final y termina en resultado tras el último caso", () => {
    const started = sessionReducer(stateAt("practice"), { type: "START_FINAL" });
    expect(started.phase).toBe("final");
    expect(started.finalIndex).toBe(0);

    const last = sessionReducer(
      { ...started, finalIndex: 4 },
      { type: "ANSWER_FINAL", answer: answer("job-f5"), isLast: true },
    );

    expect(last.phase).toBe("result");
    expect(last.finalIndex).toBe(5);
  });

  it("reinicia con la fecha indicada y sin respuestas", () => {
    const dirty: SessionState = {
      ...stateAt("result"),
      diagnosticAnswers: { "job-d1": answer("job-d1") },
      practiceAnswers: { "job-p1": answer("job-p1") },
    };
    const reset = sessionReducer(dirty, {
      type: "RESET",
      startedAt: "2026-11-25T00:00:00.000Z",
    });

    expect(reset.phase).toBe("diagnostic");
    expect(reset.startedAt).toBe("2026-11-25T00:00:00.000Z");
    expect(reset.diagnosticAnswers).toEqual({});
    expect(reset.practiceAnswers).toEqual({});
  });

  it("no muta el estado anterior", () => {
    const state = stateAt("diagnostic");
    const next = sessionReducer(state, {
      type: "ANSWER_DIAGNOSTIC",
      answer: answer("job-d1"),
      isLast: false,
    });

    expect(state.diagnosticAnswers).toEqual({});
    expect(next).not.toBe(state);
  });

  it("hidrata una sesión guardada sin recalcularla", () => {
    const saved: SessionState = {
      ...stateAt("practice"),
      practiceIndex: 2,
      practiceAnswers: { "job-p1": answer("job-p1") },
    };
    const state = sessionReducer(stateAt("diagnostic"), {
      type: "HYDRATE",
      state: saved,
    });

    expect(state).toBe(saved);
    expect(state.practiceIndex).toBe(2);
  });

  it("reinicia la práctica sin borrar el diagnóstico ni la lección", () => {
    const dirty: SessionState = {
      ...stateAt("practice"),
      practiceIndex: 3,
      practiceAnswers: { "job-p1": answer("job-p1") },
      diagnosticAnswers: { "job-d1": answer("job-d1") },
      lessonAnswers: { P: 1 },
    };
    const state = sessionReducer(dirty, { type: "RESTART_PRACTICE" });

    expect(state.phase).toBe("practice");
    expect(state.practiceIndex).toBe(0);
    expect(state.practiceAnswers).toEqual({});
    expect(state.diagnosticAnswers).toEqual({ "job-d1": answer("job-d1") });
    expect(state.lessonAnswers).toEqual({ P: 1 });
  });
});
