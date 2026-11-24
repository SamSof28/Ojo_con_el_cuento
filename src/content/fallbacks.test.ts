import { describe, expect, it } from "vitest";
import { cases } from "@/content/cases";
import { buildAdviceFallback, buildRecruiterFallback } from "./fallbacks";

describe("respaldo del simulador", () => {
  it("nunca revela que el caso es una estafa ni incluye enlaces o teléfonos", () => {
    for (const caseRecord of cases) {
      for (let turnIndex = 0; turnIndex < 4; turnIndex += 1) {
        const { message } = buildRecruiterFallback(caseRecord, turnIndex);

        expect(message.toLowerCase()).not.toContain("estafa");
        expect(message).not.toMatch(/https?:\/\/|www\.|@/);
        expect(message).not.toMatch(/\d{7,}/);
        expect(message.length).toBeLessThanOrEqual(300);
      }
    }
  });

  it("termina después de tres respuestas", () => {
    const caseRecord = cases.find((item) => item.isScam);

    expect(caseRecord).toBeDefined();
    expect(buildRecruiterFallback(caseRecord!, 0).finished).toBe(false);
    expect(buildRecruiterFallback(caseRecord!, 1).finished).toBe(false);
    expect(buildRecruiterFallback(caseRecord!, 2).finished).toBe(true);
    expect(buildRecruiterFallback(caseRecord!, 3).finished).toBe(true);
  });

  it("no menciona pago ni códigos cuando el caso no tiene esas señales", () => {
    const withoutPayment = cases.find(
      (item) => item.isScam && !item.signals.P && item.signals.E,
    );

    expect(withoutPayment).toBeDefined();

    const messages = [0, 1, 2]
      .map((turn) => buildRecruiterFallback(withoutPayment!, turn).message)
      .join(" ");

    expect(messages).not.toMatch(/consign|pago/i);
    expect(messages).toMatch(/código/i);
  });

  it("en un caso legítimo responde de forma transparente", () => {
    const legit = cases.find((item) => !item.isScam);

    expect(legit).toBeDefined();

    const first = buildRecruiterFallback(legit!, 0);
    expect(first.message).toMatch(/página oficial/i);
    expect(first.message).not.toMatch(/pago|código/i);
  });
});

describe("respaldo del consejo", () => {
  it("lista solo las señales que el caso realmente tiene", () => {
    const caseRecord = cases.find((item) => item.id === "job-d1");

    expect(caseRecord).toBeDefined();
    expect(buildAdviceFallback(caseRecord!).signals).toEqual([
      "P",
      "A",
      "R",
      "E",
    ]);
  });

  it("no inventa señales en un caso legítimo", () => {
    const legit = cases.find((item) => !item.isScam);

    expect(legit).toBeDefined();
    expect(buildAdviceFallback(legit!).signals).toEqual([]);
    expect(buildAdviceFallback(legit!).message).toMatch(/canal oficial/i);
  });
});
