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
            <motion.span
              className="text-xl"
              animate={{ scale: [1, 1.18, 1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              💕
            </motion.span>
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
              className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            >
              {/* Destello que recorre la parte ya completada */}
              {porcentaje > 0 && (
                <span
                  className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:destello_2.6s_ease-in-out_infinite]"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </div>
          {/* key: al cambiar el número, el nuevo entra con un saltito */}
          <motion.span
            key={porcentaje}
            initial={{ scale: 1.5, color: '#fa709a' }}
            animate={{ scale: 1, color: '#999999' }}
            transition={{ duration: 0.5 }}
            className="w-9 text-right text-xs font-medium tabular-nums"
          >
            {porcentaje}%
          </motion.span>
        </div>
      </div>
    </header>
  )
}
