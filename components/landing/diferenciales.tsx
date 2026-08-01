import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nuestros = [
  'Integra directamente el Diseño Curricular de Santa Fe',
  'Super-localización a Rosario y la región',
  'Formularios prediseñados: cero prompt engineering',
  'Material listo para imprimir (PDF / Word / HTML)',
  'Validación pedagógica antes de mostrar resultados',
  'Edición y regeneración puntual de actividades',
]

const genericas = [
  'Estándares y contextos mayoritariamente extranjeros',
  'Actividades genéricas sin marco curricular',
  'Requieren redactar prompts estructurados',
  'Salida que exige maquetado manual',
  'Resultados impredecibles e inconsistentes',
  'Todo o nada: regenerar rehace el conjunto',
]

export function Diferenciales() {
  return (
    <section id="diferenciales" className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Diferenciales</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
            No es otra IA genérica: es curricular y local
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-primary/30 bg-card p-6">
            <h3 className="font-display text-lg font-bold text-primary">SmartClass</h3>
            <ul className="mt-4 space-y-3">
              {nuestros.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-card-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-6">
            <h3 className="font-display text-lg font-semibold text-muted-foreground">IA de propósito general</h3>
            <ul className="mt-4 space-y-3">
              {genericas.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl border border-border bg-primary px-6 py-12 text-center text-primary-foreground">
          <h3 className="max-w-2xl font-display text-2xl font-bold text-balance md:text-3xl">
            Empezá a generar recursos alineados a tu currículo hoy
          </h3>
          <p className="max-w-xl text-primary-foreground/85 text-pretty">
            Configurá tu aula una vez y creá secuencias completas en minutos.
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/app">
              Ingresar a la plataforma
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
