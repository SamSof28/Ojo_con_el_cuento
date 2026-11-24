import Link from "next/link";
import { PareMark, SignalSeal } from "@/components/Brand";
import { ACTION_INFO, SIGNAL_INFO } from "@/content/pare";
import { LESSON_CARDS } from "@/content/lesson";
import { ACTIONS, SIGNALS } from "@/domain/types";

const stations = [
  ["Diagnóstico", "5 casos para saber de dónde partes."],
  ["Lección", "4 tarjetas cortas, una por letra."],
  ["Práctica", "Casos con pistas, IA y consejo a un familiar."],
  ["Prueba final", "5 casos nuevos, equivalentes al diagnóstico."],
  ["Resultado", "Comparación honesta y plan de hábitos."],
] as const;

export default function Home() {
  return (
    <main id="contenido" className="wide-container">
      <header className="hero">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PareMark />
          <span className="chip chip--primary">
            Antioquia sin brechas · Expl-AI-n 2026
          </span>
        </div>

        <p className="eyebrow mt-8">Aprende a ver el cuento antes de caer</p>
        <h1 className="hero-title">
          Reconocer una estafa también se aprende.
        </h1>
        <p className="hero-subtitle">
          Practica con mensajes y llamadas que se parecen a los reales. Vas a
          reconocer las señales PARE y a decidir cuándo cortar, verificar o
          seguir con cuidado.
        </p>

        <div className="hero-actions">
          <Link className="btn btn--primary" href="/sesion">
            Empezar ahora
          </Link>
          <a className="btn btn--secondary" href="#como-funciona">
            Ver cómo funciona
          </a>
        </div>

        <ul className="meta-chips" aria-label="Datos de la experiencia">
          <li className="chip">≈ 15 minutos</li>
          <li className="chip">Sin registro</li>
          <li className="chip">IA + respaldo preparado</li>
        </ul>
      </header>

      <section className="section" aria-labelledby="para-quien">
        <p className="section-kicker">Para quién es</p>
        <h2 className="section-title" id="para-quien">
          Para personas adultas que reciben mensajes y llamadas en el celular.
        </h2>
        <p className="section-lead">
          Personas adultas de Antioquia que buscan empleo o reciben ofertas y
          emergencias por chat. Está pensada para celulares de gama media o baja,
          con datos limitados y sin experiencia técnica.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="card card--soft">
            <h3 className="card-title">Lo que vas a poder hacer</h3>
            <ol className="m-0 list-decimal space-y-1 pl-5 text-sm">
              <li>Reconocer si aparecen Pago, Apuro, Rastro o Exposición.</li>
              <li>
                Decidir entre cortar, verificar por otro canal o seguir con
                cuidado.
              </li>
              <li>Explicarle a otra persona por qué un caso es riesgoso.</li>
            </ol>
          </div>
          <div className="card">
            <h3 className="card-title">Sin culpa y sin miedo</h3>
            <p className="text-sm text-muted">
              Estas estafas están diseñadas para funcionar. Si alguna vez caíste,
              no eres ingenuo. Aquí practicas con casos ficticios y puedes
              intentarlo de nuevo.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="metodo-pare">
        <p className="section-kicker">El método</p>
        <h2 className="section-title" id="metodo-pare">
          Cuatro letras para hacer una pausa.
        </h2>
        <p className="section-lead">
          Antes de responder, mira el mensaje con esta lista corta. No se trata
          de desconfiar de todo, sino de verificar.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {SIGNALS.map((signal) => {
            const info = SIGNAL_INFO[signal];

            return (
              <article className="card" key={signal}>
                <div className="flex items-start gap-3">
                  <SignalSeal letter={signal} size="md" />
                  <div>
                    <h3 className="card-title">
                      {info.letter} · {info.name}
                    </h3>
                    <p className="text-sm font-semibold">{info.question}</p>
                    <p className="mt-1 text-sm text-muted">
                      {info.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="callout">
          <p>
            <strong>Regla de oro:</strong> cuelga y verifica por un canal que tú
            ya conocías. Llama tú al número guardado del familiar o busca el
            teléfono en la página oficial de la empresa.
          </p>
        </div>
      </section>

      <section className="section" id="como-funciona" aria-labelledby="ruta">
        <p className="section-kicker">El recorrido</p>
        <h2 className="section-title" id="ruta">
          Cinco estaciones, una conversación contigo.
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {stations.map(([title, description], index) => (
            <li className="card" key={title}>
              <p className="mb-1 text-xs font-extrabold tracking-wider text-primary uppercase">
                Estación {index + 1}
              </p>
              <h3 className="card-title">{title}</h3>
              <p className="text-sm text-muted">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="ia">
        <p className="section-kicker">Dónde entra la IA</p>
        <h2 className="section-title" id="ia">
          El coach de IA explica, pero nunca te califica.
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="card">
            <h3 className="card-title">Coach Gemini</h3>
            <p className="text-sm text-muted">
              Explica tus aciertos y errores a partir de la verdad del caso y te
              deja una pregunta para pensar.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">Simulador con respaldo</h3>
            <p className="text-sm text-muted">
              La conversación usa respuestas preparadas. La integración con IA
              para simular personajes está pendiente.
            </p>
          </div>
          <div className="card">
            <h3 className="card-title">Consejo con lista de chequeo</h3>
            <p className="text-sm text-muted">
              Puedes comparar tu consejo con las señales del caso. La revisión
              automática con IA está pendiente y esto no entra en la nota.
            </p>
          </div>
        </div>
        <p className="honest-note">
          La nota del diagnóstico y de la prueba final la calcula código
          determinista con respuestas revisadas. Si la IA falla o se agota la
          cuota, la herramienta sigue con explicaciones preparadas y lo indica
          en pantalla. Por ahora, Gemini está conectado al coach; el simulador y
          el consejo a un familiar conservan su respaldo preparado.
        </p>
        <p className="honest-note">
          Al usar Gemini se envían a Google el caso ficticio y las señales y
          decisión seleccionadas. En el nivel gratuito, Google puede usar las
          solicitudes y respuestas para mejorar sus servicios. No escribas
          información personal.
        </p>
      </section>

      <section className="section" aria-labelledby="confianza">
        <p className="section-kicker">Antes de empezar</p>
        <h2 className="section-title" id="confianza">
          Tres cosas que esta herramienta no hace.
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="card card--alert">
            <h3 className="card-title">No pide datos personales</h3>
            <p className="text-sm">
              No hay login, no hay base de datos y no guardamos tu nombre. El
              avance queda en este navegador.
            </p>
          </div>
          <div className="card card--alert">
            <h3 className="card-title">No reemplaza canales oficiales</h3>
            <p className="text-sm">
              Si ya fuiste víctima o necesitas ayuda legal, acude a los canales
              oficiales que verifiques por tu cuenta.
            </p>
          </div>
          <div className="card card--alert">
            <h3 className="card-title">No inventa resultados</h3>
            <p className="text-sm">
              Solo mostramos lo que respondiste en esta sesión. No hay
              testimonios ni estadísticas inventadas.
            </p>
          </div>
        </div>
        <div className="privacy-note mt-5">
          <span aria-hidden="true">◈</span>
          <p>
            <strong>Todo es ficticio.</strong> Los nombres, empresas y mensajes
            son inventados para practicar. No escribas cédulas, cuentas, claves
            ni datos de personas reales.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="empezar">
        <div className="card card--soft">
          <h2 className="section-title" id="empezar">
            ¿Empezamos?
          </h2>
          <p className="section-lead">
            No necesitas crear una cuenta. Puedes parar y volver; tu avance se
            guarda en este navegador.
          </p>
          <div className="btn-row">
            <Link className="btn btn--primary" href="/sesion">
              Empezar el recorrido
            </Link>
            <a className="btn btn--secondary" href="#metodo-pare">
              Repasar PARE primero
            </a>
          </div>
        </div>
        <p className="honest-note">
          Esta experiencia tiene una actividad completa y una prueba final de 5
          casos. El umbral de dominio es 8 de 10 puntos. No es un certificado:
          es una foto de lo que hiciste en esta sesión.
        </p>
      </section>

      <section className="section" aria-labelledby="acciones">
        <p className="section-kicker">Las tres decisiones</p>
        <h2 className="section-title" id="acciones">
          No todo se resuelve cortando.
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {ACTIONS.map((action) => {
            const info = ACTION_INFO[action];

            return (
              <div className="card" key={action}>
                <h3 className="card-title">{info.label}</h3>
                <p className="text-sm text-muted">{info.description}</p>
              </div>
            );
          })}
        </div>
        <p className="honest-note">
          También hay ofertas legítimas. La meta es aprender a verificar, no a
          responder con miedo a todo.
        </p>
      </section>

      <section className="section" aria-labelledby="leccion-resumen">
        <p className="section-kicker">La lección en una línea</p>
        <h2 className="section-title" id="leccion-resumen">
          Pausa, mira las cuatro señales y verifica por fuera.
        </h2>
        <p className="section-lead">
          En la siguiente estación vas a practicar cada letra con una pregunta
          corta. Después, los casos te van a pedir usarlas todas juntas.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Letras PARE">
          {LESSON_CARDS.map((card) => (
            <span className="chip chip--primary" key={card.signal}>
              <SignalSeal letter={card.signal} size="sm" />
              {card.title}
            </span>
          ))}
        </div>
        <div className="btn-row">
          <Link className="btn btn--primary" href="/sesion">
            Empezar ahora
          </Link>
        </div>
      </section>
    </main>
  );
}
