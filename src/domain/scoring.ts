import {
  SIGNALS,
  type CaseAnswer,
  type CaseRecord,
  type CaseScore,
  type LetterScore,
  type ScoreComparison,
  type ScoreSummary,
  type Signal,
  type SignalMap,
} from "./types";

export const MASTERY_MIN_POINTS = 8;
export const MASTERY_MAX_POINTS = 10;
const SIGNAL_POINTS = 0.25;

export function emptySignalMap(): SignalMap {
  return { P: false, A: false, R: false, E: false };
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function percent(correct: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return round((correct / total) * 100, 1);
}

export function scoreCase(
  caseRecord: CaseRecord,
  answer: CaseAnswer | undefined,
): CaseScore {
  const selected: CaseAnswer = answer ?? {
    caseId: caseRecord.id,
    selectedSignals: emptySignalMap(),
    selectedAction: null,
  };

  const signalMatches: SignalMap = answer
    ? {
        P: selected.selectedSignals.P === caseRecord.signals.P,
        A: selected.selectedSignals.A === caseRecord.signals.A,
        R: selected.selectedSignals.R === caseRecord.signals.R,
        E: selected.selectedSignals.E === caseRecord.signals.E,
      }
    : emptySignalMap();

  const correctSignals = answer
    ? SIGNALS.filter((signal) => signalMatches[signal]).length
    : 0;
  const decision = selected.selectedAction === caseRecord.correctAction ? 1 : 0;
  const signals = round(correctSignals * SIGNAL_POINTS);
  const total = round(decision + signals);

  return {
    caseId: caseRecord.id,
    decision,
    signals,
    total,
    signalMatches,
    selected,
  };
}

export function scoreSession(
  cases: readonly CaseRecord[],
  answers: readonly CaseAnswer[],
): ScoreSummary {
  const byId = new Map(answers.map((answer) => [answer.caseId, answer]));
  const scored = cases.map((caseRecord) =>
    scoreCase(caseRecord, byId.get(caseRecord.id)),
  );

  const byLetter = Object.fromEntries(
    SIGNALS.map((signal) => {
      const correct = cases.filter(
        (caseRecord, index) => scored[index].signalMatches[signal],
      ).length;

      return [
        signal,
        {
          correct,
          total: cases.length,
          percent: percent(correct, cases.length),
        } satisfies LetterScore,
      ];
    }),
  ) as Record<Signal, LetterScore>;

  const total = round(scored.reduce((sum, item) => sum + item.total, 0));
  const max = cases.length * 2;

  return {
    total,
    max,
    percent: percent(total, max),
    byLetter,
    cases: scored,
  };
}

export function isMastery(summary: ScoreSummary): boolean {
  return (
    summary.max === MASTERY_MAX_POINTS &&
    summary.total >= MASTERY_MIN_POINTS
  );
}

export function compareScores(
  before: ScoreSummary,
  after: ScoreSummary,
): ScoreComparison {
  return {
    before,
    after,
    mastery: isMastery(after),
    improvement: round(after.percent - before.percent, 1),
  };
}
