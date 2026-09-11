import { useEffect, useState } from 'react'
import { asset } from '../utils/efectos'

/**
 * Imagen a prueba de fotos-que-todavía-no-existen.
 *
 * Mientras Carlos no haya puesto el archivo en public/fotos/, en vez de un
 * icono roto muestra un placeholder con gradiente que dice qué archivo falta.
 * Así puedes ir probando la app antes de tener las 20 fotos listas.
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

  return (
    <img
      src={asset(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setRoto(true)}
      className={`object-cover ${className}`}
    />
  )
}
