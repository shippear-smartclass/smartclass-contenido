import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Plan = {
  nombre: string
  descripcion: string
  precio: string
  periodo: string
  destacado?: boolean
  etiqueta?: string
  cta: string
  features: string[]
}

const planes: Plan[] = [
  {
    nombre: 'Prueba',
    descripcion: 'Probá SmartClass sin costo y generá tus primeros recursos.',
    precio: 'Gratis',
    periodo: '14 días',
    cta: 'Empezar gratis',
    features: [
      '10 recursos didácticos incluidos',
      '1 grado y 1 área a elección',
      'Exportación a PDF',
      'Alineación al Diseño Curricular de Santa Fe',
      'Soporte por email',
    ],
  },
  {
    nombre: 'Inicial',
    descripcion: 'Ideal para docentes que planifican su aula todos los días.',
    precio: '$8.900',
    periodo: 'por mes',
    destacado: true,
    etiqueta: 'Más elegido',
    cta: 'Elegir Inicial',
    features: [
      '150 recursos por mes',
      'Todos los grados y áreas de primaria',
      'Exportación a PDF, Word y HTML',
      'Regeneración puntual de actividades',
      'Super-localización a Rosario y la región',
      'Soporte prioritario',
    ],
  },
  {
    nombre: 'Premium',
    descripcion: 'Para equipos e instituciones que necesitan escala y control.',
    precio: '$19.900',
    periodo: 'por mes',
    cta: 'Elegir Premium',
    features: [
      'Recursos ilimitados',
      'Hasta 10 usuarios docentes',
      'Biblioteca compartida de secuencias',
      'Plantillas institucionales personalizadas',
      'Historial y versiones de cada recurso',
      'Soporte dedicado y capacitación',
    ],
  },
]

export function Planes() {
  return (
    <section id="planes" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Planes</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Elegí el plan que acompaña tu aula
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Empezá gratis y pasá a un plan pago cuando lo necesites. Precios en pesos, sin costos ocultos.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={
                plan.destacado
                  ? 'relative flex flex-col rounded-2xl border-2 border-primary bg-card p-6 shadow-lg'
                  : 'relative flex flex-col rounded-2xl border border-border bg-card p-6'
              }
            >
              {plan.etiqueta && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {plan.etiqueta}
                </span>
              )}

              <h3 className="font-display text-xl font-bold text-foreground">{plan.nombre}</h3>
              <p className="mt-2 min-h-10 text-sm text-muted-foreground text-pretty">{plan.descripcion}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                  {plan.precio}
                </span>
                <span className="text-sm text-muted-foreground">/ {plan.periodo}</span>
              </div>

              <Button
                asChild
                size="lg"
                variant={plan.destacado ? 'default' : 'outline'}
                className="mt-6 w-full gap-2"
              >
                <Link href="/login">
                  {plan.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-card-foreground">
                    <span
                      className={
                        plan.destacado
                          ? 'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'
                          : 'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground'
                      }
                    >
                      <Check className="size-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground text-pretty">
          Los precios están expresados en pesos argentinos (ARS) e incluyen IVA. Podés cambiar o cancelar tu plan
          cuando quieras.
        </p>
      </div>
    </section>
  )
}
