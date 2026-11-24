import {
  SIGNALS,
  type CaseRecord,
  type Signal,
} from "@/domain/types";

export interface RecruiterFallbackTurn {
  message: string;
  finished: boolean;
}

const SCAM_SIGNAL_LINES: Record<Signal, string> = {
  P: "Para asegurar tu cupo, el pago se hace hoy y luego te activo de una vez.",
  A: "No puedo guardarte el cupo mucho tiempo; necesito tu respuesta ya.",
  R: "Todo el proceso se maneja por este chat, no hace falta llamar a nadie más.",
  E: "Solo necesito que me confirmes el código que te acaba de llegar.",
};

const LEGIT_TURNS: readonly string[] = [
  "Claro, puedes confirmar el proceso llamando al número que aparece en nuestra página oficial. No cobramos nada.",
  "La entrevista es en la sede que te indicamos. Si no puedes asistir, avísanos con tiempo.",
  "Quedo atento. No necesito que me envíes datos personales por aquí.",
];

/**
 * Respaldo del simulador cuando la IA falla o no está disponible.
 * Usa solo las señales que el caso realmente tiene y nunca revela la respuesta.
 */
export function buildRecruiterFallback(
  caseRecord: CaseRecord,
  turnIndex: number,
): RecruiterFallbackTurn {
  if (!caseRecord.isScam) {
    return {
      message: LEGIT_TURNS[Math.min(turnIndex, LEGIT_TURNS.length - 1)],
      finished: turnIndex >= LEGIT_TURNS.length - 1,
    };
  }

  const activeSignals = SIGNALS.filter((signal) => caseRecord.signals[signal]);

  if (activeSignals.length === 0) {
    return {
      message: "Prefiero que lo hablemos por aquí. ¿Qué más necesitas saber?",
      finished: turnIndex >= 2,
    };
  }

  const signal = activeSignals[turnIndex % activeSignals.length];

  return {
    message: SCAM_SIGNAL_LINES[signal],
    finished: turnIndex >= 2,
  };
}

export interface AdviceFallback {
  message: string;
  signals: Signal[];
}

/**
 * Respaldo de "aconseja a un familiar": entrega la lista de chequeo
 * para autoevaluación, sin inventar una cobertura que no se calculó.
 */
export function buildAdviceFallback(caseRecord: CaseRecord): AdviceFallback {
  const signals = SIGNALS.filter((signal) => caseRecord.signals[signal]);

  if (signals.length === 0) {
    return {
      message:
        "La revisión automática no está disponible ahora. Este caso no tiene señales PARE: un buen consejo es confirmar por el canal oficial antes de compartir datos.",
      signals,
    };
  }

  return {
    message:
      "La revisión automática no está disponible ahora. Revisa tu consejo con esta lista de chequeo del caso:",
    signals,
  };
}
