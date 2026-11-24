import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { AdultAccessGate } from "@/components/AdultAccessGate";
import "./globals.css";

const bodyFont = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ojo con el Cuento | Aprende el método PARE",
    template: "%s · Ojo con el Cuento",
  },
  description:
    "Herramienta educativa con IA para reconocer estafas por mensaje y por llamada. Aprende el método PARE en unos 15 minutos, sin registro.",
  applicationName: "Ojo con el Cuento",
  authors: [{ name: "Samuel Romaña Acevedo" }],
  keywords: [
    "estafas",
    "PARE",
    "Antioquia",
    "educación",
    "seguridad digital",
    "empleo",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-CO"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <div className="site-shell">
          <a className="skip-link" href="#contenido">
            Saltar al contenido
          </a>
          <AdultAccessGate>{children}</AdultAccessGate>
          <footer className="site-footer">
            <div className="site-footer__inner">
              <p>
                <strong>Ojo con el Cuento</strong> · Prototipo educativo para
                Expl-AI-n 2026.
              </p>
              <p>
                Empresas, personas y números son ficticios. No escribas datos
                personales ni claves en la herramienta.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
