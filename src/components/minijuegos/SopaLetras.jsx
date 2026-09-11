import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { celdasEnLinea, generarSopa, palabraDeCeldas } from '../../utils/sopa'
import { confettiPequeno, sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #4 — Presente ❤️
 * Sopa de letras con las cualidades de Laura.
 *
 * Dos formas de jugar, porque el móvil es la prioridad:
 *   · Arrastrar el dedo de la primera letra a la última.
 *   · Tocar la primera letra y luego tocar la última.
 */
export default function SopaLetras({ datos, onCompletar }) {
  const sopa = useMemo(() => generarSopa(datos, 8), [datos])
  const { grid, tamano, palabras } = sopa

  const [encontradas, setEncontradas] = useState([])
  const [celdasVerdes, setCeldasVerdes] = useState([])
  const [seleccion, setSeleccion] = useState([])
  const [ancla, setAncla] = useState(null) // primera letra tocada (modo tocar-tocar)
  const [error, setError] = useState(false)

  const arrastrando = useRef(false)
  const inicio = useRef(null)
  const yaAvisado = useRef(false)

  // La selección vive en un ref además del estado: pointerdown/move/up pueden
  // caer en el mismo tick y ahí el estado de React todavía no se ha
  // actualizado. El ref siempre está al día; el estado es solo para pintar.
  const seleccionRef = useRef([])
  const anclaRef = useRef(null)

  const marcarSeleccion = (celdas) => {
    seleccionRef.current = celdas
    setSeleccion(celdas)
  }

  const marcarAncla = (celda) => {
    anclaRef.current = celda
    setAncla(celda)
  }

  useEffect(() => {
    if (encontradas.length === palabras.length && palabras.length > 0 && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [encontradas, palabras.length, onCompletar])

  /** Lee el índice de celda que hay debajo de un punto de la pantalla. */
  const celdaEn = (x, y) => {
    const el = document.elementFromPoint(x, y)
    const attr = el?.getAttribute?.('data-idx')
    return attr === null || attr === undefined ? null : Number(attr)
  }

  const evaluar = (celdas) => {
    if (!celdas || celdas.length < 2) {
      marcarSeleccion([])
      return
    }

    const [directa, invertida] = palabraDeCeldas(celdas, grid, tamano)
    const acierto = palabras.find(
      (p) => (p === directa || p === invertida) && !encontradas.includes(p),
    )

    if (acierto) {
      setEncontradas((prev) => [...prev, acierto])
      setCeldasVerdes((prev) => [...new Set([...prev, ...celdas])])
      confettiPequeno()
      sonar('ding', 0.25)
    } else {
      setError(true)
      setTimeout(() => setError(false), 400)
    }
    marcarSeleccion([])
  }

  const alBajar = (e) => {
    const idx = celdaEn(e.clientX, e.clientY)
    if (idx === null) return

    // Modo tocar-tocar: ya había una letra elegida, esta es la última.
    if (anclaRef.current !== null) {
      const celdas = celdasEnLinea(anclaRef.current, idx, tamano)
      marcarAncla(null)
      evaluar(celdas)
      return
    }

    arrastrando.current = true
    inicio.current = idx
    marcarSeleccion([idx])
  }

  const alMover = (e) => {
    if (!arrastrando.current || inicio.current === null) return
    const idx = celdaEn(e.clientX, e.clientY)
    if (idx === null) return
    const celdas = celdasEnLinea(inicio.current, idx, tamano)
    if (celdas) marcarSeleccion(celdas)
  }

  const alSubir = () => {
    if (!arrastrando.current) return
    arrastrando.current = false

    const celdas = seleccionRef.current

    // Solo tocó una letra: la dejamos marcada esperando la segunda.
    if (celdas.length === 1) {
      marcarAncla(celdas[0])
      return
    }

    inicio.current = null
    evaluar(celdas)
  }

  const cancelar = () => {
    arrastrando.current = false
    inicio.current = null
    marcarAncla(null)
    marcarSeleccion([])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-[13px] text-muted">
        <span>
          Encontradas: <strong className="font-semibold text-dark">{encontradas.length}</strong>/
          {palabras.length}
        </span>
        {(ancla !== null || seleccion.length > 0) && (
          <button type="button" onClick={cancelar} className="font-medium text-primary underline">
            Cancelar selección
          </button>
        )}
      </div>

      {/* Tablero */}
      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.35 }}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSubir}
        onPointerLeave={alSubir}
        className="card grid touch-none gap-0.5 p-2 select-none sm:gap-1 sm:p-3"
        style={{ gridTemplateColumns: `repeat(${tamano}, minmax(0, 1fr))` }}
      >
        {grid.flat().map((letra, idx) => {
          const verde = celdasVerdes.includes(idx)
          const marcada = seleccion.includes(idx) || ancla === idx

          return (
            <div
              key={idx}
              data-idx={idx}
              className={`flex aspect-square items-center justify-center rounded-md text-[13px] font-semibold transition-colors sm:text-base ${
                verde
                  ? 'bg-success text-white'
                  : marcada
                    ? 'bg-primary text-white'
                    : 'bg-light text-dark/80'
              }`}
            >
              {letra}
            </div>
          )
        })}
      </motion.div>

      <p className="text-center text-[11px] leading-snug text-muted">
        Arrastra el dedo sobre las letras, o toca la primera y luego la última.
      </p>

      {/* Lista de palabras */}
      <div className="card">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
          Palabras por encontrar
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
          {palabras.map((p) => {
            const hecha = encontradas.includes(p)
            return (
              <li
                key={p}
                className={`text-[13px] transition-all ${
                  hecha ? 'font-semibold text-success line-through' : 'text-dark/70'
                }`}
              >
                {hecha ? '✓ ' : '· '}
                {p}
              </li>
            )
          })}
        </ul>
      </div>

      {encontradas.length === palabras.length && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-[15px] font-semibold text-primary"
        >
          ¡Encontraste todas mis palabras para ti! ✨
        </motion.p>
      )}
    </div>
  )
}
