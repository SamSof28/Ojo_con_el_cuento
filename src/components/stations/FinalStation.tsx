import { CasePlayer } from "@/components/CasePlayer";
import { StationHeading } from "@/components/StationHeading";
import { finalCases } from "@/content/cases";
import type { CaseAnswer } from "@/domain/types";

interface FinalStationProps {
  index: number;
  onAnswer: (answer: CaseAnswer, isLast: boolean) => void;
}

export function FinalStation({ index, onAnswer }: FinalStationProps) {
  const caseRecord = finalCases[index];

  if (!caseRecord) {
    return (
      <p role="status">
        Estamos preparando el resultado. Si no avanza, recarga la página.
      </p>
    );
  }

  const isLast = index === finalCases.length - 1;
  const progress = Math.round((index / finalCases.length) * 100);

  return (
    <section aria-labelledby="station-title">
      <StationHeading
        kicker="Estación 4 · Prueba final"
        title="Cinco casos nuevos, sin pistas."
        lead="Esta prueba vale 10 puntos y el umbral de dominio es 8. Al terminar vas a ver tu comparación con el diagnóstico y las señales que más te costaron."
      />

      <div className="progress-block">
        <div className="case-counter">
          <span>
            Caso {index + 1} de {finalCases.length}
          </span>
          <span>{progress}% de la prueba</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Avance de la prueba final"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="station-note">
        No hay explicación hasta terminar. El puntaje lo calcula el sistema con
        tus respuestas, no la IA.
      </p>

      <CasePlayer
        key={caseRecord.id}
        caseRecord={caseRecord}
        submitLabel={isLast ? "Terminar la prueba" : "Guardar y seguir"}
        onSubmit={(answer) => onAnswer(answer, isLast)}
      />
    </section>
  );
}
