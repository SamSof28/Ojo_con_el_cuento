// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdultAccessGate } from "./AdultAccessGate";

describe("AdultAccessGate", () => {
  it("only reveals the app after the adult confirmation", () => {
    render(
      <AdultAccessGate>
        <p>Contenido de la experiencia</p>
      </AdultAccessGate>,
    );

    expect(screen.queryByText("Contenido de la experiencia")).not.toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", {
      name: "Confirmo que tengo 18 años o más.",
    });
    const continueButton = screen.getByRole("button", { name: "Continuar" });

    expect(continueButton).toBeDisabled();
    fireEvent.click(checkbox);
    expect(continueButton).toBeEnabled();
    fireEvent.click(continueButton);

    expect(screen.getByText("Contenido de la experiencia")).toBeInTheDocument();
  });
});
