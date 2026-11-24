import type { Action, Signal } from "@/domain/types";

export interface SignalInfo {
  letter: Signal;
  name: string;
  question: string;
  description: string;
}

export const SIGNAL_INFO: Record<Signal, SignalInfo> = {
  P: {
    letter: "P",
    name: "Pago",
    question: "¿Me piden dinero antes de darme algo?",
    description:
      "Transferencias, recargas o depósitos por adelantado para “activar” un trabajo o un premio.",
  },
  A: {
    letter: "A",
    name: "Apuro",
    question: "¿Me presionan para decidir ya?",
    description:
      "“Hoy mismo”, “no cuelgues”, “no le cuentes a nadie”. La prisa impide pensar.",
  },
  R: {
    letter: "R",
    name: "Rastro",
    question: "¿Puedo verificar quién es por otro canal?",
    description:
      "Solo hay chat o llamada y no hay una página, dirección o teléfono oficial para confirmar.",
  },
  E: {
    letter: "E",
    name: "Exposición",
    question: "¿Me piden claves, códigos o datos que no corresponden?",
    description:
      "Códigos de verificación, contraseñas, fotos de la cédula o datos de la cuenta.",
  },
};

export interface ActionInfo {
  action: Action;
  label: string;
  shortLabel: string;
  description: string;
}

export const ACTION_INFO: Record<Action, ActionInfo> = {
  cut: {
    action: "cut",
    label: "Cortar",
    shortLabel: "Cortar",
    description:
      "No respondas más o cuelga. Si ya diste datos, cambia tus claves y pide ayuda.",
  },
  verify: {
    action: "verify",
    label: "Verificar por otro canal",
    shortLabel: "Verificar",
    description:
      "Cuelga y llama tú al número guardado del familiar o a la empresa, por un canal que ya conocías.",
  },
  proceed: {
    action: "proceed",
    label: "Seguir con cuidado",
    shortLabel: "Seguir",
    description:
      "Parece legítimo. Confirma por el canal oficial y no compartas datos sensibles por el chat.",
  },
};

export const FAMILY_LABELS: Record<"job" | "emergency", string> = {
  job: "Oferta de empleo",
  emergency: "Emergencia familiar",
};

export const CHANNEL_LABELS: Record<
  "whatsapp" | "call" | "sms" | "email",
  string
> = {
  whatsapp: "Mensaje de chat",
  call: "Llamada",
  sms: "Mensaje de texto",
  email: "Correo",
};
