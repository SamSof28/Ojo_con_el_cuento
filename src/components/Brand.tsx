import { SIGNALS, type Signal } from "@/domain/types";

const SEAL_POINTS =
  "20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20";

export function SignalSeal({
  letter,
  size = "md",
}: {
  letter: Signal;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`signal-seal signal-seal--${size}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false" role="presentation">
        <polygon points={SEAL_POINTS} fill="currentColor" />
        <text
          x="32"
          y="43"
          textAnchor="middle"
          className="signal-seal__letter"
        >
          {letter}
        </text>
      </svg>
    </span>
  );
}

export function PareMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`pare-mark${compact ? " pare-mark--compact" : ""}`}>
      <span className="pare-mark__seals" aria-hidden="true">
        {SIGNALS.map((signal) => (
          <SignalSeal key={signal} letter={signal} size="sm" />
        ))}
      </span>
      <span className="pare-mark__word">
        Ojo con el <strong>Cuento</strong>
      </span>
    </span>
  );
}
