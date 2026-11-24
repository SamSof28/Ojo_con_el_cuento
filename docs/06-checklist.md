# 06 · Checklist antes de enviar

## Del brief ("Antes de enviar")
- [ ] Responde a una necesidad concreta de una población de Antioquia.
- [ ] Está claro qué competencia se desarrolla.
- [x] La IA cumple una función pedagógica real: simulación, explicación y revisión de consejo; las 3 rutas locales devolvieron `source: "ai"`.
- [ ] La prueba final usa exactamente 10 puntos y muestra dominio solo con al menos 8.
- [ ] Se completa una actividad de principio a fin.
- [ ] Hay una forma de comprobar lo aprendido.
- [ ] Revisé los contenidos; la IA no inventó datos ni dio instrucciones incorrectas.
- [ ] Es fácil de usar y se ve bien en el celular.
- [ ] El link abre en cualquier navegador y seguirá funcionando hasta el 26 de nov.

## Calidad propia
- [x] Los 16 casos están revisados por mí (`reviewedByAuthor: true`).
- [ ] Probé en ventana privada, desde el celular y con datos móviles.
- [ ] Probé con `AI_ENABLED=false` y sin clave: todo funciona.
- [x] Probé con clave real que coach, simulador y consejo devuelvan `source: "ai"` localmente el 24/11/2026.
- [x] Probé la prueba de inyección y la respuesta inválida de la IA en las pruebas del simulador y el consejo.
- [ ] `git grep GEMINI_API_KEY` no muestra claves reales; no hay `NEXT_PUBLIC_` con secretos.
- [ ] `npm run lint`, `npm test` y `npm run build` pasan.
- [ ] Contraste, tamaño de letra y botones revisados (Lighthouse de accesibilidad).
- [ ] Aviso visible: nombres y números son ficticios; no pegues datos personales.
- [ ] README completo, con el link de la herramienta.
- [ ] No hay estadísticas ni testimonios inventados.
- [ ] Probé con 2 o 3 personas del público y ajusté lo que se trabó.
- [ ] Envié una primera versión temprano y la reemplacé con la final antes del cierre.
