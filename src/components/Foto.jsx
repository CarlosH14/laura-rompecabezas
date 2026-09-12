import { useEffect, useState } from 'react'
import { asset } from '../utils/efectos'

/**
 * Imagen a prueba de fotos-que-todavía-no-existen y de recortes que decapitan.
 *
 * Dos cosas hace este componente:
 *
 * 1. Si el archivo no existe todavía, en vez de un icono roto muestra un
 *    recuadro de color que dice qué foto falta.
 *
 * 2. NO RECORTA. Las fotos del celular son verticales y los huecos de la app
 *    son horizontales: con un recorte normal, a la gente le quedan las cabezas
 *    fuera. Aquí la foto se ve entera y el hueco que sobra se rellena con la
 *    misma foto ampliada y desenfocada, como en Instagram. Sale un poco más
 *    de trabajo para el navegador, pero se descarga una sola vez.
 */
export default function Foto({
  src,
  alt = '',
  className = '',
  gradiente = 'from-[#fa709a] to-[#fee140]',
  emoji = '📷',
  children,
}) {
  const [roto, setRoto] = useState(false)

  // Si cambia la foto (carrusel, siguiente pregunta...), reintentamos.
  useEffect(() => {
    setRoto(false)
  }, [src])

  if (!src || roto) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${gradiente} p-4 text-center text-white ${className}`}
        role="img"
        aria-label={alt || 'Foto pendiente'}
      >
        <span className="text-4xl drop-shadow">{emoji}</span>
        {src ? (
          <span className="max-w-full px-2 text-[11px] leading-snug break-all opacity-90">
            Falta la foto: <code className="font-semibold">public/{src}</code>
          </span>
        ) : null}
        {children}
      </div>
    )
  }

  const ruta = asset(src)

  return (
    <div className={`relative overflow-hidden bg-black/5 ${className}`}>
      {/* Relleno: la misma foto ampliada y borrosa, solo decorativa */}
      <img
        src={ruta}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-125 object-cover blur-xl"
      />

      {/* La foto de verdad, entera */}
      <img
        src={ruta}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setRoto(true)}
        className="relative h-full w-full object-contain drop-shadow-sm"
      />
    </div>
  )
}
