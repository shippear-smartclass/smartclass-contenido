'use client'

import { useState } from 'react'
import { Printer, RefreshCw, Check, Pencil, Target, ClipboardList, BookOpen, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Actividad, SecuenciaDidactica } from '@/lib/types'

type Props = {
  secuencia: SecuenciaDidactica
  onUpdate: (s: SecuenciaDidactica) => void
}

const momentoColor: Record<string, string> = {
  Inicio: 'bg-chart-3/15 text-chart-3',
  Desarrollo: 'bg-primary/12 text-primary',
  Cierre: 'bg-accent/25 text-accent-foreground',
}

function ActividadCard({
  actividad,
  index,
  onEdit,
}: {
  actividad: Actividad
  index: number
  onEdit: (patch: Partial<Actividad>) => void
}) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
            {index + 1}
          </span>
          <Badge className={`border-0 ${momentoColor[actividad.momento] ?? 'bg-secondary text-secondary-foreground'}`}>
            {actividad.momento}
          </Badge>
          <span className="text-xs text-muted-foreground">{actividad.tiempoEstimado}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="no-print gap-1.5 text-xs"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
          {editing ? 'Listo' : 'Editar'}
        </Button>
      </div>

      {editing ? (
        <input
          value={actividad.titulo}
          onChange={(e) => onEdit({ titulo: e.target.value })}
          className="mt-3 w-full rounded-md border border-input bg-background px-3 py-1.5 font-display text-base font-semibold"
        />
      ) : (
        <h4 className="mt-3 font-display text-base font-semibold text-card-foreground">{actividad.titulo}</h4>
      )}

      {editing ? (
        <Textarea
          value={actividad.descripcion}
          onChange={(e) => onEdit({ descripcion: e.target.value })}
          rows={3}
          className="mt-2"
        />
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{actividad.descripcion}</p>
      )}

      {actividad.consignas.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Consignas</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-card-foreground">
            {actividad.consignas.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
        </div>
      )}

      {actividad.recursosNecesarios.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Recursos: </span>
          {actividad.recursosNecesarios.join(', ')}
        </p>
      )}
    </div>
  )
}

function Bloque({
  icon: Icon,
  titulo,
  children,
}: {
  icon: React.ElementType
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">{titulo}</h3>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

export function ResultadoView({ secuencia, onUpdate }: Props) {
  function editActividad(index: number, patch: Partial<Actividad>) {
    const actividades = secuencia.actividades.map((a, i) => (i === index ? { ...a, ...patch } : a))
    onUpdate({ ...secuencia, actividades })
  }

  return (
    <div className="print-area rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{secuencia.grado}</Badge>
            <Badge variant="secondary">{secuencia.area}</Badge>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-card-foreground text-balance">
            {secuencia.titulo}
          </h2>
        </div>
        <Button variant="outline" size="sm" className="no-print gap-2" onClick={() => window.print()}>
          <Printer className="size-4" />
          Imprimir / PDF
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-6">
        <Bloque icon={BookOpen} titulo="Fundamentación">
          <p className="text-sm leading-relaxed text-muted-foreground">{secuencia.fundamentacion}</p>
        </Bloque>

        {secuencia.contextoLocal && (
          <Bloque icon={MapPin} titulo="Contexto local">
            <p className="text-sm leading-relaxed text-muted-foreground">{secuencia.contextoLocal}</p>
          </Bloque>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Bloque icon={Target} titulo="Objetivos">
            <ul className="list-disc space-y-1 pl-5 text-sm text-card-foreground">
              {secuencia.objetivos.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </Bloque>
          <Bloque icon={ClipboardList} titulo="Contenidos curriculares">
            <ul className="list-disc space-y-1 pl-5 text-sm text-card-foreground">
              {secuencia.contenidosCurriculares.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </Bloque>
        </div>
      </div>

      <Separator className="my-6" />

      <h3 className="font-display text-lg font-bold text-card-foreground">Actividades</h3>
      <p className="mt-1 text-sm text-muted-foreground no-print">
        Editá cualquier actividad directamente. El resto de la secuencia se mantiene.
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {secuencia.actividades.map((a, i) => (
          <ActividadCard key={i} actividad={a} index={i} onEdit={(patch) => editActividad(i, patch)} />
        ))}
      </div>

      <Separator className="my-6" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Bloque icon={Check} titulo="Criterios de evaluación">
          <ul className="list-disc space-y-1 pl-5 text-sm text-card-foreground">
            {secuencia.criteriosEvaluacion.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Bloque>
        <Bloque icon={RefreshCw} titulo="Adaptaciones sugeridas">
          <p className="text-sm leading-relaxed text-muted-foreground">{secuencia.adaptaciones}</p>
        </Bloque>
      </div>
    </div>
  )
}
