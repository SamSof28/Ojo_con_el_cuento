import { ACTION_INFO } from "@/content/pare";
import { ACTIONS, type Action } from "@/domain/types";

interface ActionPickerProps {
  caseId: string;
  value: Action | null;
  onChange: (value: Action) => void;
  disabled?: boolean;
}

export function ActionPicker({
  caseId,
  value,
  onChange,
  disabled = false,
}: ActionPickerProps) {
  return (
    <fieldset className="fieldset" disabled={disabled}>
      <legend>¿Qué harías?</legend>
      <p className="field-hint">Elige una sola acción.</p>

      <div className="action-list">
        {ACTIONS.map((action) => {
          const info = ACTION_INFO[action];
          const inputId = `${caseId}-action-${action}`;

          return (
            <label className="option-card" htmlFor={inputId} key={action}>
              <input
                id={inputId}
                type="radio"
                name={`action-${caseId}`}
                value={action}
                checked={value === action}
                onChange={() => onChange(action)}
                disabled={disabled}
              />
              <span className="option-card__text">
                <span className="option-card__title">{info.label}</span>
                <span className="option-card__description">
                  {info.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
