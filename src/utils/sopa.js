/**
 * Generador de sopa de letras.
 *
 * En vez de escribir el tablero a mano (y tener que rehacerlo cada vez que
 * cambies una palabra), lo generamos. Usamos un generador de números con
 * semilla para que el resultado sea SIEMPRE el mismo: así el tablero no se
 * baraja cada vez que Laura recarga la página.
 */

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Las 8 direcciones posibles: horizontal, vertical y las dos diagonales,
// cada una en sus dos sentidos.
const DIRECCIONES = [
  [0, 1], [0, -1],
  [1, 0], [-1, 0],
  [1, 1], [-1, -1],
  [1, -1], [-1, 1],
]

/** Generador congruencial lineal: pseudo-aleatorio pero reproducible. */
function crearAzar(semilla) {
  let estado = semilla >>> 0
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 4294967296
  }
}

function barajar(lista, azar) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function intentarGenerar(palabras, tamano, semilla) {
  const azar = crearAzar(semilla)
  const grid = Array.from({ length: tamano }, () => Array(tamano).fill(null))
  const ubicaciones = {}

  // Las palabras largas primero: son las difíciles de encajar.
  const ordenadas = [...palabras].sort((a, b) => b.length - a.length)

  for (const palabra of ordenadas) {
    let colocada = false

    // Probamos direcciones y posiciones de arranque en orden aleatorio.
    for (const [df, dc] of barajar(DIRECCIONES, azar)) {
      const arranques = barajar(
        Array.from({ length: tamano * tamano }, (_, i) => i),
        azar,
      )

      for (const inicio of arranques) {
        const f0 = Math.floor(inicio / tamano)
        const c0 = inicio % tamano
        const celdas = []
        let cabe = true

        for (let k = 0; k < palabra.length; k++) {
          const f = f0 + df * k
          const c = c0 + dc * k
          if (f < 0 || f >= tamano || c < 0 || c >= tamano) {
            cabe = false
            break
          }
          const actual = grid[f][c]
          // Puede cruzarse con otra palabra si la letra coincide.
          if (actual !== null && actual !== palabra[k]) {
            cabe = false
            break
          }
          celdas.push(f * tamano + c)
        }

        if (!cabe) continue

        celdas.forEach((idx, k) => {
          grid[Math.floor(idx / tamano)][idx % tamano] = palabra[k]
        })
        ubicaciones[palabra] = celdas
        colocada = true
        break
      }

      if (colocada) break
    }

    if (!colocada) return null // esta semilla no sirve, probamos otra
  }

  // Los huecos que quedan se rellenan con letras al azar.
  for (let f = 0; f < tamano; f++) {
    for (let c = 0; c < tamano; c++) {
      if (grid[f][c] === null) {
        grid[f][c] = ALFABETO[Math.floor(azar() * ALFABETO.length)]
      }
    }
  }

  return { grid, ubicaciones, tamano }
}

/**
 * Genera el tablero. Si con `tamano` no caben todas las palabras, va
 * agrandando el tablero hasta que quepan — así nunca se queda sin generar,
 * pase lo que pase con las palabras que escribas.
 */
export function generarSopa(palabras, tamano = 8) {
  const limpias = [...new Set(palabras.map(normalizarPalabra).filter(Boolean))]

  for (let lado = Math.max(tamano, ...limpias.map((p) => p.length)); lado <= 14; lado++) {
    for (let semilla = 1; semilla <= 400; semilla++) {
      const resultado = intentarGenerar(limpias, lado, semilla)
      if (resultado) return { ...resultado, palabras: limpias }
    }
  }

  // Plan Z (prácticamente inalcanzable): tablero solo con letras.
  const lado = 14
  const azar = crearAzar(1)
  return {
    grid: Array.from({ length: lado }, () =>
      Array.from({ length: lado }, () => ALFABETO[Math.floor(azar() * 26)]),
    ),
    ubicaciones: {},
    tamano: lado,
    palabras: limpias,
  }
}

export function normalizarPalabra(palabra) {
  return String(palabra ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/Ñ/g, 'N')
    .replace(/[^A-Z]/g, '')
}

/**
 * Devuelve las celdas que van de `desde` hasta `hasta` SI están en línea
 * recta (horizontal, vertical o diagonal). Si no, devuelve null.
 */
export function celdasEnLinea(desde, hasta, tamano) {
  const f1 = Math.floor(desde / tamano)
  const c1 = desde % tamano
  const f2 = Math.floor(hasta / tamano)
  const c2 = hasta % tamano

  const df = f2 - f1
  const dc = c2 - c1
  const pasos = Math.max(Math.abs(df), Math.abs(dc))

  if (pasos === 0) return [desde]

  const esRecta = df === 0 || dc === 0 || Math.abs(df) === Math.abs(dc)
  if (!esRecta) return null

  const pf = Math.sign(df)
  const pc = Math.sign(dc)

  return Array.from({ length: pasos + 1 }, (_, k) => (f1 + pf * k) * tamano + (c1 + pc * k))
}

/** Lee la palabra que forman esas celdas, en un sentido y en el otro. */
export function palabraDeCeldas(celdas, grid, tamano) {
  const letras = celdas.map((idx) => grid[Math.floor(idx / tamano)][idx % tamano]).join('')
  return [letras, [...letras].reverse().join('')]
}
