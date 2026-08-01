import { ListChecks, Sparkles, ShieldCheck, Printer } from 'lucide-react'

const pasos = [
  {
    n: '01',
    icon: ListChecks,
    titulo: 'Elegís con menús',
    texto: 'Grado, área, contenido curricular, tema local y cantidad de actividades. Sin redactar prompts.',
  },
  {
    n: '02',
    icon: Sparkles,
    titulo: 'La IA sintetiza',
    texto: 'El motor genera datos estructurados (JSON) enmarcados en el Diseño Curricular de Santa Fe.',
  },
  {
    n: '03',
    icon: ShieldCheck,
    titulo: 'Se valida',
    texto: 'Reglas de negocio verifican el esquema y los límites pedagógicos antes de mostrarte nada.',
  },
  {
    n: '04',
    icon: Printer,
    titulo: 'Listo para el aula',
    texto: 'Revisás, editás, regenerás actividades puntuales e imprimís o exportás el material.',
  },
]

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Cómo funciona</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Un flujo en capas que garantiza el estándar educativo
        </h2>
        <p className="mt-4 text-muted-foreground text-pretty">
          La IA no produce el archivo final directamente: genera datos, la plataforma valida y recién después renderiza.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map((p) => (
          <div key={p.n} className="relative rounded-xl border border-border bg-card p-6">
            <span className="font-display text-sm font-bold text-accent-foreground">{p.n}</span>
            <span className="mt-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <p.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-card-foreground">{p.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
