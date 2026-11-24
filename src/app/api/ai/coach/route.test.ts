import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/ai/coach", () => {
  it("returns grounded prepared feedback without requiring age-gate data", async () => {
    vi.stubEnv("AI_ENABLED", "false");

    const response = await POST(
      new Request("http://localhost/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: "job-p1",
          selectedSignals: { P: true, A: true, R: true, E: false },
          selectedAction: "cut",
        }),
      }),
    );
    const payload: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      source: "fallback",
      nextHint: "¿Qué podrías comprobar por un canal que ya conoces?",
    });
  });
});
