# 02 · Diseño del aprendizaje

## Recorrido (≈15 min)
| Estación | Qué hace la persona | Evidencia |
|---|---|---|
| 0. Bienvenida | Lee para quién es, qué aprenderá y cómo empezar | — |
| 1. Diagnóstico | 5 casos sin pistas ni feedback inmediato | Puntaje inicial por letra |
| 2. Lección PARE | 4 tarjetas, cada una con una pregunta de comprobación | Respuestas de la tarjeta |
| 3. Práctica | Casos con feedback, reintento, simulador con IA y "aconseja a un familiar" | Intentos y errores |
| 4. Prueba final | 5 casos equivalentes a los del diagnóstico | Puntaje final por letra |
| 5. Resultado | Antes vs después, y plan de hábitos | Comparación honesta |

## Respuesta en cada caso
La persona marca qué señales ve (P, A, R, E o ninguna) y elige una acción: **Cortar**, **Verificar por otro canal** o **Seguir con cuidado**.

## Puntaje (determinista, en `src/domain/scoring.ts`)
- Decisión correcta: 1 punto.
- Señales: 1 punto repartido entre las 4 letras (0,25 por letra acertada, sea marcada o no marcada correctamente).
- Máximo por caso: 2 puntos.
- Máximo de la prueba final: 10 puntos (5 casos × 2).
- Resultado por letra: porcentaje de aciertos en esa letra a lo largo de los 5 casos.
- "Dominio" se muestra solo si la prueba final obtiene al menos 8 de 10 puntos; si no, "sigue practicando".
- La IA no participa en el cálculo ni modifica los puntajes.

## Equivalencia diagnóstico ↔ final
Cada caso del diagnóstico tiene un **par** en la prueba final con el mismo patrón de señales, la misma acción correcta y la misma dificultad, pero distinta historia. Así la comparación antes/después es justa. Ninguno de esos 10 casos aparece en la práctica.

## Casos legítimos
Cada grupo incluye ofertas legítimas. Objetivo: que la persona no aprenda a desconfiar de todo, sino a **verificar**.

## Retroalimentación
- Inmediata y sin culpa en la práctica; diferida en diagnóstico y final.
- Explica el error con la señal concreta del caso y propone qué preguntarse.
- Siempre permite reintentar con otro caso del banco de práctica.

## Aprender enseñando
En "aconseja a un familiar", la persona escribe un consejo corto (máx. 400 caracteres) para un personaje que recibió el mensaje. La IA indica cuáles señales PARE cubrió y cuáles faltaron. Es retroalimentación formativa: **no entra en el puntaje**.

## Plan de hábitos (cierre)
1. Guardar los números de los familiares y llamar siempre a esos.
2. Acordar una palabra clave familiar para emergencias.
3. Nunca pagar ni dar códigos antes de verificar por otro canal.

## Medición honesta
Solo se muestran resultados que la persona obtuvo en la sesión. Frases como "aprendiste" se usan únicamente si el puntaje final lo respalda; nunca se inventan porcentajes de mejora ni testimonios.
