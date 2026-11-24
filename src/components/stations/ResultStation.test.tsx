// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { diagnosticCases, finalCases } from "@/content/cases";
import type { CaseAnswer } from "@/domain/types";
import { ResultStation } from "./ResultStation";

function perfectAnswers(cases: typeof finalCases): Record<string, CaseAnswer> {
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

describe("ResultStation", () => {
  it("muestra el dominio solo cuando la prueba final llega a 8 de 10", () => {
    render(
      <ResultStation
        diagnosticAnswers={perfectAnswers(diagnosticCases)}
        finalAnswers={perfectAnswers(finalCases)}
        onReset={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Alcanzaste el umbral de dominio.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/\/ 10 puntos/)).toBeInTheDocument();
    expect(screen.getByText("Dominio alcanzado")).toBeInTheDocument();
  });

  it("no muestra frases de logro cuando el puntaje no las respalda", () => {
    render(
      <ResultStation
        diagnosticAnswers={{}}
        finalAnswers={{}}
        onReset={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Todavía no alcanzas el umbral de dominio.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sigue practicando")).toBeInTheDocument();
    expect(
      screen.queryByText("Dominio alcanzado"),
    ).not.toBeInTheDocument();
  });

  it("compara antes y después por letra y ofrece el detalle", () => {
    render(
      <ResultStation
        diagnosticAnswers={{}}
        finalAnswers={perfectAnswers(finalCases)}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText(/Comparación honesta/)).toBeInTheDocument();
    expect(screen.getByText(/Tus letras, antes y después/)).toBeInTheDocument();
    expect(
      screen.getByText("Ver el detalle de la prueba final"),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/de 2/)).toHaveLength(5);
  });

  it("permite repetir el recorrido", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <ResultStation
        diagnosticAnswers={{}}
        finalAnswers={{}}
        onReset={onReset}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Repetir el recorrido" }),
    );
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
