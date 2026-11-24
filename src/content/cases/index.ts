import { caseListSchema } from "@/domain/schemas";
import type { CasePool, CaseRecord } from "@/domain/types";
import rawCases from "./cases.json";

export const cases: readonly CaseRecord[] = caseListSchema.parse(rawCases);

const byId = new Map(cases.map((caseRecord) => [caseRecord.id, caseRecord]));

export function getCaseById(id: string): CaseRecord | undefined {
  return byId.get(id);
}

export function getCasesByPool(pool: CasePool): readonly CaseRecord[] {
  return cases.filter((caseRecord) => caseRecord.pool === pool);
}

export const diagnosticCases = getCasesByPool("diagnostic");
export const practiceCases = getCasesByPool("practice");
export const finalCases = getCasesByPool("final");
