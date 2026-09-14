import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { asset, confettiPequeno, sonar } from '../../utils/efectos'

const LADO = 3 // tablero 3x3
const CELDAS = LADO * LADO
const PISTAS = 3 // veces que puede ver la foto completa
const SEGUNDOS_PISTA = 2.5
const HUECO_PX = 6 // separación entre piezas mientras se juega

/**
 * MINIJUEGO #7 — 9 Razones 💕
 *
 * Una foto de los dos, partida en nueve pedazos y revuelta. Laura intercambia
 * pedazos (toca uno, toca otro; o arrastra uno encima de otro) hasta armarla.
 * Cada pedazo que cae en su sitio se queda fijo y destapa una razón.
 *
 * No hay números ni huecos: la única pista es la foto misma. Y tres "vistazos"
 * de dos segundos y medio, por si se atasca.
 */
export default function NueveRazones({ juego, datos, onCompletar }) {
  // tablero[celda] = la pieza que hay ahí. Empieza sin ninguna en su sitio.
  const [tablero, setTablero] = useState(() => desordenar(datos))
  const [seleccion, setSeleccion] = useState(null) // celda elegida para intercambiar
  const [movimientos, setMovimientos] = useState(0)
  const [recientes, setRecientes] = useState([]) // celdas que encajaron en el último movimiento
  const [pistas, setPistas] = useState(PISTAS)
  const [viendoFoto, setViendoFoto] = useState(false)
  const [arrastrando, setArrastrando] = useState(null)

  // La foto se descarga una vez y de paso nos dice su forma (vertical, cuadrada...)
  const [foto, setFoto] = useState({ estado: juego.foto ? 'cargando' : 'rota', aspecto: 1 })

  const tableroRef = useRef(null)
  const yaAvisado = useRef(false)
  const ignorarToque = useRef(false) // justo después de soltar un arrastre

  const fijas = tablero.map((pieza, celda) => pieza.posicion === celda)
  const encajadas = fijas.filter(Boolean).length
  const terminado = encajadas === CELDAS

  useEffect(() => {
    const src = juego.foto
    if (!src) return
    let vivo = true
    const img = new Image()
    img.onload = () => {
      if (!vivo) return
      // Ni una tira ni un poste: entre 3:4 y 4:3 para que quepa en el celular.
      const aspecto = Math.min(4 / 3, Math.max(3 / 4, img.naturalWidth / img.naturalHeight))
      setFoto({ estado: 'ok', aspecto })
    }
    img.onerror = () => vivo && setFoto({ estado: 'rota', aspecto: 1 })
    img.src = asset(src)
    return () => {
      vivo = false
    }
  }, [juego.foto])

  useEffect(() => {
    if (terminado && !yaAvisado.current) {
      yaAvisado.current = true
      onCompletar()
    }
  }, [terminado, onCompletar])

  // La pista se apaga sola
  useEffect(() => {
    if (!viendoFoto) return
    const t = setTimeout(() => setViendoFoto(false), SEGUNDOS_PISTA * 1000)
    return () => clearTimeout(t)
  }, [viendoFoto])

  const intercambiar = (a, b) => {
    if (a === b || fijas[a] || fijas[b] || terminado) return

    const copia = [...tablero]
    ;[copia[a], copia[b]] = [copia[b], copia[a]]
    setTablero(copia)
    setMovimientos((n) => n + 1)
    setSeleccion(null)

    const nuevas = [a, b].filter((celda) => copia[celda].posicion === celda)
    setRecientes(nuevas)
    if (nuevas.length > 0) {
      sonar('ding', 0.24)
      confettiPequeno({ y: 0.45 })
    }
  }

  const tocar = (celda) => {
    // Al soltar un arrastre a veces llega también un "tap": no cuenta.
    if (ignorarToque.current) return
    if (terminado) return
    if (fijas[celda] || seleccion === celda) {
      setSeleccion(null)
      return
    }
    if (seleccion === null) {
      setSeleccion(celda)
      return
    }
    intercambiar(seleccion, celda)
  }

  /** Celda del tablero que hay bajo un punto de la pantalla, o null. */
  const celdaBajo = (x, y) => {
    const caja = tableroRef.current?.getBoundingClientRect()
    if (!caja) return null
    const col = Math.floor(((x - caja.left) / caja.width) * LADO)
    const fila = Math.floor(((y - caja.top) / caja.height) * LADO)
    if (col < 0 || col >= LADO || fila < 0 || fila >= LADO) return null
    return fila * LADO + col
  }

  const soltar = (celda, evento, info) => {
    setArrastrando(null)
    ignorarToque.current = true
    setTimeout(() => {
      ignorarToque.current = false
    }, 250)
    const x = evento?.clientX ?? info.point.x - window.scrollX
    const y = evento?.clientY ?? info.point.y - window.scrollY
    const destino = celdaBajo(x, y)
    if (destino !== null && destino !== celda) intercambiar(celda, destino)
  }

  const verFoto = () => {
    if (pistas === 0 || viendoFoto || terminado) return
    setPistas((n) => n - 1)
    setViendoFoto(true)
    setSeleccion(null)
  }

  const conFoto = foto.estado === 'ok'
  const hueco = terminado ? 0 : HUECO_PX
  const rutaFoto = conFoto ? `url("${asset(juego.foto)}")` : undefined

  // Razones ya destapadas, en el orden del tablero (no en el que salieron)
  const destapadas = datos.filter((r) => fijas[r.posicion])

  return (
    <div className="flex flex-col gap-4">
      {/* Progreso */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            animate={{ width: `${(encajadas / CELDAS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {encajadas}/{CELDAS}
        </span>
      </div>

      {/* Tablero */}
      <div className="card p-3">
        <div
          className={`relative mx-auto w-full ${foto.aspecto < 1 ? 'max-w-[420px]' : 'max-w-[560px]'}`}
          style={{ aspectRatio: String(foto.aspecto) }}
        >
          <div
            ref={tableroRef}
            className="grid h-full w-full overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${LADO}, 1fr)`,
              gridTemplateRows: `repeat(${LADO}, 1fr)`,
              gap: hueco,
              borderRadius: terminado ? 16 : 10,
              transition: 'gap 0.6s ease-in-out, border-radius 0.6s',
            }}
          >
            {tablero.map((pieza, celda) => {
              const fija = fijas[celda]
              const elegida = seleccion === celda
              const reciente = recientes.includes(celda)
              const col = pieza.posicion % LADO
              const fila = Math.floor(pieza.posicion / LADO)

              return (
                <motion.button
                  key={pieza.posicion}
                  type="button"
                  layout
                  drag={!fija && !terminado}
                  dragSnapToOrigin
                  dragElastic={0.7}
                  dragMomentum={false}
                  onDragStart={() => {
                    setSeleccion(null)
                    setArrastrando(celda)
                  }}
                  onDragEnd={(e, info) => soltar(celda, e, info)}
                  onTap={() => tocar(celda)}
                  disabled={terminado}
                  aria-pressed={elegida}
                  aria-label={
                    fija
                      ? `Pieza ${celda + 1}, ya en su sitio`
                      : elegida
                        ? `Pieza ${celda + 1}, elegida. Toca otra para intercambiarlas`
                        : `Pieza ${celda + 1}`
                  }
                  data-celda={celda}
                  data-pieza={pieza.posicion}
                  animate={{
                    scale: elegida ? 1.06 : 1,
                    zIndex: arrastrando === celda ? 30 : elegida ? 20 : fija ? 0 : 10,
                  }}
                  whileDrag={{ scale: 1.08, zIndex: 30 }}
                  transition={{ layout: { type: 'spring', stiffness: 380, damping: 30 } }}
                  className={`relative touch-none overflow-hidden p-0 select-none ${
                    terminado ? 'cursor-default' : fija ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                  } ${reciente && !terminado ? 'animate-brillo' : ''}`}
                  style={{
                    borderRadius: terminado ? 0 : 8,
                    boxShadow: terminado
                      ? 'none'
                      : elegida
                        ? '0 0 0 3px #fff, 0 0 0 6px #fa709a, 0 10px 24px rgba(0,0,0,0.25)'
                        : fija
                          ? 'inset 0 0 0 2px rgba(255,255,255,0.9)'
                          : '0 0 0 2px #fff, 0 3px 8px rgba(0,0,0,0.18)',
                  }}
                >
                  {conFoto ? (
                    // La foto entera, corrida para que en esta celda se vea solo su pedazo.
                    <span
                      aria-hidden="true"
                      className="absolute bg-cover bg-center"
                      style={{
                        width: `calc(${LADO * 100}% + ${(LADO - 1) * hueco}px)`,
                        height: `calc(${LADO * 100}% + ${(LADO - 1) * hueco}px)`,
                        left: `calc(${-col} * (100% + ${hueco}px))`,
                        top: `calc(${-fila} * (100% + ${hueco}px))`,
                        backgroundImage: rutaFoto,
                        transition: 'width 0.6s, height 0.6s, left 0.6s, top 0.6s',
                      }}
                    />
                  ) : (
                    // Sin foto no hay nada que reconocer: mostramos el número para que
                    // igual se pueda armar.
                    <span
                      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${juego.gradiente} text-white`}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {pieza.emoji}
                      </span>
                      <span className="text-[11px] font-semibold opacity-90">{pieza.posicion + 1}</span>
                    </span>
                  )}

                  {/* Velo sobre las piezas sueltas: las fijas se ven a todo color */}
                  {conFoto && !fija && (
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 transition-colors ${
                        elegida ? 'bg-primary/15' : 'bg-white/10'
                      }`}
                    />
                  )}

                  {/* Sello con el emoji de la razón, al encajar */}
                  <AnimatePresence>
                    {fija && !terminado && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                        className="absolute right-1.5 bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-base shadow-md"
                      >
                        {pieza.emoji}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>

          {/* Pista: la foto entera, un momento */}
          <AnimatePresence>
            {viendoFoto && conFoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute inset-0 z-40 overflow-hidden rounded-[10px] shadow-xl"
                aria-hidden="true"
              >
                <span
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: rutaFoto }}
                />
                <motion.span
                  className={`absolute inset-x-0 bottom-0 h-1.5 origin-left bg-gradient-to-r ${juego.gradiente}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: SEGUNDOS_PISTA, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {foto.estado === 'rota' && (
          <p className="mt-3 text-center text-[11px] leading-snug break-all text-muted">
            Falta la foto: <code className="font-semibold">public/{juego.foto}</code>. Mientras tanto
            se arma por números.
          </p>
        )}

        {/* Marcador y pista */}
        {!terminado && (
          <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-muted">
            <span>
              Movimientos:{' '}
              <strong className="font-semibold text-dark tabular-nums">{movimientos}</strong>
            </span>
            {conFoto && (
              <motion.button
                type="button"
                whileTap={{ scale: pistas > 0 ? 0.95 : 1 }}
                onClick={verFoto}
                disabled={pistas === 0 || viendoFoto}
                className="btn-base min-h-0 border border-black/10 bg-white px-3 py-1.5 text-[12px] text-dark disabled:opacity-40"
              >
                👀 Ver la foto{' '}
                <span className="flex gap-0.5" aria-label={`${pistas} pistas`}>
                  {Array.from({ length: PISTAS }, (_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${i < pistas ? 'bg-primary' : 'bg-black/15'}`}
                    />
                  ))}
                </span>
              </motion.button>
            )}
          </div>
        )}

        {!terminado && encajadas === 0 && (
          <p className="mt-2 text-center text-[12px] text-muted">
            {conFoto
              ? 'Toca dos piezas para intercambiarlas, o arrastra una encima de otra.'
              : 'Toca dos piezas para intercambiarlas. El número es su lugar: 1 arriba a la izquierda, 9 abajo a la derecha.'}
          </p>
        )}
      </div>

      {/* La razón (o razones) que acaba de destapar */}
      <AnimatePresence mode="wait">
        {recientes.length > 0 && !terminado && (
          <motion.div
            key={recientes.join('-') + movimientos}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="card flex flex-col gap-3"
          >
            {recientes.map((celda) => {
              const razon = tablero[celda]
              return (
                <div key={celda} className="flex items-start gap-3">
                  <motion.span
                    initial={{ scale: 0, rotate: -120 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 13, delay: 0.1 }}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${juego.gradiente} text-2xl shadow-md`}
                    aria-hidden="true"
                  >
                    {razon.emoji}
                  </motion.span>
                  <div>
                    <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                      Razón {razon.posicion + 1} de {CELDAS}
                    </p>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-dark">{razon.razon}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Al terminar: todas juntas */}
      <AnimatePresence>
        {terminado && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <p className="text-center text-[15px] font-semibold text-primary">
              Nueve razones, y me quedé corto 💕
            </p>
            <p className="mt-1 text-center text-[12px] text-muted">
              La armaste en {movimientos} {movimientos === 1 ? 'movimiento' : 'movimientos'}.
            </p>
            <ol className="mt-4 flex flex-col gap-3">
              {datos.map((r, i) => (
                <motion.li
                  key={r.posicion}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-2 text-[13px] leading-relaxed"
                >
                  <span aria-hidden="true">{r.emoji}</span>
                  <span>{r.razon}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mientras juega: lo que lleva destapado */}
      {!terminado && destapadas.length > recientes.length && (
        <div className="card">
          <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
            Mis razones ({destapadas.length}/{CELDAS})
          </p>
          <ol className="flex flex-col gap-2">
            {destapadas
              .filter((r) => !recientes.includes(r.posicion))
              .map((r) => (
                <motion.li
                  key={r.posicion}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-[13px] leading-relaxed"
                >
                  <span aria-hidden="true">{r.emoji}</span>
                  <span>{r.razon}</span>
                </motion.li>
              ))}
          </ol>
        </div>
      )}
    </div>
  )
}

/**
 * Baraja las piezas de modo que NINGUNA empiece en su sitio. Si alguna
 * empezara colocada, se destaparía una razón sin haber hecho nada.
 */
function desordenar(piezas) {
  const ordenadas = [...piezas].sort((a, b) => a.posicion - b.posicion)
  let copia
  do {
    copia = [...ordenadas]
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copia[i], copia[j]] = [copia[j], copia[i]]
    }
  } while (copia.some((p, celda) => p.posicion === celda))
  return copia
}
