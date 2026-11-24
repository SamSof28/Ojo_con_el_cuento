// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { diagnosticCases } from "@/content/cases";
import { CasePlayer } from "./CasePlayer";

const caseRecord = diagnosticCases[0];

describe("CasePlayer", () => {
  it("exige elegir una acción antes de enviar", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CasePlayer caseRecord={caseRecord} onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: "Revisar mi respuesta" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Elige una acción para continuar.",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("guarda señales y acción con el id del caso", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CasePlayer caseRecord={caseRecord} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("checkbox", { name: /P · Pago/ }));
    await user.click(screen.getByRole("checkbox", { name: /A · Apuro/ }));
    await user.click(screen.getByRole("radio", { name: /Cortar/ }));
    await user.click(
      screen.getByRole("button", { name: "Revisar mi respuesta" }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      caseId: caseRecord.id,
      selectedSignals: { P: true, A: true, R: false, E: false },
      selectedAction: "cut",
    });
  });

  it("permite marcar que no hay ninguna señal", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <CasePlayer
        caseRecord={caseRecord}
        initialAnswer={{
          caseId: caseRecord.id,
          selectedSignals: { P: true, A: false, R: false, E: false },
          selectedAction: "cut",
        }}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "No veo ninguna señal" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Revisar mi respuesta" }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      caseId: caseRecord.id,
      selectedSignals: { P: false, A: false, R: false, E: false },
      selectedAction: "cut",
    });
  });

  it("en modo de solo lectura no muestra el botón de envío", () => {
    render(
      <CasePlayer
        caseRecord={caseRecord}
        initialAnswer={{
          caseId: caseRecord.id,
          selectedSignals: { P: true, A: true, R: false, E: false },
          selectedAction: "cut",
        }}
        readOnly
        onSubmit={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Revisar mi respuesta" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Tu respuesta quedó guardada/),
    ).toBeInTheDocument();
  });

  it("es navegable con teclado", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CasePlayer caseRecord={caseRecord} onSubmit={onSubmit} />);

    const firstSignal = screen.getByRole("checkbox", { name: /P · Pago/ });
    firstSignal.focus();
    await user.keyboard(" ");
    await user.click(screen.getByRole("radio", { name: /Cortar/ }));
    await user.click(
      screen.getByRole("button", { name: "Revisar mi respuesta" }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedSignals: { P: true, A: false, R: false, E: false },
      }),
    );
  });
});
