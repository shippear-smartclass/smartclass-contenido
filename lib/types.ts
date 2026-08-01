export type ImagenRecurso = {
  url: string
  alt: string
  credito?: string
}

export type Actividad = {
  titulo: string
  momento: string // Inicio | Desarrollo | Cierre
  descripcion: string
  consignas: string[]
  recursosNecesarios: string[]
  tiempoEstimado: string
  imagen?: ImagenRecurso
}

export type SecuenciaDidactica = {
  titulo: string
  grado: string
  area: string
  fundamentacion: string
  objetivos: string[]
  contenidosCurriculares: string[]
  contextoLocal: string
  imagenPortada?: ImagenRecurso
  galeria?: ImagenRecurso[]
  actividades: Actividad[]
  criteriosEvaluacion: string[]
  adaptaciones: string
}

export type FormularioGeneracion = {
  grado: string
  areaId: string
  contenido: string
  temaLocal: string
  tipoRecurso: string
  cantidad: string
  duracion: string
  nivel: string
  tipoInstitucion: string
  integracion: string
  notasDocente: string
}

// ---------------------------------------------------------------------------
// Dashboard: clases/cursos y material creado (persistido en localStorage)
// ---------------------------------------------------------------------------

export type Contacto = {
  id: string
  nombre: string
  rol: 'Alumno/a' | 'Familia' | 'Colega'
  email: string
}

export type Curso = {
  id: string
  nombre: string
  grado: string
  turno: string
  color: string
  creadoEn: string // ISO
}

export type Material = {
  id: string
  cursoId: string
  titulo: string
  area: string
  grado: string
  tipoRecurso: string
  creadoEn: string // ISO
  secuencia: SecuenciaDidactica
  compartidoCon: string[] // ids de contactos
}
