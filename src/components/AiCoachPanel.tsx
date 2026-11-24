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
          adultConfirmed: true,
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
    <section className="ai-panel" aria-labelledby="coach-title">
      <div className="ai-panel__header">
        <h2 className="ai-panel__title" id="coach-title">
          Una segunda mirada
        </h2>
        {data ? (
          <span className="ai-panel__source">
            {data.source === "ai" ? "Gemini en vivo" : "Respuestas preparadas"}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted">
        El coach te ayuda a pensar qué señal se te pasó. No cambia tu nota.
      </p>

      <button
        className="btn btn--secondary btn--small"
        type="button"
        onClick={askCoach}
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Pensando…"
          : status === "done"
            ? "Pedir otra explicación"
            : "Pedir una explicación al coach"}
      </button>

      <div aria-live="polite">
        {data ? (
          <div className="mt-3">
            <p>{data.explanation}</p>
            <p className="ai-panel__hint">{data.nextHint}</p>
            <p className="text-sm font-semibold">{data.encouragement}</p>
            {data.source === "fallback" ? (
              <p className="ai-panel__source">
                Usando una explicación preparada porque la IA no está
                disponible ahora.
              </p>
            ) : null}
          </div>
        ) : null}

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
