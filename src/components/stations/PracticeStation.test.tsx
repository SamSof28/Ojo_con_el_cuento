// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { practiceCases } from "@/content/cases";
import type { CaseAnswer } from "@/domain/types";
import { PracticeStation } from "./PracticeStation";

const caseRecord = practiceCases[0];

function answerFor(
  action: CaseAnswer["selectedAction"],
  perfectSignals = true,
): CaseAnswer {
  return {
    caseId: caseRecord.id,
    selectedSignals: perfectSignals
      ? { ...caseRecord.signals }
      : { P: false, A: false, R: false, E: false },
    selectedAction: action,
  };
}

const baseProps = {
  index: 0,
  onAnswer: vi.fn(),
  onNext: vi.fn(),
  onStartFinal: vi.fn(),
  onRestartPractice: vi.fn(),
};

describe("PracticeStation", () => {
  it("muestra el caso y el avance de la práctica", () => {
    render(<PracticeStation {...baseProps} answers={{}} />);

    expect(screen.getByText("Caso 1 de 6")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Aquí sí puedes equivocarte y volver a intentar.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Siguiente caso" }),
    ).not.toBeInTheDocument();
  });

  it("muestra feedback inmediato y la explicación base al responder", () => {
    render(
      <PracticeStation
        {...baseProps}
        answers={{
          [caseRecord.id]: answerFor(caseRecord.correctAction),
        }}
      />,
    );

    expect(screen.getByText("Viste lo importante.")).toBeInTheDocument();
    expect(screen.getByText(/Por qué:/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Siguiente caso" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Intentar con otro caso" }),
    ).not.toBeInTheDocument();
  });

  it("permite reintentar con otro caso cuando la respuesta no fue perfecta", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(
      <PracticeStation
        {...baseProps}
        onNext={onNext}
        answers={{
          [caseRecord.id]: answerFor("proceed", false),
        }}
      />,
    );

    const retry = screen.getByRole("button", {
      name: "Intentar con otro caso",
    });
    expect(retry).toBeInTheDocument();

    await user.click(retry);
    expect(onNext).toHaveBeenCalledWith(false);
  });

  it("lleva a la prueba final desde el último caso", async () => {
    const user = userEvent.setup();
    const onStartFinal = vi.fn();
    const lastCase = practiceCases[practiceCases.length - 1];

    render(
      <PracticeStation
        {...baseProps}
        index={practiceCases.length - 1}
        onStartFinal={onStartFinal}
        answers={{
          [lastCase.id]: {
            caseId: lastCase.id,
            selectedSignals: { ...lastCase.signals },
            selectedAction: lastCase.correctAction,
          },
        }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Ir a la prueba final" }),
    );
    expect(onStartFinal).toHaveBeenCalledTimes(1);
  });

  it("incluye el simulador y el consejo sin bloquear la práctica", () => {
    render(
      <PracticeStation
        {...baseProps}
        answers={{
          [caseRecord.id]: answerFor(caseRecord.correctAction),
        }}
      />,
    );

    expect(
      screen.getByText("Hablar con el personaje (simulador)", {
        selector: "summary",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Aconseja a un familiar", { selector: "summary" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pedir una explicación al coach" }),
    ).toBeInTheDocument();
  });
});
