import type { Metadata } from "next";
import { SessionApp } from "@/components/SessionApp";

export const metadata: Metadata = {
  title: "Tu recorrido",
  description:
    "Diagnóstico, lección, práctica y prueba final del método PARE para reconocer estafas.",
};

export default function SessionPage() {
  return (
    <main id="contenido" className="page-container">
      <SessionApp />
    </main>
  );
}
