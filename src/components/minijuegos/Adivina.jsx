import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Foto from '../Foto'
import { confettiPequeno, sonar } from '../../utils/efectos'

const NIVELES_BLUR = [40, 30, 20, 10, 0] // px de desenfoque por nivel
const PUNTOS_MAX = 50

/**
 * MINIJUEGO #8 — Momentos 😄
 * La foto empieza borrosa. Cada toque a "Desenfocar" la aclara, pero
 * cuesta puntos. Adivinar temprano vale más.
 */
export default function Adivina({ juego, datos, onCompletar }) {
  const [indice, setIndice] = useState(0)
  const [nivel, setNivel] = useState(0) // 0 = máximo desenfoque
  const [elegida, setElegida] = useState(null)
  const [puntos, setPuntos] = useState(0)
  const [terminado, setTerminado] = useState(false)

  const yaAvisado = useRef(false)
  const total = datos.length
  const item = datos[indice]
  const respondida = elegida !== null
  const acerto = respondida && elegida === item.correcta
  const puntosPosibles = Math.max(10, PUNTOS_MAX - nivel * 10)

  useEffect(() => {
    if (terminado && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [terminado, onCompletar])

  const responder = (i) => {
    if (respondida) return
    setElegida(i)

    if (i === item.correcta) {
      setPuntos((p) => p + puntosPosibles)
      confettiPequeno()
      sonar('ding', 0.26)
    }
  }

  const siguiente = () => {
    if (indice === total - 1) {
      setTerminado(true)
      return
    }
    setIndice((i) => i + 1)
    setNivel(0)
    setElegida(null)
  }

  // Al acertar (o falla) mostramos la foto nítida.
  const blurActual = respondida ? 0 : NIVELES_BLUR[nivel]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-[13px] text-muted">
        <span>
          Foto <strong className="font-semibold text-dark">{indice + 1}</strong> de {total}
        </span>
        <span>
          Puntos: <strong className="font-semibold text-dark tabular-nums">{puntos}</strong>
        </span>
      </div>

      <div className="card overflow-hidden p-0">
        {/* Foto con desenfoque progresivo */}
        <div className="relative h-64 overflow-hidden bg-black/5 sm:h-80">
          <motion.div
            className="h-full w-full"
            animate={{ filter: `blur(${blurActual}px)`, scale: blurActual > 0 ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Foto
              src={item.foto}
              alt="Adivina qué momento es"
              emoji="🖼️"
              gradiente={juego.gradiente}
              className="h-full w-full"
            />
          </motion.div>

          {!respondida && (
            <span className="absolute top-2 right-2 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white">
              Vale {puntosPosibles} pts
            </span>
          )}
        </div>

        <div className="p-5">
          {/* Botón de desenfoque */}
          {!respondida && (
            <div className="mb-4 flex flex-col gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setNivel((n) => Math.min(NIVELES_BLUR.length - 1, n + 1))}
                disabled={nivel >= NIVELES_BLUR.length - 1}
                className="btn-base w-full border border-black/10 bg-white text-dark disabled:opacity-40"
              >
                🔍 Desenfocar un poco {nivel >= NIVELES_BLUR.length - 1 ? '(ya está nítida)' : '(-10 pts)'}
              </motion.button>
              <div className="flex justify-center gap-1" aria-hidden="true">
                {NIVELES_BLUR.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${i <= nivel ? 'bg-primary' : 'bg-black/12'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="mb-2 text-center text-[15px] font-semibold">{item.pregunta}</p>

          <div className="flex flex-col gap-2">
            {item.respuestas.map((respuesta, i) => {
              const esCorrecta = i === item.correcta
              const fueElegida = elegida === i

              let estilo = 'border-black/10 bg-white text-dark'
              if (respondida && esCorrecta) estilo = 'border-success bg-success/10 font-semibold text-success'
              else if (fueElegida && !esCorrecta) estilo = 'border-danger bg-danger/10 text-danger'

              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => responder(i)}
                  whileTap={{ scale: respondida ? 1 : 0.97 }}
                  disabled={respondida}
                  className={`btn-base w-full justify-between border-2 text-left ${estilo}`}
                >
                  <span>{respuesta}</span>
                  {respondida && esCorrecta && <span aria-hidden="true">✓</span>}
                  {fueElegida && !esCorrecta && <span aria-hidden="true">✕</span>}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {respondida && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p
                  className={`text-center font-semibold ${acerto ? 'text-success' : 'text-danger'}`}
                >
                  {acerto ? `¡Correcto! +${puntosPosibles} puntos 🎉` : 'Casi. Era la que está en verde.'}
                </p>

                <div className="mt-3 rounded-xl bg-light p-4">
                  <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
                    La historia
                  </p>
                  <p className="text-[13px] leading-relaxed">{item.historia}</p>
                </div>

                {!terminado && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={siguiente}
                    className={`btn-base mt-4 w-full bg-gradient-to-r ${juego.gradiente} font-semibold text-white shadow-md`}
                  >
                    {indice === total - 1 ? 'Ver mi puntaje →' : 'Siguiente foto →'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {terminado && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
          <p className="text-3xl" aria-hidden="true">
            🏆
          </p>
          <p className="mt-1 text-[13px] text-muted">Puntaje final</p>
          <p className="text-3xl font-semibold tabular-nums">
            {puntos}
            <span className="text-base font-normal text-muted"> / {total * PUNTOS_MAX}</span>
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-dark/80">
            {puntos >= total * PUNTOS_MAX * 0.8
              ? 'Te acuerdas de todo. Por eso te amo. 💕'
              : 'Da igual el puntaje: los momentos ya los vivimos juntos. 💕'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
