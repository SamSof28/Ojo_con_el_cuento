import type { z } from "zod";

export const AI_TIMEOUT_MS = 8_000;

export class FetchJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchJsonError";
  }
}

/**
 * Envía JSON y valida la respuesta con Zod antes de entregarla al componente.
 * Un error HTTP, un timeout o una salida inválida terminan en el mismo camino
 * de respaldo. No registra el cuerpo recibido para no filtrar datos.
 */
export async function postJson<T>(
  url: string,
  body: unknown,
  schema: z.ZodType<T>,
  timeoutMs: number = AI_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new FetchJsonError(`La respuesta falló con estado ${response.status}`);
    }

    const payload: unknown = await response.json();
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      throw new FetchJsonError("La respuesta no cumple el formato esperado");
    }

    return parsed.data;
  } finally {
    clearTimeout(timeout);
  }
}
