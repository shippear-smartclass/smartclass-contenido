'use client'

// ---------------------------------------------------------------------------
// Store de datos DEMO en localStorage, namespaced por usuario.
// Reemplazar por Supabase cuando se conecte la persistencia real.
// ---------------------------------------------------------------------------

import type { Contacto, Curso, Material, SecuenciaDidactica } from '@/lib/types'
import { imagenDe } from '@/lib/rosario-imagenes'

const PREFIX = 'smartclass.data'

function keyFor(email: string, coleccion: string) {
  return `${PREFIX}:${email}:${coleccion}`
}

function read<T>(email: string, coleccion: string): T[] {
  try {
    const raw = localStorage.getItem(keyFor(email, coleccion))
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function write<T>(email: string, coleccion: string, valor: T[]) {
  try {
    localStorage.setItem(keyFor(email, coleccion), JSON.stringify(valor))
  } catch {
    // almacenamiento no disponible: la demo sigue funcionando en memoria
  }
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// --- Cursos -----------------------------------------------------------------

export function getCursos(email: string): Curso[] {
  return read<Curso>(email, 'cursos')
}

export function saveCurso(email: string, curso: Omit<Curso, 'id' | 'creadoEn'>): Curso {
  const nuevo: Curso = { ...curso, id: uid('curso'), creadoEn: new Date().toISOString() }
  const cursos = getCursos(email)
  write(email, 'cursos', [nuevo, ...cursos])
  return nuevo
}

// --- Materiales -------------------------------------------------------------

export function getMateriales(email: string): Material[] {
  return read<Material>(email, 'materiales')
}

export function getMaterial(email: string, id: string): Material | undefined {
  return getMateriales(email).find((m) => m.id === id)
}

export function saveMaterial(
  email: string,
  data: {
    cursoId: string
    secuencia: SecuenciaDidactica
    tipoRecurso: string
  },
): Material {
  const nuevo: Material = {
    id: uid('mat'),
    cursoId: data.cursoId,
    titulo: data.secuencia.titulo,
    area: data.secuencia.area,
    grado: data.secuencia.grado,
    tipoRecurso: data.tipoRecurso,
    creadoEn: new Date().toISOString(),
    secuencia: data.secuencia,
    compartidoCon: [],
  }
  const materiales = getMateriales(email)
  write(email, 'materiales', [nuevo, ...materiales])
  return nuevo
}

export function updateMaterial(email: string, id: string, patch: Partial<Material>) {
  const materiales = getMateriales(email).map((m) => (m.id === id ? { ...m, ...patch } : m))
  write(email, 'materiales', materiales)
}

export function deleteMaterial(email: string, id: string) {
  write(
    email,
    'materiales',
    getMateriales(email).filter((m) => m.id !== id),
  )
}

// --- Contactos --------------------------------------------------------------

export function getContactos(email: string): Contacto[] {
  return read<Contacto>(email, 'contactos')
}

// --- Seed de datos DEMO -----------------------------------------------------

const SEED_FLAG = 'seeded'

export function ensureSeed(email: string) {
  try {
    if (localStorage.getItem(keyFor(email, SEED_FLAG))) return
  } catch {
    return
  }

  // Si ya hay cursos, no volvemos a sembrar.
  if (getCursos(email).length > 0) {
    write(email, SEED_FLAG, [1] as unknown[])
    return
  }

  const ahora = Date.now()
  const dia = 24 * 60 * 60 * 1000

  const cursos: Curso[] = [
    { id: 'curso_demo_4a', nombre: '4° A - Turno mañana', grado: '4° Grado', turno: 'Mañana', color: 'chart-1', creadoEn: new Date(ahora - 30 * dia).toISOString() },
    { id: 'curso_demo_6b', nombre: '6° B - Turno tarde', grado: '6° Grado', turno: 'Tarde', color: 'chart-3', creadoEn: new Date(ahora - 20 * dia).toISOString() },
    { id: 'curso_demo_particular', nombre: 'Apoyo particular - Matemática', grado: '5° Grado', turno: 'Contraturno', color: 'chart-4', creadoEn: new Date(ahora - 8 * dia).toISOString() },
  ]

  const contactos: Contacto[] = [
    { id: 'c1', nombre: 'Martina Gómez', rol: 'Alumno/a', email: 'martina@familia.com' },
    { id: 'c2', nombre: 'Tomás Ferreyra', rol: 'Alumno/a', email: 'tomas@familia.com' },
    { id: 'c3', nombre: 'Familia López', rol: 'Familia', email: 'lopez@familia.com' },
    { id: 'c4', nombre: 'Prof. Silvana Ruiz', rol: 'Colega', email: 'silvana@escuela.edu.ar' },
    { id: 'c5', nombre: 'Familia Sosa', rol: 'Familia', email: 'sosa@familia.com' },
  ]

  const materiales: Material[] = [
    {
      id: 'mat_demo_1',
      cursoId: 'curso_demo_4a',
      titulo: 'El río Paraná y la vida en la costa',
      area: 'Ciencias Naturales',
      grado: '4° Grado',
      tipoRecurso: 'Secuencia didáctica',
      creadoEn: new Date(ahora - 5 * dia - 3 * 60 * 60 * 1000).toISOString(),
      compartidoCon: ['c1', 'c3'],
      secuencia: seedSecuenciaRio(),
    },
    {
      id: 'mat_demo_2',
      cursoId: 'curso_demo_6b',
      titulo: 'El Monumento a la Bandera y las efemérides',
      area: 'Ciencias Sociales',
      grado: '6° Grado',
      tipoRecurso: 'Secuencia didáctica',
      creadoEn: new Date(ahora - 2 * dia - 60 * 60 * 1000).toISOString(),
      compartidoCon: ['c4'],
      secuencia: seedSecuenciaMonumento(),
    },
    {
      id: 'mat_demo_3',
      cursoId: 'curso_demo_particular',
      titulo: 'Proporcionalidad en el parque de la ciudad',
      area: 'Matemática',
      grado: '5° Grado',
      tipoRecurso: 'Guía de ejercicios',
      creadoEn: new Date(ahora - 12 * 60 * 60 * 1000).toISOString(),
      compartidoCon: [],
      secuencia: seedSecuenciaParque(),
    },
  ]

  write(email, 'cursos', cursos)
  write(email, 'contactos', contactos)
  write(email, 'materiales', materiales)
  write(email, SEED_FLAG, [1] as unknown[])
}

// --- Secuencias de ejemplo (usadas por el seed) -----------------------------

function seedSecuenciaRio(): SecuenciaDidactica {
  return {
    titulo: 'El río Paraná y la vida en la costa',
    grado: '4° Grado',
    area: 'Ciencias Naturales',
    fundamentacion:
      'Esta secuencia invita a los estudiantes a conocer el ecosistema del río Paraná, sus humedales e islas, reconociendo su importancia para la vida y la comunidad de Rosario.',
    objetivos: [
      'Identificar los seres vivos que habitan el río y sus orillas.',
      'Reconocer la importancia del agua para los ecosistemas.',
      'Valorar el cuidado del ambiente ribereño.',
    ],
    contenidosCurriculares: ['Los seres vivos: diversidad y clasificación', 'El agua, el aire y el suelo', 'Ecosistemas y cuidado del ambiente'],
    contextoLocal: 'Las actividades parten de la observación del río Paraná, sus islas y humedales, un paisaje cotidiano para las familias de Rosario.',
    imagenPortada: imagenDe('rio', 0),
    galeria: [imagenDe('rio', 0), imagenDe('playa', 0), imagenDe('parque', 0)],
    actividades: [
      {
        titulo: 'Observamos el río',
        momento: 'Inicio',
        descripcion: 'A partir de imágenes del río Paraná, el grupo conversa sobre lo que conoce del río y sus orillas.',
        consignas: ['Observá las imágenes del río Paraná.', '¿Qué seres vivos podés reconocer?', 'Compartí una experiencia tuya en la costa.'],
        recursosNecesarios: ['Imágenes del río', 'Pizarrón'],
        tiempoEstimado: '15 min',
        imagen: imagenDe('rio', 1),
      },
      {
        titulo: 'Investigamos los humedales',
        momento: 'Desarrollo',
        descripcion: 'En grupos, investigan qué es un humedal y qué animales y plantas viven en las islas del Paraná.',
        consignas: ['Leé la ficha sobre los humedales.', 'Dibujá tres seres vivos de las islas.', 'Escribí por qué es importante cuidarlos.'],
        recursosNecesarios: ['Fichas impresas', 'Hojas y lápices de colores'],
        tiempoEstimado: '30 min',
        imagen: imagenDe('parque', 1),
      },
      {
        titulo: 'Cuidamos nuestra costa',
        momento: 'Cierre',
        descripcion: 'El grupo elabora afiches con recomendaciones para cuidar el río y la costa.',
        consignas: ['En grupo, escribí tres acciones para cuidar el río.', 'Ilustrá tu afiche.', 'Presentalo al resto del curso.'],
        recursosNecesarios: ['Afiches', 'Marcadores'],
        tiempoEstimado: '20 min',
        imagen: imagenDe('playa', 1),
      },
    ],
    criteriosEvaluacion: ['Participación en las observaciones.', 'Identificación de seres vivos del ecosistema.', 'Compromiso con el cuidado del ambiente.'],
    adaptaciones: 'Para grupos heterogéneos, ofrecer fichas con apoyos visuales y permitir respuestas orales o dibujadas.',
  }
}

function seedSecuenciaMonumento(): SecuenciaDidactica {
  return {
    titulo: 'El Monumento a la Bandera y las efemérides',
    grado: '6° Grado',
    area: 'Ciencias Sociales',
    fundamentacion:
      'La secuencia aborda la construcción de la memoria colectiva a través del Monumento a la Bandera de Rosario, vinculando efemérides con la identidad local.',
    objetivos: ['Comprender el valor simbólico del Monumento a la Bandera.', 'Relacionar efemérides con la historia local.', 'Reflexionar sobre la construcción de la memoria.'],
    contenidosCurriculares: ['Efemérides y construcción de la memoria', 'Sociedades a través del tiempo', 'Convivencia, normas y ciudadanía'],
    contextoLocal: 'El Monumento a la Bandera, emblema de Rosario, funciona como punto de partida para pensar la historia y la identidad santafesina.',
    imagenPortada: imagenDe('monumento', 0),
    galeria: [imagenDe('monumento', 0), imagenDe('ciudad', 0), imagenDe('rio', 0)],
    actividades: [
      {
        titulo: '¿Qué sabemos del Monumento?',
        momento: 'Inicio',
        descripcion: 'A partir de una imagen del Monumento a la Bandera, el grupo comparte lo que sabe y se plantean preguntas.',
        consignas: ['Observá la imagen del Monumento.', 'Escribí tres cosas que sepas.', 'Anotá una pregunta que te gustaría responder.'],
        recursosNecesarios: ['Imagen del Monumento', 'Cuaderno'],
        tiempoEstimado: '15 min',
        imagen: imagenDe('monumento', 1),
      },
      {
        titulo: 'Línea de tiempo de efemérides',
        momento: 'Desarrollo',
        descripcion: 'Investigan fechas clave y construyen una línea de tiempo colaborativa.',
        consignas: ['Ordená las efemérides en la línea de tiempo.', 'Ilustrá cada fecha.', 'Explicá por qué se recuerda.'],
        recursosNecesarios: ['Fichas de efemérides', 'Papel afiche'],
        tiempoEstimado: '35 min',
        imagen: imagenDe('ciudad', 0),
      },
    ],
    criteriosEvaluacion: ['Comprensión del valor simbólico del Monumento.', 'Ubicación temporal de las efemérides.', 'Participación reflexiva.'],
    adaptaciones: 'Ofrecer material audiovisual y trabajo en parejas para favorecer la comprensión de todos los estudiantes.',
  }
}

function seedSecuenciaParque(): SecuenciaDidactica {
  return {
    titulo: 'Proporcionalidad en el parque de la ciudad',
    grado: '5° Grado',
    area: 'Matemática',
    fundamentacion:
      'A través de situaciones del parque de la ciudad, los estudiantes exploran relaciones de proporcionalidad de manera concreta y contextualizada.',
    objetivos: ['Resolver problemas de proporcionalidad directa.', 'Interpretar tablas de valores.', 'Vincular la matemática con situaciones cotidianas.'],
    contenidosCurriculares: ['Proporcionalidad y tratamiento de la información', 'Operaciones: multiplicación y división'],
    contextoLocal: 'Los problemas se ambientan en un parque de Rosario: cantidad de árboles, bancos y visitantes.',
    imagenPortada: imagenDe('parque', 0),
    galeria: [imagenDe('parque', 0), imagenDe('ciudad', 1)],
    actividades: [
      {
        titulo: 'Contamos en el parque',
        momento: 'Inicio',
        descripcion: 'Se presenta una situación del parque para activar ideas previas sobre proporcionalidad.',
        consignas: ['Si en 2 canteros hay 6 árboles, ¿cuántos hay en 4 canteros?', 'Explicá cómo lo pensaste.'],
        recursosNecesarios: ['Pizarrón', 'Cuaderno'],
        tiempoEstimado: '15 min',
        imagen: imagenDe('parque', 1),
      },
      {
        titulo: 'Tablas de proporcionalidad',
        momento: 'Desarrollo',
        descripcion: 'Completan tablas con situaciones del parque y descubren la constante de proporcionalidad.',
        consignas: ['Completá la tabla de árboles por cantero.', 'Encontrá el patrón.', 'Inventá tu propio problema.'],
        recursosNecesarios: ['Guía impresa'],
        tiempoEstimado: '30 min',
        imagen: imagenDe('ciudad', 1),
      },
    ],
    criteriosEvaluacion: ['Resolución correcta de proporcionalidad.', 'Interpretación de tablas.', 'Justificación de procedimientos.'],
    adaptaciones: 'Para apoyo escolar, usar material concreto (fichas) antes de pasar a la tabla numérica.',
  }
}
