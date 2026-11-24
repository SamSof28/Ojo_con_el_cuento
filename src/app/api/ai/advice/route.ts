import { getCaseById } from "@/content/cases";
import { adviceRequestSchema } from "@/domain/schemas";
import { getAdviceResponse } from "@/lib/ai/advice";
import { getGeminiJsonGenerator } from "@/lib/ai/gemini";
import { checkAiRequest, readJsonBody } from "@/lib/ai/request-guard";

export const maxDuration = 25;

export async function POST(request: Request) {
  const denied = checkAiRequest(request);

  if (denied) {
    return denied;
  }

  const body = await readJsonBody(request);

  if (!body.ok) {
    return body.response;
  }

  const parsed = adviceRequestSchema.safeParse(body.body);

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

  const response = await getAdviceResponse(
    parsed.data,
    caseRecord,
    getGeminiJsonGenerator(),
  );

  return Response.json(response);
}
