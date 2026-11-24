# 03 · Arquitectura

## Stack
Next.js (App Router) + TypeScript + Tailwind, Zod para validar, Vitest para pruebas, Vercel para despliegue, Gemini API desde una ruta del servidor.

## Estructura
```
src/
  app/                  páginas y /api/ai/*
  components/           interfaz reutilizable
  content/cases/        casos en JSON (fuente de verdad)
  domain/               types, schemas, scoring (funciones puras)
  lib/ai/               puerto AiCoach, adaptador Gemini, fallback, prompts
```

## Flujo de IA
```
cliente → POST /api/ai/{recruiter|coach|advice}
   1. valida el cuerpo con Zod (límites de longitud)
   2. carga el caso por id desde el servidor (nunca confía en la "verdad" del cliente)
   3. limita por IP (mejor esfuerzo)
   4. llama al modelo con prompt de docs/05, temperatura baja y salida JSON
   5. valida la salida (esquema, longitud, sin URLs ni teléfonos)
   6. si falla: un reintento y luego explicación prediseñada del caso
```

Estado de implementación: coach, simulador y consejo a un familiar tienen rutas Gemini, validación Zod y respaldos. Se corrigió el timeout: Gemini rechaza plazos manuales inferiores a 10 s. El 24 de noviembre de 2026, las tres rutas locales devolvieron `source: "ai"`; se observó un `503` transitorio antes de que las llamadas posteriores tuvieran éxito.

## Decisiones (ADR cortas)
1. **Monolito Next.js:** un repo, un despliegue; menor complejidad operativa.
2. **App Router:** páginas y rutas de API compartidas en un mismo proyecto desplegable en Vercel.
3. **Contenido como JSON:** modificable sin tocar código y permite sumar módulos.
4. **Puntaje determinista:** la medición no depende de la IA (fiabilidad).
5. **IA funcional y desacoplada:** las tres actividades pedagógicas usan Gemini si está configurado; los respaldos permiten completar el recorrido sin IA. `AiCoach` permite adaptar Gemini o respaldo sin cambiar el dominio.
6. **Sin base de datos ni login:** privacidad y simplicidad. Progreso en `localStorage` con versión de datos y `try/catch`; si el almacenamiento falla, la sesión sigue en memoria.
7. **Puntaje en el cliente:** no hay consecuencias externas; **los endpoints de IA no confían en el cliente**.

## Atributos de calidad
| Atributo | Cómo se cumple |
|---|---|
| Disponibilidad | Modo sin IA completo; timeout de Gemini de 10 s por intento; un reintento y respaldo; rutas con `maxDuration` de 25 s en Vercel |
| Seguridad | Clave solo en servidor; entrada acotada; salida restringida por esquema y filtros; límite por IP en memoria, de mejor esfuerzo y no distribuido |
| Privacidad | Sin login ni solicitud de edad; aviso de no incluir datos personales y del uso de datos del nivel gratuito |
| Rendimiento | Pocas dependencias, sin librerías pesadas, páginas estáticas |
| Accesibilidad | Contraste AA, fuente ≥ 18 px, objetivos ≥ 44 px, `lang="es-CO"`, sin depender solo del color, `prefers-reduced-motion` |
| Mantenibilidad | Capas claras; dominio sin dependencias de UI |

## Contratos de API (resumen)
- `recruiter`: `{caseId, history[≤6], userMessage}` → `{message, finished}`
- `coach`: `{caseId, selectedSignals, selectedAction}` → `{explanation, nextHint, encouragement}`
- `advice`: `{caseId, advice(≤400)}` → `{covers:{P,A,R,E}, message}`
Todos responden con un campo `source: "ai" | "fallback"`.

## Variables de entorno
`GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_ENABLED`. En Vercel se configuran en Project → Settings → Environment Variables y requieren un nuevo despliegue. Ver `.env.example`.

Si una llamada falla o Gemini devuelve una salida que no pasa la validación, la respuesta usa el respaldo. El servidor registra únicamente el código HTTP, la categoría y nombres de campos permitidos, nunca la clave, el texto del participante ni el cuerpo del error.

## Verificación de Gemini
SDK instalado y verificado: `@google/genai` 3.6.1. El modelo predeterminado es `gemini-3.5-flash-lite`, vigente y compatible con salida estructurada. En Vercel deben configurarse `AI_ENABLED=true` y `GEMINI_API_KEY`, y volver a desplegar. El nivel gratuito puede usar las solicitudes y respuestas para mejorar los servicios; no se envían datos personales. Ver los enlaces oficiales de SDK, modelo y términos en el README para confirmar precios y condiciones vigentes al desplegar.
