import { Clock, MapPinOff, ShuffleIcon } from 'lucide-react'

const problemas = [
  {
    icon: Clock,
    titulo: 'Tiempo perdido en maquetar',
    texto:
      'Los docentes dedican horas a buscar, adaptar y dar formato a secuencias y materiales antes de llevarlos al aula.',
  },
  {
    icon: MapPinOff,
    titulo: 'Falta de contexto local',
    texto:
      'Las IA de propósito general generan actividades genéricas que ignoran el Diseño Curricular y la realidad sociocultural de la región.',
  },
  {
    icon: ShuffleIcon,
    titulo: 'Resultados impredecibles',
    texto:
      'Sin prompts estructurados, la calidad es inconsistente y exige una edición exhaustiva antes de usarse.',
  },
]

export function Problema() {
  return (
    <section id="problema" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">El problema</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Enseñar bien no debería empezar peleando con una hoja en blanco
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problemas.map((p) => (
            <div key={p.titulo} className="rounded-xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
