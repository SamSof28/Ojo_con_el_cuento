import { SignalSeal } from "@/components/Brand";
import { ScoreBars } from "@/components/ScoreBars";
import { StationHeading } from "@/components/StationHeading";
import { diagnosticCases, finalCases, getCaseById } from "@/content/cases";
import { FAMILY_LABELS, SIGNAL_INFO } from "@/content/pare";
import { isMastery, scoreSession } from "@/domain/scoring";
import type { CaseAnswer } from "@/domain/types";

interface ResultStationProps {
  diagnosticAnswers: Record<string, CaseAnswer>;
  finalAnswers: Record<string, CaseAnswer>;
  onReset: () => void;
}

function formatPoints(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded);

  return text.replace(".", ",");
}

function formatChange(value: number): string {
  if (value === 0) {
    return "sin cambio";
  }

  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : "−";

  return `${sign}${String(Math.abs(rounded)).replace(".", ",")} puntos porcentuales`;
}

const HABITS = [
  "Guarda los números de tus familiares y llama siempre a esos cuando te digan que hay una emergencia.",
  "Acuerda una palabra clave familiar para confirmar que una emergencia es real.",
  "Nunca pagues ni compartas códigos antes de verificar por un canal que tú ya conocías.",
] as const;

export function ResultStation({
  diagnosticAnswers,
  finalAnswers,
  onReset,
}: ResultStationProps) {
  const before = scoreSession(
    diagnosticCases,
    Object.values(diagnosticAnswers),
  );
  const after = scoreSession(finalCases, Object.values(finalAnswers));
  const mastery = isMastery(after);
  const improvement = Math.round((after.percent - before.percent) * 10) / 10;
  const weakestSignals = (Object.keys(SIGNAL_INFO) as Array<keyof typeof SIGNAL_INFO>)
    .filter((signal) => after.byLetter[signal].percent < 100)
    .sort((a, b) => after.byLetter[a].percent - after.byLetter[b].percent);

  return (
    <section aria-labelledby="station-title">
      <StationHeading
        kicker="Estación 5 · Resultado"
        title={
          mastery
            ? "Alcanzaste el umbral de dominio."
            : "Todavía no alcanzas el umbral de dominio."
        }
        lead={
          mastery
            ? "Obtuviste al menos 8 de 10 en la prueba final. Este resultado es de esta sesión y no es un certificado."
            : "Obtuviste menos de 8 de 10 en la prueba final. No es un fracaso: mira las letras que más te costaron y vuelve a practicar cuando quieras."
        }
      />

      <div className="score-hero" aria-live="polite">
        <div>
          <p className="score-hero__number">
            {formatPoints(after.total)}
            <span> / {formatPoints(after.max)} puntos</span>
          </p>
          <p className="score-hero__label">
            Prueba final · Diagnóstico: {formatPoints(before.total)} de{" "}
            {formatPoints(before.max)}
          </p>
        </div>
        <span className={`chip ${mastery ? "chip--success" : "chip--alert"}`}>
          {mastery ? "Dominio alcanzado" : "Sigue practicando"}
        </span>
      </div>

      <div className="callout">
        <p>
          <strong>Comparación honesta:</strong> pasaste de{" "}
          {formatPoints(before.percent)}% a {formatPoints(after.percent)}% de
          aciertos. El cambio es {formatChange(improvement)}. No inventamos
          porcentajes de mejora ni testimonios: esto es solo lo que respondiste
          en esta sesión.
        </p>
      </div>

      <h2 className="section-title result-subtitle">Tus letras, antes y después</h2>
      <p className="section-lead">
        Cada barra muestra el porcentaje de aciertos en esa letra a lo largo de
        los cinco casos. No es una calificación de tu inteligencia: es una pista
        de dónde enfocar la próxima práctica.
      </p>
      <ScoreBars before={before} after={after} />

      {weakestSignals.length > 0 ? (
        <div className="card card--highlight result-card">
          <h2 className="card-title">Para practicar mañana</h2>
          <div className="flex flex-wrap gap-2">
            {weakestSignals.map((signal) => (
              <span className="chip" key={signal}>
                <SignalSeal letter={signal} size="sm" />
                {SIGNAL_INFO[signal].name}: {after.byLetter[signal].percent}%
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm">
            Vuelve a la práctica y fíjate en esas letras antes de responder.
            Puedes repetir el recorrido completo cuando quieras.
          </p>
        </div>
      ) : (
        <div className="card card--success result-card">
          <h2 className="card-title">Las cuatro letras quedaron claras</h2>
          <p className="text-sm">
            Acertaste el 100% de las señales en la prueba final. Aun así, la
            regla de oro sigue siendo la misma: verifica por un canal que ya
            conocías antes de actuar.
          </p>
        </div>
      )}

      <h2 className="section-title result-subtitle">Tu plan de hábitos</h2>
      <ol className="habit-list">
        {HABITS.map((habit, index) => (
          <li className="habit" key={habit}>
            <span className="habit__number" aria-hidden="true">
              {index + 1}
            </span>
            <p>{habit}</p>
          </li>
        ))}
      </ol>

      <details className="details-panel result-details">
        <summary>Ver el detalle de la prueba final</summary>
        <ul className="result-case-list">
          {after.cases.map((caseScore) => {
            const caseRecord = getCaseById(caseScore.caseId);

            if (!caseRecord) {
              return null;
            }

            return (
              <li key={caseScore.caseId}>
                <span>
                  <strong>{caseRecord.sender}</strong>
                  <span className="result-case-list__meta">
                    {" "}
                    · {FAMILY_LABELS[caseRecord.family]}
                  </span>
                </span>
                <span className="result-case-list__score">
                  {formatPoints(caseScore.total)} de 2
                </span>
              </li>
            );
          })}
        </ul>
      </details>

      <div className="btn-row result-actions">
        <button className="btn btn--primary" type="button" onClick={onReset}>
          Repetir el recorrido
        </button>
      </div>
      <p className="honest-note">
        Al repetir se borran las respuestas guardadas en este navegador. No se
        envía nada a un servidor ni se crea una cuenta.
      </p>
    </section>
  );
}
