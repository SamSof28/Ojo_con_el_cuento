"use client";

import { useState, type FormEvent } from "react";
import { ActionPicker } from "@/components/ActionPicker";
import { CaseMessage } from "@/components/CaseMessage";
import { SignalPicker } from "@/components/SignalPicker";
import { emptySignalMap } from "@/domain/scoring";
import type {
  Action,
  CaseAnswer,
  CaseRecord,
  SignalMap,
} from "@/domain/types";

interface CasePlayerProps {
  caseRecord: CaseRecord;
  initialAnswer?: CaseAnswer;
  readOnly?: boolean;
  submitLabel?: string;
  onSubmit: (answer: CaseAnswer) => void;
}

export function CasePlayer({
  caseRecord,
  initialAnswer,
  readOnly = false,
  submitLabel = "Revisar mi respuesta",
  onSubmit,
}: CasePlayerProps) {
  const [signals, setSignals] = useState<SignalMap>(
    initialAnswer?.selectedSignals ?? emptySignalMap(),
  );
  const [action, setAction] = useState<Action | null>(
    initialAnswer?.selectedAction ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!action) {
      setError("Elige una acción para continuar.");
      return;
    }

    setError(null);
    onSubmit({
      caseId: caseRecord.id,
      selectedSignals: signals,
      selectedAction: action,
    });
  }

  return (
    <div className="space-y-4">
      <CaseMessage caseRecord={caseRecord} />

      <form onSubmit={handleSubmit} noValidate>
        <SignalPicker
          caseId={caseRecord.id}
          value={signals}
          onChange={setSignals}
          disabled={readOnly}
        />
        <ActionPicker
          caseId={caseRecord.id}
          value={action}
          onChange={setAction}
          disabled={readOnly}
        />

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        {readOnly ? (
          <p className="mt-4 text-sm text-muted">
            Tu respuesta quedó guardada. Revisa la explicación antes de seguir.
          </p>
        ) : (
          <div className="btn-row">
            <button className="btn btn--primary" type="submit">
              {submitLabel}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
