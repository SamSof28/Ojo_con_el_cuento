import { SignalSeal } from "@/components/Brand";
import { SIGNAL_INFO } from "@/content/pare";
import { SIGNALS, type ScoreSummary } from "@/domain/types";

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function ScoreBars({
  before,
  after,
}: {
  before: ScoreSummary;
  after: ScoreSummary;
}) {
  return (
    <div className="score-grid">
      {SIGNALS.map((signal) => {
        const beforeValue = before.byLetter[signal];
        const afterValue = after.byLetter[signal];
        const info = SIGNAL_INFO[signal];

        return (
          <div className="score-row" key={signal}>
            <div className="score-row__head">
              <span className="score-row__name">
                <SignalSeal letter={signal} size="sm" />
                {info.letter} · {info.name}
              </span>
              <span className="score-row__values">
                Antes {beforeValue.percent}% · Después {afterValue.percent}%
              </span>
            </div>

            <div className="bar-pair" aria-hidden="true">
              <div className="bar-line">
                <span>Antes</span>
                <span className="bar">
                  <span
                    className="bar__fill"
                    style={{ width: `${clampPercent(beforeValue.percent)}%` }}
                  />
                </span>
                <span className="bar__value">{beforeValue.percent}%</span>
              </div>
              <div className="bar-line">
                <span>Después</span>
                <span className="bar">
                  <span
                    className="bar__fill bar__fill--after"
                    style={{ width: `${clampPercent(afterValue.percent)}%` }}
                  />
                </span>
                <span className="bar__value">{afterValue.percent}%</span>
              </div>
            </div>

            <p className="sr-only">
              {info.name}: antes acertaste {beforeValue.correct} de{" "}
              {beforeValue.total} casos; después acertaste {afterValue.correct}{" "}
              de {afterValue.total} casos.
            </p>
          </div>
        );
      })}
    </div>
  );
}
