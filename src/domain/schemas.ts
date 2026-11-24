import { z } from "zod";
import {
  ACTIONS,
  CASE_CHANNELS,
  CASE_FAMILIES,
  CASE_POOLS,
  SIGNALS,
  type CaseRecord,
} from "./types";

const signalMapSchema = z
  .object({
    P: z.boolean(),
    A: z.boolean(),
    R: z.boolean(),
    E: z.boolean(),
  })
  .strict();

const actionSchema = z.enum(ACTIONS);
const poolSchema = z.enum(CASE_POOLS);
const familySchema = z.enum(CASE_FAMILIES);
const channelSchema = z.enum(CASE_CHANNELS);

export const caseSchema: z.ZodType<CaseRecord> = z
  .object({
    id: z
      .string()
      .min(3)
      .max(40)
      .regex(/^[a-z0-9-]+$/, "El id solo admite minúsculas, números y guiones"),
    pool: poolSchema,
    pairId: z
      .string()
      .min(2)
      .max(10)
      .regex(/^p[1-9][0-9]*$/)
      .nullable(),
    family: familySchema,
    channel: channelSchema,
    sender: z.string().min(2).max(40),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
    scenario: z.string().min(40).max(700),
    isScam: z.boolean(),
    signals: signalMapSchema,
    correctAction: actionSchema,
    explanation: z.string().min(30).max(600),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    reviewedByAuthor: z.boolean(),
  })
  .strict()
  .superRefine((value, context) => {
    const signalValues = SIGNALS.map((signal) => value.signals[signal]);

    if (!value.isScam) {
      if (signalValues.some(Boolean)) {
        context.addIssue({
          code: "custom",
          path: ["signals"],
          message: "Un caso legítimo no puede tener señales PARE",
        });
      }

      if (value.correctAction !== "proceed") {
        context.addIssue({
          code: "custom",
          path: ["correctAction"],
          message: "Un caso legítimo debe resolverse con proceed",
        });
      }
    }

    if (value.isScam && !signalValues.some(Boolean)) {
      context.addIssue({
        code: "custom",
        path: ["signals"],
        message: "Un caso de estafa debe tener al menos una señal PARE",
      });
    }
  });

export const caseListSchema = z.array(caseSchema).min(1);

export const caseAnswerSchema = z
  .object({
    caseId: z.string().min(1).max(40),
    selectedSignals: signalMapSchema,
    selectedAction: actionSchema.nullable(),
  })
  .strict();

export const coachRequestSchema = z
  .object({
    caseId: z.string().min(3).max(40),
    selectedSignals: signalMapSchema,
    selectedAction: actionSchema.nullable(),
  })
  .strict();

export const coachOutputSchema = z
  .object({
    explanation: z.string().min(1).max(600),
    nextHint: z.string().min(1).max(240),
    encouragement: z.string().min(1).max(240),
  })
  .strict();

export const coachResponseSchema = coachOutputSchema.extend({
  source: z.enum(["ai", "fallback"]),
});

export const recruiterTurnSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    text: z.string().min(1).max(400),
  })
  .strict();

export const recruiterRequestSchema = z
  .object({
    caseId: z.string().min(3).max(40),
    history: z.array(recruiterTurnSchema).max(6),
    userMessage: z.string().min(1).max(300),
  })
  .strict();

export const recruiterOutputSchema = z
  .object({
    message: z.string().min(1).max(500),
    finished: z.boolean(),
  })
  .strict();

export const recruiterResponseSchema = recruiterOutputSchema.extend({
  source: z.enum(["ai", "fallback"]),
});

export const adviceRequestSchema = z
  .object({
    caseId: z.string().min(3).max(40),
    advice: z.string().trim().min(10).max(400),
  })
  .strict();

export const adviceOutputSchema = z
  .object({
    covers: signalMapSchema,
    message: z.string().min(1).max(400),
  })
  .strict();

export const adviceResponseSchema = adviceOutputSchema.extend({
  source: z.enum(["ai", "fallback"]),
});

export type CoachRequest = z.infer<typeof coachRequestSchema>;
export type CoachOutput = z.infer<typeof coachOutputSchema>;
export type CoachResponse = z.infer<typeof coachResponseSchema>;
export type RecruiterTurn = z.infer<typeof recruiterTurnSchema>;
export type RecruiterRequest = z.infer<typeof recruiterRequestSchema>;
export type RecruiterOutput = z.infer<typeof recruiterOutputSchema>;
export type RecruiterResponse = z.infer<typeof recruiterResponseSchema>;
export type AdviceRequest = z.infer<typeof adviceRequestSchema>;
export type AdviceOutput = z.infer<typeof adviceOutputSchema>;
export type AdviceResponse = z.infer<typeof adviceResponseSchema>;
