import type { Phase } from "@/domain/session";

const STATIONS: readonly { phase: Phase; label: string; short: string }[] = [
  { phase: "diagnostic", label: "Diagnóstico", short: "Diagn." },
  { phase: "lesson", label: "Lección", short: "Lecc." },
  { phase: "practice", label: "Práctica", short: "Prác." },
  { phase: "final", label: "Prueba final", short: "Prueba" },
  { phase: "result", label: "Resultado", short: "Result." },
];

export function StationRoute({ current }: { current: Phase }) {
  const currentIndex = STATIONS.findIndex((station) => station.phase === current);

  return (
    <nav className="station-route" aria-label="Ruta de aprendizaje">
      <ol>
        {STATIONS.map((station, index) => {
          const isCurrent = index === currentIndex;
          const isComplete = index < currentIndex;

          return (
            <li
              key={station.phase}
              className={
                isCurrent
                  ? "station-route__item is-current"
                  : isComplete
                    ? "station-route__item is-complete"
                    : "station-route__item"
              }
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="station-route__dot" aria-hidden="true">
                {isComplete ? "✓" : index + 1}
              </span>
              <span className="station-route__label">
                <span className="station-route__label-full">{station.label}</span>
                <span className="station-route__label-short" aria-hidden="true">
                  {station.short}
                </span>
              </span>
              <span className="sr-only">
                {isComplete
                  ? "Completado"
                  : isCurrent
                    ? "Estación actual"
                    : "Pendiente"}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="station-route__caption">
        Paso {currentIndex + 1} de {STATIONS.length}:{" "}
        <strong>{STATIONS[currentIndex]?.label}</strong>
      </p>
    </nav>
  );
}
