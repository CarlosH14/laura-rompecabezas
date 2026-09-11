import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Foto from '../Foto'
import { asset, confettiPequeno, sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #1 — Canciones 🎵
 * Quiz: suena un fragmento, hay tres opciones, y al acertar se revela
 * la historia detrás de la canción.
 */
export default function Canciones({ juego, datos, onCompletar }) {
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState(null) // opción tocada en la pregunta actual
  const [acertadas, setAcertadas] = useState([]) // índices de canciones ya acertadas
  const [sonando, setSonando] = useState(false)
  const [audioRoto, setAudioRoto] = useState(false)

  const audioRef = useRef(null)
  const yaAvisado = useRef(false)

  const cancion = datos[indice]
  const acertada = acertadas.includes(indice)
  const total = datos.length

  // Al cambiar de canción: parar el audio y limpiar la selección.
  useEffect(() => {
    audioRef.current?.pause()
    setSonando(false)
    setAudioRoto(false)
    setElegida(null)
  }, [indice])

  // Avisar al contenedor cuando estén las tres.
  useEffect(() => {
    if (acertadas.length === total && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [acertadas, total, onCompletar])

  const alternarAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (sonando) {
      audio.pause()
      setSonando(false)
      return
    }
    const p = audio.play()
    if (p?.then) p.then(() => setSonando(true)).catch(() => setAudioRoto(true))
    else setSonando(true)
  }

  const responder = (i) => {
    if (acertada) return
    setElegida(i)

    if (i === cancion.correcta) {
      setAcertadas((prev) => (prev.includes(indice) ? prev : [...prev, indice]))
      confettiPequeno()
      sonar('ding', 0.28)
      audioRef.current?.pause()
      setSonando(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progreso */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            initial={{ width: 0 }}
            animate={{ width: `${(acertadas.length / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {acertadas.length}/{total}
        </span>
      </div>

      <div className="card overflow-hidden p-0">
        {/* Foto de la canción */}
        <Foto
          src={cancion.foto}
          alt={`Foto de ${cancion.titulo}`}
          emoji="🎵"
          gradiente={juego.gradiente}
          className="h-52 w-full sm:h-64"
        />

        <div className="p-5">
          {/* Reproductor */}
          <audio
            ref={audioRef}
            src={asset(cancion.audio)}
            preload="none"
            onEnded={() => setSonando(false)}
            onError={() => setAudioRoto(true)}
          />

          <motion.button
            type="button"
            onClick={alternarAudio}
            whileTap={{ scale: 0.96 }}
            disabled={audioRoto}
            className={`btn-base w-full bg-gradient-to-r ${juego.gradiente} font-semibold text-white shadow-md disabled:opacity-45`}
          >
            {audioRoto ? '🔇 Audio no disponible' : sonando ? '⏸ Pausar' : '▶ Reproducir'}
          </motion.button>

          {audioRoto && (
            <p className="mt-2 text-center text-[11px] leading-snug text-muted">
              Falta el archivo <code>public/{cancion.audio}</code>. La canción se puede adivinar igual.
            </p>
          )}

          {/* Opciones */}
          <p className="mt-5 mb-2 text-center text-[13px] font-medium text-muted">
            ¿Qué canción es esta?
          </p>

          <div className="flex flex-col gap-2">
            {cancion.opciones.map((opcion, i) => {
              const esCorrecta = i === cancion.correcta
              const fueElegida = elegida === i
              const revelar = acertada || (elegida !== null && esCorrecta)

              let estilo = 'border-black/10 bg-white text-dark'
              if (revelar && esCorrecta) estilo = 'border-success bg-success/10 text-success font-semibold'
              else if (fueElegida && !esCorrecta) estilo = 'border-danger bg-danger/10 text-danger'

              return (
                <motion.button
                  key={opcion + i}
                  type="button"
                  onClick={() => responder(i)}
                  whileTap={{ scale: acertada ? 1 : 0.97 }}
                  animate={fueElegida && !esCorrecta ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                  disabled={acertada}
                  className={`btn-base w-full justify-between border-2 text-left ${estilo}`}
                >
                  <span>{opcion}</span>
                  {revelar && esCorrecta && <span aria-hidden="true">✓</span>}
                  {fueElegida && !esCorrecta && <span aria-hidden="true">✕</span>}
                </motion.button>
              )
            })}
          </div>

          {/* Mensajes */}
          <AnimatePresence mode="wait">
            {acertada && (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <p className="text-center font-semibold text-success">¡Correcto! 🎉</p>
                <div className="mt-3 rounded-xl bg-light p-4">
                  <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
                    Mi historia con {cancion.titulo}
                    {cancion.artista ? ` · ${cancion.artista}` : ''}
                  </p>
                  <p className="text-[13px] leading-relaxed">{cancion.historia}</p>
                </div>
              </motion.div>
            )}

            {!acertada && elegida !== null && (
              <motion.p
                key="fail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-[13px] font-medium text-danger"
              >
                Uy, esa no. La correcta está en verde — toca esa 😉
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navegación entre canciones */}
      <div className="flex items-center justify-between gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0}
          className="btn-base border border-black/10 bg-white text-dark disabled:opacity-35"
        >
          ← Anterior
        </motion.button>

        <div className="flex gap-1.5" aria-hidden="true">
          {datos.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                acertadas.includes(i) ? 'bg-success' : i === indice ? 'bg-primary' : 'bg-black/15'
              }`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setIndice((i) => Math.min(total - 1, i + 1))}
          disabled={indice === total - 1}
          className="btn-base border border-black/10 bg-white text-dark disabled:opacity-35"
        >
          Siguiente →
        </motion.button>
      </div>

      {acertadas.length === total && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          ¡Completaste las {total} canciones! 🎶
        </motion.p>
      )}
    </div>
  )
}
