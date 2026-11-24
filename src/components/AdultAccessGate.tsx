"use client";

import { useState, type ReactNode } from "react";

interface AdultAccessGateProps {
  children: ReactNode;
}

export function AdultAccessGate({ children }: AdultAccessGateProps) {
  const [isAdult, setIsAdult] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return children;
  }

  return (
    <main id="contenido" className="wide-container">
      <section className="hero card card--soft" aria-labelledby="age-gate-title">
        <p className="eyebrow">Antes de entrar</p>
        <h1 className="hero-title" id="age-gate-title">
          Esta experiencia es para personas mayores de 18 años.
        </h1>
        <p className="hero-subtitle">
          Para continuar, confirma que tienes 18 años o más. No pedimos tu fecha
          de nacimiento ni guardamos esta confirmación.
        </p>
        <label className="mt-5 flex min-h-11 items-center gap-3 text-base font-semibold">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(event) => setIsAdult(event.target.checked)}
            className="h-6 w-6 accent-primary"
          />
          Confirmo que tengo 18 años o más.
        </label>
        <button
          className="btn btn--primary mt-5"
          type="button"
          disabled={!isAdult}
          onClick={() => setConfirmed(true)}
        >
          Continuar
        </button>
      </section>
    </main>
  );
}
