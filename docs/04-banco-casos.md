# 04 · Banco de casos

Fuente de verdad de la verdad de cada caso. **Todos los casos deben ser revisados por el autor** antes de publicarse (`reviewedByAuthor: true`). Nombres, teléfonos y enlaces: ficticios.

## Esquema
```json
{
  "id": "job-001",
  "pool": "diagnostic | practice | final",
  "pairId": "p1",
  "family": "job | emergency",
  "channel": "whatsapp | call | sms | email",
  "scenario": "Texto que ve la persona",
  "isScam": true,
  "signals": { "P": true, "A": true, "R": true, "E": false },
  "correctAction": "cut | verify | proceed",
  "explanation": "Explicación base, usada también como respaldo sin IA",
  "difficulty": 1,
  "reviewedByAuthor": false
}
```

## Distribución objetivo (16 casos)
| Pool | Casos | Notas |
|---|---|---|
| diagnostic | 5 | 3 estafas y 2 legítimos; al menos 1 `emergency`; cada letra aparece al menos 2 veces |
| final | 5 | Pares 1 a 1 con diagnostic (`pairId`): mismas señales, misma acción, misma dificultad |
| practice | 6 | Variedad de canales; al menos 2 `emergency` y 1 legítimo |

## Reglas de calidad
- Redacción en español cotidiano de Colombia, sin tecnicismos.
- Sin marcas, entidades ni personas reales.
- Cada explicación nombra la señal concreta que aparece en el texto.
- Un caso legítimo tiene todas las señales en `false` y `correctAction: "proceed"`, con algo verificable (por ejemplo, confirmar por la página oficial).
- Una `emergency` correcta suele ser `verify` (colgar y llamar tú al familiar), no `cut`.

## Borradores de ejemplo (revisar y reescribir)
```json
[
  {
    "id": "job-001", "pool": "practice", "family": "job", "channel": "whatsapp",
    "scenario": "Aurora Digital (empresa ficticia): 'Gana $1.800.000 semanales dando me gusta a videos desde tu celular. Cupos limitados, responde hoy. Para activar tu cuenta consigna $50.000 de capacitación; te los devolvemos con tu primer pago. Escríbenos por Telegram.'",
    "isScam": true, "signals": {"P": true, "A": true, "R": true, "E": false},
    "correctAction": "cut",
    "explanation": "Piden dinero antes de empezar (Pago), presionan con cupos y 'responde hoy' (Apuro) y mandan a otro chat sin datos verificables de la empresa (Rastro).",
    "difficulty": 1, "reviewedByAuthor": false
  },
  {
    "id": "emg-001", "pool": "practice", "family": "emergency", "channel": "call",
    "scenario": "Llaman al celular: 'Señora, habla un médico. Su hijo tuvo un accidente y está grave. Transfiera $800.000 ya para operarlo. No cuelgue ni llame a nadie, cada minuto cuenta.'",
    "isScam": true, "signals": {"P": true, "A": true, "R": true, "E": false},
    "correctAction": "verify",
    "explanation": "Piden una transferencia inmediata (Pago), no dejan colgar (Apuro) y no se puede confirmar quién llama (Rastro). Lo correcto: colgar y llamar tú al familiar o a un contacto que ya conoces.",
    "difficulty": 1, "reviewedByAuthor": false
  },
  {
    "id": "job-002", "pool": "practice", "family": "job", "channel": "email",
    "scenario": "Un correo de una empresa ficticia: 'Hola Laura, vimos tu hoja de vida en la bolsa de empleo. Te invitamos a una entrevista el jueves a las 10 a. m. en nuestra sede. El proceso no tiene costo. Puedes confirmar llamando al teléfono publicado en nuestra página oficial.'",
    "isScam": false, "signals": {"P": false, "A": false, "R": false, "E": false},
    "correctAction": "proceed",
    "explanation": "No piden dinero, no presionan, ofrecen una forma de verificar por la página oficial y no piden datos innecesarios. Aun así conviene confirmar por ese canal.",
    "difficulty": 2, "reviewedByAuthor": false
  }
]
```

## Pendiente del autor
Revisar y completar los 16 casos. Es la tarea más importante del proyecto: de ella depende que la medición sea confiable.
