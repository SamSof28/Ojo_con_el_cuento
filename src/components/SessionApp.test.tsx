// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { practiceCases, finalCases } from "@/content/cases";
import { createSession } from "@/domain/session";
import type { CaseAnswer } from "@/domain/types";
import { SESSION_STORAGE_KEY, saveSession } from "@/lib/session-storage";
import { SessionApp } from "./SessionApp";

function perfectAnswers(
  cases: readonly (typeof finalCases)[number][],
): Record<string, CaseAnswer> {
  return Object.fromEntries(
    cases.map((caseRecord) => [
      caseRecord.id,
      {
        caseId: caseRecord.id,
        selectedSignals: { ...caseRecord.signals },
        selectedAction: caseRecord.correctAction,
      },
    ]),
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("SessionApp", () => {
  it("monta el diagnóstico y guarda la sesión en este navegador", async () => {
    render(<SessionApp />);

    expect(await screen.findByText("Caso 1 de 5")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "¿Qué tan lejos llegas hoy?" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).not.toBeNull();
    });
  });

  it("recupera una lección guardada con sus respuestas", async () => {
    saveSession(
      {
        ...createSession("2026-11-24T00:00:00.000Z"),
        phase: "lesson",
        lessonAnswers: { P: 1, A: 2, R: 0, E: 1 },
      },
      window.localStorage,
    );

    render(<SessionApp />);

    expect(
      await screen.findByRole("heading", {
        name: "Cuatro letras para hacer una pausa.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ir a la práctica" }),
    ).toBeEnabled();
  });

  it("recupera el feedback de una práctica ya respondida", async () => {
    const caseRecord = practiceCases[0];

    saveSession(
      {
        ...createSession("2026-11-24T00:00:00.000Z"),
        phase: "practice",
        practiceAnswers: {
          [caseRecord.id]: {
            caseId: caseRecord.id,
            selectedSignals: { ...caseRecord.signals },
            selectedAction: caseRecord.correctAction,
          },
        },
      },
      window.localStorage,
    );

    render(<SessionApp />);

    expect(await screen.findByText("Viste lo importante.")).toBeInTheDocument();
  });

  it("muestra el resultado final de una sesión terminada", async () => {
    saveSession(
      {
        ...createSession("2026-11-24T00:00:00.000Z"),
        phase: "result",
        finalAnswers: perfectAnswers(finalCases),
      },
      window.localStorage,
    );

    render(<SessionApp />);

    expect(
      await screen.findByRole("heading", {
        name: "Alcanzaste el umbral de dominio.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dominio alcanzado")).toBeInTheDocument();
  });
});
