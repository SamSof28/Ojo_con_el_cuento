import type { Signal } from "@/domain/types";

export interface LessonCard {
  signal: Signal;
  title: string;
  body: string;
  question: string;
  options: readonly string[];
  correctIndex: number;
  feedback: string;
}

export const LESSON_CARDS: readonly LessonCard[] = [
  {
    signal: "P",
    title: "P de Pago",
    body: "Es la señal de la plata: te piden dinero, una recarga o un depósito antes de darte algo.",
    question: "¿Cuál de estas frases es una señal de Pago?",
    options: [
      "Te llamamos desde la empresa",
      "Consigna $50.000 para activar tu cuenta",
      "Puedes responder mañana",
    ],
    correctIndex: 1,
    feedback:
      "Si te piden plata antes de darte el trabajo o el premio, enciende la P.",
  },
  {
    signal: "A",
    title: "A de Apuro",
    body: "Es la prisa que no te deja pensar: “hoy”, “ya”, “no cuelgues”, “no le cuentes a nadie”.",
    question: "¿Cuál es una señal de Apuro?",
    options: [
      "El proceso no tiene costo",
      "Puedes confirmar por la página oficial",
      "No cuelgues ni le digas a nadie",
    ],
    correctIndex: 2,
    feedback:
      "Sí. Cuando te prohíben colgar o avisar, quieren que decidas sin pensar. Ahí aparece la A.",
  },
  {
    signal: "R",
    title: "R de Rastro",
    body: "Es la falta de rastro: no puedes confirmar quién es por un canal distinto al que te escribió o llamó.",
    question: "¿Qué significa la señal de Rastro?",
    options: [
      "No puedo verificar quién es por otro canal",
      "El mensaje tiene un error de ortografía",
      "La persona usa un número desconocido",
    ],
    correctIndex: 0,
    feedback:
      "Rastro no es desconfiar de todo: es comprobar por un canal que tú ya conocías.",
  },
  {
    signal: "E",
    title: "E de Exposición",
    body: "Es cuando piden claves, códigos o datos que no corresponden: contraseñas, códigos de verificación, foto de la cédula.",
    question: "¿Qué dato nunca deberías compartir por mensaje?",
    options: [
      "Tu horario disponible",
      "Un código de verificación",
      "El nombre del cargo que buscas",
    ],
    correctIndex: 1,
    feedback:
      "Ese código es una llave. Nadie legítimo debería pedírtelo por chat o por llamada.",
  },
];
