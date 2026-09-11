import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Foto from './Foto'
import { FINAL, MINIJUEGOS, TOTAL_JUEGOS } from '../data/minijuegos'
import { useGameStore } from '../hooks/useGameStore'
import { confettiCorazones, confettiGrande } from '../utils/efectos'

/** Pantalla final: la recompensa por haber armado los nueve sobres. */
export default function Final() {
  const volverAlInicio = useGameStore((s) => s.volverAlInicio)
  const reiniciarTodo = useGameStore((s) => s.reiniciarTodo)
  const completados = useGameStore((s) => s.completados)

  const [confirmarReinicio, setConfirmarReinicio] = useState(false)

  // Celebración al entrar.
  useEffect(() => {
    confettiGrande()
    const t = setTimeout(confettiCorazones, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-3xl px-4 pt-6 pb-20"
    >
      {/* Cabecera */}
      <div className="rounded-2xl bg-gradient-to-br from-[#764ba2] via-[#fa709a] to-[#fee140] p-7 text-center text-white shadow-xl">
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          💕
        </motion.div>
        <h1 className="mt-3 text-2xl leading-snug font-semibold">{FINAL.titulo}</h1>
        <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed opacity-95">{FINAL.mensaje}</p>
        <p className="mt-4 text-[15px] font-semibold">{FINAL.firma}</p>
      </div>

      {/* Collage */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FINAL.fotos.map((foto, i) => (
          <motion.div
            key={foto + i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.09, duration: 0.45 }}
            className="overflow-hidden rounded-xl shadow-md"
          >
            <Foto
              src={foto}
              alt={`Recuerdo ${i + 1}`}
              emoji="💞"
              gradiente={
                ['from-[#fa709a] to-[#fee140]', 'from-[#667eea] to-[#764ba2]', 'from-[#f093fb] to-[#f5576c]'][i % 3]
              }
              className="aspect-square w-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Resumen del recorrido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card mt-6"
      >
        <p className="mb-3 text-center text-[11px] font-semibold tracking-wide text-muted uppercase">
          Lo que armaste
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MINIJUEGOS.map((juego) => (
            <div
              key={juego.id}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center ${
                completados.includes(juego.id) ? 'bg-light' : 'opacity-40'
              }`}
            >
              <span className="text-xl" aria-hidden="true">
                {juego.emoji}
              </span>
              <span className="text-[11px] leading-tight font-medium">{juego.titulo}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[13px] text-muted">
          {completados.length} de {TOTAL_JUEGOS} completados
        </p>
      </motion.div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={volverAlInicio}
          className="btn-base bg-gradient-to-r from-primary to-secondary font-semibold text-white shadow-lg"
        >
          🧩 Ver todo de nuevo
        </motion.button>

        {/* Reinicio: útil si quiere volver a jugarlo desde cero. Pide confirmación
            porque borra el progreso guardado. */}
        {confirmarReinicio ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-[12px] text-muted">¿Seguro? Se borra el progreso guardado.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reiniciarTodo}
                className="btn-base min-h-0 border border-danger/40 bg-white px-3 py-2 text-[12px] text-danger"
              >
                Sí, empezar de cero
              </button>
              <button
                type="button"
                onClick={() => setConfirmarReinicio(false)}
                className="btn-base min-h-0 border border-black/10 bg-white px-3 py-2 text-[12px] text-dark"
              >
                No, déjalo así
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmarReinicio(true)}
            className="text-[12px] text-muted underline decoration-dotted underline-offset-4"
          >
            Empezar el rompecabezas de cero
          </button>
        )}
      </div>
    </motion.main>
  )
}
