import { SignalSeal } from "@/components/Brand";
import { ACTION_INFO, SIGNAL_INFO } from "@/content/pare";
import { scoreCase } from "@/domain/scoring";
import {
  SIGNALS,
  type CaseAnswer,
  type CaseRecord,
} from "@/domain/types";

export function FeedbackPanel({
  caseRecord,
  answer,
}: {
  caseRecord: CaseRecord;
  answer: CaseAnswer;
}) {
  const score = scoreCase(caseRecord, answer);
  const perfect = score.total === 2;
  const decisionOk = score.decision === 1;

  const heading = perfect
    ? "Viste lo importante."
    : decisionOk
      ? "La acción fue la segura. Revisa las señales."
      : "La acción segura era otra. Vamos a verla sin culpa.";

  return (
    <section
      className={`feedback ${perfect ? "feedback--ok" : "feedback--retry"}`}
      aria-labelledby="feedback-title"
      role="status"
    >
      <h2 id="feedback-title">{heading}</h2>
      <p>
        La acción segura era{" "}
        <strong>{ACTION_INFO[caseRecord.correctAction].label.toLowerCase()}</strong>
        . Tu respuesta:{" "}
        <strong>
          {answer.selectedAction
            ? ACTION_INFO[answer.selectedAction].label.toLowerCase()
            : "sin acción"}
        </strong>
        .
      </p>

      <ul className="signal-check-list" aria-label="Revisión de las señales PARE">
        {SIGNALS.map((signal) => {
          const matched = score.signalMatches[signal];
          const info = SIGNAL_INFO[signal];

          return (
            <li
              className={`signal-check ${matched ? "is-ok" : "is-miss"}`}
              key={signal}
            >
              <SignalSeal letter={signal} size="sm" />
              <span>
                <strong>
                  {info.letter} · {info.name}
                </strong>
                {matched ? " — la leíste bien" : " — vuelve a mirar el mensaje"}
              </span>
              <span className="signal-check__status">
                {matched ? "Acertaste" : "Revisa"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="callout">
        <p>
          <strong>Por qué:</strong> {caseRecord.explanation}
        </p>
      </div>

      <p className="mt-3 text-sm text-muted">
        Esta explicación viene del caso revisado, no de la IA. Así la
        retroalimentación base siempre está disponible.
      </p>
    </section>
  );
}
