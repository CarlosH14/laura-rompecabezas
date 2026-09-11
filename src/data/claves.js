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
  { id: 1, clave: 'LUNA2024',   pista: 'El fragmento de la canción que más amo de ti' },
  { id: 2, clave: 'SIEMPRE',    pista: 'Lo que te prometo por... (una sola palabra)' },
  { id: 3, clave: '18FEBRERO',  pista: 'La fecha en que nos conocimos (día + mes, sin espacios)' },
  { id: 4, clave: 'TEAMO',      pista: 'Lo que siento en cada momento, en dos palabras pegadas' },
  { id: 5, clave: 'JUNTOS',     pista: 'Lo que vamos a construir... ¿de qué manera?' },
  { id: 6, clave: 'ESTA_NOCHE', pista: 'Lo que sucederá en pocas horas (con guion bajo en medio)' },
  { id: 7, clave: 'TIAMO9',     pista: '"Te amo" en italiano + el número de razones' },
  { id: 8, clave: 'RECUERDOS',  pista: 'Los instantes que más atesoro' },
  { id: 9, clave: 'SECRETOS',   pista: 'Lo que te he querido decir y nunca dije en voz alta' },
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
