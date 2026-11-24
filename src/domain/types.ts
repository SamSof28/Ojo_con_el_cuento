export const SIGNALS = ["P", "A", "R", "E"] as const;
export type Signal = (typeof SIGNALS)[number];

export const ACTIONS = ["cut", "verify", "proceed"] as const;
export type Action = (typeof ACTIONS)[number];

export const CASE_POOLS = ["diagnostic", "practice", "final"] as const;
export type CasePool = (typeof CASE_POOLS)[number];

export const CASE_FAMILIES = ["job", "emergency"] as const;
export type CaseFamily = (typeof CASE_FAMILIES)[number];

export const CASE_CHANNELS = ["whatsapp", "call", "sms", "email"] as const;
export type CaseChannel = (typeof CASE_CHANNELS)[number];

export type Difficulty = 1 | 2 | 3;

export interface SignalMap {
  P: boolean;
  A: boolean;
  R: boolean;
  E: boolean;
}

export interface CaseRecord {
  id: string;
  pool: CasePool;
  pairId: string | null;
  family: CaseFamily;
  channel: CaseChannel;
  sender: string;
  time?: string;
  scenario: string;
  isScam: boolean;
  signals: SignalMap;
  correctAction: Action;
  explanation: string;
  difficulty: Difficulty;
  reviewedByAuthor: boolean;
}

export interface CaseAnswer {
  caseId: string;
  selectedSignals: SignalMap;
  selectedAction: Action | null;
}

export interface CaseScore {
  caseId: string;
  decision: number;
  signals: number;
  total: number;
  signalMatches: SignalMap;
  selected: CaseAnswer;
}

export interface LetterScore {
  correct: number;
  total: number;
  percent: number;
}

export interface ScoreSummary {
  total: number;
  max: number;
  percent: number;
  byLetter: Record<Signal, LetterScore>;
  cases: CaseScore[];
}

export interface ScoreComparison {
  before: ScoreSummary;
  after: ScoreSummary;
  mastery: boolean;
  improvement: number;
}
