'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe2,
  Heart,
  Sparkles,
  MapPin,
  Users,
  Baby,
  GraduationCap,
  Blocks,
  Loader2,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AREAS, GRADOS, TEMAS_LOCALES, getArea } from '@/lib/curriculum'
import type { FormularioGeneracion } from '@/lib/types'

type Props = {
  form: FormularioGeneracion
  onChange: (patch: Partial<FormularioGeneracion>) => void
  onSubmit: () => void
  loading: boolean
}

const AREA_ICONS: Record<string, React.ElementType> = {
  matematica: Calculator,
  lengua: BookOpen,
  'cs-naturales': FlaskConical,
  'cs-sociales': Globe2,
  esi: Heart,
}

const NIVEL_OPCIONES = [
  { valor: 'Refuerzo / apoyo escolar', titulo: 'Necesitan apoyo', desc: 'Van a reforzar lo básico, paso a paso.', icon: Baby },
  { valor: 'Nivel estándar del grado', titulo: 'Nivel del grado', desc: 'Trabajan lo esperado para su edad.', icon: GraduationCap },
  { valor: 'Grupo heterogéneo (nivel mixto)', titulo: 'Grupo mezclado', desc: 'Hay distintos ritmos en el mismo grupo.', icon: Users },
  { valor: 'Profundización / enriquecimiento', titulo: 'Quieren más', desc: 'Están listos para desafíos extra.', icon: Blocks },
]

const PASOS = ['Grado', 'Materia', 'Tema', 'El grupo', 'Rosario'] as const

export function GeneradorWizard({ form, onChange, onSubmit, loading }: Props) {
  const [paso, setPaso] = useState(0)
  const area = getArea(form.areaId)
  const contenidos = area?.contenidos ?? []

  const puedeAvanzar = useMemo(() => {
    switch (paso) {
      case 0:
        return !!form.grado
      case 1:
        return !!form.areaId
      case 2:
        return !!form.contenido
      case 3:
        return !!form.nivel
      case 4:
        return true
      default:
        return false
    }
  }, [paso, form])

  const esUltimo = paso === PASOS.length - 1

  function siguiente() {
    if (esUltimo) {
      onSubmit()
      return
    }
    setPaso((p) => Math.min(p + 1, PASOS.length - 1))
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
      {/* Progreso */}
      <ol className="mb-7 flex items-center gap-1.5">
        {PASOS.map((nombre, i) => {
          const completo = i < paso
          const actual = i === paso
          return (
            <li key={nombre} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full items-center">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    completo
                      ? 'bg-primary text-primary-foreground'
                      : actual
                        ? 'bg-primary/15 text-primary ring-2 ring-primary'
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {completo ? <Check className="size-4" /> : i + 1}
                </span>
                {i < PASOS.length - 1 && (
                  <span className={`mx-1 h-0.5 flex-1 rounded ${completo ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              <span className={`text-center text-[11px] font-medium ${actual ? 'text-foreground' : 'text-muted-foreground'}`}>
                {nombre}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Paso 0: Grado */}
      {paso === 0 && (
        <StepShell titulo="¿Con qué grado vas a trabajar?" subtitulo="Elegí el grado del grupo o del alumno.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GRADOS.map((g) => (
              <OpcionCard key={g} activo={form.grado === g} onClick={() => onChange({ grado: g })}>
                <span className="font-display text-lg font-bold text-foreground">{g.split(' ')[0]}</span>
                <span className="text-xs text-muted-foreground">Grado</span>
              </OpcionCard>
            ))}
          </div>
        </StepShell>
      )}

      {/* Paso 1: Materia */}
      {paso === 1 && (
        <StepShell titulo="¿Qué materia querés enseñar?" subtitulo="Tocá una de las áreas.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AREAS.map((a) => {
              const Icon = AREA_ICONS[a.id] ?? BookOpen
              return (
                <OpcionCard
                  key={a.id}
                  activo={form.areaId === a.id}
                  onClick={() => onChange({ areaId: a.id, contenido: '' })}
                  row
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      form.areaId === a.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-left font-display text-sm font-semibold text-foreground">{a.nombre}</span>
                </OpcionCard>
              )
            })}
          </div>
        </StepShell>
      )}

      {/* Paso 2: Tema / contenido */}
      {paso === 2 && (
        <StepShell titulo="¿Qué tema querés dar?" subtitulo="Elegí un contenido del programa de Santa Fe.">
          <div className="grid grid-cols-1 gap-2.5">
            {contenidos.map((c) => (
              <OpcionCard key={c} activo={form.contenido === c} onClick={() => onChange({ contenido: c })} row>
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.contenido === c ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                  }`}
                >
                  {form.contenido === c && <Check className="size-3.5" />}
                </span>
                <span className="text-left text-sm text-foreground">{c}</span>
              </OpcionCard>
            ))}
          </div>
        </StepShell>
      )}

      {/* Paso 3: El grupo */}
      {paso === 3 && (
        <StepShell titulo="¿Cómo es tu grupo?" subtitulo="Esto ayuda a ajustar la dificultad.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NIVEL_OPCIONES.map((n) => (
              <OpcionCard key={n.valor} activo={form.nivel === n.valor} onClick={() => onChange({ nivel: n.valor })} row>
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    form.nivel === n.valor ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <n.icon className="size-5" />
                </span>
                <span className="flex flex-col text-left">
                  <span className="font-display text-sm font-semibold text-foreground">{n.titulo}</span>
                  <span className="text-xs text-muted-foreground">{n.desc}</span>
                </span>
              </OpcionCard>
            ))}
          </div>
        </StepShell>
      )}

      {/* Paso 4: Rosario / tema local + notas */}
      {paso === 4 && (
        <StepShell
          titulo="¿Lo conectamos con Rosario?"
          subtitulo="Opcional: elegí un tema local para que las actividades sean más cercanas."
        >
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <OpcionCard activo={!form.temaLocal} onClick={() => onChange({ temaLocal: '' })} row>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="text-left text-sm text-foreground">Sin tema local</span>
            </OpcionCard>
            {TEMAS_LOCALES.map((t) => (
              <OpcionCard key={t} activo={form.temaLocal === t} onClick={() => onChange({ temaLocal: t })} row>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                    form.temaLocal === t ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <MapPin className="size-4" />
                </span>
                <span className="text-left text-sm text-foreground">{t}</span>
              </OpcionCard>
            ))}
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              ¿Algo más que querés contarnos? <span className="text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              value={form.notasDocente}
              onChange={(e) => onChange({ notasDocente: e.target.value })}
              placeholder="Ej: el grupo trabaja mucho en equipo; preferimos actividades con dibujos."
              rows={3}
            />
          </div>
        </StepShell>
      )}

      {/* Navegación */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0 || loading}
          className="gap-1.5 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Atrás
        </Button>

        <Button size="lg" onClick={siguiente} disabled={!puedeAvanzar || loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creando...
            </>
          ) : esUltimo ? (
            <>
              <Sparkles className="size-4" />
              Crear recurso
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function StepShell({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold tracking-tight text-foreground text-balance md:text-2xl">
        {titulo}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitulo}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function OpcionCard({
  activo,
  onClick,
  children,
  row = false,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
  row?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex ${row ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center gap-0.5'} rounded-xl border-2 p-4 text-center transition-all ${
        activo
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/40'
      }`}
    >
      {children}
    </button>
  )
}
