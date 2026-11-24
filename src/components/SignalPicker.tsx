import { SignalSeal } from "@/components/Brand";
import { SIGNAL_INFO } from "@/content/pare";
import { SIGNALS, type SignalMap } from "@/domain/types";

interface SignalPickerProps {
  caseId: string;
  value: SignalMap;
  onChange: (value: SignalMap) => void;
  disabled?: boolean;
}

export function SignalPicker({
  caseId,
  value,
  onChange,
  disabled = false,
}: SignalPickerProps) {
  const hasSignals = SIGNALS.some((signal) => value[signal]);

  return (
    <fieldset className="fieldset" disabled={disabled}>
      <legend>¿Qué señales ves?</legend>
      <p className="field-hint">
        Marca todas las que aparezcan. Si no ves ninguna, déjalas sin marcar.
      </p>

      <div className="signal-grid">
        {SIGNALS.map((signal) => {
          const info = SIGNAL_INFO[signal];
          const inputId = `${caseId}-signal-${signal}`;

          return (
            <label className="option-card" htmlFor={inputId} key={signal}>
              <input
                id={inputId}
                type="checkbox"
                checked={value[signal]}
                onChange={() =>
                  onChange({ ...value, [signal]: !value[signal] })
                }
                disabled={disabled}
              />
              <SignalSeal letter={signal} size="sm" />
              <span className="option-card__text">
                <span className="option-card__title">
                  {info.letter} · {info.name}
                </span>
                <span className="option-card__description">
                  {info.question}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-3">
        <button
          className="btn btn--secondary btn--small"
          type="button"
          onClick={() => onChange({ P: false, A: false, R: false, E: false })}
          aria-pressed={!hasSignals}
          disabled={disabled}
        >
          No veo ninguna señal
        </button>
      </div>
    </fieldset>
  );
}
