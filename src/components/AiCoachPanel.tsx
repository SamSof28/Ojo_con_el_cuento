"use client";

import { useState } from "react";
import { coachResponseSchema, type CoachResponse } from "@/domain/schemas";
import type { Action, SignalMap } from "@/domain/types";

interface AiCoachPanelProps {
  caseId: string;
  selectedSignals: SignalMap;
  selectedAction: Action | null;
}

type Status = "idle" | "loading" | "done" | "error";

export function AiCoachPanel({
  caseId,
  selectedSignals,
  selectedAction,
}: AiCoachPanelProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<CoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function askCoach() {
    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          selectedSignals,
          selectedAction,
        }),
      });

      if (!response.ok) {
        throw new Error(`El coach respondió ${response.status}`);
      }

      const payload: unknown = await response.json();
      const parsed = coachResponseSchema.safeParse(payload);

      if (!parsed.success) {
        throw new Error("La respuesta del coach no tenía el formato esperado");
      }

      setData(parsed.data);
      setStatus("done");
    } catch {
      setError(
        "No pudimos conectar con el coach. La explicación del caso sigue disponible arriba.",
      );
      setStatus("error");
    }
  }

  return (
    <section
      className="ai-panel ai-panel--featured"
      aria-labelledby="coach-title"
    >
      <div className="ai-panel__header">
        <h2 className="ai-panel__title" id="coach-title">
          El tutor PARE de Gemini
        </h2>
        {data ? (
          <span className="ai-panel__source">
            {data.source === "ai"
              ? "Respuesta de Gemini"
              : "Explicación preparada"}
          </span>
        ) : (
          <span className="ai-panel__source">Usa el caso y tu respuesta</span>
        )}
      </div>

      <p className="ai-panel__intro">
        No te da una nota: contrasta las señales que marcaste con este caso,
        explica una pista concreta y te deja una pregunta para pensar.
      </p>

      <button
        className="btn btn--primary"
        type="button"
        onClick={askCoach}
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Pensando…"
          : status === "done"
            ? "Pedir otra explicación"
            : status === "error"
              ? "Intentar conectar de nuevo"
              : "Pedir retroalimentación a Gemini"}
      </button>

      <div aria-live="polite">
        {data ? (
          <div className="mt-3">
            <p>{data.explanation}</p>
            <p className="ai-panel__hint">
              <strong>Para pensar:</strong> {data.nextHint}
            </p>
            <p className="text-sm font-semibold">{data.encouragement}</p>
            {data.source === "fallback" ? (
              <p className="ai-panel__fallback">
                Gemini no está disponible ahora. Esta explicación viene del
                caso revisado.
              </p>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="form-error" role="alert">
            {error} Puedes continuar con la explicación preparada del caso.
          </p>
        ) : null}
      </div>
    </section>
  );
}
