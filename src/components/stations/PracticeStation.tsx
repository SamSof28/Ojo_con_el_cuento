import { AdvicePanel } from "@/components/AdvicePanel";
import { AiCoachPanel } from "@/components/AiCoachPanel";
import { CasePlayer } from "@/components/CasePlayer";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { SimulatorPanel } from "@/components/SimulatorPanel";
import { StationHeading } from "@/components/StationHeading";
import { practiceCases } from "@/content/cases";
import { scoreCase } from "@/domain/scoring";
import type { CaseAnswer } from "@/domain/types";

interface PracticeStationProps {
  index: number;
  answers: Record<string, CaseAnswer>;
  onAnswer: (answer: CaseAnswer) => void;
  onNext: (isLast: boolean) => void;
  onStartFinal: () => void;
  onRestartPractice: () => void;
}

export function PracticeStation({
  index,
  answers,
  onAnswer,
  onNext,
  onStartFinal,
  onRestartPractice,
}: PracticeStationProps) {
  const caseRecord = practiceCases[index];

  if (!caseRecord) {
    return (
      <p role="status">
        Estamos preparando la práctica. Si no avanza, recarga la página.
      </p>
    );
  }

  const answer = answers[caseRecord.id];
  const score = answer ? scoreCase(caseRecord, answer) : null;
  const isLast = index === practiceCases.length - 1;
  const progress = Math.round((index / practiceCases.length) * 100);

  function retry() {
    if (isLast) {
      onRestartPractice();
      return;
    }

    onNext(false);
  }

  return (
    <section aria-labelledby="station-title">
      <StationHeading
        kicker="Estación 3 · Práctica"
        title="Aquí sí puedes equivocarte y volver a intentar."
        lead="Cada caso te muestra la explicación apenas respondes. Puedes hablar con el personaje y practicar cómo le explicarías el riesgo a alguien de tu familia."
      />

      <div className="progress-block">
        <div className="case-counter">
          <span>
            Caso {index + 1} de {practiceCases.length}
          </span>
          <span>{progress}% de la práctica</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Avance de la práctica"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <CasePlayer
        key={caseRecord.id}
        caseRecord={caseRecord}
        initialAnswer={answer}
        readOnly={Boolean(answer)}
        submitLabel="Revisar mi respuesta"
        onSubmit={onAnswer}
      />

      {answer && score ? (
        <div className="feedback-stack" aria-live="polite">
          <FeedbackPanel caseRecord={caseRecord} answer={answer} />

          <details className="details-panel">
            <summary>Hablar con el personaje (simulador)</summary>
            <SimulatorPanel caseRecord={caseRecord} />
          </details>

          <details className="details-panel">
            <summary>Aconseja a un familiar</summary>
            <AdvicePanel caseRecord={caseRecord} />
          </details>

          <AiCoachPanel
            caseId={caseRecord.id}
            selectedSignals={answer.selectedSignals}
            selectedAction={answer.selectedAction}
          />

          {score.total < 2 ? (
            <div className="btn-row">
              <button
                className="btn btn--secondary"
                type="button"
                onClick={retry}
              >
                Intentar con otro caso
              </button>
            </div>
          ) : null}

          <div className="btn-row">
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => (isLast ? onStartFinal() : onNext(false))}
            >
              {isLast ? "Ir a la prueba final" : "Siguiente caso"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
