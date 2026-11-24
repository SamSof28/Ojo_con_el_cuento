# 08 · Diseño de interfaz

Objetivo: que se sienta **cálida, clara y confiable** para personas de edades y experiencia muy distintas, en celulares de gama media o baja. Que parezca hecha con intención, no una plantilla genérica.

## Identidad
- **Sello PARE:** el logo y los iconos de las 4 señales usan la forma de una señal octagonal de tránsito con la letra grande. Es la imagen distintiva de la herramienta.
- **Ruta de estaciones:** el progreso es una línea con 5 estaciones (Diagnóstico, Lección, Práctica, Prueba final, Resultado). Inspirada en una línea de metro, **sin copiar** logos ni colores oficiales de ninguna entidad.
- **Casos como el celular real:** los mensajes se muestran como un chat (burbujas, hora, remitente ficticio). Las llamadas, como una pantalla de llamada entrante con botón de colgar.

## Color (sugerido; verificar contraste AA, 4.5:1 en texto)
| Uso | Valor |
|---|---|
| Fondo | `#FAF6EF` (crema suave) |
| Superficie | `#FFFFFF` |
| Texto | `#1B1B1B` |
| Primario | `#0F4C5C` (azul petróleo) |
| Alerta (solo en señales) | `#B3402A` (rojo ladrillo) |
| Acierto | `#2E7D4F` |
| Resaltado | `#E09F3E` (no usar como color de texto sobre blanco) |
Definir como variables CSS en `src/app/globals.css`. Nunca comunicar algo **solo** con color: acompañar con texto o icono.

## Tipografía
Máximo 2 familias, cargadas con `next/font`. Cuerpo con una fuente de alta legibilidad (por ejemplo Atkinson Hyperlegible, si está disponible en `next/font/google`) a 18–20 px. Interlineado generoso. Títulos con más carácter, sin exagerar.

## Componentes y layout
- Se diseña primero a **360 px**. En escritorio, columna centrada de máximo 640 px.
- Una acción principal por pantalla. Botones de mínimo 48 px de alto, con texto claro.
- Foco visible (contorno de 3 px). Navegable con teclado. `prefers-reduced-motion` respetado.
- Estados amables: "Pensando…" mientras responde la IA; si hay respaldo, mensaje discreto ("Usando respuestas preparadas"), sin culpar ni asustar.
- Bienvenida: para quién es, qué aprenderás (3 líneas), duración (≈15 min), "sin registro", botón **Empezar**.

## Voz y textos
- Tuteo cálido, frases cortas, sin jerga ("mensaje que intenta engañarte", no "phishing").
- Sin culpa y sin tono de miedo. Frases de logro solo si el puntaje las respalda.

## Evitar (aspecto genérico)
Gradientes morados o azules, vidrio esmerilado, sombras difusas excesivas, emojis como decoración, cuadrículas de tarjetas idénticas, ilustraciones de banco de imágenes, frases tipo "potencia tu futuro". Preferir espacio generoso, bordes definidos, jerarquía tipográfica clara y los detalles propios (sello PARE, ruta, chat).

## Audio (si hay tiempo)
Botón "Escuchar" con la voz del navegador (`speechSynthesis`) cuando esté disponible. Cualquier voz generada por IA debe indicarse como tal.
