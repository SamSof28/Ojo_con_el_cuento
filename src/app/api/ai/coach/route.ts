import { getCaseById } from "@/content/cases";
import { coachRequestSchema } from "@/domain/schemas";
import { createGeminiCoach } from "@/lib/ai/gemini-coach";
import { getCoachResponse } from "@/lib/ai/coach";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
  }

  const parsed = coachRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "La solicitud no tiene el formato esperado." },
      { status: 400 },
    );
  }

  const caseRecord = getCaseById(parsed.data.caseId);

  if (!caseRecord) {
    return Response.json({ error: "No encontramos ese caso." }, { status: 404 });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
  const isAiEnabled = process.env.AI_ENABLED !== "false";
  const coach =
    isAiEnabled && apiKey ? createGeminiCoach(apiKey, model) : null;

  const response = await getCoachResponse(parsed.data, caseRecord, coach);

  return Response.json(response);
}
