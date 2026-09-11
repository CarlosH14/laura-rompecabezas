import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { confettiPequeno, sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #2 — Promesas ✨
 * Memoria: cada promesa está partida en dos tarjetas (el texto y su emoji).
 * Al emparejarlas, la promesa se queda escrita en la lista de abajo.
 */
export default function Promesas({ juego, datos, onCompletar }) {
  // El mazo se baraja una sola vez, al montar.
  const [mazo] = useState(() => barajarMazo(datos))

  const [volteadas, setVolteadas] = useState([]) // índices en el mazo (máx. 2)
  const [encontradas, setEncontradas] = useState([]) // números de pareja resueltos
  const [intentos, setIntentos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)

  const yaAvisado = useRef(false)
  const total = datos.length

  useEffect(() => {
    if (encontradas.length === total && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [encontradas, total, onCompletar])

  const voltear = (i) => {
    if (bloqueado) return
    const carta = mazo[i]
    if (encontradas.includes(carta.pareja)) return
    if (volteadas.includes(i)) return
    if (volteadas.length === 2) return

    const nuevas = [...volteadas, i]
    setVolteadas(nuevas)

    if (nuevas.length < 2) return

    const [a, b] = nuevas
    setIntentos((n) => n + 1)

    if (mazo[a].pareja === mazo[b].pareja) {
      // ¡Par!
      setEncontradas((prev) => [...prev, mazo[a].pareja])
      setVolteadas([])
      confettiPequeno()
      sonar('ding', 0.25)
    } else {
      // No coinciden: se ven un momento y se voltean de nuevo.
      setBloqueado(true)
      setTimeout(() => {
        setVolteadas([])
        setBloqueado(false)
      }, 950)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-[13px] text-muted">
        <span>
          Pares: <strong className="font-semibold text-dark">{encontradas.length}</strong>/{total}
        </span>
        <span>
          Intentos: <strong className="font-semibold text-dark">{intentos}</strong>
        </span>
      </div>

      {/* Tablero: 2 columnas en móvil, 4 en pantallas grandes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {mazo.map((carta, i) => {
          const resuelta = encontradas.includes(carta.pareja)
          const abierta = resuelta || volteadas.includes(i)

          return (
            <motion.button
              key={carta.id}
              type="button"
              onClick={() => voltear(i)}
              whileTap={{ scale: abierta ? 1 : 0.95 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              disabled={abierta}
              aria-label={abierta ? carta.texto : 'Tarjeta tapada'}
              className="relative min-h-[112px] w-full [perspective:900px]"
            >
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{ rotateY: abierta ? 180 : 0 }}
                transition={{ duration: 0.45 }}
              >
                {/* Cara tapada */}
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br ${juego.gradiente} text-2xl text-white shadow-md [backface-visibility:hidden]`}
                >
                  <span aria-hidden="true" className="opacity-80">
                    💗
                  </span>
                </span>

                {/* Cara descubierta */}
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 p-2 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    resuelta ? 'border-success bg-success/10' : 'border-primary/40 bg-white'
                  }`}
                >
                  {carta.tipo === 'emoji' ? (
                    <span className="text-4xl" aria-hidden="true">
                      {carta.texto}
                    </span>
                  ) : (
                    <span className="text-[12px] leading-snug font-medium text-dark">{carta.texto}</span>
                  )}
                </span>
              </motion.div>
            </motion.button>
          )
        })}
      </div>

      {/* Promesas descubiertas */}
      <AnimatePresence>
        {encontradas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card"
          >
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
              Mis promesas
            </p>
            <ul className="flex flex-col gap-2">
              {datos.map((p, i) =>
                encontradas.includes(i) ? (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 text-[13px] leading-relaxed"
                  >
                    <span aria-hidden="true">{p.emoji}</span>
                    <span>{p.promesa}</span>
                  </motion.li>
                ) : null,
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {encontradas.length === total && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          ¡Las encontraste todas! Estas son mis promesas para ti 💕
        </motion.p>
      )}
    </div>
  )
}

/** Convierte las promesas en 8 tarjetas y las baraja. */
function barajarMazo(promesas) {
  const cartas = promesas.flatMap((p, i) => [
    { id: `texto-${i}`, pareja: i, tipo: 'texto', texto: p.promesa },
    { id: `emoji-${i}`, pareja: i, tipo: 'emoji', texto: p.emoji },
  ])

  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cartas[i], cartas[j]] = [cartas[j], cartas[i]]
  }
  return cartas
}
