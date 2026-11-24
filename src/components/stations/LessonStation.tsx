import { SignalSeal } from "@/components/Brand";
import { StationHeading } from "@/components/StationHeading";
import { LESSON_CARDS } from "@/content/lesson";
import { SIGNALS, type Signal } from "@/domain/types";

interface LessonStationProps {
  answers: Partial<Record<Signal, number>>;
  onAnswer: (signal: Signal, option: number) => void;
  onContinue: () => void;
}

export function LessonStation({
  answers,
  onAnswer,
  onContinue,
}: LessonStationProps) {
  const answeredCount = SIGNALS.filter(
    (signal) => answers[signal] !== undefined,
  ).length;
  const isComplete = answeredCount === SIGNALS.length;

  return (
    <section aria-labelledby="station-title">
      <StationHeading
        kicker="Estación 2 · Lección"
        title="Cuatro letras para hacer una pausa."
        lead="Cada tarjeta te enseña una señal y te hace una pregunta corta. No hay nota aquí: es para probar la idea antes de los casos."
      />

      <div className="progress-block">
        <div className="case-counter">
          <span>
            {answeredCount} de {SIGNALS.length} tarjetas respondidas
          </span>
          <span>{isComplete ? "Completa" : "En curso"}</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={SIGNALS.length}
          aria-valuenow={answeredCount}
          aria-label="Avance de la lección"
        >
          <div
            className="progress-fill"
            style={{ width: `${(answeredCount / SIGNALS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="lesson-list">
        {LESSON_CARDS.map((card) => {
          const selected = answers[card.signal];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === card.correctIndex;

          return (
            <article className="card lesson-card" key={card.signal}>
              <div className="lesson-card__head">
                <SignalSeal letter={card.signal} size="md" />
                <h2 className="lesson-card__title">{card.title}</h2>
              </div>
              <p className="lesson-card__body">{card.body}</p>

              <fieldset className="fieldset">
                <legend>{card.question}</legend>
                <div className="action-list">
                  {card.options.map((option, optionIndex) => {
                    const inputId = `lesson-${card.signal}-${optionIndex}`;

                    return (
                      <label className="option-card" htmlFor={inputId} key={option}>
                        <input
                          id={inputId}
                          type="radio"
                          name={`lesson-${card.signal}`}
                          checked={selected === optionIndex}
                          onChange={() => onAnswer(card.signal, optionIndex)}
                        />
                        <span className="option-card__text">
                          <span className="option-card__title">{option}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {isAnswered ? (
                <p
                  className={`lesson-feedback ${
                    isCorrect ? "lesson-feedback--ok" : "lesson-feedback--retry"
                  }`}
                  role="status"
                >
                  <strong>{isCorrect ? "Exacto. " : "Casi. "}</strong>
                  {card.feedback}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="btn-row">
        <button
          className="btn btn--primary"
          type="button"
          onClick={onContinue}
          disabled={!isComplete}
        >
          Ir a la práctica
        </button>
      </div>
      {!isComplete ? (
        <p className="station-note">
          Responde las cuatro tarjetas para continuar. Puedes cambiar tus
          respuestas antes de seguir.
        </p>
      ) : null}
    </section>
  );
}
