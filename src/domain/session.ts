import type { CaseAnswer, Signal } from "./types";

export const SESSION_VERSION = 1 as const;

export type Phase = "diagnostic" | "lesson" | "practice" | "final" | "result";

export interface SessionState {
  version: typeof SESSION_VERSION;
  phase: Phase;
  diagnosticIndex: number;
  practiceIndex: number;
  finalIndex: number;
  diagnosticAnswers: Record<string, CaseAnswer>;
  practiceAnswers: Record<string, CaseAnswer>;
  finalAnswers: Record<string, CaseAnswer>;
  lessonAnswers: Partial<Record<Signal, number>>;
  startedAt: string;
}

export type SessionAction =
  | { type: "HYDRATE"; state: SessionState }
  | { type: "ANSWER_DIAGNOSTIC"; answer: CaseAnswer; isLast: boolean }
  | { type: "ANSWER_LESSON"; signal: Signal; option: number }
  | { type: "START_PRACTICE" }
  | { type: "RESTART_PRACTICE" }
  | { type: "ANSWER_PRACTICE"; answer: CaseAnswer }
  | { type: "NEXT_PRACTICE"; isLast: boolean }
  | { type: "START_FINAL" }
  | { type: "ANSWER_FINAL"; answer: CaseAnswer; isLast: boolean }
  | { type: "RESET"; startedAt: string };

export function createSession(
  startedAt: string = new Date().toISOString(),
): SessionState {
  return {
    version: SESSION_VERSION,
    phase: "diagnostic",
    diagnosticIndex: 0,
    practiceIndex: 0,
    finalIndex: 0,
    diagnosticAnswers: {},
    practiceAnswers: {},
    finalAnswers: {},
    lessonAnswers: {},
    startedAt,
  };
}

function addAnswer(
  answers: Record<string, CaseAnswer>,
  answer: CaseAnswer,
): Record<string, CaseAnswer> {
  return { ...answers, [answer.caseId]: answer };
}

export function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "ANSWER_DIAGNOSTIC": {
      const isLast = action.isLast;

      return {
        ...state,
        diagnosticAnswers: addAnswer(state.diagnosticAnswers, action.answer),
        diagnosticIndex: state.diagnosticIndex + 1,
        phase: isLast ? "lesson" : "diagnostic",
      };
    }
    case "ANSWER_LESSON":
      return {
        ...state,
        lessonAnswers: {
          ...state.lessonAnswers,
          [action.signal]: action.option,
        },
      };
    case "START_PRACTICE":
      return { ...state, phase: "practice", practiceIndex: 0 };
    case "RESTART_PRACTICE":
      return { ...state, phase: "practice", practiceIndex: 0, practiceAnswers: {} };
    case "ANSWER_PRACTICE":
      return {
        ...state,
        practiceAnswers: addAnswer(state.practiceAnswers, action.answer),
      };
    case "NEXT_PRACTICE":
      return {
        ...state,
        practiceIndex: action.isLast
          ? state.practiceIndex
          : state.practiceIndex + 1,
      };
    case "START_FINAL":
      return { ...state, phase: "final", finalIndex: 0 };
    case "ANSWER_FINAL": {
      const isLast = action.isLast;

      return {
        ...state,
        finalAnswers: addAnswer(state.finalAnswers, action.answer),
        finalIndex: state.finalIndex + 1,
        phase: isLast ? "result" : "final",
      };
    }
    case "RESET":
      return createSession(action.startedAt);
    default:
      return state;
  }
}
