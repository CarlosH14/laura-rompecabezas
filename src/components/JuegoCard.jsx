import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

/**
 * Una casilla del grid 3x3.
 *
 * Tres estados posibles:
 *   bloqueado    → candado, gris, al tocar abre el modal de la clave
 *   desbloqueado → gradiente a color, invita a jugar
 *   completado   → gradiente + palomita
 */
export default function JuegoCard({ juego, indice }) {
  const desbloqueado = useGameStore((s) => s.desbloqueados.includes(juego.id))
  const completado = useGameStore((s) => s.completados.includes(juego.id))
  const irAJuego = useGameStore((s) => s.irAJuego)
  const abrirModal = useGameStore((s) => s.abrirModal)

  const alTocar = () => (desbloqueado ? irAJuego(juego.id) : abrirModal(juego.id))

  return (
    <motion.button
      type="button"
      onClick={alTocar}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: indice * 0.06 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={
        desbloqueado
          ? `Jugar ${juego.titulo}${completado ? ' (completado)' : ''}`
          : `${juego.titulo}: bloqueado. Toca para escribir la clave`
      }
      className={`relative flex aspect-square min-h-[104px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border p-2 text-center transition-shadow ${
        desbloqueado
          ? `border-transparent bg-gradient-to-br ${juego.gradiente} text-white shadow-[0_6px_18px_rgba(0,0,0,0.16)]`
          : 'border-black/10 bg-white/70 text-muted shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Número del sobre, arriba a la izquierda */}
      <span
        className={`absolute top-1.5 left-2 text-[10px] font-semibold ${
          desbloqueado ? 'text-white/70' : 'text-muted/70'
        }`}
      >
        {juego.id}
      </span>

      {completado && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-success shadow"
          aria-hidden="true"
        >
          ✓
        </motion.span>
      )}

      <span className={`text-3xl ${desbloqueado ? '' : 'opacity-30 grayscale'}`} aria-hidden="true">
        {desbloqueado ? juego.emoji : '🔒'}
      </span>

      <span className={`px-1 text-[12px] leading-tight font-medium ${desbloqueado ? 'text-white' : 'text-muted'}`}>
        {juego.titulo}
      </span>

      {/* Brillo suave permanente en el que toca jugar ahora */}
      {desbloqueado && !completado && (
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-white/40" aria-hidden="true" />
      )}
    </motion.button>
  )
}
