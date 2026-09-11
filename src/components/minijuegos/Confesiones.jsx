import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #9 — Confesiones 🤐
 * Un diario. Las confesiones están cerradas y apagadas; al tocarlas se
 * abren, suben al frente y se leen. La última es la grande.
 */
export default function Confesiones({ juego, datos, onCompletar }) {
  const [abiertas, setAbiertas] = useState([])
  const [enfocada, setEnfocada] = useState(null)
  const [cerrado, setCerrado] = useState(false)

  const yaAvisado = useRef(false)
  const total = datos.length
  const todasLeidas = abiertas.length === total

  useEffect(() => {
    if (cerrado && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [cerrado, onCompletar])

  const abrir = (i) => {
    setEnfocada(i)
    if (!abiertas.includes(i)) {
      setAbiertas((prev) => [...prev, i])
      sonar('ding', 0.2)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            animate={{ width: `${(abiertas.length / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {abiertas.length}/{total}
        </span>
      </div>

      {/* El diario */}
      <div className="flex flex-col gap-3">
        {datos.map((confesion, i) => {
          const abierta = abiertas.includes(i)
          const activa = enfocada === i
          const especial = Boolean(confesion.especial)

          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{
                opacity: abierta ? 1 : 0.45,
                y: 0,
                scale: activa ? 1 : 0.985,
              }}
              transition={{ duration: 0.4, delay: abiertas.length === 0 ? i * 0.07 : 0 }}
              className={`relative overflow-hidden rounded-xl border transition-shadow ${
                especial
                  ? `border-transparent bg-gradient-to-br ${juego.gradiente} text-white`
                  : 'border-black/10 bg-white'
              } ${activa ? 'shadow-[0_10px_28px_rgba(0,0,0,0.16)]' : 'shadow-sm'}`}
              style={{ zIndex: activa ? 10 : 1 }}
            >
              <button
                type="button"
                onClick={() => abrir(i)}
                className="flex w-full items-center gap-3 p-4 text-left"
                aria-expanded={abierta}
              >
                <motion.span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl ${
                    especial ? 'bg-white/25' : 'bg-light'
                  }`}
                  animate={activa ? { rotate: [0, -15, 15, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  aria-hidden="true"
                >
                  {abierta ? confesion.emoji : '🤐'}
                </motion.span>

                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-semibold ${
                      especial ? 'text-[17px] text-white' : 'text-[15px] text-dark'
                    }`}
                  >
                    {confesion.titulo}
                  </span>
                  {!abierta && (
                    <span className={`block text-[12px] ${especial ? 'text-white/80' : 'text-muted'}`}>
                      Toca para leerla
                    </span>
                  )}
                </span>

                <span
                  className={`shrink-0 text-sm ${especial ? 'text-white/70' : 'text-muted'}`}
                  aria-hidden="true"
                >
                  {abierta ? '' : '›'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {abierta && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p
                      className={`px-4 pb-4 leading-relaxed ${
                        especial ? 'text-[15px] text-white/95' : 'text-[13px] text-dark/80'
                      }`}
                    >
                      {confesion.texto}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Cierre de la aventura */}
      <AnimatePresence>
        {todasLeidas && !cerrado && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCerrado(true)}
            className="btn-base mt-2 w-full bg-gradient-to-r from-[#764ba2] to-[#fa709a] py-4 text-[15px] font-semibold text-white shadow-lg"
          >
            💕 Fin de la aventura
          </motion.button>
        )}
      </AnimatePresence>

      {!todasLeidas && (
        <p className="text-center text-[12px] text-muted">
          Te faltan {total - abiertas.length}{' '}
          {total - abiertas.length === 1 ? 'confesión' : 'confesiones'} por leer.
        </p>
      )}
    </div>
  )
}
