import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const mocks = vi.hoisted(() => ({
  constructor: vi.fn(),
  generateContent: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  ApiError: class ApiError extends Error {
    status = 400;
  },
  GoogleGenAI: class GoogleGenAI {
    models = { generateContent: mocks.generateContent };

    constructor(options: unknown) {
      mocks.constructor(options);
    }
  },
}));

import { createGeminiJsonGenerator } from "./gemini";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createGeminiJsonGenerator", () => {
  it("uses the minimum supported Gemini request timeout", async () => {
    mocks.generateContent.mockResolvedValue({ text: '{"answer":"ok"}' });
    const generator = createGeminiJsonGenerator("test-key", "test-model");

    await generator.generate(
      "system",
      "prompt",
      z.object({ answer: z.string() }),
    );

    expect(mocks.constructor).toHaveBeenCalledWith({
      apiKey: "test-key",
      httpOptions: {
        timeout: 10_000,
        retryOptions: { attempts: 1 },
      },
    });
  });
});
