import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { confettiPequeno, sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #5 — Futuro 🌟
 * Un paisaje con cositas flotando. Cada una guarda un sueño.
 * Se pueden tocar en el orden que sea; al revelarlas todas, se completa.
 */
export default function Futuro({ juego, datos, onCompletar }) {
  const [revelados, setRevelados] = useState([])
  const [activo, setActivo] = useState(null)
  const yaAvisado = useRef(false)

  const total = datos.length

  useEffect(() => {
    if (revelados.length === total && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [revelados, total, onCompletar])

  const revelar = (i) => {
    setActivo(i)
    if (!revelados.includes(i)) {
      setRevelados((prev) => [...prev, i])
      confettiPequeno({ y: 0.5 })
      sonar('ding', 0.22)
    }
  }

  const elemento = activo !== null ? datos[activo] : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            animate={{ width: `${(revelados.length / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {revelados.length}/{total}
        </span>
      </div>

      {/* Escena */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#2b2160] via-[#5a3f8f] to-[#fa709a] shadow-lg sm:aspect-[16/10]">
        <Paisaje />

        {datos.map((el, i) => {
          const abierto = revelados.includes(i)
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => revelar(i)}
              style={{ left: `${el.x}%`, top: `${el.y}%` }}
              className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full backdrop-blur-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: abierto ? 0 : [0, -6, 0],
              }}
              transition={{
                delay: i * 0.1,
                y: { duration: 3 + i * 0.4, repeat: abierto ? 0 : Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.9 }}
              aria-label={abierto ? `${el.titulo}: ver de nuevo` : `Descubrir ${el.titulo}`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-lg transition-all ${
                  abierto
                    ? 'bg-white ring-2 ring-white'
                    : 'bg-white/25 ring-1 ring-white/50 animate-pulso'
                }`}
                aria-hidden="true"
              >
                {el.emoji}
              </span>
              {abierto && (
                <span className="mt-1 rounded-full bg-black/35 px-1.5 text-[10px] font-medium text-white">
                  {el.titulo}
                </span>
              )}
            </motion.button>
          )
        })}

        {revelados.length === 0 && (
          <p className="absolute inset-x-0 bottom-3 text-center text-[12px] font-medium text-white/85">
            Toca cada cosita ✨
          </p>
        )}
      </div>

      {/* Sueño abierto */}
      <AnimatePresence mode="wait">
        {elemento && (
          <motion.div
            key={activo}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <p className="flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true">{elemento.emoji}</span> {elemento.titulo}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-dark/80">{elemento.sueno}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lo que ya descubrió */}
      {revelados.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {datos.map((el, i) =>
            revelados.includes(i) ? (
              <button
                key={i}
                type="button"
                onClick={() => setActivo(i)}
                className={`btn-base min-h-0 px-3 py-1.5 text-[12px] ${
                  activo === i ? 'bg-primary text-white' : 'border border-black/10 bg-white text-dark'
                }`}
              >
                {el.emoji} {el.titulo}
              </button>
            ) : null,
          )}
        </div>
      )}

      {revelados.length === total && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          Nuestro futuro juntos 💫
        </motion.p>
      )}
    </div>
  )
}

/** Fondo decorativo: colinas, casa y estrellas. Puro SVG, sin imágenes. */
function Paisaje() {
  return (
    <svg
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* Estrellas */}
      {[
        [30, 30], [90, 55], [150, 25], [220, 45], [300, 28], [360, 60],
        [60, 90], [190, 80], [340, 100], [255, 95],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 2 : 1.3} fill="white" opacity={0.75} />
      ))}

      {/* Luna */}
      <circle cx="330" cy="52" r="18" fill="#fff8e1" opacity="0.9" />
      <circle cx="322" cy="46" r="16" fill="#4a3480" opacity="0.55" />

      {/* Colinas */}
      <path d="M0 250 Q 90 200 180 245 T 400 235 L400 320 L0 320 Z" fill="#3b2a6b" opacity="0.55" />
      <path d="M0 275 Q 120 235 240 275 T 400 268 L400 320 L0 320 Z" fill="#2a1c52" opacity="0.6" />

      {/* Casita */}
      <g transform="translate(168 232)">
        <path d="M0 18 L16 4 L32 18 Z" fill="#ffd7e6" opacity="0.85" />
        <rect x="4" y="18" width="24" height="20" rx="2" fill="#ffe9f2" opacity="0.8" />
        <rect x="13" y="26" width="7" height="12" rx="1" fill="#764ba2" opacity="0.85" />
      </g>
    </svg>
  )
}
