import { create } from 'zustand'
import { validarClave } from '../data/claves'
import { TOTAL_JUEGOS } from '../data/minijuegos'
import { borrarEstado, cargarEstado, guardarEstado } from '../utils/storage'

const inicial = cargarEstado()

/**
 * Store único de la app.
 *
 * `pantalla` decide qué se ve: el grid, un minijuego, o la pantalla final.
 * No hay router — con tres pantallas, un router es más peso que ayuda.
 */
export const useGameStore = create((set, get) => ({
  // ─── Estado ──────────────────────────────────────────────
  desbloqueados: inicial.desbloqueados,
  completados: inicial.completados,
  progreso: inicial.progreso,

  pantalla: 'home', // 'home' | 'juego' | 'final'
  juegoActual: null,
  modalAbierto: null, // id del minijuego cuyo modal de clave está abierto

  // ─── Acciones ────────────────────────────────────────────

  abrirModal: (id) => set({ modalAbierto: id }),
  cerrarModal: () => set({ modalAbierto: null }),

  /**
   * Intenta desbloquear con la clave que escribió Laura.
   * Devuelve true/false para que el modal sepa qué animación mostrar.
   */
  desbloquear: (id, claveIntentada) => {
    if (!validarClave(id, claveIntentada)) {
      get().registrarIntento(id, false)
      return false
    }

    set((s) => {
      const desbloqueados = s.desbloqueados.includes(id) ? s.desbloqueados : [...s.desbloqueados, id].sort((a, b) => a - b)
      const siguiente = { ...s, desbloqueados, modalAbierto: null }
      guardarEstado(siguiente)
      return { desbloqueados, modalAbierto: null }
    })

    get().registrarIntento(id, true)
    return true
  },

  /** Cuenta los intentos por minijuego (solo para el resumen final). */
  registrarIntento: (id, acertado) =>
    set((s) => {
      const previo = s.progreso[id] ?? { intentos: 0 }
      const progreso = {
        ...s.progreso,
        [id]: {
          ...previo,
          intentos: (previo.intentos ?? 0) + 1,
          ...(acertado ? { desbloqueadoEn: new Date().toISOString() } : null),
        },
      }
      guardarEstado({ ...s, progreso })
      return { progreso }
    }),

  marcarCompletado: (id) =>
    set((s) => {
      if (s.completados.includes(id)) return s
      const completados = [...s.completados, id].sort((a, b) => a - b)
      const progreso = {
        ...s.progreso,
        [id]: { ...(s.progreso[id] ?? {}), completadoEn: new Date().toISOString() },
      }
      guardarEstado({ ...s, completados, progreso })
      return { completados, progreso }
    }),

  irAJuego: (id) => {
    if (!get().estaDesbloqueado(id)) {
      set({ modalAbierto: id })
      return
    }
    set({ pantalla: 'juego', juegoActual: id, modalAbierto: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  volverAlInicio: () => {
    set({ pantalla: 'home', juegoActual: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  irAlFinal: () => {
    set({ pantalla: 'final', juegoActual: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  /** Borra todo el progreso. Útil para probar, y para que Laura repita. */
  reiniciarTodo: () => {
    borrarEstado()
    set({
      desbloqueados: [1],
      completados: [],
      progreso: {},
      pantalla: 'home',
      juegoActual: null,
      modalAbierto: null,
    })
  },

  // ─── Derivados ───────────────────────────────────────────
  estaDesbloqueado: (id) => get().desbloqueados.includes(id),
  estaCompletado: (id) => get().completados.includes(id),
  porcentaje: () => Math.round((get().completados.length / TOTAL_JUEGOS) * 100),
  todoCompletado: () => get().completados.length === TOTAL_JUEGOS,
}))

// Atajo para probar mientras desarrollas (solo en `npm run dev`, nunca en la
// versión publicada). En la consola del navegador:
//   __laura.getState().reiniciarTodo()                → borrar progreso
//   __laura.setState({ desbloqueados: [1,2,3,4,5,6,7,8,9] })  → abrirlo todo
if (import.meta.env.DEV) {
  window.__laura = useGameStore
}
