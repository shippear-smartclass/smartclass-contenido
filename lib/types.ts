export type Actividad = {
  titulo: string
  momento: string // Inicio | Desarrollo | Cierre
  descripcion: string
  consignas: string[]
  recursosNecesarios: string[]
  tiempoEstimado: string
}

export type SecuenciaDidactica = {
  titulo: string
  grado: string
  area: string
  fundamentacion: string
  objetivos: string[]
  contenidosCurriculares: string[]
  contextoLocal: string
  actividades: Actividad[]
  criteriosEvaluacion: string[]
  adaptaciones: string
}

export type FormularioGeneracion = {
  grado: string
  areaIds: string[]
  contenido: string
  temaLocal: string
  tipoRecurso: string
  cantidad: string
  duracion: string
  nivel: string
  tipoInstitucion: string
  ejesTransversales: string[]
  notasDocente: string
}
