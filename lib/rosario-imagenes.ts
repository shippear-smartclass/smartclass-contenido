import type { ImagenRecurso } from '@/lib/types'

/**
 * Banco de imágenes gratuitas (Unsplash) de Rosario y su entorno.
 * Se sirven en vivo desde Unsplash; ante cualquier fallo de carga, el
 * componente <ImagenRecurso> reemplaza por el placeholder local para que la
 * demo nunca se rompa.
 */

export const IMG_PLACEHOLDER = '/images/rosario-placeholder.png'

function u(id: string, w = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`
}

export type CategoriaImagen = 'monumento' | 'parque' | 'playa' | 'rio' | 'ciudad'

type Banco = Record<CategoriaImagen, ImagenRecurso[]>

// Colecciones curadas. Cada categoría tiene varias opciones para variar.
export const BANCO_ROSARIO: Banco = {
  monumento: [
    { url: u('photo-1589909202802-8f4aadce1849'), alt: 'Monumento a la Bandera de Rosario junto al río Paraná', credito: 'Unsplash' },
    { url: u('photo-1621506289937-a8e4df240d0b'), alt: 'Vista del Monumento a la Bandera al atardecer', credito: 'Unsplash' },
  ],
  parque: [
    { url: u('photo-1441974231531-c6227db76b6e'), alt: 'Parque arbolado con senderos y vegetación', credito: 'Unsplash' },
    { url: u('photo-1519331379826-f10be5486c6f'), alt: 'Parque urbano con árboles y césped verde', credito: 'Unsplash' },
  ],
  playa: [
    { url: u('photo-1507525428034-b723cf961d3e'), alt: 'Playa de arena junto al agua', credito: 'Unsplash' },
    { url: u('photo-1505228395891-9a51e7e86bf6'), alt: 'Orilla de río con arena y sol', credito: 'Unsplash' },
  ],
  rio: [
    { url: u('photo-1437482078695-73f5ca6c96e2'), alt: 'Río ancho con vegetación en las orillas', credito: 'Unsplash' },
    { url: u('photo-1470770841072-f978cf4d019e'), alt: 'Río y humedales al amanecer', credito: 'Unsplash' },
  ],
  ciudad: [
    { url: u('photo-1449824913935-59a10b8d2000'), alt: 'Vista urbana de la ciudad con edificios', credito: 'Unsplash' },
    { url: u('photo-1502920917128-1aa500764cbd'), alt: 'Calle arbolada de una ciudad', credito: 'Unsplash' },
  ],
}

const PALABRAS: Array<{ cat: CategoriaImagen; claves: string[] }> = [
  { cat: 'monumento', claves: ['monumento', 'bandera', 'histor', 'efeméride', 'efemeride', 'patri', 'memoria'] },
  { cat: 'playa', claves: ['playa', 'costa', 'balneario', 'arena'] },
  { cat: 'rio', claves: ['río', 'rio', 'paraná', 'parana', 'humedal', 'isla', 'agua', 'puerto'] },
  { cat: 'parque', claves: ['parque', 'plaza', 'árbol', 'arbol', 'natural', 'ambiente', 'ecosistema', 'ser vivo', 'planta'] },
  { cat: 'ciudad', claves: ['ciudad', 'transporte', 'urban', 'barrio', 'industria', 'producción', 'produccion'] },
]

/** Elige la categoría de imagen más pertinente a partir de un texto libre. */
export function categoriaPorTexto(...textos: string[]): CategoriaImagen {
  const t = textos.join(' ').toLowerCase()
  for (const { cat, claves } of PALABRAS) {
    if (claves.some((c) => t.includes(c))) return cat
  }
  return 'ciudad'
}

/** Devuelve una imagen de la categoría; el índice permite variar dentro del set. */
export function imagenDe(cat: CategoriaImagen, indice = 0): ImagenRecurso {
  const set = BANCO_ROSARIO[cat]
  return set[indice % set.length]
}

/** Imagen sugerida a partir de texto libre. */
export function imagenPorTexto(indice: number, ...textos: string[]): ImagenRecurso {
  return imagenDe(categoriaPorTexto(...textos), indice)
}

/** Galería variada de 4 imágenes representativas de Rosario. */
export function galeriaRosario(): ImagenRecurso[] {
  return [
    imagenDe('monumento', 0),
    imagenDe('parque', 0),
    imagenDe('playa', 0),
    imagenDe('rio', 0),
  ]
}
