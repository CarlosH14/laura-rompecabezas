import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Foto from '../Foto'

/**
 * MINIJUEGO #3 — Pasado 📸
 * Carrusel de momentos. Se completa cuando Laura llega al último.
 */
export default function Timeline({ juego, datos, onCompletar }) {
  const [indice, setIndice] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const yaAvisado = useRef(false)

  const total = datos.length
  const momento = datos[indice]
  const enElFinal = indice === total - 1

  useEffect(() => {
    if (enElFinal && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [enElFinal, onCompletar])

  const ir = (nuevo) => {
    if (nuevo < 0 || nuevo >= total) return
    setDireccion(nuevo > indice ? 1 : -1)
    setIndice(nuevo)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card overflow-hidden p-0">
        <AnimatePresence mode="wait" custom={direccion}>
          <motion.div
            key={indice}
            custom={direccion}
            initial={{ opacity: 0, x: direccion * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direccion * -40 }}
            transition={{ duration: 0.35 }}
            // Se puede pasar arrastrando, como en una galería de fotos.
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) ir(indice + 1)
              else if (info.offset.x > 60) ir(indice - 1)
            }}
          >
            <Foto
              src={momento.foto}
              alt={momento.titulo}
              emoji="📸"
              gradiente={juego.gradiente}
              className="h-64 w-full sm:h-80"
            />

            <div className="p-5">
              <span
                className={`inline-block rounded-full bg-gradient-to-r ${juego.gradiente} px-3 py-1 text-[11px] font-semibold text-white`}
              >
                {momento.fecha}
              </span>
              <h2 className="mt-2 text-xl leading-snug font-semibold">{momento.titulo}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-dark/80">{momento.descripcion}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Puntos de navegación */}
      <div className="flex justify-center gap-2">
        {datos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ir al momento ${i + 1}`}
            aria-current={i === indice}
            className="p-1.5"
          >
            <span
              className={`block rounded-full transition-all ${
                i === indice ? 'h-2.5 w-6 bg-primary' : 'h-2.5 w-2.5 bg-black/15'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => ir(indice - 1)}
          disabled={indice === 0}
          className="btn-base border border-black/10 bg-white text-dark disabled:opacity-35"
        >
          ← Anterior
        </motion.button>

        <span className="text-xs font-medium text-muted tabular-nums">
          {indice + 1} / {total}
        </span>

        {enElFinal ? (
          <span className="btn-base cursor-default bg-transparent text-[13px] font-semibold text-primary">
            💕 Fin del recorrido
          </span>
        ) : (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => ir(indice + 1)}
            className={`btn-base bg-gradient-to-r ${juego.gradiente} font-semibold text-white shadow-md`}
          >
            Siguiente →
          </motion.button>
        )}
      </div>

      {enElFinal && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          ¡Qué viaje tan hermoso! 💕
        </motion.p>
      )}
    </div>
  )
}
