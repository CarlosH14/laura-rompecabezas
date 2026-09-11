import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Foto from '../Foto'
import { confettiPequeno, sonar } from '../../utils/efectos'
import { FINAL } from '../../data/minijuegos'

/**
 * MINIJUEGO #7 — 9 Razones 💕
 * Rompecabezas 3x3: cada pieza va en su hueco y al encajar revela una razón.
 *
 * Se juega TOCANDO (elige pieza → toca el hueco) porque el drag & drop de
 * HTML5 no existe en móvil. En escritorio además se puede arrastrar.
 */
export default function NueveRazones({ juego, datos, onCompletar }) {
  const [piezasBarajadas] = useState(() => barajar(datos))

  const [tablero, setTablero] = useState(Array(9).fill(null))
  const [seleccionada, setSeleccionada] = useState(null) // posicion de la pieza elegida
  const [errorEn, setErrorEn] = useState(null) // hueco que rechazó una pieza
  const yaAvisado = useRef(false)

  const colocadas = tablero.filter(Boolean).length
  const pendientes = piezasBarajadas.filter((p) => !tablero[p.posicion])

  useEffect(() => {
    if (colocadas === 9 && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [colocadas, onCompletar])

  const intentarColocar = (hueco, posicionPieza) => {
    if (posicionPieza === null || posicionPieza === undefined) return
    if (tablero[hueco]) return

    if (posicionPieza === hueco) {
      const pieza = datos.find((p) => p.posicion === posicionPieza)
      setTablero((prev) => {
        const copia = [...prev]
        copia[hueco] = pieza
        return copia
      })
      setSeleccionada(null)
      confettiPequeno()
      sonar('ding', 0.24)
    } else {
      // La pieza "se devuelve": soltamos la selección para que el siguiente
      // toque sobre ella la vuelva a elegir en vez de deseleccionarla.
      setErrorEn(hueco)
      setSeleccionada(null)
      setTimeout(() => setErrorEn(null), 450)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            animate={{ width: `${(colocadas / 9) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">{colocadas}/9</span>
      </div>

      {/* Tablero 3x3 */}
      <div className="card p-3">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, hueco) => {
            const pieza = tablero[hueco]
            const conError = errorEn === hueco

            return (
              <motion.button
                key={hueco}
                type="button"
                onClick={() => intentarColocar(hueco, seleccionada)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const dato = e.dataTransfer.getData('text/plain')
                  if (dato !== '') intentarColocar(hueco, Number(dato))
                }}
                animate={conError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                disabled={Boolean(pieza)}
                aria-label={
                  pieza ? `Pieza ${hueco + 1} colocada` : `Hueco ${hueco + 1}, vacío`
                }
                className={`flex aspect-square items-center justify-center rounded-lg text-3xl transition-colors ${
                  pieza
                    ? `bg-gradient-to-br ${juego.gradiente} text-white shadow-md animate-brillo`
                    : conError
                      ? 'border-2 border-danger bg-danger/10'
                      : seleccionada !== null
                        ? 'border-2 border-dashed border-primary/60 bg-primary/5'
                        : 'border-2 border-dashed border-black/10 bg-light'
                }`}
              >
                {pieza ? (
                  <span aria-hidden="true">{pieza.emoji}</span>
                ) : (
                  <span className="text-[11px] font-medium text-muted">{hueco + 1}</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Piezas por colocar */}
      {pendientes.length > 0 && (
        <div className="card">
          <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
            Piezas ({pendientes.length})
          </p>
          <p className="mb-3 text-[12px] text-muted">
            Toca una pieza y luego el hueco al que crees que va. El número de la pieza es su lugar.
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <AnimatePresence>
              {pendientes.map((pieza) => {
                const elegida = seleccionada === pieza.posicion
                return (
                  // El botón va DENTRO del motion.div: framer-motion se queda con
                  // los props onDragStart/onDragEnd para sus propios gestos, así
                  // que el drag nativo de HTML5 tiene que vivir en un botón normal.
                  <motion.div
                    key={pieza.posicion}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <button
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        setSeleccionada(pieza.posicion)
                        e.dataTransfer.setData('text/plain', String(pieza.posicion))
                      }}
                      onClick={() => setSeleccionada(elegida ? null : pieza.posicion)}
                      aria-pressed={elegida}
                      aria-label={`Pieza número ${pieza.posicion + 1}`}
                      className={`relative flex h-16 w-16 cursor-grab items-center justify-center rounded-lg text-2xl shadow-sm transition-all active:scale-95 ${
                        elegida
                          ? 'bg-primary text-white ring-4 ring-primary/30'
                          : 'border border-black/10 bg-white'
                      }`}
                    >
                      <span aria-hidden="true">{pieza.emoji}</span>
                      <span
                        className={`absolute right-1 bottom-0.5 text-[10px] font-semibold ${
                          elegida ? 'text-white/90' : 'text-muted'
                        }`}
                      >
                        {pieza.posicion + 1}
                      </span>
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Razones que va destapando */}
      {colocadas > 0 && (
        <div className="card">
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
            Mis razones ({colocadas}/9)
          </p>
          <ol className="flex flex-col gap-2">
            <AnimatePresence>
              {tablero.map((pieza, i) =>
                pieza ? (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 text-[13px] leading-relaxed"
                  >
                    <span aria-hidden="true">{pieza.emoji}</span>
                    <span>{pieza.razon}</span>
                  </motion.li>
                ) : null,
              )}
            </AnimatePresence>
          </ol>
        </div>
      )}

      {/* Premio: foto grande al completar */}
      <AnimatePresence>
        {colocadas === 9 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="card overflow-hidden p-0"
          >
            <Foto
              src={FINAL.fotos[0]}
              alt="Nosotros"
              emoji="💕"
              gradiente={juego.gradiente}
              className="h-60 w-full sm:h-80"
            />
            <p className="p-4 text-center text-[15px] font-semibold text-primary">
              Nueve razones, y me quedé corto 💕
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function barajar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}
