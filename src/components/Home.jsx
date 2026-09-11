import { motion } from 'framer-motion'
import { MINIJUEGOS, TOTAL_JUEGOS } from '../data/minijuegos'
import { useGameStore } from '../hooks/useGameStore'
import JuegoCard from './JuegoCard'

/** Pantalla principal: el grid 3x3 con los nueve sobres. */
export default function Home() {
  const desbloqueados = useGameStore((s) => s.desbloqueados)
  const completados = useGameStore((s) => s.completados)
  const todoCompletado = completados.length === TOTAL_JUEGOS
  const irAlFinal = useGameStore((s) => s.irAlFinal)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16"
    >
      {/* Encabezado */}
      <div className="mb-6 text-center">
        <motion.div
          className="mb-2 inline-block text-5xl"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          🧩
        </motion.div>
        <h1 className="text-[28px] leading-tight font-semibold">
          Nueve piezas, <span className="texto-gradiente">una sola tú</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] text-muted">
          Cada sobre trae una pieza y una clave. Escribe la clave aquí y se abre lo que preparé para ti.
          No hay prisa: tu progreso se guarda solo.
        </p>
      </div>

      {/* Grid 3x3 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {MINIJUEGOS.map((juego, i) => (
          <JuegoCard key={juego.id} juego={juego} indice={i} />
        ))}
      </div>

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
          className="btn-base mx-auto mt-6 flex bg-gradient-to-r from-[#764ba2] to-[#fa709a] font-semibold text-white shadow-lg"
        >
          💕 Ver el final otra vez
        </motion.button>
      )}
    </motion.main>
  )
}
