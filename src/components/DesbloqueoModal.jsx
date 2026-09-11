import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import { juegoPorId } from '../data/minijuegos'
import { pistaDe } from '../data/claves'
import { confettiGrande, sonar } from '../utils/efectos'

/** Modal donde Laura escribe la clave que viene en la carta. */
export default function DesbloqueoModal() {
  const id = useGameStore((s) => s.modalAbierto)
  const cerrarModal = useGameStore((s) => s.cerrarModal)
  const desbloquear = useGameStore((s) => s.desbloquear)
  const irAJuego = useGameStore((s) => s.irAJuego)

  const [valor, setValor] = useState('')
  const [error, setError] = useState(false)
  const [verPista, setVerPista] = useState(false)
  const [abriendo, setAbriendo] = useState(false) // animación de "se abrió"
  const inputRef = useRef(null)

  const juego = id ? juegoPorId(id) : null

  // Al abrir: limpiamos, enfocamos y bloqueamos el scroll del fondo.
  useEffect(() => {
    if (!id) return
    setValor('')
    setError(false)
    setVerPista(false)
    setAbriendo(false)
    const t = setTimeout(() => inputRef.current?.focus(), 250)

    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const alPresionarEsc = (e) => {
      if (e.key === 'Escape') cerrarModal()
    }
    window.addEventListener('keydown', alPresionarEsc)

    return () => {
      clearTimeout(t)
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', alPresionarEsc)
    }
  }, [id, cerrarModal])

  const enviar = (e) => {
    e.preventDefault()
    if (!id || !valor.trim()) return

    // Ojo: `desbloquear` pone `modalAbierto` a null, así que el modal empieza a
    // desmontarse. Guardamos el id antes para poder navegar después.
    const abrirEste = id

    if (desbloquear(abrirEste, valor)) {
      setAbriendo(true)
      confettiGrande()
      sonar('unlock', 0.35)
      // Pausa para que se vea el candado abrirse y el confetti.
      setTimeout(() => irAJuego(abrirEste), 1200)
    } else {
      setError(true)
      setValor('')
      inputRef.current?.focus()
      setTimeout(() => setError(false), 1600)
    }
  }

  return (
    <AnimatePresence>
      {juego && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Fondo oscuro: tocar fuera cierra */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={cerrarModal}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: error ? [0, -8, 8, -6, 6, 0] : 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.3, x: { duration: 0.4 } }}
            className="card relative z-10 w-full max-w-sm"
          >
            <div className="flex flex-col items-center gap-1 text-center">
              <motion.div
                className={`mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${juego.gradiente} text-2xl shadow-lg`}
                animate={
                  abriendo
                    ? { scale: [1, 1.35, 1.15], rotate: [0, -12, 12, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.7, ease: 'easeOut' }}
                aria-hidden="true"
              >
                {/* El `key` hace que al abrirse se monte un candado nuevo, con
                    su animación de entrada. Sin AnimatePresence a propósito: no
                    queremos esperar a que el candado cerrado termine de salir. */}
                <motion.span
                  key={abriendo ? 'abierto' : 'cerrado'}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 14 }}
                >
                  {abriendo ? '🔓' : '🔒'}
                </motion.span>
              </motion.div>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Sobre #{juego.id}</p>
              <h2 id="titulo-modal" className="text-xl font-semibold">
                {juego.titulo} {juego.emoji}
              </h2>
              <motion.p
                key={abriendo ? 'ok' : 'pide'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-1 text-[13px] ${abriendo ? 'font-semibold text-success' : 'text-muted'}`}
              >
                {abriendo
                  ? '¡Esa es! Abriendo tu sobre...'
                  : `Escribe la clave que viene en la carta del sobre #${juego.id}.`}
              </motion.p>
            </div>

            {/* Al acertar, el formulario se va y deja ver la celebración */}
            <motion.div
              animate={{ opacity: abriendo ? 0 : 1, height: abriendo ? 0 : 'auto' }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
              <input
                ref={inputRef}
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Escribe la clave..."
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                aria-invalid={error}
                className={`input-base text-center font-semibold tracking-widest uppercase ${
                  error ? 'border-danger' : ''
                }`}
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center text-[13px] font-medium text-danger"
                  >
                    Esa no es. Intenta de nuevo, tienes infinitos intentos 💛
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                disabled={!valor.trim()}
                className={`btn-base w-full bg-gradient-to-r ${juego.gradiente} font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Desbloquear
              </motion.button>

              <button
                type="button"
                onClick={() => setVerPista((v) => !v)}
                className="text-[13px] font-medium text-primary underline decoration-dotted underline-offset-4"
              >
                {verPista ? 'Ocultar la pista' : '¿Necesitas una pista?'}
              </button>

              <AnimatePresence>
                {verPista && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-lg bg-secondary/25 px-3 py-2 text-center text-[13px] text-dark"
                  >
                    💡 {pistaDe(juego.id)}
                  </motion.p>
                )}
              </AnimatePresence>
              </form>
            </motion.div>

            {/* Barrita que se llena mientras entra al minijuego */}
            <AnimatePresence>
              {abriendo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/10"
                >
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${juego.gradiente}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!abriendo && (
              <button
                type="button"
                onClick={cerrarModal}
                aria-label="Cerrar"
                className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg text-muted shadow-md"
              >
                ×
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
