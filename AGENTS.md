# AGENTS.md — Ojo con el Cuento

Herramienta web de aprendizaje con IA que enseña el método PARE para detectar estafas por mensaje y llamada. Reto "Antioquia sin brechas" (Expl-AI-n 2026). **Cierre: 24 de noviembre de 2026, 11:59 p. m. (Colombia).**

## Antes de actuar
1. Lee `docs/00-brief.md` y `docs/01-producto.md`. Para tareas de código, lee también `docs/03-arquitectura.md` y la tarea en `docs/07-tareas.md`.
2. Si algo no está en los docs, **pregunta; no lo inventes**.
3. Trabaja **una tarea a la vez** de `docs/07-tareas.md`. Al terminar, ejecuta `npm run lint`, `npm test` y `npm run build`, y reporta el resultado real.

## Reglas
- Nunca afirmes que algo funciona sin haberlo ejecutado.
- No uses APIs ni librerías sin confirmarlas en el código instalado (`node_modules`) o en la documentación oficial. Para Gemini, verifica el SDK vigente en la documentación oficial; si no puedes, usa `fetch` al endpoint REST documentado.
- No agregues dependencias, funciones ni pantallas fuera del alcance sin preguntar.
- **No escribas ni modifiques casos de `src/content/cases/` sin dejar `reviewedByAuthor: false`.** Solo el autor los marca como revisados.
- La IA **nunca** califica. El puntaje vive en `src/domain/scoring.ts` (funciones puras con pruebas).
- La clave `GEMINI_API_KEY` solo se usa en el servidor. Nada con `NEXT_PUBLIC_`.
- Toda la app debe funcionar **sin IA** (`AI_ENABLED=false` o sin clave).
- No pidas ni guardes datos personales. Sin login. Sin base de datos.
- Nombres de empresas, personas, teléfonos y enlaces de los casos son **ficticios**. Nada de marcas reales.
- No inventes estadísticas, leyes ni instituciones en el contenido.

## Código
- TypeScript estricto, sin `any`. Identificadores en inglés; textos de interfaz y casos en español.
- Lógica de dominio en `src/domain/` sin imports de React ni de red.
- Componentes pequeños. Mobile first. Contraste AA, fuente base ≥ 18 px, objetivos táctiles ≥ 44 px.
- Un commit por tarea, mensaje claro (`feat:`, `fix:`, `test:`, `docs:`).

## Comandos
`npm run dev` · `npm run lint` · `npm test` · `npm run build`

## Definición de terminado
La tarea cumple sus criterios de aceptación, pasan lint, pruebas y build, y no se rompió el modo sin IA.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
