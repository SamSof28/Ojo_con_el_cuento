const MAX_BODY_BYTES = 12_000;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;

interface RateRecord {
  count: number;
  resetAt: number;
}

export function createAiRateLimiter(
  limit: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_WINDOW_MS,
  now: () => number = Date.now,
) {
  const records = new Map<string, RateRecord>();

  return (ip: string): boolean => {
    const timestamp = now();

    for (const [key, record] of records) {
      if (record.resetAt <= timestamp) {
        records.delete(key);
      }
    }

    const record = records.get(ip);

    if (!record || record.resetAt <= timestamp) {
      records.set(ip, { count: 1, resetAt: timestamp + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count += 1;
    return true;
  };
}

const allowRequestForIp = createAiRateLimiter();

export function checkAiRequest(request: Request): Response | null {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { error: "La solicitud es demasiado grande." },
      { status: 413 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!allowRequestForIp(ip)) {
    return Response.json(
      { error: "Alcanzaste el límite temporal. Espera un minuto e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  return null;
}

export type JsonBodyResult =
  | { ok: true; body: unknown }
  | { ok: false; response: Response };

export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  const reader = request.body?.getReader();

  if (!reader) {
    return {
      ok: false,
      response: Response.json(
        { error: "El cuerpo debe ser JSON válido." },
        { status: 400 },
      ),
    };
  }

  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      bytesRead += value.byteLength;

      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel();
        return {
          ok: false,
          response: Response.json(
            { error: "La solicitud es demasiado grande." },
            { status: 413 },
          ),
        };
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(bytesRead);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, body: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return {
      ok: false,
      response: Response.json(
        { error: "El cuerpo debe ser JSON válido." },
        { status: 400 },
      ),
    };
  }
}
