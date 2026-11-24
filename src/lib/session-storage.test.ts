import { describe, expect, it } from "vitest";
import { createSession } from "@/domain/session";
import {
  clearSession,
  loadSession,
  SESSION_STORAGE_KEY,
  saveSession,
} from "./session-storage";

class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

function makeStorage(): Storage {
  return new MemoryStorage();
}

describe("session-storage", () => {
  it("guarda y recupera una sesión válida", () => {
    const storage = makeStorage();
    const state = createSession("2026-11-24T00:00:00.000Z");

    expect(saveSession(state, storage)).toBe(true);
    expect(loadSession(storage)).toEqual(state);
  });

  it("devuelve null sin almacenamiento o sin datos", () => {
    expect(loadSession(null)).toBeNull();
    expect(loadSession(makeStorage())).toBeNull();
  });

  it("ignora JSON corrupto, versiones viejas y fases inválidas", () => {
    const corrupt = makeStorage();
    corrupt.setItem(SESSION_STORAGE_KEY, "{no es json");
    expect(loadSession(corrupt)).toBeNull();

    const oldVersion = makeStorage();
    oldVersion.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...createSession(), version: 2 }),
    );
    expect(loadSession(oldVersion)).toBeNull();

    const invalidPhase = makeStorage();
    invalidPhase.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...createSession(), phase: "otra" }),
    );
    expect(loadSession(invalidPhase)).toBeNull();
  });

  it("no falla si el almacenamiento está lleno o bloqueado", () => {
    const storage = makeStorage();
    storage.setItem = () => {
      throw new DOMException("Cuota llena", "QuotaExceededError");
    };

    expect(saveSession(createSession(), storage)).toBe(false);
  });

  it("borra la sesión sin lanzar errores", () => {
    const storage = makeStorage();
    saveSession(createSession(), storage);
    clearSession(storage);

    expect(loadSession(storage)).toBeNull();
    expect(() => clearSession(null)).not.toThrow();
  });

  it("acepta una sesión con respuestas parciales de la lección", () => {
    const storage = makeStorage();
    const state = {
      ...createSession("2026-11-24T00:00:00.000Z"),
      lessonAnswers: { P: 1 },
    };

    saveSession(state, storage);
    expect(loadSession(storage)?.lessonAnswers).toEqual({ P: 1 });
  });
});
