import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import { MINIJUEGOS, TOTAL_JUEGOS, juegoPorId } from '../data/minijuegos'
import { confettiGrande, sonar } from '../utils/efectos'

import Canciones from './minijuegos/Canciones'
import Promesas from './minijuegos/Promesas'
import Timeline from './minijuegos/Timeline'
import SopaLetras from './minijuegos/SopaLetras'
import Futuro from './minijuegos/Futuro'
import CuentaRegresiva from './minijuegos/CuentaRegresiva'
import NueveRazones from './minijuegos/NueveRazones'
import Adivina from './minijuegos/Adivina'
import Poema from './minijuegos/Poema'

const POR_TIPO = {
  quiz: Canciones,
  memoria: Promesas,
  timeline: Timeline,
  sopa: SopaLetras,
  revelar: Futuro,
  sorpresas: CuentaRegresiva,
  puzzle: NueveRazones,
  adivina: Adivina,
  poema: Poema,
}

/**
 * Envoltura común de los nueve minijuegos: cabecera con el gradiente del
 * juego, el minijuego dentro, y el pie con la navegación.
 *
 * Cada minijuego solo se preocupa de su mecánica y llama a `onCompletar()`
 * cuando termina. De la celebración, el guardado y el "¿y ahora qué?" se
 * encarga este componente.
 */
export default function JuegoContainer() {
  const juegoActual = useGameStore((s) => s.juegoActual)
  const marcarCompletado = useGameStore((s) => s.marcarCompletado)
  const volverAlInicio = useGameStore((s) => s.volverAlInicio)
  const irAJuego = useGameStore((s) => s.irAJuego)
  const abrirModal = useGameStore((s) => s.abrirModal)
  const irAlFinal = useGameStore((s) => s.irAlFinal)
  const desbloqueados = useGameStore((s) => s.desbloqueados)
  const completados = useGameStore((s) => s.completados)

  const [recienCompletado, setRecienCompletado] = useState(false)

  const juego = juegoActual ? juegoPorId(juegoActual) : null

  useEffect(() => {
    setRecienCompletado(false)
  }, [juegoActual])

  const alCompletar = useCallback(() => {
    if (!juego) return
    marcarCompletado(juego.id)
    setRecienCompletado(true)
    confettiGrande()
    sonar('tada', 0.35)
  }, [juego, marcarCompletado])

  if (!juego) return null

  const Minijuego = POR_TIPO[juego.tipo]
  const siguiente = MINIJUEGOS.find((j) => j.id === juego.id + 1)
  const siguienteDesbloqueado = siguiente ? desbloqueados.includes(siguiente.id) : false
  const todoListo = completados.length === TOTAL_JUEGOS

  return (
    <motion.main
      key={juego.id}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl px-4 pt-4 pb-16"
    >
      {/* Cabecera del minijuego */}
      <motion.div
        initial={{ opacity: 0, y: -14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className={`relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br ${juego.gradiente} p-5 text-white shadow-lg`}
      >
        {/* Destello de bienvenida, una sola pasada */}
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent [animation:destello_1.6s_ease-out_1]"
          aria-hidden="true"
        />
        <p className="text-[11px] font-medium tracking-wider uppercase opacity-80">Sobre #{juego.id}</p>
        <h1 className="mt-0.5 flex items-center gap-2 text-2xl font-semibold">
          <motion.span
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 13, delay: 0.1 }}
            aria-hidden="true"
          >
            {juego.emoji}
          </motion.span>{' '}
          {juego.titulo}
        </h1>
        <p className="mt-1 text-[13px] leading-relaxed opacity-95">{juego.intro}</p>
      </motion.div>

      {/* El minijuego */}
      {Minijuego ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <Minijuego juego={juego} datos={juego.contenido} onCompletar={alCompletar} />
        </motion.div>
      ) : (
        <p className="card text-center text-muted">
          No encontré el minijuego del tipo "{juego.tipo}".
        </p>
      )}

      {/* Pie: qué hacer después */}
      <AnimatePresence>
        {recienCompletado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="card mt-6 text-center"
          >
            <motion.p
              className="text-3xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
              transition={{
                scale: { type: 'spring', stiffness: 400, damping: 12 },
                y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              }}
              aria-hidden="true"
            >
              🎉
            </motion.p>
            <h2 className="mt-1 text-xl font-semibold">Minijuego completado</h2>

            {todoListo ? (
              <>
                <p className="mt-1 text-[13px] text-muted">
                  Nueve de nueve. Lo armaste todo, Laura.
                </p>
                <motion.button
                  type="button"
                  onClick={irAlFinal}
                  whileTap={{ scale: 0.96 }}
                  className="btn-base btn-destello mx-auto mt-4 flex bg-gradient-to-r from-[#764ba2] to-[#fa709a] font-semibold text-white shadow-lg"
                >
                  💕 Abrir el final
                </motion.button>
              </>
            ) : (
              <>
                <p className="mt-1 text-[13px] text-muted">
                  {siguiente
                    ? siguienteDesbloqueado
                      ? `Ya tienes abierto el siguiente: ${siguiente.titulo}.`
                      : `Cuando abras el sobre #${siguiente.id} tendrás la clave del siguiente.`
                    : 'Te faltan algunos sobres por abrir.'}
                </p>

                <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
                  {siguiente && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        siguienteDesbloqueado ? irAJuego(siguiente.id) : abrirModal(siguiente.id)
                      }
                      className={`btn-base btn-destello bg-gradient-to-r ${siguiente.gradiente} font-semibold text-white shadow-lg`}
                    >
                      {siguienteDesbloqueado
                        ? `${siguiente.emoji} Ir a ${siguiente.titulo}`
                        : `🔑 Tengo la clave del sobre #${siguiente.id}`}
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={volverAlInicio}
                    className="btn-base border border-black/10 bg-white text-dark"
                  >
                    Volver al inicio
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!recienCompletado && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={volverAlInicio}
            className="text-[13px] font-medium text-muted underline decoration-dotted underline-offset-4"
          >
            ← Volver al inicio
          </button>
        </div>
      )}
    </motion.main>
  )
}
