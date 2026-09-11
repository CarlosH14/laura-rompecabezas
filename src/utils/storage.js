/**
 * Persistencia en localStorage.
 *
 * Todo el progreso de Laura vive en su navegador: no hay servidor, no hay
 * cuentas, no hay nada que se pueda caer. Si abre el link en el mismo
 * teléfono, su progreso sigue ahí.
 *
 * Ojo: si cambia de teléfono o borra los datos del navegador, empieza de
 * cero. Es el trade-off de no tener backend — y para este regalo está bien.
 */

const CLAVE_STORAGE = 'gameState'

/** Estado inicial: el minijuego #1 arranca desbloqueado (viene con el sobre #1). */
export function estadoInicial() {
  return {
    desbloqueados: [1],
    completados: [],
    progreso: {},
    ultimaVisita: new Date().toISOString(),
  }
}

export function cargarEstado() {
  try {
    const crudo = localStorage.getItem(CLAVE_STORAGE)
    if (!crudo) return estadoInicial()

    const datos = JSON.parse(crudo)
    const base = estadoInicial()

    // Validamos cada campo por separado: si el localStorage quedó a medias
    // (o de una versión anterior de la app), no queremos que reviente.
    return {
      desbloqueados: sanearIds(datos.desbloqueados, base.desbloqueados),
      completados: sanearIds(datos.completados, []),
      progreso: typeof datos.progreso === 'object' && datos.progreso !== null ? datos.progreso : {},
      ultimaVisita: typeof datos.ultimaVisita === 'string' ? datos.ultimaVisita : base.ultimaVisita,
    }
  } catch {
    // localStorage bloqueado (modo privado en algunos navegadores) o JSON roto.
    return estadoInicial()
  }
}

export function guardarEstado(estado) {
  try {
    localStorage.setItem(
      CLAVE_STORAGE,
      JSON.stringify({
        desbloqueados: estado.desbloqueados,
        completados: estado.completados,
        progreso: estado.progreso,
        ultimaVisita: new Date().toISOString(),
      }),
    )
  } catch {
    // Si no se puede guardar, la sesión sigue funcionando en memoria.
  }
}

export function borrarEstado() {
  try {
    localStorage.removeItem(CLAVE_STORAGE)
  } catch {
    /* nada que hacer */
  }
}

function sanearIds(valor, porDefecto) {
  if (!Array.isArray(valor)) return porDefecto
  const limpios = valor.filter((n) => Number.isInteger(n) && n >= 1 && n <= 9)
  return [...new Set(limpios)].sort((a, b) => a - b)
}
