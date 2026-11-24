import Link from "next/link";
import { PareMark, SignalSeal } from "@/components/Brand";
import { ACTION_INFO, SIGNAL_INFO } from "@/content/pare";
import { ACTIONS, SIGNALS } from "@/domain/types";

const stations = [
  ["Diagnóstico", "5 casos para reconocer tu punto de partida."],
  ["Lección", "Una pregunta breve para cada letra PARE."],
  ["Práctica", "Decide, revisa y conversa con el tutor Gemini."],
  ["Prueba final", "5 casos nuevos con el mismo nivel de dificultad."],
  ["Resultado", "Compara tus respuestas y elige un hábito."],
] as const;

export default function Home() {
  return (
    <main id="contenido" className="wide-container">
      <header className="hero hero--landing">
        <div className="hero__topline">
          <PareMark />
          <span className="chip chip--primary">
            Antioquia sin brechas · Expl-AI-n 2026
          </span>
        </div>

        <div className="hero__layout">
          <div className="hero__copy">
            <h1 className="hero-title">
              Reconocer una estafa también se aprende.
            </h1>
            <p className="hero-subtitle">
              Practica con mensajes y llamadas que se parecen a los reales.
              Reconoce las señales PARE y decide cuándo cortar, verificar o
              seguir con cuidado.
            </p>

            <div className="hero-actions">
              <Link className="btn btn--secondary" href="/sesion">
                Empezar el recorrido
              </Link>
              <a className="hero-text-link" href="#como-funciona">
                Ver cómo funciona
              </a>
            </div>

            <ul className="meta-chips" aria-label="Datos de la experiencia">
              <li className="chip">≈ 15 minutos</li>
              <li className="chip">Sin registro</li>
              <li className="chip">Funciona con o sin IA</li>
            </ul>
          </div>

          <aside className="hero-tutor" aria-label="Cómo enseña el tutor Gemini">
            <h2>La IA no responde por ti. Te ayuda a pensar.</h2>
            <p>
              Después de cada respuesta, Gemini consulta la información
              verificada del caso y te devuelve una explicación y una pregunta
              para reflexionar.
            </p>
            <ol className="hero-tutor__steps">
              <li>
                <span>01</span>
                <span>Tú lees y decides.</span>
              </li>
              <li>
                <span>02</span>
                <span>El tutor contrasta tu elección con el caso.</span>
              </li>
              <li>
                <span>03</span>
                <span>Recibes una pista para pensar por tu cuenta.</span>
              </li>
            </ol>
            <p className="hero-tutor__note">
              El puntaje lo calcula el sistema, nunca la IA.
            </p>
          </aside>
        </div>
      </header>

      <section className="section audience-section" aria-labelledby="para-quien">
        <div>
          <h2 className="section-title" id="para-quien">
            Para decidir con calma cuando llega un mensaje urgente.
          </h2>
          <p className="section-lead">
            Una práctica corta para personas de Antioquia que buscan empleo o
            reciben ofertas y supuestas emergencias en el celular. Hecha para
            pantallas pequeñas, datos limitados y distintos niveles de
            experiencia digital.
          </p>
        </div>
        <div className="audience-outcomes">
          <p className="audience-outcomes__lead">Al terminar podrás:</p>
          <ul>
            <li>Encontrar señales de riesgo sin desconfiar de todo.</li>
            <li>Elegir entre cortar, verificar o seguir con cuidado.</li>
            <li>Explicarle a alguien más por qué conviene verificar.</li>
          </ul>
          <p className="audience-outcomes__note">
            Sin culpas: estas situaciones están diseñadas para presionar.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="metodo-pare">
        <div className="section-heading">
          <h2 className="section-title" id="metodo-pare">
            Cuatro señales para hacer una pausa.
          </h2>
          <p className="section-lead">
            No se trata de temerle a todo. Se trata de reconocer qué revisar
            antes de responder.
          </p>
        </div>
        <dl className="pare-list">
          {SIGNALS.map((signal) => {
            const info = SIGNAL_INFO[signal];

            return (
              <div className="pare-item" key={signal}>
                <dt>
                  <SignalSeal letter={signal} size="md" />
                  <span>{info.letter} · {info.name}</span>
                </dt>
                <dd>
                  <strong>{info.question}</strong>
                  <span>{info.description}</span>
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="pare-rule">
          <strong>Si algo no cuadra:</strong> cuelga y verifica por un canal que
          ya conocías, como el número guardado de tu familiar o el teléfono
          oficial de la empresa.
        </p>
      </section>

      <section
        className="section journey-section"
        id="como-funciona"
        aria-labelledby="ruta"
      >
        <div className="section-heading">
          <h2 className="section-title" id="ruta">
            Un recorrido de principio a fin.
          </h2>
          <p className="section-lead">
            Primero respondes por tu cuenta; luego aprendes, practicas y
            comparas lo que lograste.
          </p>
        </div>
        <ol className="journey-list">
          {stations.map(([title, description], index) => (
            <li key={title}>
              <span className="journey-list__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section ai-feature" aria-labelledby="ia">
        <div className="ai-feature__intro">
          <h2 className="section-title" id="ia">
            Un tutor que usa el caso, no un chatbot genérico.
          </h2>
          <p className="section-lead">
            Gemini recibe el caso revisado y tu respuesta para explicar señales
            concretas. Si la IA no responde, la actividad continúa con el
            respaldo preparado.
          </p>
          <Link className="btn btn--primary" href="/sesion">
            Probar la experiencia
          </Link>
        </div>

        <div className="ai-feature__modules">
          <article className="ai-feature__module ai-feature__module--primary">
            <h3>Retroalimentación personalizada</h3>
            <p>
              Contrasta tus señales y tu decisión con la explicación verificada.
              Te orienta sin cambiar el puntaje.
            </p>
          </article>
          <article className="ai-feature__module">
            <h3>Simulación de conversación</h3>
            <p>
              Gemini interpreta al personaje sin revelar la respuesta correcta
              ni salirse de la información del caso.
            </p>
          </article>
          <article className="ai-feature__module">
            <h3>Aprender explicándolo</h3>
            <p>
              Revisa qué señales incluiste en el consejo que darías a otra
              persona. No cuenta para la nota.
            </p>
          </article>
        </div>
        <p className="ai-feature__privacy">
          Según la actividad, se envían a Google el caso ficticio, las
          respuestas seleccionadas, los mensajes de la simulación o el consejo
          que escribas. No incluyas nombres, claves ni información personal. En
          el nivel gratuito, Google puede usar las solicitudes y respuestas
          para mejorar sus servicios.
        </p>
      </section>

      <section className="section decision-section" aria-labelledby="acciones">
        <div className="section-heading">
          <h2 className="section-title" id="acciones">
            Aprende a verificar, no a responder con miedo.
          </h2>
          <p className="section-lead">
            También hay ofertas legítimas. La decisión depende de las señales y
            de si puedes confirmar quién te contacta.
          </p>
        </div>
        <dl className="decision-list">
          {ACTIONS.map((action) => {
            const info = ACTION_INFO[action];

            return (
              <div key={action}>
                <dt>{info.label}</dt>
                <dd>{info.description}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="section trust-section" aria-labelledby="confianza">
        <div className="section-heading">
          <h2 className="section-title" id="confianza">
            Una experiencia transparente y sin registro.
          </h2>
          <p className="section-lead">
            Los casos son ficticios, el avance queda en este navegador y la IA
            nunca calcula tu resultado.
          </p>
        </div>
        <p className="trust-note">
          <strong>Todo es ficticio.</strong> Los nombres, empresas y mensajes se
          crearon para practicar. No incluyas información personal.
        </p>
        <p className="honest-note">
          La prueba final tiene 5 casos y un máximo de 10 puntos. Mostrar un
          resultado no equivale a certificar una competencia: es una medida de
          tus respuestas en esta sesión.
        </p>
      </section>

      <section className="section cta-section" aria-labelledby="empezar">
        <h2 className="section-title" id="empezar">
          Haz una pausa. Mira el caso. Decide con PARE.
        </h2>
        <p className="section-lead">
          Completa el recorrido en unos 15 minutos. Sin crear una cuenta.
        </p>
        <Link className="btn btn--primary" href="/sesion">
          Empezar el recorrido
        </Link>
      </section>
    </main>
  );
}
