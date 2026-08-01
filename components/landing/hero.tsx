import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <MapPin className="size-3.5" />
            Alineado al Diseño Curricular de Santa Fe
          </span>

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
            Recursos didácticos <span className="text-primary">listos para el aula</span>, sin escribir prompts.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            SmartClass genera secuencias y materiales super-localizados para Educación Primaria,
            alineados automáticamente al programa oficial de la provincia. La IA hace la tarea repetitiva;
            el criterio pedagógico sigue siendo tuyo.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/app">
                Generar un recurso
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#como-funciona">
                <Sparkles className="size-4" />
                Ver cómo funciona
              </a>
            </Button>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="font-display text-2xl font-bold text-foreground">7</dt>
              <dd className="text-sm text-muted-foreground">grados de primaria</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-bold text-foreground">9</dt>
              <dd className="text-sm text-muted-foreground">áreas curriculares</dd>
            </div>
            <div>
              <dt className="font-display text-2xl font-bold text-foreground">0</dt>
              <dd className="text-sm text-muted-foreground">prompts que redactar</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
            <Image
              src="/images/hero-docente.png"
              alt="Docente de primaria acompañando a sus alumnos en el aula"
              width={720}
              height={560}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden max-w-[220px] rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
            <p className="text-xs font-medium text-muted-foreground">Contexto local</p>
            <p className="mt-1 text-sm font-semibold text-foreground text-pretty">
              "El río Paraná" integrado a una secuencia de Ciencias Naturales de 4° grado.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
