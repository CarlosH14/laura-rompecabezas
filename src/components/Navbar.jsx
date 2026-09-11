import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import { TOTAL_JUEGOS } from '../data/minijuegos'

/** Barra fija de arriba: identidad, progreso y botón de volver. */
export default function Navbar() {
  const pantalla = useGameStore((s) => s.pantalla)
  const completados = useGameStore((s) => s.completados)
  const desbloqueados = useGameStore((s) => s.desbloqueados)
  const volverAlInicio = useGameStore((s) => s.volverAlInicio)

  const porcentaje = Math.round((completados.length / TOTAL_JUEGOS) * 100)
  const enHome = pantalla === 'home'

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        {enHome ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              💕
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-dark">Para Laura</p>
              <p className="text-[11px] leading-none text-muted">
                {desbloqueados.length}/{TOTAL_JUEGOS} desbloqueados · {completados.length}/{TOTAL_JUEGOS} completados
              </p>
            </div>
          </div>
        ) : (
          <motion.button
            type="button"
            onClick={volverAlInicio}
            whileTap={{ scale: 0.95 }}
            className="btn-base -ml-2 bg-transparent px-3 py-2 text-dark hover:bg-black/5"
          >
            <span aria-hidden="true">←</span> Volver
          </motion.button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <div
            className="h-2 w-20 overflow-hidden rounded-full bg-black/10 sm:w-32"
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del rompecabezas"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="w-9 text-right text-xs font-medium tabular-nums text-muted">{porcentaje}%</span>
        </div>
      </div>
    </header>
  )
}
