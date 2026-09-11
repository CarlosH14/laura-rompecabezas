import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { confettiPequeno, sonar } from '../../utils/efectos'

/**
 * MINIJUEGO #9 — El poema 📜
 *
 * Al poema le faltan nueve palabras. Laura las va eligiendo entre tres
 * opciones, de arriba abajo, y cada acierto descubre los versos siguientes.
 * Cuando pone la última, el poema entero se vuelve a escribir solo, verso a
 * verso, para que lo lea de un tirón.
 *
 * El reparto de responsabilidades es el de siempre: aquí está la mecánica, y
 * el poema entero vive en src/data/minijuegos.js.
 */
export default function Poema({ juego, datos, onCompletar }) {
  // Aplanamos las partes en una sola lista de versos, apuntando a qué parte
  // pertenece cada uno. Así el índice de un verso sirve para todo.
  const { lineas, huecos } = useMemo(() => aplanar(datos), [datos])

  const [resueltas, setResueltas] = useState([]) // palabras ya colocadas, en orden
  const [fallo, setFallo] = useState(null) // opción tocada que no era
  const [modo, setModo] = useState('jugando') // 'jugando' | 'lectura'

  const yaAvisado = useRef(false)
  const cabeceraRef = useRef(null)

  const total = huecos.length
  const indiceActual = resueltas.length
  const huecoActual = huecos[indiceActual] ?? null

  // Las tres opciones se barajan una vez: si la correcta saliera siempre
  // primero, no habría nada que adivinar.
  const opcionesBarajadas = useMemo(
    () => huecos.map((h) => barajar(h.opciones)),
    [huecos],
  )

  // Hasta dónde se ve el poema: hasta el verso del hueco que toca ahora.
  // En modo lectura, entero.
  const hastaLinea = modo === 'lectura' ? lineas.length : (huecoActual?.linea ?? lineas.length - 1)

  useEffect(() => {
    if (modo !== 'lectura' || yaAvisado.current) return
    yaAvisado.current = true

    // Le damos tiempo a que termine de escribirse antes de sacar el cartel de
    // "completado", para no interrumpirle la lectura.
    const espera = 900 + lineas.length * 90
    const t = setTimeout(onCompletar, espera)
    return () => clearTimeout(t)
  }, [modo, lineas.length, onCompletar])

  const responder = (palabra) => {
    if (!huecoActual || modo === 'lectura') return

    if (normalizar(palabra) !== normalizar(huecoActual.respuesta)) {
      setFallo(palabra)
      setTimeout(() => setFallo(null), 700)
      return
    }

    const siguientes = [...resueltas, palabra]
    setResueltas(siguientes)
    confettiPequeno()
    sonar('ding', 0.24)

    if (siguientes.length === total) {
      // La última: el poema se relee entero desde arriba.
      setTimeout(() => {
        setModo('lectura')
        cabeceraRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 650)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progreso */}
      <div className="flex items-center gap-3" ref={cabeceraRef}>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/10">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
            animate={{ width: `${(resueltas.length / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-medium text-muted tabular-nums">
          {resueltas.length}/{total} palabras
        </span>
      </div>

      {/* El poema */}
      <div className="card px-5 py-6 sm:px-8">
        {lineas.map((linea, i) => {
          if (i > hastaLinea) return null

          // Título de cada una de las tres partes
          if (linea.tipo === 'titulo') {
            return (
              <motion.h2
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: modo === 'lectura' ? i * 0.09 : 0, duration: 0.5 }}
                className={`mb-3 font-serif text-lg italic ${i === 0 ? 'mt-0' : 'mt-8'} text-primary`}
              >
                {linea.texto}
              </motion.h2>
            )
          }

          if (linea.tipo === 'espacio') return <div key={i} className="h-4" />

          const esElActual = huecoActual?.linea === i && modo === 'jugando'
          const palabraPuesta = linea.hueco !== undefined ? resueltas[linea.hueco] : null

          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: modo === 'lectura' ? i * 0.09 : 0, duration: 0.5 }}
              className="font-serif text-[15px] leading-[1.9] text-dark/90"
            >
              {linea.hueco === undefined ? (
                linea.texto
              ) : (
                <>
                  {linea.antes}
                  {palabraPuesta ? (
                    <motion.span
                      initial={{ scale: 1.35, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                      className="font-semibold text-primary"
                    >
                      {palabraPuesta}
                    </motion.span>
                  ) : (
                    <span
                      className={`mx-0.5 inline-block min-w-[4.5rem] rounded-md border-2 border-dashed px-2 text-center align-baseline ${
                        esElActual
                          ? 'animate-pulso border-primary bg-primary/10 text-primary'
                          : 'border-black/15 text-transparent'
                      }`}
                    >
                      ?
                    </span>
                  )}
                  {linea.despues}
                </>
              )}
            </motion.p>
          )
        })}
      </div>

      {/* Las tres opciones del hueco que toca */}
      <AnimatePresence mode="wait">
        {modo === 'jugando' && huecoActual && (
          <motion.div
            key={indiceActual}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="card"
          >
            <p className="mb-3 text-center text-[13px] text-muted">
              ¿Qué palabra falta en ese verso?
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {opcionesBarajadas[indiceActual].map((opcion) => {
                const esElFallo = fallo === opcion
                return (
                  <motion.button
                    key={opcion}
                    type="button"
                    onClick={() => responder(opcion)}
                    whileTap={{ scale: 0.96 }}
                    animate={esElFallo ? { x: [0, -7, 7, -5, 5, 0] } : {}}
                    transition={{ duration: 0.45 }}
                    className={`btn-base flex-1 border-2 font-serif text-[15px] ${
                      esElFallo
                        ? 'border-danger bg-danger/10 text-danger'
                        : 'border-black/10 bg-white text-dark'
                    }`}
                  >
                    {opcion}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {fallo && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-center text-[13px] font-medium text-danger"
                >
                  Esa no. Y mira que era fácil, la escribí pensando en ti 💛
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {modo === 'lectura' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + lineas.length * 0.09, duration: 0.8 }}
          className="text-center font-serif text-[15px] italic text-primary"
        >
          Nueve palabras, una por cada sobre. Ya está completo 💕
        </motion.p>
      )}
    </div>
  )
}

/**
 * Convierte las partes del poema en una lista plana de líneas y saca aparte
 * los huecos en el orden en que hay que rellenarlos.
 *
 * Cada línea acaba siendo una de estas: título de parte, línea en blanco,
 * verso normal, o verso con hueco (partido en `antes` / `despues`).
 */
function aplanar(partes) {
  const lineas = []
  const huecos = []

  partes.forEach((parte) => {
    lineas.push({ tipo: 'titulo', texto: parte.titulo })

    parte.versos.forEach((verso) => {
      if (verso === '') {
        lineas.push({ tipo: 'espacio' })
        return
      }

      if (typeof verso === 'string') {
        lineas.push({ tipo: 'verso', texto: verso })
        return
      }

      const [antes, despues = ''] = verso.texto.split('___')
      lineas.push({ tipo: 'verso', antes, despues, hueco: huecos.length })
      huecos.push({
        linea: lineas.length - 1,
        respuesta: verso.respuesta,
        opciones: verso.opciones,
      })
    })
  })

  return { lineas, huecos }
}

function barajar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Para comparar sin que estorben mayúsculas ni acentos. */
function normalizar(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
