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
        name: "Cuatro letras para hacer una pausa.",
      }),
    ).toBeInTheDocument();
  });

  it("invita a comenzar el recorrido sin registro", () => {
    render(<Home />);

    const startLinks = screen.getAllByRole("link", { name: "Empezar ahora" });

    expect(startLinks.length).toBeGreaterThanOrEqual(1);
    expect(startLinks[0]).toHaveAttribute("href", "/sesion");
    expect(screen.getByText("Sin registro", { selector: "li" })).toBeInTheDocument();
    expect(screen.getByText(/umbral de dominio es 8 de 10 puntos/)).toBeInTheDocument();
  });

  it("aclara que la IA no califica y que todo es ficticio", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /El coach de IA explica, pero nunca te califica/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Gemini está conectado al coach/)).toBeInTheDocument();
    expect(
      screen.getByText(/Todo es ficticio/, { selector: "strong" }),
    ).toBeInTheDocument();
  });
});
