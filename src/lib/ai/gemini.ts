import { ApiError, GoogleGenAI } from "@google/genai";
import type { z } from "zod";

const REQUEST_TIMEOUT_MS = 10_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export interface GeminiJsonGenerator {
  generate(
    systemInstruction: string,
    prompt: string,
    schema: z.ZodType,
  ): Promise<string>;
}

function getApiErrorCategory(error: ApiError): string {
  let details = error.message.toLowerCase();

  try {
    const body: unknown = JSON.parse(error.message);

    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error !== null &&
      "message" in body.error &&
      typeof body.error.message === "string"
    ) {
      details = body.error.message.toLowerCase();
    }
  } catch {
    // Keep classification bounded to the message already supplied by the SDK.
  }

  if (/api key.*not valid|invalid api key|api_key_invalid/.test(details)) {
    return "invalid_api_key";
  }

  if (/quota|rate limit|resource_exhausted/.test(details)) {
    return "quota";
  }

  if (/model.*not found|not found.*model|unsupported model/.test(details)) {
    return "model_unavailable";
  }

  if (/responsejsonschema|json schema|schema/.test(details)) {
    return "response_schema_rejected";
  }

  if (/permission|forbidden|unauthenticated/.test(details)) {
    return "credentials_or_permissions";
  }

  return error.status === 400 ? "invalid_request" : "provider_error";
}

function getApiErrorStatus(error: ApiError): string | undefined {
  try {
    const body: unknown = JSON.parse(error.message);

    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "object" &&
      body.error !== null &&
      "status" in body.error &&
      typeof body.error.status === "string" &&
      /^[A-Z_]+$/.test(body.error.status)
    ) {
      return body.error.status;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getApiErrorClues(error: ApiError): string[] {
  const knownTerms = [
    "schema",
    "property",
    "additionalproperties",
    "model",
    "json",
    "mime",
    "token",
    "instruction",
  ];
  const details = error.message.toLowerCase();

  return knownTerms.filter((term) => details.includes(term));
}

function getApiErrorFields(error: ApiError): string[] {
  try {
    const body: unknown = JSON.parse(error.message);

    if (
      !isRecord(body) ||
      !isRecord(body.error) ||
      !Array.isArray(body.error.details)
    ) {
      return [];
    }

    const fields: string[] = [];

    for (const detail of body.error.details) {
      if (!isRecord(detail) || !Array.isArray(detail.fieldViolations)) {
        continue;
      }

      for (const violation of detail.fieldViolations) {
        if (
          isRecord(violation) &&
          typeof violation.field === "string" &&
          /^[\w.\[\]-]+$/.test(violation.field)
        ) {
          fields.push(violation.field);
        }
      }
    }

    return [...new Set(fields)];
  } catch {
    return [];
  }
}

export function logGeminiFailure(error: unknown): void {
  if (error instanceof ApiError) {
    console.error("[ai] Gemini API request failed", {
      status: error.status,
      providerStatus: getApiErrorStatus(error),
      category: getApiErrorCategory(error),
      clues: getApiErrorClues(error),
      fields: getApiErrorFields(error),
    });
    return;
  }

  console.error("[ai] Gemini request failed", {
    errorName: error instanceof Error ? error.name : "UnknownError",
  });
}

export function logGeminiOutputRejected(): void {
  console.warn("[ai] Gemini response rejected by output validation");
}

export function createGeminiJsonGenerator(
  apiKey: string,
  model: string,
): GeminiJsonGenerator {
  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: REQUEST_TIMEOUT_MS,
      retryOptions: { attempts: 1 },
    },
  });

  return {
    async generate(systemInstruction, prompt, schema) {
      const response = await client.models.generateContent({
        model,
        contents: JSON.stringify({
          instructions: systemInstruction,
          request: prompt,
          responseSchema: schema.toJSONSchema(),
        }),
        config: {
          temperature: 0.2,
          maxOutputTokens: 300,
          responseMimeType: "application/json",
        },
      });

      if (!response.text) {
        throw new Error("Gemini no devolvió texto");
      }

      return response.text;
    },
  };
}

export function getGeminiJsonGenerator(): GeminiJsonGenerator | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (process.env.AI_ENABLED !== "true" || !apiKey) {
    return null;
  }

  return createGeminiJsonGenerator(
    apiKey,
    process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite",
  );
}
