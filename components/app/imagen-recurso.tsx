'use client'

import { useState } from 'react'
import { IMG_PLACEHOLDER } from '@/lib/rosario-imagenes'
import type { ImagenRecurso as ImagenRecursoType } from '@/lib/types'

type Props = {
  imagen?: ImagenRecursoType
  className?: string
  showCredit?: boolean
}

/**
 * Imagen de un recurso con fallback local: si la carga desde el banco gratuito
 * (Unsplash) falla, se reemplaza por el placeholder para no romper la demo.
 */
export function ImagenRecurso({ imagen, className, showCredit = false }: Props) {
  const [src, setSrc] = useState(imagen?.url ?? IMG_PLACEHOLDER)
  const [errored, setErrored] = useState(false)

  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || '/placeholder.svg'}
        alt={imagen?.alt ?? 'Imagen ilustrativa de Rosario'}
        crossOrigin="anonymous"
        loading="lazy"
        onError={() => {
          if (!errored) {
            setErrored(true)
            setSrc(IMG_PLACEHOLDER)
          }
        }}
        className="size-full object-cover"
      />
      {showCredit && imagen?.credito && !errored && (
        <figcaption className="mt-1 text-right text-[10px] text-muted-foreground">
          Foto: {imagen.credito}
        </figcaption>
      )}
    </figure>
  )
}
