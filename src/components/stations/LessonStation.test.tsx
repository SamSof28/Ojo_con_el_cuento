// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LessonStation } from "./LessonStation";

const completeAnswers = { P: 1, A: 2, R: 0, E: 1 } as const;

describe("LessonStation", () => {
  it("no deja continuar hasta responder las cuatro tarjetas", () => {
    render(
      <LessonStation answers={{}} onAnswer={vi.fn()} onContinue={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Ir a la práctica" }),
    ).toBeDisabled();
    expect(screen.getByText("0 de 4 tarjetas respondidas")).toBeInTheDocument();
  });

  it("guarda la opción elegida y muestra retroalimentación", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();

    render(
      <LessonStation answers={{}} onAnswer={onAnswer} onContinue={vi.fn()} />,
    );

    await user.click(
      screen.getByRole("radio", {
        name: "Consigna $50.000 para activar tu cuenta",
      }),
    );

    expect(onAnswer).toHaveBeenCalledWith("P", 1);
  });

  it("muestra el feedback de las respuestas correctas e incorrectas", () => {
    render(
      <LessonStation
        answers={{ P: 1, A: 0, R: 0, E: 1 }}
        onAnswer={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    const feedbacks = screen.getAllByRole("status");

    expect(feedbacks).toHaveLength(4);
    expect(
      feedbacks.some((element) => element.textContent?.includes("Exacto")),
    ).toBe(true);
    expect(
      feedbacks.some((element) => element.textContent?.includes("Casi")),
    ).toBe(true);
  });

  it("habilita el paso a la práctica cuando están las cuatro respuestas", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    render(
      <LessonStation
        answers={completeAnswers}
        onAnswer={vi.fn()}
        onContinue={onContinue}
      />,
    );

    const button = screen.getByRole("button", { name: "Ir a la práctica" });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
