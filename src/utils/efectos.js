import confetti from 'canvas-confetti'

/** Ruta de un archivo de /public que funciona igual en local y en GitHub Pages. */
export function asset(ruta) {
  if (!ruta) return ''
  if (/^(https?:)?\/\//.test(ruta)) return ruta // ya es una URL completa
  return `${import.meta.env.BASE_URL}${String(ruta).replace(/^\/+/, '')}`
}

const COLORES = ['#fa709a', '#fee140', '#f093fb', '#667eea', '#764ba2', '#ffffff']

/** Confetti grande: para desbloqueos y para completar un minijuego. */
export function confettiGrande() {
  confetti({
    particleCount: 120,
    spread: 90,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: COLORES,
    disableForReducedMotion: true,
  })
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: COLORES, disableForReducedMotion: true })
    confetti({ particleCount: 60, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: COLORES, disableForReducedMotion: true })
  }, 180)
}

/** Confetti chiquito: para aciertos sueltos dentro de un minijuego. */
export function confettiPequeno(origen) {
  confetti({
    particleCount: 35,
    spread: 55,
    startVelocity: 28,
    scalar: 0.8,
    origin: origen ?? { y: 0.7 },
    colors: COLORES,
    disableForReducedMotion: true,
  })
}

/** Lluvia de corazones para la pantalla final. */
export function confettiCorazones() {
  const corazon = confetti.shapeFromText({ text: '💕', scalar: 2 })
  confetti({
    particleCount: 40,
    spread: 100,
    startVelocity: 35,
    shapes: [corazon],
    scalar: 2,
    origin: { y: 0.5 },
    disableForReducedMotion: true,
  })
}

/**
 * Sonidos. Son 100% opcionales: si los archivos no existen en
 * public/audio/, esto falla en silencio y no pasa nada.
 *
 * Archivos esperados:  ding.mp3  ·  tada.mp3  ·  unlock.mp3
 */
let sonidoActivo = true

export function silenciar(valor) {
  sonidoActivo = !valor
}

export function sonar(nombre, volumen = 0.3) {
  if (!sonidoActivo) return
  try {
    const audio = new Audio(asset(`audio/${nombre}.mp3`))
    audio.volume = volumen
    const promesa = audio.play()
    if (promesa?.catch) promesa.catch(() => {})
  } catch {
    /* sin sonido, sin drama */
  }
}
