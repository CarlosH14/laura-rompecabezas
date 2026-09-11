/**
 * ════════════════════════════════════════════════════════════
 *  LAS 9 CLAVES
 * ════════════════════════════════════════════════════════════
 *  Estas son las palabras que van escritas en cada carta física.
 *  Laura las escribe en el modal para desbloquear cada minijuego.
 *
 *  ✏️  PARA CAMBIAR UNA CLAVE: edita solo el campo `clave`.
 *      - No importan mayúsculas/minúsculas ni espacios sobrantes.
 *      - Evita acentos y la ñ (para que sea fácil de escribir en móvil).
 *      - `pista` es lo que Laura ve en el modal si se atasca.
 * ════════════════════════════════════════════════════════════
 */
export const CLAVES = [
  { id: 1, clave: 'AZUL',       pista: 'El nombre de nuestra canción... y el de alguien que todavía no existe' },
  { id: 2, clave: 'SIEMPRE',    pista: 'Lo que te prometo por... (una sola palabra)' },
  { id: 3, clave: '18ENERO',    pista: 'El día que dejamos de ser solo amigos (día + mes, sin espacios)' },
  { id: 4, clave: 'TEAMO',      pista: 'Lo que siento en cada momento, en dos palabras pegadas' },
  { id: 5, clave: 'JUNTOS',     pista: 'Lo que vamos a construir... ¿de qué manera?' },
  { id: 6, clave: 'ESTA_NOCHE', pista: 'Lo que va a pasar el 19, en dos palabras (con guion bajo en medio)' },
  { id: 7, clave: 'HERMOSA',    pista: 'Lo que te digo cuando te arreglas... y también cuando no' },
  { id: 8, clave: 'RECUERDOS',  pista: 'Los instantes que más atesoro' },
  { id: 9, clave: 'POETA',      pista: 'Lo que no soy, pero en lo que me convertí para escribirte esto' },
]

/** Normaliza una clave para comparar: sin espacios, sin acentos, en mayúsculas. */
export function normalizarClave(texto) {
  return String(texto ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/\s+/g, '')             // quita TODOS los espacios
}

/** ¿La clave que escribió coincide con la del minijuego `id`? */
export function validarClave(id, intento) {
  const entrada = CLAVES.find((c) => c.id === id)
  if (!entrada) return false
  return normalizarClave(intento) === normalizarClave(entrada.clave)
}

export function pistaDe(id) {
  return CLAVES.find((c) => c.id === id)?.pista ?? ''
}
