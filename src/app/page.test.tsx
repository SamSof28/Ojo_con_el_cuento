// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("muestra el nombre del producto", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Ojo con el Cuento" }),
    ).toBeInTheDocument();
  });
});
