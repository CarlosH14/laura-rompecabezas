import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { confettiPequeno, sonar } from '../../utils/efectos'
import { NOCHE_ESPECIAL } from '../../data/minijuegos'

/**
 * MINIJUEGO #6 — Noche Especial 🌙
 * Cinco botones desordenados. Cada uno esconde una sorpresa de la noche especial.
 */
export default function CuentaRegresiva({ datos, onCompletar }) {
  // Se desordenan una vez, al montar, para que no se abran en orden 1-2-3-4-5.
  // Va en un useState con función inicializadora (no en un useMemo) para que el
  // azar se calcule una sola vez y no en cada render.
  const [orden] = useState(() => {
    const idx = datos.map((_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    return idx
  })

  const [abiertas, setAbiertas] = useState([])
  const yaAvisado = useRef(false)
  const total = datos.length

  useEffect(() => {
    if (abiertas.length === total && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [abiertas, total, onCompletar])

  const abrir = (i) => {
    if (abiertas.includes(i)) return
    setAbiertas((prev) => [...prev, i])
    confettiPequeno()
    sonar('ding', 0.25)
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-semibold">Sorpresas para {NOCHE_ESPECIAL} ✨</h2>
      <p className="-mt-3 text-center text-[13px] text-muted">
        Abiertas: {abiertas.length} de {total}
      </p>

      {/* Botones-sorpresa */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {orden.map((i, posicion) => {
          const sorpresa = datos[i]
          const abierta = abiertas.includes(i)

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => abrir(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: posicion * 0.07 }}
              whileHover={{ scale: abierta ? 1 : 1.04 }}
              whileTap={{ scale: 0.95 }}
              aria-label={abierta ? sorpresa.titulo : 'Sorpresa por abrir'}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition-all ${
                abierta
                  ? `border-transparent bg-gradient-to-br ${sorpresa.gradiente} text-white shadow-lg`
                  : 'border-dashed border-primary/40 bg-white text-primary shadow-sm'
              }`}
            >
              <motion.span
                className="text-3xl"
                animate={abierta ? { rotate: [0, -12, 12, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
              >
                {abierta ? sorpresa.emoji : '❔'}
              </motion.span>
              <span className={`text-[12px] font-medium ${abierta ? 'text-white' : 'text-muted'}`}>
                {abierta ? sorpresa.titulo : 'Ábreme'}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Contenido revelado, en el orden en que las fue abriendo */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {abiertas.map((i) => {
            const sorpresa = datos[i]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-xl bg-gradient-to-br ${sorpresa.gradiente} p-5 text-white shadow-lg`}
              >
                <p className="flex items-center gap-2 text-[15px] font-semibold">
                  <span aria-hidden="true">{sorpresa.emoji}</span> {sorpresa.titulo}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed opacity-95">{sorpresa.contenido}</p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {abiertas.length === total && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          Ya falta poquito para que vivas todo esto 💕
        </motion.p>
      )}
    </div>
  )
}
