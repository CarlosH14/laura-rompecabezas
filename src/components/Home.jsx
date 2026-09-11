import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MINIJUEGOS, TOTAL_JUEGOS } from '../data/minijuegos'
import { useGameStore } from '../hooks/useGameStore'
import JuegoCard from './JuegoCard'

/** Pantalla principal: el grid 3x3 con los nueve sobres. */
export default function Home() {
  const desbloqueados = useGameStore((s) => s.desbloqueados)
  const completados = useGameStore((s) => s.completados)
  const abrirModal = useGameStore((s) => s.abrirModal)
  const irAlFinal = useGameStore((s) => s.irAlFinal)

  const sinMovimiento = useReducedMotion()
  const todoCompletado = completados.length === TOTAL_JUEGOS
  const sinEmpezar = desbloqueados.length === 0

  // El primero que está abierto y sin terminar: es el que late en el grid.
  const siguienteAJugar = MINIJUEGOS.find(
    (j) => desbloqueados.includes(j.id) && !completados.includes(j.id),
  )?.id

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16"
    >
      {/* Encabezado */}
      <div className="mb-6 text-center">
        <motion.div
          className="mb-2 inline-block text-5xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={
            sinMovimiento
              ? { scale: 1, rotate: 0 }
              : { scale: 1, rotate: [0, 8, 0, -8, 0], y: [0, -10, 0] }
          }
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 12 },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
          }}
          aria-hidden="true"
        >
          🧩
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-[28px] leading-tight font-semibold"
        >
          Nueve piezas, <span className="texto-gradiente">una sola tú</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mx-auto mt-2 max-w-md text-[13px] text-muted"
        >
          Cada sobre trae una pieza y una clave. Escribe la clave aquí y se abre lo que preparé para ti.
          No hay prisa: tu progreso se guarda solo.
        </motion.p>
      </div>

      {/* Grid 3x3 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MINIJUEGOS.map((juego, i) => (
          <JuegoCard
            key={juego.id}
            juego={juego}
            indice={i}
            esElSiguiente={juego.id === siguienteAJugar}
          />
        ))}
      </div>

      {/* Primera visita: un empujón para que sepa por dónde empezar */}
      <AnimatePresence>
        {sinEmpezar && (
          <motion.button
            type="button"
            onClick={() => abrirModal(1)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileTap={{ scale: 0.97 }}
            className="btn-base btn-destello mx-auto mt-6 flex w-full max-w-sm bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-lg"
          >
            <motion.span
              animate={sinMovimiento ? {} : { rotate: [0, -18, 18, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.4 }}
              aria-hidden="true"
            >
              🔑
            </motion.span>
            Empieza por el sobre #1
          </motion.button>
        )}
      </AnimatePresence>

      {/* Resumen de progreso */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[13px] text-muted"
      >
        <span>
          🔓 <strong className="font-semibold text-dark">{desbloqueados.length}</strong> de {TOTAL_JUEGOS} abiertos
        </span>
        <span>
          ✓ <strong className="font-semibold text-dark">{completados.length}</strong> de {TOTAL_JUEGOS} completados
        </span>
      </motion.div>

      {/* Cuando ya terminó los nueve, puede volver a la pantalla final */}
      {todoCompletado && (
        <motion.button
          type="button"
          onClick={irAlFinal}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="btn-base btn-destello mx-auto mt-6 flex bg-gradient-to-r from-[#764ba2] to-[#fa709a] font-semibold text-white shadow-lg"
        >
          💕 Ver el final otra vez
        </motion.button>
      )}
    </motion.main>
  )
}
