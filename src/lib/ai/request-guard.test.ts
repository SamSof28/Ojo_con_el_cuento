import { describe, expect, it } from "vitest";
import {
  createAiRateLimiter,
  checkAiRequest,
  readJsonBody,
} from "./request-guard";

describe("AI request guard", () => {
  it("limits requests per IP and resets the window", () => {
    let now = 0;
    const allow = createAiRateLimiter(2, 1_000, () => now);

    expect(allow("192.0.2.1")).toBe(true);
    expect(allow("192.0.2.1")).toBe(true);
    expect(allow("192.0.2.1")).toBe(false);
    expect(allow("192.0.2.2")).toBe(true);

    now = 1_000;
    expect(allow("192.0.2.1")).toBe(true);
  });

  it("rejects a request exceeding the declared body size limit", async () => {
    const response = await checkAiRequest(
      new Request("http://localhost/api/ai/coach", {
        method: "POST",
        headers: {
          "Content-Length": "12001",
          "X-Forwarded-For": "192.0.2.4",
        },
      }),
    );

    expect(response?.status).toBe(413);
  });

  it("rejects an oversized streamed body when content-length is absent", async () => {
    const result = await readJsonBody(
      new Request("http://localhost/api/ai/coach", {
        method: "POST",
        headers: { "X-Forwarded-For": "192.0.2.5" },
        body: "x".repeat(12_001),
      }),
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.response.status).toBe(413);
    }
  });
});
