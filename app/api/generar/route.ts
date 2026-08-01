import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getArea } from '@/lib/curriculum'
import { galeriaRosario, imagenPorTexto } from '@/lib/rosario-imagenes'
import type { FormularioGeneracion, SecuenciaDidactica } from '@/lib/types'

export const maxDuration = 60

const deepSeek = createDeepSeek({ apiKey: process.env.deepseek ?? '' })

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
  const form = (await req.json()) as FormularioGeneracion

  try {
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
      model: deepSeek('deepseek-chat'),
      system,
      prompt,
      output: Output.object({ schema: secuenciaSchema }),
    })

    return Response.json({ secuencia: enriquecerConImagenes(output as SecuenciaDidactica, form) })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log('[v0] Error generando recurso, usando fallback simulado:', message)

    // Plan B: si la IA falla por cualquier motivo, devolvemos un recurso
    // simulado para que la demo nunca muestre un error al docente.
    return Response.json({
      secuencia: enriquecerConImagenes(construirSecuenciaSimulada(form), form),
      simulada: true,
    })
  }
}

/**
 * Agrega imágenes de Rosario (banco gratuito) a la secuencia: una portada, una
 * galería y una imagen por actividad, elegidas según el texto de cada parte.
 */
function enriquecerConImagenes(sec: SecuenciaDidactica, form: FormularioGeneracion): SecuenciaDidactica {
  const contextoTexto = `${form.temaLocal} ${sec.titulo} ${sec.contextoLocal} ${form.contenido}`
  return {
    ...sec,
    imagenPortada: sec.imagenPortada ?? imagenPorTexto(0, contextoTexto),
    galeria: sec.galeria && sec.galeria.length > 0 ? sec.galeria : galeriaRosario(),
    actividades: sec.actividades.map((a, i) => ({
      ...a,
      imagen: a.imagen ?? imagenPorTexto(i, a.titulo, a.descripcion, form.temaLocal, form.contenido),
    })),
  }
}

function construirSecuenciaSimulada(form: FormularioGeneracion): SecuenciaDidactica {
  const area = getArea(form.areaId)
  const areaNombre = area?.nombre ?? form.areaId
  const cantidad = Math.max(1, Number.parseInt(form.cantidad, 10) || 3)
  const momentos = ['Inicio', 'Desarrollo', 'Cierre']
  const tema = form.contenido || 'los contenidos del área'
  const local = form.temaLocal || 'la vida cotidiana en Santa Fe/Rosario'

  const actividades = Array.from({ length: cantidad }, (_, i) => {
    const momento = momentos[Math.min(i, momentos.length - 1)]
    return {
      titulo: `Actividad ${i + 1}: ${tema}`,
      momento,
      descripcion: `El docente propone trabajar ${tema} vinculándolo con ${local}. Esta actividad corresponde al momento de ${momento.toLowerCase()} de la clase.`,
      consignas: [
        `Observá y conversá en grupo sobre ${tema}.`,
        `Registrá en la carpeta tus ideas y ejemplos relacionados con ${local}.`,
        'Compartí tus conclusiones con el resto del curso.',
      ],
      recursosNecesarios: ['Pizarrón', 'Carpeta y útiles', 'Material impreso preparado por el docente'],
      tiempoEstimado: momento === 'Desarrollo' ? '30 min' : '15 min',
    }
  })

  return {
    titulo: `Secuencia didáctica: ${tema}`,
    grado: form.grado,
    area: areaNombre,
    fundamentacion: `Esta secuencia aborda ${tema} para ${form.grado} en el área de ${areaNombre}, respetando el Diseño Curricular de la Provincia de Santa Fe. Se propone un abordaje contextualizado que vincula los contenidos con ${local}.`,
    objetivos: [
      `Comprender los conceptos centrales vinculados a ${tema}.`,
      `Relacionar los contenidos con situaciones reales de ${local}.`,
      'Desarrollar habilidades de trabajo colaborativo y expresión oral.',
    ],
    contenidosCurriculares: [tema, `Contenidos del área de ${areaNombre} para ${form.grado}`],
    contextoLocal: `Las actividades toman como punto de partida ${local}, favoreciendo la super-localización de los aprendizajes.`,
    actividades,
    criteriosEvaluacion: [
      'Participación en las actividades propuestas.',
      'Comprensión de los contenidos abordados.',
      'Capacidad de vincular lo aprendido con el contexto local.',
    ],
    adaptaciones: `Para el nivel "${form.nivel}", se sugiere ajustar la complejidad de las consignas y ofrecer apoyos visuales o acompañamiento personalizado según las necesidades del grupo.`,
  }
}
