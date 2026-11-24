"use client";

import { useState, type FormEvent } from "react";
import { SignalSeal } from "@/components/Brand";
import { buildAdviceFallback } from "@/content/fallbacks";
import { SIGNAL_INFO } from "@/content/pare";
import {
  adviceResponseSchema,
  type AdviceResponse,
} from "@/domain/schemas";
import { SIGNALS, type CaseRecord, type Signal } from "@/domain/types";
import { postJson } from "@/lib/fetch-json";

const MAX_ADVICE_LENGTH = 400;

interface AdvicePanelProps {
  caseRecord: CaseRecord;
}

interface AdviceChecklist {
  message: string;
  signals: Signal[];
}

export function AdvicePanel({ caseRecord }: AdvicePanelProps) {
  const [advice, setAdvice] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<AdviceResponse | null>(null);
  const [fallback, setFallback] = useState<AdviceChecklist | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presentSignals = SIGNALS.filter((signal) => caseRecord.signals[signal]);
  const inputId = `advice-${caseRecord.id}`;
  const isBusy = status === "loading";

  async function submitAdvice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = advice.trim();

    if (text.length < 10) {
      setError("Escribe al menos una frase para poder revisar tu consejo.");
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      const response = await postJson(
        "/api/ai/advice",
        { caseId: caseRecord.id, advice: text },
        adviceResponseSchema,
      );

      if (response.source === "fallback") {
        setResult(null);
        setFallback(buildAdviceFallback(caseRecord));
      } else {
        setResult(response);
        setFallback(null);
      }
      setStatus("done");
    } catch {
      setResult(null);
      setFallback(buildAdviceFallback(caseRecord));
      setStatus("done");
    }
  }

  return (
    <section className="ai-panel" aria-labelledby={`advice-title-${caseRecord.id}`}>
      <div className="ai-panel__header">
        <h2 className="ai-panel__title" id={`advice-title-${caseRecord.id}`}>
          Practica cómo aconsejar a alguien
        </h2>
        {result ? (
          <span className="ai-panel__source">
            {result.source === "ai" ? "Gemini en vivo" : "Respuestas preparadas"}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted">
        Imagina que alguien de tu familia recibió este mensaje. Gemini compara
        tu consejo con las señales verificadas del caso y te ayuda a completarlo.
        Esto no entra en tu puntaje.
      </p>

      <form onSubmit={submitAdvice} noValidate>
        <label className="field-label" htmlFor={inputId}>
          Tu consejo
        </label>
        <textarea
          className="textarea"
          id={inputId}
          value={advice}
          onChange={(event) => setAdvice(event.target.value)}
          maxLength={MAX_ADVICE_LENGTH}
          placeholder="Ej.: No consignes plata ni compartas códigos. Llama a la empresa por el número de su página oficial."
          disabled={isBusy}
        />
        <p className="char-count">
          {advice.length} / {MAX_ADVICE_LENGTH}
        </p>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="btn-row">
          <button
            className="btn btn--secondary btn--small"
            type="submit"
            disabled={isBusy || advice.trim().length < 10}
          >
            {isBusy ? "Revisando…" : "Revisar mi consejo"}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {result ? (
          <div className="mt-3">
            <p>{result.message}</p>
            {presentSignals.length > 0 ? (
              <ul className="cover-list" aria-label="Señales que cubrió tu consejo">
                {presentSignals.map((signal) => (
                  <li
                    className={`cover-chip ${
                      result.covers[signal]
                        ? "cover-chip--yes"
                        : "cover-chip--no"
                    }`}
                    key={signal}
                  >
                    <SignalSeal letter={signal} size="sm" />
                    {result.covers[signal]
                      ? `Cubriste ${SIGNAL_INFO[signal].name}`
                      : `Falta ${SIGNAL_INFO[signal].name}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                Este caso no tiene señales PARE. Un buen consejo es confirmar por
                el canal oficial antes de compartir datos.
              </p>
            )}
          </div>
        ) : null}

        {fallback ? (
          <div className="mt-3">
            <p>{fallback.message}</p>
            {fallback.signals.length > 0 ? (
              <ul className="cover-list" aria-label="Lista de chequeo de señales">
                {fallback.signals.map((signal) => (
                  <li className="cover-chip cover-chip--no" key={signal}>
                    <SignalSeal letter={signal} size="sm" />
                    ¿Mencionaste {SIGNAL_INFO[signal].name}?
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="ai-panel__source">
              La IA no está disponible ahora. Usa la lista para autoevaluarte.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
