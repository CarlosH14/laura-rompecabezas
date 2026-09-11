import { motion, useReducedMotion } from 'framer-motion'

/**
 * Capa decorativa que vive detrás de todo: dos manchas de color que se mueven
 * despacio y unos corazones que suben flotando.
 *
 * Los corazones son animación de CSS pura (no de JavaScript): son muchos
 * elementos a la vez y así el trabajo lo hace el compositor del navegador, sin
 * gastar batería en el celular. Las dos manchas sí van con Framer Motion,
 * porque son solo dos y el movimiento es más orgánico.
 *
 * Si el teléfono tiene activado "reducir movimiento", esta capa no se dibuja.
 */

// Posiciones fijas (nada de Math.random): así el fondo se ve igual siempre
// y no parpadea al recargar.
const FLOTANTES = [
  { emoji: '💕', izquierda: 6, tamano: 22, duracion: 26, retraso: 0, opacidad: 0.22 },
  { emoji: '✨', izquierda: 18, tamano: 14, duracion: 34, retraso: 6, opacidad: 0.28 },
  { emoji: '💗', izquierda: 27, tamano: 18, duracion: 29, retraso: 13, opacidad: 0.18 },
  { emoji: '💫', izquierda: 39, tamano: 16, duracion: 38, retraso: 3, opacidad: 0.22 },
  { emoji: '💕', izquierda: 48, tamano: 12, duracion: 31, retraso: 19, opacidad: 0.16 },
  { emoji: '🌸', izquierda: 58, tamano: 20, duracion: 36, retraso: 9, opacidad: 0.2 },
  { emoji: '✨', izquierda: 68, tamano: 13, duracion: 27, retraso: 16, opacidad: 0.26 },
  { emoji: '💗', izquierda: 77, tamano: 17, duracion: 33, retraso: 1, opacidad: 0.18 },
  { emoji: '💫', izquierda: 86, tamano: 15, duracion: 40, retraso: 11, opacidad: 0.22 },
  { emoji: '💕', izquierda: 94, tamano: 19, duracion: 30, retraso: 22, opacidad: 0.16 },
  { emoji: '✨', izquierda: 12, tamano: 11, duracion: 42, retraso: 25, opacidad: 0.24 },
  { emoji: '🌸', izquierda: 33, tamano: 14, duracion: 35, retraso: 30, opacidad: 0.15 },
  { emoji: '💗', izquierda: 63, tamano: 12, duracion: 28, retraso: 27, opacidad: 0.2 },
  { emoji: '💕', izquierda: 82, tamano: 13, duracion: 44, retraso: 34, opacidad: 0.17 },
]

export default function FondoAnimado() {
  const sinMovimiento = useReducedMotion()
  if (sinMovimiento) return null

  return (
    <div className="fondo-animado pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Manchas de luz que respiran */}
      <motion.div
        className="absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-[#fa709a]/25 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-28 top-1/3 h-[22rem] w-[22rem] rounded-full bg-[#fee140]/25 blur-3xl"
        animate={{ x: [0, -50, 20, 0], y: [0, -60, 30, 0], scale: [1, 0.9, 1.12, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 left-1/4 h-[18rem] w-[18rem] rounded-full bg-[#764ba2]/15 blur-3xl"
        animate={{ x: [0, 40, -30, 0], y: [0, -40, -10, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corazones que suben */}
      {FLOTANTES.map((f, i) => (
        <span
          key={i}
          className="flotante absolute bottom-[-6vh] select-none"
          style={{
            left: `${f.izquierda}%`,
            fontSize: `${f.tamano}px`,
            animationDuration: `${f.duracion}s`,
            animationDelay: `-${f.retraso}s`, // negativo: ya empiezan repartidos
            '--op': f.opacidad,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  )
}
