import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { FetchJsonError, postJson } from "./fetch-json";

const schema = z.object({ message: z.string().min(1) }).strict();

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("postJson", () => {
  it("envía JSON y devuelve la respuesta validada", async () => {
    let capturedUrl = "";
    let capturedInit: RequestInit | undefined;
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedInit = init;
      return jsonResponse({ message: "Hola" });
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(postJson("/api/test", { hello: true }, schema)).resolves.toEqual(
      { message: "Hola" },
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(capturedUrl).toBe("/api/test");
    expect(capturedInit?.method).toBe("POST");
    expect(capturedInit?.body).toBe(JSON.stringify({ hello: true }));
  });

  it("rechaza errores HTTP sin exponer el cuerpo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ error: "detalle interno" }, 500)),
    );

    const error: unknown = await postJson("/api/test", {}, schema).catch(
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(FetchJsonError);
    expect(String(error)).not.toContain("detalle interno");
    expect(String(error)).toContain("estado 500");
  });

  it("rechaza una salida que no cumple el esquema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: 42, extra: true })),
    );

    await expect(postJson("/api/test", {}, schema)).rejects.toBeInstanceOf(
      FetchJsonError,
    );
  });

  it("rechaza JSON inválido", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{no es json", { status: 200 })),
    );

    await expect(postJson("/api/test", {}, schema)).rejects.toBeInstanceOf(
      SyntaxError,
    );
  });
});
