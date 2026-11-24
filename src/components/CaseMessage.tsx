import { CHANNEL_LABELS, FAMILY_LABELS } from "@/content/pare";
import type { CaseRecord } from "@/domain/types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CaseMessage({ caseRecord }: { caseRecord: CaseRecord }) {
  const time = caseRecord.time ?? "";

  return (
    <article className="case-card" aria-label="Caso para analizar">
      <div className="case-meta">
        <span className="chip chip--primary">
          {FAMILY_LABELS[caseRecord.family]}
        </span>
        <span className="chip">{CHANNEL_LABELS[caseRecord.channel]}</span>
      </div>

      {caseRecord.channel === "call" ? (
        <div className="call-screen">
          <div className="call-screen__top">
            <div className="call-screen__avatar" aria-hidden="true">
              {initials(caseRecord.sender)}
            </div>
            <p className="call-screen__label">Llamada entrante</p>
            <p className="call-screen__name">{caseRecord.sender}</p>
            <p className="mt-1 text-xs opacity-80">
              Número desconocido · {time}
            </p>
          </div>
          <p className="call-screen__message">{caseRecord.scenario}</p>
        </div>
      ) : caseRecord.channel === "email" ? (
        <div className="case-email">
          <div className="case-email__head">
            <span className="case-email__sender">{caseRecord.sender}</span>
            <span className="text-xs text-muted">{time}</span>
          </div>
          <div className="case-email__body">{caseRecord.scenario}</div>
        </div>
      ) : caseRecord.channel === "sms" ? (
        <div className="sms-card">
          <div className="sms-card__head">
            <span className="sms-card__sender">{caseRecord.sender}</span>
            <span className="text-xs text-muted">{time}</span>
          </div>
          <p className="sms-card__body">{caseRecord.scenario}</p>
        </div>
      ) : (
        <div className="case-phone">
          <div className="case-phone__bar">
            <span className="case-phone__sender">{caseRecord.sender}</span>
            <span className="case-phone__status">{time}</span>
          </div>
          <div className="case-phone__body">
            <div className="chat-bubble">
              {caseRecord.scenario}
              <span className="chat-bubble__time">{time}</span>
            </div>
          </div>
        </div>
      )}

      <p className="case-fictitious">
        Caso ficticio para practicar. No respondas a mensajes reales desde aquí.
      </p>
    </article>
  );
}
