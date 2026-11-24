import type { CaseRecord, SignalMap, Action } from "@/domain/types";

export interface CoachContext {
  caseRecord: CaseRecord;
  selectedSignals: SignalMap;
  selectedAction: Action | null;
}

export interface AiCoach {
  generate(context: CoachContext): Promise<string>;
}
