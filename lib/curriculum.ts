// Base curricular simplificada del Diseño Curricular para la Educación Primaria
// de la Provincia de Santa Fe. Actúa como "fuente de verdad" y guardrail para
// la generación de recursos didácticos.

export const GRADOS = [
  '1° Grado',
  '2° Grado',
  '3° Grado',
  '4° Grado',
  '5° Grado',
  '6° Grado',
  '7° Grado',
] as const

export type Grado = (typeof GRADOS)[number]

export type Area = {
  id: string
  nombre: string
  contenidos: string[]
}

export const AREAS: Area[] = [
  {
    id: 'matematica',
    nombre: 'Matemática',
    contenidos: [
      'Números naturales: lectura, escritura y orden',
      'Operaciones: suma y resta con distintos significados',
      'Multiplicación y división: repartos y agrupamientos',
      'Fracciones y expresiones decimales',
      'Geometría: figuras y cuerpos geométricos',
      'Medida: longitud, peso, capacidad y tiempo',
      'Proporcionalidad y tratamiento de la información',
    ],
  },
  {
    id: 'lengua',
    nombre: 'Lengua',
    contenidos: [
      'Prácticas de lectura de textos literarios',
      'Producción escrita: cuentos y textos narrativos',
      'Reflexión sobre el lenguaje: sustantivos, adjetivos y verbos',
      'Oralidad: exposición y conversación',
      'Textos informativos y de estudio',
      'Ortografía y normativa',
    ],
  },
  {
    id: 'cs-naturales',
    nombre: 'Ciencias Naturales',
    contenidos: [
      'Los seres vivos: diversidad y clasificación',
      'El cuerpo humano y la salud',
      'Materiales y sus cambios',
      'El agua, el aire y el suelo',
      'La Tierra y el universo',
      'Ecosistemas y cuidado del ambiente',
    ],
  },
  {
    id: 'cs-sociales',
    nombre: 'Ciencias Sociales',
    contenidos: [
      'Sociedades a través del tiempo',
      'Espacios rurales y urbanos de Santa Fe',
      'Circuitos productivos regionales',
      'Efemérides y construcción de la memoria',
      'Convivencia, normas y ciudadanía',
      'Instituciones de la comunidad',
    ],
  },
  {
    id: 'esi',
    nombre: 'Educación Sexual Integral (ESI)',
    contenidos: [
      'Cuidado del cuerpo y la salud',
      'Vínculos y expresión de emociones',
      'Convivencia, respeto y diversidad',
      'Derechos de niñas, niños y adolescentes',
    ],
  },
]

export const TIPOS_RECURSO = [
  { id: 'secuencia', nombre: 'Secuencia didáctica' },
  { id: 'guia-ejercicios', nombre: 'Guía de ejercicios' },
  { id: 'proyecto', nombre: 'Proyecto interdisciplinario' },
  { id: 'evaluacion', nombre: 'Actividad de evaluación' },
] as const

export const NIVELES_APRENDIZAJE = [
  'Grupo heterogéneo (nivel mixto)',
  'Refuerzo / apoyo escolar',
  'Nivel estándar del grado',
  'Profundización / enriquecimiento',
] as const

export const TIPOS_INSTITUCION = [
  'Escuela pública laica',
  'Escuela pública de gestión privada',
  'Escuela religiosa',
  'Escuela rural',
  'Escuela urbano-marginal',
] as const

export const TEMAS_LOCALES = [
  'El río Paraná y la vida en la costa',
  'El Monumento a la Bandera (Rosario)',
  'Los humedales y las islas del Paraná',
  'La producción agropecuaria de la región',
  'El transporte y la ciudad de Rosario',
  'Personajes santafesinos destacados',
  'Fiestas y tradiciones de Santa Fe',
  'El puerto y la industria regional',
] as const

export const CANTIDADES = ['3 actividades', '4 actividades', '5 actividades', '6 actividades'] as const

export const DURACIONES = ['1 clase (40 min)', '2 clases', '3 clases', '1 semana', '2 semanas'] as const

export function getArea(id: string) {
  return AREAS.find((a) => a.id === id)
}
