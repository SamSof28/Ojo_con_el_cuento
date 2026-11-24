# 07 · Tareas (una a la vez, un commit por tarea)

Orden pensado para tener **un recorrido completo desplegado antes de integrar la IA**.

- [ ] **T0 · Base.** Crear proyecto Next.js + TypeScript + Tailwind, Vitest, Zod. Scripts `dev`, `lint`, `test`, `build`. *Aceptación:* los 4 comandos corren; página de inicio vacía.
- [ ] **T1 · Dominio.** `types.ts`, `schemas.ts`, `scoring.ts` según docs/02. *Aceptación:* pruebas del puntaje por caso, por letra y dominio con al menos 8/10.
- [ ] **T2 · Contenido.** Cargador de casos JSON con validación y 3 casos de docs/04. *Aceptación:* una prueba valida todos los casos y las parejas diagnóstico↔final.
- [ ] **T3 · Estructura de la interfaz.** Layout accesible según docs/08-diseno-ui.md, bienvenida, ruta de estaciones, aviso de ficticio. *Aceptación:* se ve bien a 360 px de ancho; contraste AA.
- [ ] **T4 · Reproductor de casos.** Marcar señales y elegir acción. *Aceptación:* guarda la respuesta; funciona con teclado.
- [ ] **T5 · Diagnóstico y lección PARE.** *Aceptación:* se recorre completo con los casos de ejemplo.
- [ ] **T6 · Práctica sin IA.** Feedback con la explicación base y reintento con otro caso. *Aceptación:* un error muestra la explicación y permite reintentar.
- [ ] **T7 · Prueba final y resultado.** Comparación antes/después por letra, plan de hábitos. *Aceptación:* no se muestran frases de logro si no hay puntaje que las respalde.
- [ ] **T8 · Despliegue temprano.** Subir a Vercel y probar en ventana privada y celular. *Aceptación:* link público con el recorrido completo funcionando **sin IA**.
- [ ] **T9 · Puerto de IA y coach.** `AiCoach`, adaptador Gemini, respaldo, validación de salida, `/api/ai/coach`. *Aceptación:* pruebas del validador y del respaldo; sin clave sigue funcionando.
- [ ] **T10 · Simulador.** `/api/ai/recruiter` con historial acotado. *Aceptación:* conversación de hasta 6 turnos y respaldo con guion fijo.
- [ ] **T11 · Aconseja a un familiar.** `/api/ai/advice`. *Aceptación:* devuelve cobertura PARE; no entra al puntaje.
- [ ] **T12 · Límites y seguridad.** Límite por IP, tope de longitud, prueba de inyección. *Aceptación:* se documenta el resultado en la checklist.
- [ ] **T13 · Pulido móvil y accesibilidad.** Lectura en voz alta con el navegador si hay tiempo. *Aceptación:* Lighthouse de accesibilidad sin fallos graves.
- [ ] **T14 · Revisión final.** Ejecutar `/verificar`, corregir y completar docs/06. *Aceptación:* checklist completa.

## Secuencia sugerida
- Primero completar T0 a T2 y revisar el banco de casos.
- Después construir el recorrido sin IA T3 a T8 y desplegar una primera versión.
- Integrar y probar la IA T9 a T13.
- Terminar con T14, revisión manual y despliegue final antes del cierre.
