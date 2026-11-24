"use client";

import Link from "next/link";
import { useEffect, useReducer, useSyncExternalStore } from "react";
import { PareMark } from "@/components/Brand";
import { StationRoute } from "@/components/StationRoute";
import { DiagnosticStation } from "@/components/stations/DiagnosticStation";
import { FinalStation } from "@/components/stations/FinalStation";
import { LessonStation } from "@/components/stations/LessonStation";
import { PracticeStation } from "@/components/stations/PracticeStation";
import { ResultStation } from "@/components/stations/ResultStation";
import { createSession, sessionReducer } from "@/domain/session";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/lib/session-storage";

const subscribeToHydration = () => () => {};

function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

function SessionHeader() {
  return (
    <header className="session-header">
      <Link className="brand-link" href="/" aria-label="Volver al inicio">
        <PareMark compact />
      </Link>
      <p className="session-header__note">
        Tu avance se guarda en este navegador. Sin registro.
      </p>
    </header>
  );
}

function SessionBody() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, () =>
    loadSession() ?? createSession(),
  );

  useEffect(() => {
    saveSession(state);
  }, [state]);

  useEffect(() => {
    const heading = document.getElementById("station-title");
    heading?.focus({ preventScroll: false });
  }, [
    state.phase,
    state.diagnosticIndex,
    state.practiceIndex,
    state.finalIndex,
  ]);

  function resetSession() {
    clearSession();
    dispatch({ type: "RESET", startedAt: new Date().toISOString() });
  }

  return (
    <>
      <StationRoute current={state.phase} />

      {state.phase === "diagnostic" ? (
        <DiagnosticStation
          index={state.diagnosticIndex}
          onAnswer={(answer, isLast) =>
            dispatch({ type: "ANSWER_DIAGNOSTIC", answer, isLast })
          }
        />
      ) : null}

      {state.phase === "lesson" ? (
        <LessonStation
          answers={state.lessonAnswers}
          onAnswer={(signal, option) =>
            dispatch({ type: "ANSWER_LESSON", signal, option })
          }
          onContinue={() => dispatch({ type: "START_PRACTICE" })}
        />
      ) : null}

      {state.phase === "practice" ? (
        <PracticeStation
          index={state.practiceIndex}
          answers={state.practiceAnswers}
          onAnswer={(answer) => dispatch({ type: "ANSWER_PRACTICE", answer })}
          onNext={(isLast) => dispatch({ type: "NEXT_PRACTICE", isLast })}
          onStartFinal={() => dispatch({ type: "START_FINAL" })}
          onRestartPractice={() => dispatch({ type: "RESTART_PRACTICE" })}
        />
      ) : null}

      {state.phase === "final" ? (
        <FinalStation
          index={state.finalIndex}
          onAnswer={(answer, isLast) =>
            dispatch({ type: "ANSWER_FINAL", answer, isLast })
          }
        />
      ) : null}

      {state.phase === "result" ? (
        <ResultStation
          diagnosticAnswers={state.diagnosticAnswers}
          finalAnswers={state.finalAnswers}
          onReset={resetSession}
        />
      ) : null}
    </>
  );
}

export function SessionApp() {
  const hasHydrated = useHasHydrated();

  return (
    <div className="session-app">
      <SessionHeader />
      {hasHydrated ? (
        <SessionBody />
      ) : (
        <p className="session-loading" role="status">
          Cargando tu avance…
        </p>
      )}
    </div>
  );
}
