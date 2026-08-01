import Link from 'next/link'
import {
  FileText,
  ListChecks,
  ClipboardCheck,
  Layers,
  Video,
  Table2,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { AppHeader } from '@/components/app/app-header'
import { Badge } from '@/components/ui/badge'

const herramientas = [
  {
    id: 'secuencia',
    href: '/app/generador',
    icon: ListChecks,
    nombre: 'Generador de secuencias didácticas',
    desc: 'Secuencias completas alineadas al Diseño Curricular de Santa Fe, con contexto local.',
    disponible: true,
  },
  {
    id: 'guia',
    href: '/app/generador',
    icon: FileText,
    nombre: 'Guía de ejercicios',
    desc: 'Series de actividades graduadas para practicar un contenido puntual.',
    disponible: true,
  },
  {
    id: 'rubrica',
    icon: ClipboardCheck,
    nombre: 'Generador de rúbricas',
    desc: 'Rúbricas de evaluación por criterios y niveles de logro.',
    disponible: false,
  },
  {
    id: 'proyecto',
    icon: Layers,
    nombre: 'Proyecto interdisciplinario',
    desc: 'Proyectos que integran varias áreas alrededor de un tema local.',
    disponible: false,
  },
  {
    id: 'video',
    icon: Video,
    nombre: 'Actividades a partir de video',
    desc: 'Consignas y preguntas generadas desde un recurso audiovisual.',
    disponible: false,
  },
  {
    id: 'tabla',
    icon: Table2,
    nombre: 'Planificación anual',
    desc: 'Distribución de contenidos a lo largo del ciclo lectivo.',
    disponible: false,
  },
]

export default function AppDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Herramientas
          </h1>
          <p className="text-muted-foreground">
            Elegí un generador. Todos los recursos se enmarcan en el Diseño Curricular de la provincia de Santa Fe.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {herramientas.map((h) => {
            const Card = (
              <div
                className={`group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-shadow ${
                  h.disponible ? 'hover:shadow-md' : 'opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <h.icon className="size-5" />
                  </span>
                  {h.disponible ? (
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  ) : (
                    <Badge variant="secondary" className="gap-1 text-[11px]">
                      <Lock className="size-3" />
                      Pronto
                    </Badge>
                  )}
                </div>
                <h2 className="mt-4 font-display text-base font-semibold text-card-foreground text-pretty">
                  {h.nombre}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </div>
            )

            return h.disponible && h.href ? (
              <Link key={h.id} href={h.href}>
                {Card}
              </Link>
            ) : (
              <div key={h.id}>{Card}</div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
