import { z } from "zod";
import { caseAnswerSchema } from "@/domain/schemas";
import {
  SESSION_VERSION,
  type Phase,
  type SessionState,
} from "@/domain/session";
import { SIGNALS } from "@/domain/types";

export const SESSION_STORAGE_KEY = "ojo-con-el-cuento:session";

const lessonAnswersSchema = z
  .object({
    P: z.number().int().min(0).max(5).optional(),
    A: z.number().int().min(0).max(5).optional(),
    R: z.number().int().min(0).max(5).optional(),
    E: z.number().int().min(0).max(5).optional(),
  })
  .strict();

const phaseSchema = z.enum([
  "diagnostic",
  "lesson",
  "practice",
  "final",
  "result",
]) satisfies z.ZodType<Phase>;

const sessionStateSchema: z.ZodType<SessionState> = z
  .object({
    version: z.literal(SESSION_VERSION),
    phase: phaseSchema,
    diagnosticIndex: z.number().int().min(0).max(5),
    practiceIndex: z.number().int().min(0).max(6),
    finalIndex: z.number().int().min(0).max(5),
    diagnosticAnswers: z.record(z.string(), caseAnswerSchema),
    practiceAnswers: z.record(z.string(), caseAnswerSchema),
    finalAnswers: z.record(z.string(), caseAnswerSchema),
    lessonAnswers: lessonAnswersSchema,
    startedAt: z.string().min(10).max(40),
  })
  .strict();

function defaultStorage(): Storage | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadSession(
  storage: Storage | null = defaultStorage(),
): SessionState | null {
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    const result = sessionStateSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveSession(
  state: SessionState,
  storage: Storage | null = defaultStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearSession(
  storage: Storage | null = defaultStorage(),
): void {
  try {
    storage?.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // El almacenamiento es una mejora, no una dependencia.
  }
}

export function answeredSignals(
  lessonAnswers: Partial<Record<(typeof SIGNALS)[number], number>>,
): number {
  return SIGNALS.filter((signal) => lessonAnswers[signal] !== undefined).length;
}
