"use client";

import { useState, type FormEvent } from "react";
import { buildRecruiterFallback } from "@/content/fallbacks";
import {
  recruiterResponseSchema,
  type RecruiterResponse,
  type RecruiterTurn,
} from "@/domain/schemas";
import type { CaseRecord } from "@/domain/types";
import { postJson } from "@/lib/fetch-json";

interface SimulatorPanelProps {
  caseRecord: CaseRecord;
}

export function SimulatorPanel({ caseRecord }: SimulatorPanelProps) {
  const [turns, setTurns] = useState<RecruiterTurn[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [finished, setFinished] = useState(false);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const inputId = `simulator-${caseRecord.id}`;
  const isBusy = status === "loading";

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();

    if (!text || isBusy || finished) {
      return;
    }

    const assistantTurns = turns.filter((turn) => turn.role === "assistant").length;
    const history = turns.slice(-6);
    const userTurn: RecruiterTurn = { role: "user", text };

    setTurns((current) => [...current, userTurn]);
    setInput("");
    setStatus("loading");
    setNotice(null);

    try {
      const response: RecruiterResponse = await postJson(
        "/api/ai/recruiter",
        { caseId: caseRecord.id, history, userMessage: text },
        recruiterResponseSchema,
      );

      setTurns((current) => [
        ...current,
        { role: "assistant", text: response.message },
      ]);
      setFinished(response.finished);
      setSource(response.source);
      setStatus("done");
      setNotice(
        response.source === "fallback"
          ? "Usando respuestas preparadas para esta simulación."
          : null,
      );
    } catch {
      const fallback = buildRecruiterFallback(caseRecord, assistantTurns);

      setTurns((current) => [
        ...current,
        { role: "assistant", text: fallback.message },
      ]);
      setFinished(fallback.finished);
      setSource("fallback");
      setStatus("done");
      setNotice(
        "La IA no está disponible ahora. Sigo con un guion preparado para que practiques.",
      );
    }
  }

  return (
    <section className="ai-panel" aria-labelledby={`simulator-title-${caseRecord.id}`}>
      <div className="ai-panel__header">
        <h2 className="ai-panel__title" id={`simulator-title-${caseRecord.id}`}>
          Simulador de conversación
        </h2>
        {source ? (
          <span className="ai-panel__source">
            {source === "ai" ? "Gemini en vivo" : "Respuestas preparadas"}
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted">
        Escribe una pregunta como si estuvieras hablando con esta persona. El
        personaje responde sin decirte la respuesta correcta. Esto es una
        simulación: no escribas datos reales.
      </p>

      {turns.length === 0 ? (
        <p className="simulator-invite">
          Prueba preguntar: “¿Puedo verificar la empresa por otro canal?” o
          “¿Por qué necesitan un pago?”.
        </p>
      ) : (
        <div className="chat-log" aria-live="polite" aria-label="Conversación simulada">
          {turns.map((turn, index) => (
            <div
              className={`chat-log__row chat-log__row--${turn.role}`}
              key={`${turn.role}-${index}`}
            >
              <span className="chat-log__bubble">{turn.text}</span>
            </div>
          ))}
          {isBusy ? (
            <div className="chat-log__row chat-log__row--assistant">
              <span className="chat-log__bubble">Pensando…</span>
            </div>
          ) : null}
        </div>
      )}

      {notice ? (
        <p className="ai-panel__source" role="status">
          {notice}
        </p>
      ) : null}

      {finished ? (
        <p className="text-sm font-semibold">
          La simulación terminó. Ahora decide qué harías con el caso.
        </p>
      ) : (
        <form className="chat-compose" onSubmit={sendMessage}>
          <label className="visually-hidden" htmlFor={inputId}>
            Tu pregunta para el personaje
          </label>
          <input
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={300}
            placeholder="Escribe tu pregunta…"
            disabled={isBusy}
            autoComplete="off"
          />
          <button
            className="btn btn--primary btn--small"
            type="submit"
            disabled={isBusy || input.trim().length === 0}
          >
            Enviar
          </button>
        </form>
      )}

      <p className="char-count">{input.length} / 300</p>
    </section>
  );
}
