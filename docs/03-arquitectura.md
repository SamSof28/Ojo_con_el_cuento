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
   4. llama al modelo con prompt de docs/05, temperatura baja y JSON estructurado
   5. valida la salida (esquema, longitud, sin URLs ni teléfonos)
   6. si falla: un reintento y luego explicación prediseñada del caso
```

## Decisiones (ADR cortas)
1. **Monolito Next.js:** un repo, un despliegue; menor complejidad operativa.
2. **App Router:** páginas y rutas de API compartidas en un mismo proyecto desplegable en Vercel.
3. **Contenido como JSON:** modificable sin tocar código y permite sumar módulos.
4. **Puntaje determinista:** la medición no depende de la IA (fiabilidad).
5. **IA obligatoria funcional y desacoplada:** Gemini se usa para simulación, coach y consejo; `AiCoach` permite adaptar Gemini o respaldo sin cambiar el dominio.
6. **Sin base de datos ni login:** privacidad y simplicidad. Progreso en `localStorage` con versión de datos y `try/catch`; si el almacenamiento falla, la sesión sigue en memoria.
7. **Puntaje en el cliente:** no hay consecuencias externas; **los endpoints de IA no confían en el cliente**.

## Atributos de calidad
| Atributo | Cómo se cumple |
|---|---|
| Disponibilidad | Modo sin IA completo; tiempo límite de 8 s; reintento y respaldo |
| Seguridad | Clave solo en servidor; entrada acotada; texto del usuario tratado como dato (anti-inyección) |
| Privacidad | Sin datos personales; aviso para no pegar cédula, cuentas ni claves |
| Rendimiento | Pocas dependencias, sin librerías pesadas, páginas estáticas |
| Accesibilidad | Contraste AA, fuente ≥ 18 px, objetivos ≥ 44 px, `lang="es-CO"`, sin depender solo del color, `prefers-reduced-motion` |
| Mantenibilidad | Capas claras; dominio sin dependencias de UI |

## Contratos de API (resumen)
- `recruiter`: `{caseId, history[≤6], userMessage}` → `{message, finished}`
- `coach`: `{caseId, selectedSignals, selectedAction}` → `{explanation, nextHint, encouragement}`
- `advice`: `{caseId, advice(≤400)}` → `{covers:{P,A,R,E}, message}`
Todos responden con un campo `source: "ai" | "fallback"`.

## Variables de entorno
`GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_ENABLED`. Ver `.env.example`.

## Nota de verificación
Antes de integrar Gemini, confirmar en la documentación oficial el SDK vigente, el nombre del modelo económico y los límites del nivel gratuito. Revisar también los términos de uso de datos del nivel gratuito.
