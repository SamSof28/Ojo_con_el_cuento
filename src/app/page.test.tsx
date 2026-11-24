// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("presenta el producto y el método PARE", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Reconocer una estafa también se aprende.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ojo con el/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Cuatro señales para hacer una pausa.",
      }),
    ).toBeInTheDocument();
  });

  it("invita a comenzar el recorrido sin registro", () => {
    render(<Home />);

    const startLinks = screen.getAllByRole("link", {
      name: "Empezar el recorrido",
    });

    expect(startLinks.length).toBeGreaterThanOrEqual(1);
    expect(startLinks[0]).toHaveAttribute("href", "/sesion");
    expect(screen.getByText("Sin registro", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText(/≈ 15 minutos/)).toBeInTheDocument();
  });

  it("aclara que la IA no califica y que todo es ficticio", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /Un tutor que usa el caso, no un chatbot genérico/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/El puntaje lo calcula el sistema, nunca la IA/))
      .toBeInTheDocument();
    expect(screen.getByText(/Si la IA no responde/)).toBeInTheDocument();
    expect(
      screen.getByText(/Todo es ficticio/, { selector: "strong" }),
    ).toBeInTheDocument();
  });
});
