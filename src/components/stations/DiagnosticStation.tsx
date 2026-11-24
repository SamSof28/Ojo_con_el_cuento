import { CasePlayer } from "@/components/CasePlayer";
import { StationHeading } from "@/components/StationHeading";
import { diagnosticCases } from "@/content/cases";
import type { CaseAnswer } from "@/domain/types";

interface DiagnosticStationProps {
  index: number;
  onAnswer: (answer: CaseAnswer, isLast: boolean) => void;
}

export function DiagnosticStation({ index, onAnswer }: DiagnosticStationProps) {
  const caseRecord = diagnosticCases[index];

  if (!caseRecord) {
    return (
      <p role="status">
        Estamos preparando la lección. Si no avanza, recarga la página.
      </p>
    );
  }

  const isLast = index === diagnosticCases.length - 1;
  const progress = Math.round((index / diagnosticCases.length) * 100);

  return (
    <section aria-labelledby="station-title">
      <StationHeading
        kicker="Estación 1 · Diagnóstico"
        title="¿Qué tan lejos llegas hoy?"
        lead="Cinco casos para saber de dónde partes. No hay pistas ni respuestas inmediatas: responde con lo que ves y al final comparamos."
      />

      <div className="progress-block">
        <div className="case-counter">
          <span>
            Caso {index + 1} de {diagnosticCases.length}
          </span>
          <span>{progress}% del diagnóstico</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Avance del diagnóstico"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="station-note">
        En esta estación no verás si acertaste. Guardamos tu respuesta para
        mostrarte la comparación al final.
      </p>

      <CasePlayer
        key={caseRecord.id}
        caseRecord={caseRecord}
        submitLabel={isLast ? "Terminar diagnóstico" : "Guardar y seguir"}
        onSubmit={(answer) => onAnswer(answer, isLast)}
      />
    </section>
  );
}
