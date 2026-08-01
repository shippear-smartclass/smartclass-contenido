import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getArea } from '@/lib/curriculum'
import type { FormularioGeneracion } from '@/lib/types'

export const maxDuration = 60

const actividadSchema = z.object({
  titulo: z.string().describe('Título breve y claro de la actividad'),
  momento: z.string().describe('Momento de la clase: Inicio, Desarrollo o Cierre'),
  descripcion: z.string().describe('Descripción de qué hará el grupo, dirigida al docente'),
  consignas: z.array(z.string()).describe('Consignas concretas para los alumnos, listas para copiar'),
  recursosNecesarios: z.array(z.string()).describe('Materiales o recursos que necesita el docente'),
  tiempoEstimado: z.string().describe('Tiempo estimado, ej. "20 min"'),
})

const secuenciaSchema = z.object({
  titulo: z.string(),
  grado: z.string(),
  area: z.string(),
  fundamentacion: z.string().describe('Breve fundamentación pedagógica (2-4 oraciones)'),
  objetivos: z.array(z.string()).describe('Objetivos de aprendizaje'),
  contenidosCurriculares: z.array(z.string()).describe('Contenidos del Diseño Curricular abordados'),
  contextoLocal: z.string().describe('Cómo se vincula la secuencia con el contexto local de Santa Fe/Rosario'),
  actividades: z.array(actividadSchema),
  criteriosEvaluacion: z.array(z.string()),
  adaptaciones: z.string().describe('Sugerencias de adaptación para distintos niveles del grupo'),
})

export async function POST(req: Request) {
  try {
    const form = (await req.json()) as FormularioGeneracion
    const area = getArea(form.areaId)

    const system = `Sos un asistente pedagógico experto en Educación Primaria de la Provincia de Santa Fe, Argentina.
Generás recursos didácticos alineados ESTRICTAMENTE al Diseño Curricular provincial de Santa Fe.
Reglas:
- La IA no reemplaza al docente, lo potencia: el criterio pedagógico queda en el docente.
- El Diseño Curricular es la fuente de verdad. No inventes contenidos fuera del área/grado indicados.
- Super-localización: vinculá la teoría con temas cotidianos y de actualidad de Rosario/Santa Fe cuando corresponda.
- Usá español rioplatense (voseo) y un registro claro, profesional y respetuoso.
- Las consignas deben estar redactadas para el alumnado del grado indicado, listas para imprimir.
- Ajustá dificultad, tono y temáticas al contexto de aula (nivel, tipo de institución) indicado.`

    const prompt = `Generá un recurso didáctico con estos parámetros:
- Tipo de recurso: ${form.tipoRecurso}
- Grado: ${form.grado}
- Área: ${area?.nombre ?? form.areaId}
- Contenido curricular (Santa Fe): ${form.contenido}
- Tema local / de actualidad: ${form.temaLocal || 'sin especificar'}
- Integración interdisciplinaria: ${form.integracion || 'ninguna'}
- Cantidad de actividades: ${form.cantidad}
- Duración disponible: ${form.duracion}
- Nivel de aprendizaje del grupo: ${form.nivel}
- Tipo de institución: ${form.tipoInstitucion}
- Notas adicionales del docente: ${form.notasDocente || 'ninguna'}

Respetá la cantidad de actividades pedida y distribuí los momentos (Inicio, Desarrollo, Cierre) de forma coherente.`

    const { output } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system,
      prompt,
      output: Output.object({ schema: secuenciaSchema }),
    })

    return Response.json({ secuencia: output })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log('[v0] Error generando recurso:', message)

    if (message.includes('credit card') || message.includes('AI Gateway')) {
      return Response.json(
        {
          error:
            'La IA todavía no está habilitada en este proyecto. Para activarla hay que agregar una tarjeta al AI Gateway de Vercel y así desbloquear los créditos gratuitos.',
        },
        { status: 402 },
      )
    }

    return Response.json(
      { error: 'No se pudo generar el recurso. Intentá nuevamente.' },
      { status: 500 },
    )
  }
}
