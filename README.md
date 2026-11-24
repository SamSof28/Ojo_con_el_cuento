# Ojo con el Cuento

> Aprende a protegerte, y a proteger a los tuyos, de estafas por mensaje y por llamada.

Herramienta web de aprendizaje con IA para el reto **Antioquia sin brechas** (Expl-AI-n 2026, Universidad de Medellín).

**Link de la herramienta:** _(pegar aquí la URL de Vercel)_

## El problema

Muchas estafas no engañan por ser sofisticadas, sino porque nos hacen sentir **miedo o ilusión** y no nos dejan pensar. Dos casos comunes (ejemplos construidos para enseñar, no testimonios de personas reales):

- **La oferta que cobra:** llega por WhatsApp un trabajo "desde el celular", con buen sueldo y cupos limitados. Para empezar hay que pagar una "capacitación" o un "uniforme".
- **La llamada de emergencia falsa:** alguien dice que un familiar tuvo un accidente y que hay que transferir dinero ya, sin colgar y sin avisar a nadie.

Ambas usan lo mismo: **piden plata, meten presión, no se pueden verificar y buscan datos o claves.**

## Qué aprende la persona: el método PARE

| Letra | Pregunta que debe hacerse | Señal de alerta |
|---|---|---|
| **P**ago | ¿Me piden dinero antes de darme algo? | Transferencias, recargas o "depósitos" por adelantado |
| **A**puro | ¿Me presionan para decidir ya? | "Hoy mismo", "no cuelgue", "no le diga a nadie" |
| **R**astro | ¿Puedo verificar quién es por otro canal? | Solo hay chat o llamada y no hay forma de confirmar |
| **E**xposición | ¿Me piden claves, códigos o datos que no corresponden? | Códigos de verificación, claves, fotos de documentos |

**Competencia que se puede demostrar:** ante una oferta, mensaje o llamada dudosa, la persona identifica las señales PARE y decide si **cortar**, **verificar por otro canal** o **seguir con cuidado**.

## Cómo funciona (15 minutos, sin registro)

1. **Diagnóstico:** 5 casos sin ayuda, para saber de dónde parte.
2. **Lección PARE:** 4 tarjetas cortas con una pregunta de comprobación cada una.
3. **Práctica:** conversas con un falso reclutador o una falsa llamada (simulados por IA), marcas las señales y decides. Después **aconsejas a un familiar** que recibió el mensaje: explicar es una de las mejores formas de aprender.
4. **Prueba final:** 5 casos nuevos, equivalentes a los del diagnóstico.
5. **Resultado:** comparación antes y después **por cada letra de PARE**, y un plan de hábitos (por ejemplo, acordar una palabra clave familiar).

## Cómo enseña la IA (y qué no hace)

- **Simula** al reclutador o a quien llama, siguiendo un guion de un caso revisado por el autor.
- **Explica** los errores con lenguaje sencillo, usando solo las señales reales del caso.
- **Revisa el consejo** que la persona le da a un familiar y le dice qué señales faltaron.
- **No califica.** La nota de diagnóstico y prueba final la calcula código determinista contra respuestas verificadas. Así la medición no depende de que la IA acierte.
- **No inventa** empresas, teléfonos, enlaces ni leyes: todo es ficticio y la salida de la IA se valida antes de mostrarse.
- **Si la IA falla o se agota la cuota gratuita,** la herramienta sigue funcionando con explicaciones prediseñadas.

## Decisiones de diseño y calidad

| Atributo | Decisión |
|---|---|
| Fiabilidad pedagógica | La verdad de cada caso vive en datos revisados; la IA solo redacta |
| Disponibilidad | IA como función central con respaldo completo si falla, se queda sin cuota o se desactiva |
| Seguridad | La clave de la API vive solo en el servidor; los endpoints de IA no confían en el cliente |
| Privacidad | Sin login ni datos personales; el progreso queda en el navegador |
| Accesibilidad | Alto contraste, letra grande, botones táctiles amplios, lenguaje simple |
| Modificabilidad | El contenido son archivos JSON separados del código; nuevos temas son nuevos módulos |
| Testabilidad | Lógica de puntaje en funciones puras con pruebas automáticas |
| Desempeño y costo | Pocas dependencias, páginas ligeras, modelo económico con tiempo límite |

## Arquitectura

```
Navegador (Next.js, móvil primero)
   │  casos JSON + puntaje (funciones puras)
   ▼
/api/ai/*  (ruta del servidor)
   │  valida entrada → carga el caso por id → llama al modelo → valida salida
   ▼
Gemini API  ──(falla / sin cuota)──►  explicaciones prediseñadas
```

Detalles en [`docs/03-arquitectura.md`](docs/03-arquitectura.md).

## Ejecutar localmente

```bash
npm install
cp .env.example .env.local   # agrega tu GEMINI_API_KEY
npm run dev
npm test
npm run build
```

Sin `GEMINI_API_KEY` o con `AI_ENABLED=false`, la herramienta conserva el recorrido completo mediante contenidos y explicaciones de respaldo.

## Despliegue

Vercel. Variables de entorno: `GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_ENABLED`.

## Límites honestos

- Es un prototipo funcional: la IA puede equivocarse; por eso la medición no depende de ella.
- La prueba final tiene 5 casos: indica avance, no certifica competencia.
- Aún no se ha medido con grupos reales de usuarios. Cuando se pruebe con personas, aquí se documentará lo observado.
- No reemplaza canales oficiales ni asesoría profesional.
- Todos los nombres de empresas, personas y números son ficticios.

## Hoja de ruta

La estructura por módulos permite sumar temas sin reescribir: arriendos falsos, préstamos "gota a gota", phishing bancario, y otros como movilidad en Medellín o derechos laborales, cada uno con su banco de casos y su revisión.

## Autoría

Creado por _Samuel Romaña Acevedo_, estudiante de la Universidad de Medellín, para Expl-AI-n 2026.