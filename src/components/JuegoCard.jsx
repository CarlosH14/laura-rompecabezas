import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

/**
 * Una casilla del grid 3x3.
 *
 * Tres estados posibles:
 *   bloqueado    → candado, gris, al tocar tiembla y abre el modal de la clave
 *   desbloqueado → gradiente a color, late para invitar a jugar
 *   completado   → gradiente + palomita + un destello que lo cruza
 */
export default function JuegoCard({ juego, indice, esElSiguiente }) {
  const desbloqueado = useGameStore((s) => s.desbloqueados.includes(juego.id))
  const completado = useGameStore((s) => s.completados.includes(juego.id))
  const irAJuego = useGameStore((s) => s.irAJuego)
  const abrirModal = useGameStore((s) => s.abrirModal)

  const sinMovimiento = useReducedMotion()
  const [temblando, setTemblando] = useState(false)

  // El que toca jugar ahora: abierto, sin terminar y el primero de la fila.
  const invitando = desbloqueado && !completado && esElSiguiente && !sinMovimiento

  const alTocar = () => {
    if (desbloqueado) {
      irAJuego(juego.id)
      return
    }
    // Bloqueado: el candado tiembla un momento y luego sale el modal.
    setTemblando(true)
    setTimeout(() => setTemblando(false), 400)
    abrirModal(juego.id)
  }

  return (
    <motion.button
      type="button"
      onClick={alTocar}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: temblando ? [0, -4, 4, -3, 3, 0] : 0,
      }}
      transition={{
        duration: 0.5,
        delay: indice * 0.06,
        type: 'spring',
        stiffness: 260,
        damping: 20,
        rotate: { duration: 0.4, delay: 0 },
      }}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.93 }}
      aria-label={
        desbloqueado
          ? `Jugar ${juego.titulo}${completado ? ' (completado)' : ''}`
          : `${juego.titulo}: bloqueado. Toca para escribir la clave`
      }
      className={`relative flex aspect-square min-h-[104px] flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border p-2 text-center ${
        desbloqueado
          ? `border-transparent bg-gradient-to-br ${juego.gradiente} text-white shadow-[0_6px_18px_rgba(0,0,0,0.16)]`
          : 'border-black/10 bg-white/70 text-muted shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
      } ${invitando ? 'late' : ''}`}
    >
      {/* Destello que cruza las casillas ya terminadas */}
      {completado && !sinMovimiento && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
          <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent [animation:destello_4.5s_ease-in-out_infinite]" />
        </span>
      )}

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
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 14 }}
          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-success shadow"
          aria-hidden="true"
        >
          ✓
        </motion.span>
      )}

      {/* El emoji: flota si está abierto, y el candado se queda quieto */}
      <motion.span
        className={`text-3xl ${desbloqueado ? '' : 'opacity-30 grayscale'}`}
        animate={
          desbloqueado && !sinMovimiento
            ? { y: [0, -4, 0], rotate: [0, 5, 0, -5, 0] }
            : {}
        }
        transition={{ duration: 4 + (indice % 3), repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {desbloqueado ? juego.emoji : '🔒'}
      </motion.span>

      <span className={`px-1 text-[12px] leading-tight font-medium ${desbloqueado ? 'text-white' : 'text-muted'}`}>
        {juego.titulo}
      </span>

      {/* Aro suave en el que está abierto sin terminar */}
      {desbloqueado && !completado && (
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-white/40" aria-hidden="true" />
      )}
    </motion.button>
  )
}
