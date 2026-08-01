'use client'

import { ImagenRecurso } from '@/components/app/imagen-recurso'
import type { SecuenciaDidactica } from '@/lib/types'

/**
 * Vista de la secuencia como diapositivas 16:9. Se usa tanto para el modo
 * presentación en pantalla como para exportar a PDF (una slide por hoja,
 * en horizontal, gracias a las reglas .presentacion-print / .slide).
 */
export function PresentacionView({ secuencia }: { secuencia: SecuenciaDidactica }) {
  const slides: React.ReactNode[] = []

  // Slide de portada
  slides.push(
    <Slide key="portada">
      <div className="relative flex size-full flex-col justify-end overflow-hidden">
        <ImagenRecurso imagen={secuencia.imagenPortada} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        <div className="relative z-10 p-[6%]">
          <div className="mb-2 flex gap-2">
            <SlideChip>{secuencia.grado}</SlideChip>
            <SlideChip>{secuencia.area}</SlideChip>
          </div>
          <h1 className="font-display text-[3.2vw] font-bold leading-tight text-background text-balance md:text-4xl">
            {secuencia.titulo}
          </h1>
        </div>
      </div>
    </Slide>,
  )

  // Slide de objetivos
  slides.push(
    <Slide key="objetivos">
      <div className="flex size-full flex-col justify-center p-[6%]">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">Objetivos</p>
        <h2 className="mb-5 font-display text-3xl font-bold text-foreground">¿Qué vamos a aprender?</h2>
        <ul className="flex flex-col gap-3">
          {secuencia.objetivos.map((o, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-lg text-foreground">{o}</span>
            </li>
          ))}
        </ul>
      </div>
    </Slide>,
  )

  // Una slide por actividad
  secuencia.actividades.forEach((a, i) => {
    slides.push(
      <Slide key={`act-${i}`}>
        <div className="flex size-full">
          <div className="flex w-1/2 flex-col justify-center p-[5%]">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {a.momento} · {a.tiempoEstimado}
              </span>
            </div>
            <h2 className="mb-2 font-display text-2xl font-bold text-foreground text-balance">{a.titulo}</h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{a.descripcion}</p>
            {a.consignas.length > 0 && (
              <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground">
                {a.consignas.slice(0, 4).map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ol>
            )}
          </div>
          <div className="relative w-1/2 overflow-hidden">
            <ImagenRecurso imagen={a.imagen} className="absolute inset-0" />
          </div>
        </div>
      </Slide>,
    )
  })

  // Slide de cierre
  slides.push(
    <Slide key="cierre">
      <div className="flex size-full flex-col justify-center bg-primary p-[6%] text-primary-foreground">
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-80">Para cerrar</p>
        <h2 className="mb-4 font-display text-3xl font-bold">¿Cómo evaluamos?</h2>
        <ul className="flex flex-col gap-2">
          {secuencia.criteriosEvaluacion.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-lg">
              <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-primary-foreground" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </Slide>,
  )

  return <div className="flex flex-col gap-5">{slides}</div>
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <div className="slide aspect-video w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {children}
    </div>
  )
}

function SlideChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-background/20 px-3 py-1 text-xs font-medium text-background backdrop-blur">
      {children}
    </span>
  )
}
